-- =============================================
-- STUDENT SKILLS TABLE - NEW STRUCTURE
-- =============================================
-- This migration updates the student_skills table to:
-- 1. Add slot_id (from Excel 'id' column)
-- 2. Add year column (supports Roman numerals I, II, III, IV)
-- 3. Remove unique constraints to allow multiple records per student/course
-- 4. Each Excel row = one database row (no updates, only inserts)
-- =============================================

-- Step 1: Backup existing data (optional - run manually if needed)
-- CREATE TABLE student_skills_backup AS SELECT * FROM student_skills;

-- Step 2: Drop existing unique constraints that prevent duplicates
ALTER TABLE `student_skills` 
  DROP INDEX IF EXISTS `unique_student_skill_course`,
  DROP INDEX IF EXISTS `unique_student_course_excel_venue`;

-- Step 3: Add new columns
ALTER TABLE `student_skills`
  ADD COLUMN `slot_id` INT UNSIGNED NULL COMMENT 'Slot ID from Excel file' AFTER `id`,
  ADD COLUMN `year` INT NULL DEFAULT 2 COMMENT 'Student year (1-4)' AFTER `student_id`,
  ADD COLUMN `student_name` VARCHAR(255) NULL COMMENT 'Student name from Excel' AFTER `year`,
  ADD COLUMN `student_email` VARCHAR(255) NULL COMMENT 'Student email from Excel' AFTER `student_name`,
  MODIFY COLUMN `total_attempts` INT NOT NULL DEFAULT 1 COMMENT 'Attempt count from Excel (not auto-incremented)';

-- Step 4: Add index for slot_id and slot_date for faster queries
ALTER TABLE `student_skills`
  ADD INDEX `idx_slot_id` (`slot_id`),
  ADD INDEX `idx_slot_date_desc` (`slot_date` DESC),
  ADD INDEX `idx_student_course_date` (`student_id`, `course_name`, `slot_date`);

-- Step 5: Rename last_slot_date to slot_date for clarity (optional - keeping both for compatibility)
-- The column last_slot_date will now store the slot_date from Excel directly

-- =============================================
-- VERIFICATION QUERIES (run after migration)
-- =============================================

-- Check new structure:
-- DESCRIBE student_skills;

-- Verify indexes:
-- SHOW INDEX FROM student_skills;

-- =============================================
-- EXCEL FORMAT EXPECTED:
-- =============================================
-- | id | roll_number | user_id | name | year | email | course_name | venue | attendance | score | attempt | status | slot_date | start_time | end_time |
--
-- - id: Stored as slot_id
-- - year: Accepts Roman numerals (I=1, II=2, III=3, IV=4) or numbers
-- - attempt: Stored as total_attempts (not auto-incremented)
-- - Same student + course + same date = SKIP (don't insert)
-- - Same student + course + different date = INSERT new record
-- =============================================
