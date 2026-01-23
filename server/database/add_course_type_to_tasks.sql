-- =============================================
-- ADD COURSE_TYPE TO TASKS TABLE
-- =============================================
-- This migration adds a course_type column to categorize tasks
-- by course (frontend, backend, devops, react-native)
-- =============================================

-- Add course_type column to tasks table
ALTER TABLE `tasks`
  ADD COLUMN `course_type` VARCHAR(50) NULL 
  COMMENT 'Course type: frontend, backend, devops, react-native' 
  AFTER `skill_filter`;

-- Add index for faster filtering
ALTER TABLE `tasks`
  ADD INDEX `idx_course_type` (`course_type`);

-- =============================================
-- USAGE:
-- =============================================
-- When creating a task:
-- - course_type = 'frontend': Task appears in Frontend Dev course
-- - course_type = 'backend': Task appears in Backend Dev course
-- - course_type = 'devops': Task appears in DevOps course
-- - course_type = 'react-native': Task appears in React Native course
-- - course_type = NULL: Task appears in all courses
-- =============================================

-- Verify the change
DESCRIBE tasks;
