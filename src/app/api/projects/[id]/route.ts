import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { supabaseAdmin } from '@/lib/supabase';
import { createAuditLog } from '@/lib/auth-server';

// GET /api/projects/[id] - Get specific project
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: currentUser } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('clerk_id', userId)
      .single();

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { id } = await params;

    const { data: project, error } = await supabaseAdmin
      .from('projects')
      .select(`
        *,
        organization:users!projects_org_id_fkey(id, clerk_id, metadata)
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching project:', error);
      throw error;
    }

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Check access permissions
    const canAccess = 
      currentUser.role === 'admin' ||
      project.org_id === currentUser.id ||
      (currentUser.role === 'local' && project.status === 'approved');

    if (!canAccess) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    return NextResponse.json({ project });
  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH /api/projects/[id] - Update project
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: currentUser } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('clerk_id', userId)
      .single();

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const body = await request.json();
    const { id } = await params;

    // Get existing project
    const { data: existingProject, error: fetchError } = await supabaseAdmin
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !existingProject) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Check permissions
    const canUpdate = 
      currentUser.role === 'admin' ||
      existingProject.org_id === currentUser.id;

    if (!canUpdate) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Update project
    const { data: updatedProject, error } = await supabaseAdmin
      .from('projects')
      .update({
        ...body,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select(`
        *,
        organization:users!projects_org_id_fkey(id, clerk_id, metadata)
      `)
      .single();

    if (error) {
      console.error('Error updating project:', error);
      throw error;
    }

    await createAuditLog(currentUser.id, 'project_updated', id, 'project', {
      old_data: existingProject,
      new_data: body,
      updated_by: currentUser.id
    });

    return NextResponse.json({ 
      project: updatedProject,
      message: 'Project updated successfully'
    });
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/projects/[id] - Delete project
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: currentUser } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('clerk_id', userId)
      .single();

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { id } = await params;

    // Get existing project
    const { data: existingProject, error: fetchError } = await supabaseAdmin
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !existingProject) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Check permissions - only project owner or admin can delete
    const canDelete = 
      currentUser.role === 'admin' ||
      existingProject.org_id === currentUser.id;

    if (!canDelete) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Delete associated files from storage
    if (existingProject.file_urls && existingProject.file_urls.length > 0) {
      try {
        // Extract file paths from URLs and delete them
        const filePaths = existingProject.file_urls.map((url: string) => {
          const path = url.split('/project-documents/')[1];
          return path;
        }).filter(Boolean);

        if (filePaths.length > 0) {
          await supabaseAdmin.storage
            .from('project-documents')
            .remove(filePaths);
        }
      } catch (storageError) {
        console.error('Error deleting project files:', storageError);
        // Continue with project deletion even if file deletion fails
      }
    }

    // Delete project
    const { error } = await supabaseAdmin
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting project:', error);
      throw error;
    }

    await createAuditLog(currentUser.id, 'project_deleted', id, 'project', {
      deleted_project: existingProject,
      deleted_by: currentUser.id
    });

    return NextResponse.json({ 
      message: 'Project and associated files deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
