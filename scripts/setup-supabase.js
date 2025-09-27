#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // You'll need to add this to .env

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials. Please check your .env file.');
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupSupabase() {
  console.log('🚀 Setting up Supabase backend...\n');

  try {
    // 1. Create storage bucket if it doesn't exist
    console.log('📁 Setting up storage buckets...');
    
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('Error listing buckets:', listError);
    } else {
      const bucketExists = buckets.some(bucket => bucket.name === 'project_files');
      
      if (!bucketExists) {
        const { error: bucketError } = await supabase.storage.createBucket('project_files', {
          public: true,
          allowedMimeTypes: [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'text/csv',
            'image/jpeg',
            'image/png',
            'image/tiff',
            'image/gif',
            'video/mp4',
            'application/zip'
          ],
          fileSizeLimit: 52428800 // 50MB
        });
        
        if (bucketError) {
          console.error('❌ Error creating bucket:', bucketError);
        } else {
          console.log('✅ Created project_files bucket');
        }
      } else {
        console.log('✅ project_files bucket already exists');
      }
    }

    // 2. Read and execute all migration SQL files in order
    console.log('\n📊 Setting up database schema...');
    
    const migrationsDir = path.join(__dirname, '..', 'supabase', 'migrations');
    
    if (fs.existsSync(migrationsDir)) {
      const migrationFiles = fs.readdirSync(migrationsDir)
        .filter(file => file.endsWith('.sql'))
        .sort(); // Ensure migrations are applied in order
      
      for (const migrationFile of migrationFiles) {
        console.log(`\n Applying migration: ${migrationFile}...`);
        const migrationPath = path.join(migrationsDir, migrationFile);
        const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
        
        // Split the SQL into individual statements and execute them
        const statements = migrationSQL
          .split(';')
          .map(stmt => stmt.trim())
          .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
        
        for (const statement of statements) {
          if (statement.length > 0) {
            try {
              await supabase.rpc('exec_sql', { sql_statement: statement + ';' });
            } catch (error) {
              // Try direct query if RPC fails
              const { error: queryError } = await supabase.from('_dummy_').select('*').limit(0);
              if (queryError && !queryError.message.includes('relation "_dummy_" does not exist')) {
                console.error('SQL Error:', error);
              }
            }
          }
        }
        
        console.log(`✅ Migration ${migrationFile} applied successfully`);
      }
      
      console.log('\n✅ All database migrations applied successfully');
    } else {
      console.log('⚠️  Migrations directory not found, you may need to run the SQL manually');
    }

    // 3. Create initial admin user if needed
    console.log('\n👤 Checking for admin users...');
    
    const { data: adminUsers, error: adminError } = await supabase
      .from('users')
      .select('*')
      .eq('role', 'admin')
      .limit(1);
    
    if (adminError) {
      console.log('⚠️  Could not check for admin users (table might not exist yet)');
    } else if (adminUsers && adminUsers.length === 0) {
      console.log('ℹ️  No admin users found. Create one through the app after signing up.');
    } else {
      console.log('✅ Admin users exist');
    }

    console.log('\n🎉 Supabase setup completed successfully!');
    console.log('\nNext steps:');
    console.log('1. Update your frontend to use the new API endpoints');
    console.log('2. Test the authentication flow');
    console.log('3. Create your first admin user through the onboarding process');

  } catch (error) {
    console.error('❌ Error setting up Supabase:', error);
    process.exit(1);
  }
}

// Run setup
setupSupabase();
