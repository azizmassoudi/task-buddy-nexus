-- Create enum types
CREATE TYPE projectstatus AS ENUM ('active', 'completed', 'on_hold');
CREATE TYPE taskstatus AS ENUM ('todo', 'in_progress', 'review', 'done');
CREATE TYPE taskpriority AS ENUM ('low', 'medium', 'high');
CREATE TYPE projectmemberrole AS ENUM ('owner', 'member');

-- Create projects table
CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    description TEXT,
    status projectstatus NOT NULL,
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

-- Create tasks table
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR NOT NULL,
    description TEXT,
    status taskstatus NOT NULL,
    priority taskpriority NOT NULL,
    project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    assigned_to INTEGER REFERENCES users(id),
    created_by INTEGER NOT NULL REFERENCES users(id),
    due_date TIMESTAMP,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

-- Create project_members table
CREATE TABLE project_members (
    id SERIAL PRIMARY KEY,
    project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role projectmemberrole NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    UNIQUE(project_id, user_id)
);

-- Create indexes
CREATE INDEX ix_projects_id ON projects(id);
CREATE INDEX ix_tasks_id ON tasks(id);
CREATE INDEX ix_project_members_id ON project_members(id); 