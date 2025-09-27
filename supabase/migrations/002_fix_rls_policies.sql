-- Fix RLS policies to avoid infinite recursion
-- Drop existing policies that cause recursion
DROP POLICY IF EXISTS "Users can read own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;
DROP POLICY IF EXISTS "Organizations can manage own projects" ON projects;
DROP POLICY IF EXISTS "Users can manage own contributions" ON contributions;
DROP POLICY IF EXISTS "Users can read related transactions" ON transactions;
DROP POLICY IF EXISTS "Only admins can read audit logs" ON audit_logs;

-- Create new policies that avoid recursion

-- Users policies - simplified to avoid circular dependencies
CREATE POLICY "Users can read own data" ON users
    FOR SELECT USING (clerk_id = auth.jwt() ->> 'sub');

CREATE POLICY "Users can update own data" ON users
    FOR UPDATE USING (clerk_id = auth.jwt() ->> 'sub');

CREATE POLICY "Users can insert own data" ON users
    FOR INSERT WITH CHECK (clerk_id = auth.jwt() ->> 'sub');

-- Admin access for users - separate policy to avoid recursion
CREATE POLICY "Service role can access all users" ON users
    FOR ALL USING (auth.role() = 'service_role');

-- Projects policies
CREATE POLICY "Users can read own projects" ON projects
    FOR SELECT USING (
        org_id IN (SELECT id FROM users WHERE clerk_id = auth.jwt() ->> 'sub') OR
        status = 'approved'
    );

CREATE POLICY "Organizations can manage own projects" ON projects
    FOR ALL USING (
        org_id IN (SELECT id FROM users WHERE clerk_id = auth.jwt() ->> 'sub')
    );

CREATE POLICY "Service role can access all projects" ON projects
    FOR ALL USING (auth.role() = 'service_role');

-- Contributions policies
CREATE POLICY "Users can read own contributions" ON contributions
    FOR SELECT USING (
        user_id IN (SELECT id FROM users WHERE clerk_id = auth.jwt() ->> 'sub')
    );

CREATE POLICY "Users can manage own contributions" ON contributions
    FOR ALL USING (
        user_id IN (SELECT id FROM users WHERE clerk_id = auth.jwt() ->> 'sub')
    );

CREATE POLICY "Service role can access all contributions" ON contributions
    FOR ALL USING (auth.role() = 'service_role');

-- Transactions policies
CREATE POLICY "Users can read related transactions" ON transactions
    FOR SELECT USING (
        user_id IN (SELECT id FROM users WHERE clerk_id = auth.jwt() ->> 'sub') OR
        project_id IN (
            SELECT id FROM projects 
            WHERE org_id IN (SELECT id FROM users WHERE clerk_id = auth.jwt() ->> 'sub')
        )
    );

CREATE POLICY "Service role can access all transactions" ON transactions
    FOR ALL USING (auth.role() = 'service_role');

-- Audit logs policies - only service role can access
CREATE POLICY "Service role can access audit logs" ON audit_logs
    FOR ALL USING (auth.role() = 'service_role');