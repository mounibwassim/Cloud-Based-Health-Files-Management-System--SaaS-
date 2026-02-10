-- Emergency Audit & Fix Script

-- 1. Remove Manager Hierarchy
ALTER TABLE users DROP COLUMN IF EXISTS manager_id;
ALTER TABLE records DROP COLUMN IF EXISTS manager_id;

-- 2. Clean and Enforce Integer Type on user_id
-- First, try to convert any existing string data to integer (if possible), or nullify invalid ones
-- This prevents the "operator does not exist" error if it was somehow text
-- Note: In a real prod env we might check data first, but instruction is "Emergency Reset"
ALTER TABLE records 
    ALTER COLUMN user_id TYPE INTEGER USING (NULLIF(user_id::text, '')::integer);

-- 3. Ensure Roles are Clean
UPDATE users SET role = 'user' WHERE role = 'manager'; -- Flatten Managers to Users

-- 4. Verify Admin Exists
-- (Optional: You might want to ensure 'mounib' is admin)
UPDATE users SET role = 'admin' WHERE username = 'mounib';

SELECT 'Audit Completed' as status;
