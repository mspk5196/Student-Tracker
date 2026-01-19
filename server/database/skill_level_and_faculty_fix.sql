-- Migration: Add skill_level to student_skills and fix faculty delete constraint
-- Run this SQL before testing the changes

-- 1. Add skill_level column to student_skills table (stores extracted level number)
ALTER TABLE student_skills 
ADD COLUMN skill_level INT DEFAULT NULL COMMENT 'Extracted skill level from course name (e.g., Level 1, Level 2)' 
AFTER course_name;

-- 2. Add index for better query performance on skill_level
CREATE INDEX idx_skill_level ON student_skills(skill_level);

-- 3. Fix the groups table foreign key to allow faculty deletion
-- First, drop the existing restrictive constraint
ALTER TABLE `groups` DROP FOREIGN KEY `groups_ibfk_2`;

-- 4. Recreate the constraint with SET NULL on delete
-- This allows faculty to be deleted while preserving the group (faculty_id becomes NULL)
ALTER TABLE `groups` 
MODIFY COLUMN `faculty_id` INT UNSIGNED NULL;

ALTER TABLE `groups` 
ADD CONSTRAINT `groups_ibfk_2` 
FOREIGN KEY (`faculty_id`) REFERENCES `faculties` (`faculty_id`) 
ON DELETE SET NULL ON UPDATE RESTRICT;

-- 5. Verify the changes
-- SHOW CREATE TABLE student_skills;
-- SHOW CREATE TABLE `groups`;
