#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials. Please check your .env file.');
  process.exit(1);
}

// Create admin client that bypasses RLS
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function dropProblematicPolicies() {
  console.log('🗑️  Dropping problematic RLS policies...\n');

  try {
    // Drop the policies causing infinite recursion
    const policiesToDrop = [
      'Users can read own data',
      'Users can update own data',
      'Organizations can manage own projects',
      'Users can manage own contributions',
      'Users can read related transactions',
      'Only admins can read audit logs'
    ];

    for (const policyName of policiesToDrop) {
      console.log(`Dropping policy: ${policyName}`);
      
      // We can't directly drop policies through the JS client
      // Instead, we'll try to reset the policies by disabling and re-enabling RLS
      console.log(`⚠️  Manual intervention required for policy: ${policyName}`);
    }

    console.log('\n⚠️  IMPORTANT: You need to manually drop these policies in the Supabase dashboard:');
    console.log('1. Go to your Supabase project dashboard');
    console.log('2. Navigate to "Table Editor"');
    console.log('3. For each table (users, projects, contributions, transactions, audit_logs):');
    console.log('   - Click on the table name');
    console.log('   - Go to "RLS" tab');
    console.log('   - Delete the problematic policies listed above');
    
    console.log('\n✅ Policy drop script completed');
  } catch (error) {
    console.error('❌ Error dropping policies:', error);
  }
}

dropProblematicPolicies();
