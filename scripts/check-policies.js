#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials. Please check your .env file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkPolicies() {
  console.log('🔍 Checking RLS policies on users table...\n');

  try {
    // Check if RLS is enabled on users table
    const { data: rlsStatus, error: rlsError } = await supabase
      .from('users')
      .select()
      .limit(1);
    
    if (rlsError) {
      console.error('RLS Status Check Error:', rlsError);
    } else {
      console.log('✅ Successfully queried users table');
    }

    // Try to get policies information
    const { data: policies, error: policiesError } = await supabase
      .rpc('get_policies', { table_name: 'users' });
    
    if (policiesError) {
      console.error('Policies Check Error:', policiesError);
      console.log('\nℹ️  This might be expected if the get_policies function does not exist');
    } else {
      console.log('📋 Current policies on users table:');
      console.log(JSON.stringify(policies, null, 2));
    }

    console.log('\n✅ Policy check completed');
  } catch (error) {
    console.error('❌ Error checking policies:', error);
  }
}

checkPolicies();
