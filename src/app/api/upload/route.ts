import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    
    // Handle both single file and multiple files
    const files = formData.getAll('files') as File[];
    const singleFile = formData.get('file') as File; // Fallback for single file
    
    // Combine both approaches
    const allFiles = files.length > 0 ? files : (singleFile ? [singleFile] : []);
    
    console.log('Received files:', allFiles.length); // Debug log
    
    if (!allFiles.length) {
      console.log('No files found in formData'); // Debug log
      return NextResponse.json({ error: 'No files provided' }, { status: 400 });
    }

    const projectId = formData.get('projectId') as string || 'default';
    const bucket = 'project_files';

    const uploadedFiles = [];
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/csv',
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'image/gif'
    ];

    for (const file of allFiles) {
      console.log(`Processing file: ${file.name}, size: ${file.size}, type: ${file.type}`); // Debug log
      
      // Validate file size
      if (file.size > maxSize) {
        return NextResponse.json({ 
          error: `File "${file.name}" exceeds 10MB limit` 
        }, { status: 400 });
      }

      // Validate file type (be more lenient)
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      const allowedExtensions = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'csv', 'jpg', 'jpeg', 'png', 'gif'];
      
      if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
        return NextResponse.json({ 
          error: `File "${file.name}" has unsupported format. Allowed: PDF, DOC, DOCX, XLS, XLSX, CSV, JPG, PNG` 
        }, { status: 400 });
      }

      // Generate unique filename
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 10);
      const fileName = `${timestamp}-${randomString}.${fileExtension}`;
      const filePath = `projects/${projectId}/${fileName}`;

      try {
        // Convert file to buffer
        const fileBuffer = Buffer.from(await file.arrayBuffer());
        
        console.log(`Uploading ${file.name} to ${filePath}`); // Debug log

        // Upload to Supabase Storage using admin client
        const { data, error } = await supabaseAdmin.storage
          .from(bucket)
          .upload(filePath, fileBuffer, {
            contentType: file.type || `application/${fileExtension}`,
            cacheControl: '3600',
            upsert: false,
          });

        if (error) {
          console.error(`Storage upload error for ${file.name}:`, error);
          return NextResponse.json({ 
            error: `Upload failed for "${file.name}": ${error.message}` 
          }, { status: 500 });
        }

        // Get public URL
        const { data: { publicUrl } } = supabaseAdmin.storage
          .from(bucket)
          .getPublicUrl(filePath);

        uploadedFiles.push({
          name: file.name,
          originalName: file.name,
          path: data.path,
          url: publicUrl,
          size: file.size,
          type: file.type || `application/${fileExtension}`
        });

        console.log(`Successfully uploaded ${file.name}`); // Debug log
      } catch (uploadError) {
        console.error(`Error processing file ${file.name}:`, uploadError);
        return NextResponse.json({ 
          error: `Failed to process "${file.name}": ${uploadError instanceof Error ? uploadError.message : 'Unknown error'}` 
        }, { status: 500 });
      }
    }

    console.log(`Successfully uploaded ${uploadedFiles.length} files`); // Debug log

    return NextResponse.json({ 
      success: true,
      files: uploadedFiles,
      message: `Successfully uploaded ${uploadedFiles.length} files`
    });
  } catch (error) {
    console.error('Upload API error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Upload failed' 
    }, { status: 500 });
  }
}
