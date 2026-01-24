-- =============================================
-- VERIFY SKILL_FILTER COLUMN EXISTS
-- =============================================
-- Run this query to check if the skill_filter column exists in the tasks table
-- =============================================

SHOW COLUMNS FROM tasks LIKE 'skill_filter';

-- If the above query returns empty (0 rows), then run the migration:
-- SOURCE add_skill_filter_to_tasks.sql;

-- OR manually run:
-- ALTER TABLE `tasks` ADD COLUMN `skill_filter` VARCHAR(255) NULL COMMENT 'Optional skill name - task shows only to students who have NOT cleared this skill' AFTER `external_url`;
-- ALTER TABLE `tasks` ADD INDEX `idx_skill_filter` (`skill_filter`);
