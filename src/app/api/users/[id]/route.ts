// app/api/users/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { requireRole, createAuditLog } from '@/lib/auth-server';

// GET /api/users/[id] - Get specific user (admin only)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await requireRole(['admin']);
    const { id } = await params;

    // Use admin client to bypass RLS
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching user:', error);
      throw error;
    }

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof Error && error.message === 'Insufficient permissions') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH /api/users/[id] - Update user (admin only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await requireRole(['admin']);
    const body = await request.json();
    const { id } = await params;
    
    console.log('Updating user:', { id, updateData: body, adminId: currentUser.id });
    
    // Get existing user using admin client
    const { data: existingUser, error: fetchError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError) {
      console.error('Error fetching existing user:', fetchError);
      throw fetchError;
    }

    if (!existingUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Update user using admin client
    const { data: updatedUser, error } = await supabaseAdmin
      .from('users')
      .update({
        ...body,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating user:', error);
      throw error;
    }

    // Create audit log
    await createAuditLog(currentUser.id, 'user_updated_by_admin', id, 'user', {
      old_data: existingUser,
      new_data: body,
      updated_by: currentUser.id
    });

    return NextResponse.json({ 
      user: updatedUser,
      message: 'User updated successfully'
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof Error && error.message === 'Insufficient permissions') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/users/[id] - Delete user (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await requireRole(['admin']);
    const { id } = await params;

    console.log('Deleting user:', { id, adminId: currentUser.id });

    // Get existing user for audit log using admin client
    const { data: existingUser, error: fetchError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError) {
      console.error('Error fetching user to delete:', fetchError);
      throw fetchError;
    }

    if (!existingUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Prevent admin from deleting themselves
    if (existingUser.id === currentUser.id) {
      return NextResponse.json({ 
        error: 'Cannot delete your own account' 
      }, { status: 400 });
    }

    // Delete user using admin client
    const { error } = await supabaseAdmin
      .from('users')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting user:', error);
      throw error;
    }

    // Create audit log
    await createAuditLog(currentUser.id, 'user_deleted', id, 'user', {
      deleted_user: existingUser,
      deleted_by: currentUser.id
    });

    return NextResponse.json({ 
      message: 'User deleted successfully',
      deletedUser: {
        id: existingUser.id,
        clerk_id: existingUser.clerk_id,
        role: existingUser.role
      }
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof Error && error.message === 'Insufficient permissions') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
  