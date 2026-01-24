-- Migration to support creating tasks and roadmaps for multiple venues
-- This adds a grouping mechanism to track tasks/roadmaps created together for all venues

-- ============ TASKS TABLE UPDATES ============

-- Add group_id to tasks table (skip if already exists)
SET @col_exists = 0;
SELECT COUNT(*) INTO @col_exists 
FROM information_schema.COLUMNS 
WHERE TABLE_SCHEMA = DATABASE() 
AND TABLE_NAME = 'tasks' 
AND COLUMN_NAME = 'group_id';

SET @query = IF(@col_exists = 0, 
  'ALTER TABLE `tasks` ADD COLUMN `group_id` VARCHAR(100) DEFAULT NULL COMMENT ''Groups tasks created together for multiple venues'' AFTER `task_id`',
  'SELECT ''Column group_id already exists in tasks table'' AS message');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add index for group_id (skip if already exists)
SET @idx_exists = 0;
SELECT COUNT(*) INTO @idx_exists 
FROM information_schema.STATISTICS 
WHERE TABLE_SCHEMA = DATABASE() 
AND TABLE_NAME = 'tasks' 
AND INDEX_NAME = 'idx_task_group';

SET @query = IF(@idx_exists = 0, 
  'ALTER TABLE `tasks` ADD INDEX `idx_task_group` (`group_id`)',
  'SELECT ''Index idx_task_group already exists'' AS message');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add is_template flag
SET @col_exists = 0;
SELECT COUNT(*) INTO @col_exists 
FROM information_schema.COLUMNS 
WHERE TABLE_SCHEMA = DATABASE() 
AND TABLE_NAME = 'tasks' 
AND COLUMN_NAME = 'is_template';

SET @query = IF(@col_exists = 0, 
  'ALTER TABLE `tasks` ADD COLUMN `is_template` TINYINT(1) DEFAULT 0 COMMENT ''Marks if this is a template task for all venues'' AFTER `status`',
  'SELECT ''Column is_template already exists in tasks table'' AS message');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;


-- ============ ROADMAP TABLE UPDATES ============

-- Add course_type column
SET @col_exists = 0;
SELECT COUNT(*) INTO @col_exists 
FROM information_schema.COLUMNS 
WHERE TABLE_SCHEMA = DATABASE() 
AND TABLE_NAME = 'roadmap' 
AND COLUMN_NAME = 'course_type';

SET @query = IF(@col_exists = 0, 
  'ALTER TABLE `roadmap` ADD COLUMN `course_type` VARCHAR(50) DEFAULT ''frontend'' COMMENT ''Type of course: frontend, backend, etc.'' AFTER `description`',
  'SELECT ''Column course_type already exists in roadmap table'' AS message');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add learning_objectives column
SET @col_exists = 0;
SELECT COUNT(*) INTO @col_exists 
FROM information_schema.COLUMNS 
WHERE TABLE_SCHEMA = DATABASE() 
AND TABLE_NAME = 'roadmap' 
AND COLUMN_NAME = 'learning_objectives';

SET @query = IF(@col_exists = 0, 
  'ALTER TABLE `roadmap` ADD COLUMN `learning_objectives` TEXT DEFAULT NULL COMMENT ''Learning objectives for this module'' AFTER `course_type`',
  'SELECT ''Column learning_objectives already exists in roadmap table'' AS message');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add module_order column
SET @col_exists = 0;
SELECT COUNT(*) INTO @col_exists 
FROM information_schema.COLUMNS 
WHERE TABLE_SCHEMA = DATABASE() 
AND TABLE_NAME = 'roadmap' 
AND COLUMN_NAME = 'module_order';

SET @query = IF(@col_exists = 0, 
  'ALTER TABLE `roadmap` ADD COLUMN `module_order` INT DEFAULT NULL COMMENT ''Order of module in the roadmap'' AFTER `learning_objectives`',
  'SELECT ''Column module_order already exists in roadmap table'' AS message');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add group_id to roadmap table
SET @col_exists = 0;
SELECT COUNT(*) INTO @col_exists 
FROM information_schema.COLUMNS 
WHERE TABLE_SCHEMA = DATABASE() 
AND TABLE_NAME = 'roadmap' 
AND COLUMN_NAME = 'group_id';

SET @query = IF(@col_exists = 0, 
  'ALTER TABLE `roadmap` ADD COLUMN `group_id` VARCHAR(100) DEFAULT NULL COMMENT ''Groups roadmap modules created together for multiple venues'' AFTER `roadmap_id`',
  'SELECT ''Column group_id already exists in roadmap table'' AS message');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add index for group_id
SET @idx_exists = 0;
SELECT COUNT(*) INTO @idx_exists 
FROM information_schema.STATISTICS 
WHERE TABLE_SCHEMA = DATABASE() 
AND TABLE_NAME = 'roadmap' 
AND INDEX_NAME = 'idx_roadmap_group';

SET @query = IF(@idx_exists = 0, 
  'ALTER TABLE `roadmap` ADD INDEX `idx_roadmap_group` (`group_id`)',
  'SELECT ''Index idx_roadmap_group already exists'' AS message');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add is_template flag
SET @col_exists = 0;
SELECT COUNT(*) INTO @col_exists 
FROM information_schema.COLUMNS 
WHERE TABLE_SCHEMA = DATABASE() 
AND TABLE_NAME = 'roadmap' 
AND COLUMN_NAME = 'is_template';

SET @query = IF(@col_exists = 0, 
  'ALTER TABLE `roadmap` ADD COLUMN `is_template` TINYINT(1) DEFAULT 0 COMMENT ''Marks if this is a template roadmap for all venues'' AFTER `status`',
  'SELECT ''Column is_template already exists in roadmap table'' AS message');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;


-- ============ WHAT THESE CHANGES ENABLE ============
-- 1. When admin creates task/roadmap for "All Venues", the system generates a unique group_id
-- 2. Creates individual records for each active venue with the same group_id
-- 3. Can query all related tasks/roadmaps using the group_id
-- 4. Can update/delete all tasks in a group together
-- 5. Maintains referential integrity (each record still has a specific venue_id)
-- 6. Adds missing columns (course_type, learning_objectives, module_order) that the code expects
