#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials. Please check your .env file.');
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function applyMigrations() {
  console.log('🚀 Applying Supabase migrations...\n');

  try {
    const migrationsDir = path.join(__dirname, '..', 'supabase', 'migrations');
    
    if (!fs.existsSync(migrationsDir)) {
      console.error('❌ Migrations directory not found');
      process.exit(1);
    }

    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort(); // Ensure migrations are applied in order
    
    for (const migrationFile of migrationFiles) {
      console.log(`Applying migration: ${migrationFile}...`);
      const migrationPath = path.join(migrationsDir, migrationFile);
      const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
      
      // Execute the entire migration file as one SQL statement
      const { error } = await supabase.rpc('exec_sql', { sql_statement: migrationSQL });
      
      if (error) {
        console.error(`❌ Error applying migration ${migrationFile}:`, error);
      } else {
        console.log(`✅ Migration ${migrationFile} applied successfully`);
      }
    }
    
    console.log('\n🎉 All migrations applied successfully!');
  } catch (error) {
    console.error('❌ Error applying migrations:', error);
    process.exit(1);
  }
}

// Run migrations
applyMigrations();
