import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { requireRole, createAuditLog } from '@/lib/auth-server';

// POST /api/admin/projects/[id]/approve - Approve project (admin only)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await requireRole(['admin']);
    const body = await request.json();
    const { approved_credits, review_notes } = body;
    const { id } = await params;

    // Get existing project
    const { data: project, error: fetchError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Update project status
    const { data: updatedProject, error } = await supabase
      .from('projects')
      .update({
        status: 'approved',
        credits: approved_credits || project.expected_credits,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select(`
        *,
        organization:users!projects_org_id_fkey(id, clerk_id, metadata)
      `)
      .single();

    if (error) {
      throw error;
    }

    // Create transaction record
    await supabase
      .from('transactions')
      .insert({
        project_id: id,
        user_id: project.org_id,
        tx_type: 'project_approved',
        amount: approved_credits || project.expected_credits,
        metadata: {
          approved_by: currentUser.id,
          review_notes: review_notes || '',
          original_expected_credits: project.expected_credits
        }
      });

    // Create audit log
    await createAuditLog(currentUser.id, 'project_approved', id, 'project', {
      project_name: project.name,
      approved_credits: approved_credits || project.expected_credits,
      review_notes: review_notes || '',
      approved_by: currentUser.id
    });

    return NextResponse.json({ 
      project: updatedProject,
      message: 'Project approved successfully'
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof Error && error.message === 'Insufficient permissions') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    console.error('Error approving project:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}