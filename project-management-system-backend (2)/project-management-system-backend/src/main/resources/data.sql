-- Seed data for PMS (runs after Hibernate creates tables)

-- Insert default admin user (password: admin123 — BCrypt encoded)
INSERT INTO users (username, email, password, role, created_at)
VALUES ('admin', 'admin@pms.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'ADMIN', NOW())
ON CONFLICT (username) DO NOTHING;

-- Insert sample manager
INSERT INTO users (username, email, password, role, created_at)
VALUES ('manager1', 'manager@pms.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'MANAGER', NOW())
ON CONFLICT (username) DO NOTHING;

-- Insert sample developer
INSERT INTO users (username, email, password, role, created_at)
VALUES ('dev1', 'dev@pms.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'USER', NOW())
ON CONFLICT (username) DO NOTHING;

-- Insert sample projects
INSERT INTO projects (name, description, status, start_date, end_date, owner_id, created_at)
SELECT
  'E-Commerce Platform',
  'Build a full-stack e-commerce application',
  'IN_PROGRESS',
  DATE '2024-01-01',
  DATE '2024-06-30',
  u.id,
  NOW()
FROM users u
WHERE u.username = 'manager1'
  AND NOT EXISTS (
    SELECT 1
    FROM projects p
    WHERE p.name = 'E-Commerce Platform' AND p.owner_id = u.id
  )
LIMIT 1;

INSERT INTO projects (name, description, status, start_date, end_date, owner_id, created_at)
SELECT
  'CRM System',
  'Customer relationship management system',
  'PLANNED',
  DATE '2024-03-01',
  DATE '2024-09-30',
  u.id,
  NOW()
FROM users u
WHERE u.username = 'manager1'
  AND NOT EXISTS (
    SELECT 1
    FROM projects p
    WHERE p.name = 'CRM System' AND p.owner_id = u.id
  )
LIMIT 1;

-- Insert sample tasks
INSERT INTO tasks (title, description, status, priority, due_date, project_id, assignee_id, created_at)
SELECT
  'Setup project structure',
  'Initialize Spring Boot project with dependencies',
  'DONE',
  'HIGH',
  DATE '2024-01-10',
  p.id,
  u.id,
  NOW()
FROM projects p
JOIN users u ON u.username = 'dev1'
WHERE p.name = 'E-Commerce Platform'
  AND NOT EXISTS (
    SELECT 1 FROM tasks t WHERE t.title = 'Setup project structure' AND t.project_id = p.id
  )
LIMIT 1;

INSERT INTO tasks (title, description, status, priority, due_date, project_id, assignee_id, created_at)
SELECT
  'Implement authentication',
  'JWT-based login and registration',
  'IN_PROGRESS',
  'HIGH',
  DATE '2024-02-01',
  p.id,
  u.id,
  NOW()
FROM projects p
JOIN users u ON u.username = 'dev1'
WHERE p.name = 'E-Commerce Platform'
  AND NOT EXISTS (
    SELECT 1 FROM tasks t WHERE t.title = 'Implement authentication' AND t.project_id = p.id
  )
LIMIT 1;

INSERT INTO tasks (title, description, status, priority, due_date, project_id, assignee_id, created_at)
SELECT
  'Design database schema',
  'Create ERD and database schema',
  'TODO',
  'MEDIUM',
  DATE '2024-02-15',
  p.id,
  u.id,
  NOW()
FROM projects p
JOIN users u ON u.username = 'dev1'
WHERE p.name = 'CRM System'
  AND NOT EXISTS (
    SELECT 1 FROM tasks t WHERE t.title = 'Design database schema' AND t.project_id = p.id
  )
LIMIT 1;
