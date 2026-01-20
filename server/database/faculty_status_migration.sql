-- Faculty Status Migration
-- This migration updates the is_active column to support 3 statuses:
-- 0 = Inactive
-- 1 = Active (default)
-- 2 = On Leave
-- 
-- Run this migration on your database to enable "On Leave" status for faculty

-- The is_active column is already TINYINT(1), which can store values 0, 1, 2
-- No schema change needed, just a comment for documentation

-- Update any existing data if needed (optional)
-- All existing faculty with is_active = 1 remain Active
-- All existing faculty with is_active = 0 remain Inactive

-- To test the new status, you can run:
-- UPDATE users SET is_active = 2 WHERE user_id = <faculty_user_id> AND role_id = 2;

-- Status mapping:
-- is_active = 0 -> Inactive (faculty is deactivated, cannot login)
-- is_active = 1 -> Active (faculty is actively working)
-- is_active = 2 -> On Leave (faculty is temporarily on leave)

SELECT 'Faculty status migration documentation created. No schema changes required.' AS message;
