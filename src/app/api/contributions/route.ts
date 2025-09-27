import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { requireAuth, createAuditLog } from '@/lib/auth-server';

// GET /api/contributions - Get contributions (filtered by user role)
export async function GET(request: NextRequest) {
  try {
    const currentUser = await requireAuth();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const projectId = searchParams.get('project_id');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    let query = supabase
      .from('contributions')
      .select(`
        *,
        user:users!contributions_user_id_fkey(id, clerk_id, metadata),
        project:projects!contributions_project_id_fkey(id, name, org_id)
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Filter based on user role
    if (currentUser.role === 'local') {
      // Local users can only see their own contributions
      query = query.eq('user_id', currentUser.id);
    } else if (currentUser.role === 'organization') {
      // Organizations can see contributions to their projects
      const { data: orgProjects } = await supabase
        .from('projects')
        .select('id')
        .eq('org_id', currentUser.id);
      
      const projectIds = orgProjects?.map(p => p.id) || [];
      if (projectIds.length > 0) {
        query = query.in('project_id', projectIds);
      } else {
        // No projects, return empty
        return NextResponse.json({ contributions: [] });
      }
    }
    // Admins can see all contributions

    // Apply filters
    if (status) {
      query = query.eq('status', status);
    }
    if (projectId) {
      query = query.eq('project_id', projectId);
    }

    const { data: contributions, error } = await query;

    if (error) {
      throw error;
    }

    return NextResponse.json({ contributions });
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    console.error('Error fetching contributions:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/contributions - Create new contribution
export async function POST(request: NextRequest) {
  try {
    const currentUser = await requireAuth();
    const body = await request.json();

    const contributionData = {
      user_id: currentUser.id,
      project_id: body.project_id || null,
      title: body.title,
      description: body.description,
      type: body.type,
      location: body.location,
      coordinates: body.coordinates,
      date: body.date,
      quantity: body.quantity,
      file_urls: body.file_urls || [],
      impact: body.impact || 'medium',
      status: 'pending' as const
    };

    const { data: contribution, error } = await supabase
      .from('contributions')
      .insert(contributionData)
      .select(`
        *,
        user:users!contributions_user_id_fkey(id, clerk_id, metadata),
        project:projects!contributions_project_id_fkey(id, name, org_id)
      `)
      .single();

    if (error) {
      throw error;
    }

    await createAuditLog(currentUser.id, 'contribution_created', contribution.id, 'contribution', {
      contribution_title: contribution.title,
      contribution_type: contribution.type,
      location: contribution.location,
      project_id: contribution.project_id
    });

    return NextResponse.json({ contribution }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    console.error('Error creating contribution:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}