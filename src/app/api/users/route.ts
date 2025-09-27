// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { supabaseAdmin } from '@/lib/supabase';
import { createAuditLog } from '@/lib/auth-server';

// GET /api/users - Get all users (admin only) or current user
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Use admin client to bypass RLS for user lookup
    const { data: currentUser } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('clerk_id', userId)
      .single();

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // If admin, return all users, otherwise return only current user
    if (currentUser.role === 'admin') {
      const { data: users, error } = await supabaseAdmin
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return NextResponse.json({ users });
    } else {
      return NextResponse.json({ users: [currentUser] });
    }
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/users - Create or update user
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      console.log('No userId found in auth()');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { role, metadata } = body;

    console.log('Creating/updating user:', { userId, role, metadata });

    // Check if user already exists using admin client
    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('clerk_id', userId)
      .single();

    if (existingUser) {
      // Update existing user using admin client
      const { data: updatedUser, error } = await supabaseAdmin
        .from('users')
        .update({
          role,
          metadata,
          updated_at: new Date().toISOString()
        })
        .eq('clerk_id', userId)
        .select()
        .single();

      if (error) {
        console.error('Error updating user:', error);
        throw error;
      }

      await createAuditLog(existingUser.id, 'user_updated', existingUser.id, 'user', {
        old_role: existingUser.role,
        new_role: role,
        old_metadata: existingUser.metadata,
        new_metadata: metadata
      });

      return NextResponse.json({ user: updatedUser });
    } else {
      // Create new user using admin client (bypasses RLS)
      const { data: newUser, error } = await supabaseAdmin
        .from('users')
        .insert({
          clerk_id: userId,
          role,
          metadata
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating user:', error);
        throw error;
      }

      await createAuditLog(newUser.id, 'user_created', newUser.id, 'user', {
        role,
        metadata
      });

      return NextResponse.json({ user: newUser }, { status: 201 });
    }
  } catch (error) {
    console.error('Error creating/updating user:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Internal server error' 
    }, { status: 500 });
  }
}
