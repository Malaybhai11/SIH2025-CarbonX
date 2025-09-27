import { auth } from '@clerk/nextjs/server';
import { supabase, supabaseAdmin } from './supabase';
import type { User } from './supabase';

export async function getCurrentUser(): Promise<User | null> {
  const { userId } = await auth();
  
  if (!userId) {
    return null;
  }

  const { data: user, error } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('clerk_id', userId)
    .single();

  if (error) {
    console.error('Error fetching user:', error);
    return null;
  }

  return user;
}

export async function requireAuth(): Promise<User> {
  const user = await getCurrentUser();
  
  if (!user) {
    throw new Error('Unauthorized');
  }

  return user;
}

export async function requireRole(allowedRoles: string[]): Promise<User> {
  const user = await requireAuth();
  
  if (!allowedRoles.includes(user.role)) {
    throw new Error('Insufficient permissions');
  }

  return user;
}

export async function createAuditLog(
  actorId: string,
  action: string,
  targetId: string,
  targetType: 'user' | 'project' | 'contribution',
  details: Record<string, any> = {}
) {
  await supabaseAdmin
    .from('audit_logs')
    .insert({
      actor_id: actorId,
      action,
      target_id: targetId,
      target_type: targetType,
      details
    });
}