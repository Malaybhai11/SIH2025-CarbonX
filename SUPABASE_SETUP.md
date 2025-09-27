# 🗄️ Supabase Backend Setup Guide

## Prerequisites
1. **Supabase Account**: Sign up at [supabase.com](https://supabase.com)
2. **Project Created**: Create a new project in your Supabase dashboard

## Step 1: Configure Environment Variables

Your `.env` file already has the basic Supabase credentials. You need to add the **Service Role Key**:

1. Go to your Supabase project dashboard
2. Navigate to **Settings** > **API**
3. Copy the **service_role** key (not the anon key)
4. Add it to your `.env` file:

```env
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...your-service-role-key
```

## Step 2: Set Up Database Schema

### Option A: Manual Setup (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `supabase/migrations/001_initial_schema.sql`
4. Click **Run** to execute the schema

### Option B: Automated Setup

```bash
npm run setup-supabase
```

## Step 3: Configure Storage

1. In your Supabase dashboard, go to **Storage**
2. Create a new bucket called `project_files`
3. Set it as **Public bucket**
4. Configure file size limits (recommended: 50MB)

## Step 4: Test the Integration

1. Start your development server:
```bash
npm run dev
```

2. Sign up for a new account
3. Complete the onboarding process
4. Check your Supabase dashboard to see the user data

## Database Tables Created

- **users**: Store user profiles and roles
- **projects**: Carbon credit projects
- **contributions**: Local contributor data
- **transactions**: Credit transactions and approvals
- **audit_logs**: System audit trail

## Security Features

- **Row Level Security (RLS)**: Enabled on all tables
- **Role-based Access**: Users can only access their own data
- **Admin Privileges**: Admins can access all data
- **File Upload Security**: Size and type restrictions

## API Endpoints

- `GET/POST /api/users` - User management
- `GET/POST /api/projects` - Project management
- `GET/POST /api/contributions` - Contributor data
- `POST /api/admin/projects/[id]/approve` - Admin project approval
- `POST /api/admin/projects/[id]/reject` - Admin project rejection
- `POST /api/upload` - File uploads

## Troubleshooting

### Common Issues:

1. **"Unauthorized" errors**: Check your Clerk authentication setup
2. **Database connection errors**: Verify your Supabase URL and keys
3. **RLS policy errors**: Ensure the user exists in the users table
4. **File upload fails**: Check storage bucket configuration

### Debug Steps:

1. Check browser console for errors
2. Verify environment variables are loaded
3. Test API endpoints in browser network tab
4. Check Supabase logs in dashboard

## Next Steps

After successful setup:

1. **Test User Flows**: Try all user roles (admin, organization, local)
2. **Project Submission**: Test the complete project workflow
3. **File Uploads**: Test document and image uploads
4. **Admin Features**: Test project approval/rejection

## Support

If you encounter issues:
1. Check the Supabase documentation
2. Review the error logs in both browser and Supabase dashboard
3. Ensure all environment variables are correctly set