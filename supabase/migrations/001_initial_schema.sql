-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clerk_id TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('admin', 'organization', 'local')),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Projects table
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'approved', 'rejected')),
    credits INTEGER DEFAULT 0,
    location TEXT NOT NULL,
    coordinates TEXT,
    type TEXT NOT NULL,
    methodology TEXT,
    baseline TEXT,
    monitoring TEXT,
    expected_credits INTEGER DEFAULT 0,
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contributions table
CREATE TABLE contributions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL,
    location TEXT NOT NULL,
    coordinates TEXT,
    date DATE NOT NULL,
    quantity INTEGER,
    file_urls TEXT[] DEFAULT '{}',
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'verified', 'rejected')),
    impact TEXT NOT NULL DEFAULT 'medium' CHECK (impact IN ('low', 'medium', 'high')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Transactions table
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    tx_type TEXT NOT NULL CHECK (tx_type IN ('credit_issued', 'credit_transferred', 'project_approved')),
    amount INTEGER NOT NULL,
    tx_hash TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audit logs table
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor_id UUID REFERENCES users(id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    target_id TEXT NOT NULL,
    target_type TEXT NOT NULL CHECK (target_type IN ('user', 'project', 'contribution')),
    details JSONB DEFAULT '{}',
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_users_clerk_id ON users(clerk_id);
CREATE INDEX idx_projects_org_id ON projects(org_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_contributions_user_id ON contributions(user_id);
CREATE INDEX idx_contributions_project_id ON contributions(project_id);
CREATE INDEX idx_contributions_status ON contributions(status);
CREATE INDEX idx_transactions_project_id ON transactions(project_id);
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_audit_logs_actor_id ON audit_logs(actor_id);
CREATE INDEX idx_audit_logs_timestamp ON audit_logs(timestamp);

-- Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE contributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Users can read their own data, admins can read all
CREATE POLICY "Users can read own data" ON users
    FOR SELECT USING (clerk_id = auth.jwt() ->> 'sub' OR 
                     EXISTS(SELECT 1 FROM users WHERE clerk_id = auth.jwt() ->> 'sub' AND role = 'admin'));

-- Users can update their own data, admins can update all
CREATE POLICY "Users can update own data" ON users
    FOR UPDATE USING (clerk_id = auth.jwt() ->> 'sub' OR 
                     EXISTS(SELECT 1 FROM users WHERE clerk_id = auth.jwt() ->> 'sub' AND role = 'admin'));

-- Projects: Organizations can manage their own projects, others can read approved projects
CREATE POLICY "Organizations can manage own projects" ON projects
    FOR ALL USING (
        org_id IN (SELECT id FROM users WHERE clerk_id = auth.jwt() ->> 'sub') OR
        (status = 'approved' AND auth.jwt() ->> 'sub' IS NOT NULL) OR
        EXISTS(SELECT 1 FROM users WHERE clerk_id = auth.jwt() ->> 'sub' AND role = 'admin')
    );

-- Contributions: Users can manage their own contributions
CREATE POLICY "Users can manage own contributions" ON contributions
    FOR ALL USING (
        user_id IN (SELECT id FROM users WHERE clerk_id = auth.jwt() ->> 'sub') OR
        EXISTS(SELECT 1 FROM users WHERE clerk_id = auth.jwt() ->> 'sub' AND role = 'admin')
    );

-- Transactions: Users can read related transactions
CREATE POLICY "Users can read related transactions" ON transactions
    FOR SELECT USING (
        user_id IN (SELECT id FROM users WHERE clerk_id = auth.jwt() ->> 'sub') OR
        project_id IN (SELECT id FROM projects WHERE org_id IN (SELECT id FROM users WHERE clerk_id = auth.jwt() ->> 'sub')) OR
        EXISTS(SELECT 1 FROM users WHERE clerk_id = auth.jwt() ->> 'sub' AND role = 'admin')
    );

-- Audit logs: Only admins can read
CREATE POLICY "Only admins can read audit logs" ON audit_logs
    FOR SELECT USING (EXISTS(SELECT 1 FROM users WHERE clerk_id = auth.jwt() ->> 'sub' AND role = 'admin'));

-- Functions for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_contributions_updated_at BEFORE UPDATE ON contributions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();