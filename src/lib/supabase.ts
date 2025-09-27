import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Client for frontend (with RLS)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Admin client for backend operations (bypasses RLS)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Database Types
export interface User {
  id: string
  clerk_id: string
  role: 'admin' | 'organization' | 'local'
  metadata: Record<string, any>
  created_at: string
}

export interface Project {
  id: string
  org_id: string
  name: string
  description: string
  status: 'pending' | 'under_review' | 'approved' | 'rejected'
  credits: number
  location: string
  coordinates?: string
  type: string
  methodology?: string
  baseline?: string
  monitoring?: string
  expected_credits: number
  start_date?: string
  end_date?: string
  created_at: string
  updated_at: string
}

export interface Contribution {
  id: string
  user_id: string
  project_id?: string
  title: string
  description: string
  type: string
  location: string
  coordinates?: string
  date: string
  quantity?: number
  file_urls: string[]
  status: 'pending' | 'under_review' | 'verified' | 'rejected'
  impact: 'low' | 'medium' | 'high'
  created_at: string
}

export interface Transaction {
  id: string
  project_id: string
  user_id: string
  tx_type: 'credit_issued' | 'credit_transferred' | 'project_approved'
  amount: number
  tx_hash?: string
  metadata: Record<string, any>
  created_at: string
}

export interface AuditLog {
  id: string
  actor_id: string
  action: string
  target_id: string
  target_type: 'user' | 'project' | 'contribution'
  details: Record<string, any>
  timestamp: string
}