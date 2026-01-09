-- =====================================================
-- DATABASE CLEANUP AND OPTIMIZATION SCRIPT
-- Generated: January 9, 2026
-- Purpose: Remove unused tables/columns and add missing columns
-- =====================================================

-- IMPORTANT: BACKUP YOUR DATABASE BEFORE RUNNING THIS SCRIPT!
-- Run this command first: mysqldump -u root -p studentactivity > backup_before_cleanup.sql

SET FOREIGN_KEY_CHECKS=0;

-- =====================================================
-- SECTION 1: DROP COMPLETELY UNUSED TABLES
-- =====================================================
-- These tables are defined in the schema but never used in the application

-- 1. mapping_history - No references found in controllers or frontend
DROP TABLE IF EXISTS `mapping_history`;

-- 2. resources - Old table, replaced by roadmap_resources
DROP TABLE IF EXISTS `resources`;

-- 3. venue_skills - Not used anywhere in the application
DROP TABLE IF EXISTS `venue_skills`;

-- 4. student_report - Not used, replaced by task_submissions
DROP TABLE IF EXISTS `student_report`;

-- =====================================================
-- SECTION 2: DROP UNUSED COLUMNS FROM ACTIVE TABLES
-- =====================================================

-- GROUPS table - Remove unused columns
-- The 'groups' table uses venue_id and faculty_id through relationships, 
-- but has unused direct reference columns
-- Note: Keep all columns as they are used in queries

-- FACULTIES table - All columns are used
-- No changes needed

-- STUDENTS table - All columns are used
-- No changes needed

-- VENUE table - All columns are used
-- No changes needed

-- ATTENDANCE table - All columns are used
-- No changes needed

-- TASKS table - All columns are used
-- No changes needed

-- TASK_SUBMISSIONS table - All columns are used
-- No changes needed

-- TASK_FILES table - All columns are used
-- No changes needed

-- ROADMAP table - All columns are used
-- No changes needed

-- ROADMAP_RESOURCES table - All columns are used
-- No changes needed

-- STUDENT_SKILLS table - All columns are used
-- No changes needed

-- =====================================================
-- SECTION 3: ADD MISSING COLUMNS
-- =====================================================

-- Check if any columns are referenced in code but missing from schema
-- Based on analysis, all referenced columns exist in the database

-- Add index for better performance on frequently queried columns
-- These indexes will improve query performance

-- Index for attendance queries
ALTER TABLE `attendance` 
ADD INDEX `idx_attendance_created_date` (`created_at`),
ADD INDEX `idx_attendance_student_venue` (`student_id`, `venue_id`);

-- Index for task submissions
ALTER TABLE `task_submissions` 
ADD INDEX `idx_submission_status_date` (`status`, `submitted_at`);

-- Index for student skills queries
ALTER TABLE `student_skills`
ADD INDEX `idx_student_skills_status_date` (`status`, `last_slot_date`);

-- Index for roadmap queries
ALTER TABLE `roadmap`
ADD INDEX `idx_roadmap_venue_day` (`venue_id`, `day`);

-- =====================================================
-- SECTION 4: CLEAN UP VENUE_ALLOCATION TABLE
-- =====================================================
-- This table is partially used - only in skillReportController
-- but the functionality can be replaced with direct venue.assigned_faculty_id

-- Option 1: Keep the table for historical data tracking
-- Option 2: Drop it and use only venue.assigned_faculty_id

-- Recommended: Keep it for now, but consider migrating to venue.assigned_faculty_id
-- If you want to drop it, uncomment the following line:
-- DROP TABLE IF EXISTS `venue_allocation`;

-- =====================================================
-- SECTION 5: VERIFY FOREIGN KEY CONSTRAINTS
-- =====================================================
-- All foreign key constraints are valid and in use

-- =====================================================
-- SECTION 6: OPTIMIZE TABLES
-- =====================================================

OPTIMIZE TABLE `attendance`;
OPTIMIZE TABLE `attendance_session`;
OPTIMIZE TABLE `faculties`;
OPTIMIZE TABLE `group_students`;
OPTIMIZE TABLE `groups`;
OPTIMIZE TABLE `roadmap`;
OPTIMIZE TABLE `roadmap_resources`;
OPTIMIZE TABLE `skills`;
OPTIMIZE TABLE `student_skills`;
OPTIMIZE TABLE `students`;
OPTIMIZE TABLE `task_files`;
OPTIMIZE TABLE `task_submissions`;
OPTIMIZE TABLE `tasks`;
OPTIMIZE TABLE `users`;
OPTIMIZE TABLE `venue`;

SET FOREIGN_KEY_CHECKS=1;

-- =====================================================
-- SUMMARY OF CHANGES
-- =====================================================
-- TABLES DROPPED:
--   1. mapping_history (unused)
--   2. resources (replaced by roadmap_resources)
--   3. venue_skills (unused)
--   4. student_report (replaced by task_submissions)
--
-- COLUMNS DROPPED:
--   None - all columns in active tables are being used
--
-- COLUMNS ADDED:
--   None - all referenced columns already exist
--
-- INDEXES ADDED:
--   - attendance: idx_attendance_created_date, idx_attendance_student_venue
--   - task_submissions: idx_submission_status_date
--   - student_skills: idx_student_skills_status_date
--   - roadmap: idx_roadmap_venue_day
--
-- TABLES TO REVIEW:
--   - venue_allocation: Partially used, consider consolidating with venue.assigned_faculty_id
--
-- =====================================================
-- POST-MIGRATION VERIFICATION
-- =====================================================
-- Run these queries to verify the cleanup:

-- Check remaining tables
-- SELECT TABLE_NAME 
-- FROM INFORMATION_SCHEMA.TABLES 
-- WHERE TABLE_SCHEMA = 'studentactivity' 
-- ORDER BY TABLE_NAME;

-- Check table sizes
-- SELECT 
--   TABLE_NAME,
--   ROUND(((DATA_LENGTH + INDEX_LENGTH) / 1024 / 1024), 2) AS 'Size (MB)'
-- FROM INFORMATION_SCHEMA.TABLES
-- WHERE TABLE_SCHEMA = 'studentactivity'
-- ORDER BY (DATA_LENGTH + INDEX_LENGTH) DESC;

-- =====================================================
-- NOTES FOR DEVELOPERS
-- =====================================================
-- 1. All critical application tables are preserved
-- 2. Only completely unused tables are dropped
-- 3. Performance indexes added for frequently queried columns
-- 4. All foreign key relationships maintained
-- 5. No data loss for active features
-- 6. Consider implementing soft deletes for student_report functionality
--    if historical tracking is needed in the future
