-- Remove Manager link and ensure User link is strong
ALTER TABLE users DROP COLUMN IF EXISTS manager_id;
ALTER TABLE records DROP COLUMN IF EXISTS manager_id;

-- Ensure records are linked to the right account
ALTER TABLE records ADD COLUMN IF NOT EXISTS user_id INTEGER REFERENCES users(id);

-- Optional: Clean up roles (convert existing managers to users or admins?)
-- UPDATE users SET role = 'user' WHERE role = 'manager';
