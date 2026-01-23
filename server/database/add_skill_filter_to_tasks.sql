-- =============================================
-- ADD SKILL FILTER TO TASKS TABLE
-- =============================================
-- This migration adds a skill_filter column to filter task visibility
-- based on student skill completion status.
-- =============================================

-- Add skill_filter column to tasks table
ALTER TABLE `tasks`
  ADD COLUMN `skill_filter` VARCHAR(255) NULL COMMENT 'Optional skill name - task shows only to students who have NOT cleared this skill' AFTER `external_url`;

-- Add index for faster filtering
ALTER TABLE `tasks`
  ADD INDEX `idx_skill_filter` (`skill_filter`);

-- =============================================
-- USAGE:
-- =============================================
-- When creating a task:
-- - If skill_filter is NULL: Task shows to ALL students in the venue
-- - If skill_filter = 'HTML/CSS': Task shows only to students who have NOT cleared HTML/CSS
--   (students with status 'Not Cleared' or 'Ongoing' OR students with no record for that skill)
--
-- Example:
-- INSERT INTO tasks (title, skill_filter, ...) VALUES ('HTML Quiz', 'HTML/CSS', ...);
-- This task will only appear for students who haven't completed HTML/CSS
-- =============================================

-- Verify the change
DESCRIBE tasks;
