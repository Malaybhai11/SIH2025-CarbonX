import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { supabaseAdmin } from '@/lib/supabase';
import { createAuditLog } from '@/lib/auth-server';

// GET /api/projects - Get projects (filtered by user role)
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get current user
    const { data: currentUser } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('clerk_id', userId)
      .single();

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    let query = supabaseAdmin
      .from('projects')
      .select(`
        *,
        organization:users!projects_org_id_fkey(id, clerk_id, metadata)
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Filter based on user role
    if (currentUser.role === 'organization') {
      // Organizations can only see their own projects
      query = query.eq('org_id', currentUser.id);
    } else if (currentUser.role === 'local') {
      // Local users can only see approved projects
      query = query.eq('status', 'approved');
    }
    // Admins can see all projects

    // Apply status filter if provided
    if (status && currentUser.role === 'admin') {
      query = query.eq('status', status);
    }

    const { data: projects, error } = await query;

    if (error) {
      console.error('Error fetching projects:', error);
      throw error;
    }

    return NextResponse.json({ projects });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/projects - Create new project (organizations only)
export async function POST(request: NextRequest) {
  console.log('🚀 === PROJECT CREATION API STARTED ===');
  
  try {
    // Step 1: Authentication
    console.log('📝 Checking authentication...');
    const { userId } = await auth();
    console.log('👤 User ID from Clerk:', userId);
    
    if (!userId) {
      console.log('❌ No userId from Clerk authentication');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Step 2: Get current user from database
    console.log('🔍 Looking up user in database...');
    const { data: currentUser, error: userError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('clerk_id', userId)
      .single();

    console.log('🔍 User query result:', { currentUser, userError });

    if (userError) {
      console.error('❌ Error fetching user from database:', userError);
      return NextResponse.json({ 
        error: `Database error: ${userError.message}` 
      }, { status: 500 });
    }

    if (!currentUser) {
      console.log('❌ User not found in database. Creating user...');
      // Auto-create user if they don't exist
      const { data: newUser, error: createError } = await supabaseAdmin
        .from('users')
        .insert({
          clerk_id: userId,
          role: 'organization', // Default role
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (createError) {
        console.error('❌ Error creating user:', createError);
        return NextResponse.json({ 
          error: `Failed to create user: ${createError.message}` 
        }, { status: 500 });
      }

      console.log('✅ User created:', newUser);
      // Use the newly created user
      const userToUse = newUser;
      
      // Continue with project creation using userToUse instead of currentUser
      // ... rest of the logic
    } else {
      console.log('✅ User found:', currentUser.id, 'Role:', currentUser.role);
    }

    // Step 3: Check role permissions
    if (currentUser && currentUser.role !== 'organization') {
      console.log('❌ User role not authorized:', currentUser.role);
      return NextResponse.json({ 
        error: 'Only organizations can create projects' 
      }, { status: 403 });
    }

    // Step 4: Parse request body
    console.log('📋 Parsing request body...');
    const body = await request.json();
    console.log('📄 Request body:', JSON.stringify(body, null, 2));

    const { 
      name, 
      description, 
      type, 
      location, 
      coordinates, 
      startDate, 
      endDate, 
      expectedCredits, 
      methodology, 
      baseline, 
      monitoring,
      fileUrls 
    } = body;

    // Step 5: Validate required fields
    console.log('✅ Validating required fields...');
    const requiredFields = { name, description, type, location, methodology, baseline, monitoring };
    const missingFields = Object.entries(requiredFields)
      .filter(([key, value]) => !value)
      .map(([key]) => key);

    if (missingFields.length > 0) {
      console.log('❌ Missing required fields:', missingFields);
      return NextResponse.json({ 
        error: `Missing required fields: ${missingFields.join(', ')}` 
      }, { status: 400 });
    }

    // Step 6: Prepare project data
    console.log('🏗️ Preparing project data...');
    const projectData = {
      org_id: currentUser.id,
      name: name.trim(),
      description: description.trim(),
      type,
      location: location.trim(),
      coordinates: coordinates?.trim() || null,
      methodology: methodology.trim(),
      baseline: baseline.trim(),
      monitoring: monitoring.trim(),
      expected_credits: parseInt(expectedCredits) || 0,
      start_date: startDate || null,
      end_date: endDate || null,
      file_urls: fileUrls || [],
      status: 'pending' as const,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    console.log('📊 Project data to insert:', JSON.stringify(projectData, null, 2));

    // Step 7: Insert project
    console.log('💾 Inserting project into database...');
    const { data: project, error } = await supabaseAdmin
      .from('projects')
      .insert(projectData)
      .select(`
        *,
        organization:users!projects_org_id_fkey(id, clerk_id, metadata)
      `)
      .single();

    if (error) {
      console.error('❌ Error creating project:', error);
      console.error('❌ Error details:', JSON.stringify(error, null, 2));
      return NextResponse.json({ 
        error: `Project creation failed: ${error.message}` 
      }, { status: 500 });
    }

    console.log('✅ Project created successfully:', project.id);

    // Step 8: Create audit log (optional, can comment out if this fails)
    try {
      console.log('📝 Creating audit log...');
      await createAuditLog(currentUser.id, 'project_created', project.id, 'project', {
        project_name: project.name,
        project_type: project.type,
        expected_credits: project.expected_credits,
        files_count: fileUrls?.length || 0
      });
      console.log('✅ Audit log created');
    } catch (auditError) {
      console.error('⚠️ Audit log failed (non-critical):', auditError);
      // Don't fail the request if audit log fails
    }

    console.log('🎉 === PROJECT CREATION SUCCESS ===');
    return NextResponse.json({ 
      project,
      message: 'Project created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('💥 === PROJECT CREATION FAILED ===');
    console.error('❌ Error type:', typeof error);
    console.error('❌ Error message:', error instanceof Error ? error.message : 'Unknown error');
    console.error('❌ Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    console.error('❌ Full error object:', JSON.stringify(error, null, 2));
    
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Project creation failed' 
    }, { status: 500 });
  }
}
