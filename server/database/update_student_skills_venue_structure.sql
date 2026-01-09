-- Update student_skills table to store Excel venue name and student's current venue allocation
-- Run this migration to update the table structure

USE studentconnections;

-- Drop existing venue_id foreign key if it exists
SET @constraint_exists = (SELECT COUNT(*) 
  FROM information_schema.TABLE_CONSTRAINTS 
  WHERE CONSTRAINT_SCHEMA = 'studentconnections' 
  AND TABLE_NAME = 'student_skills' 
  AND CONSTRAINT_NAME = 'fk_student_skills_venue');

SET @sql = IF(@constraint_exists > 0, 
  'ALTER TABLE student_skills DROP FOREIGN KEY fk_student_skills_venue', 
  'SELECT "FK does not exist"');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Drop old venue_id column if it exists
SET @col_exists = (SELECT COUNT(*) FROM information_schema.COLUMNS 
  WHERE TABLE_SCHEMA = 'studentconnections' 
  AND TABLE_NAME = 'student_skills' 
  AND COLUMN_NAME = 'venue_id');

SET @sql = IF(@col_exists > 0, 
  'ALTER TABLE student_skills DROP COLUMN venue_id', 
  'SELECT "venue_id does not exist"');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add new columns for venue tracking
ALTER TABLE `student_skills`
  ADD COLUMN IF NOT EXISTS `excel_venue_name` VARCHAR(255) NOT NULL COMMENT 'Venue name from Excel file where test was taken',
  ADD COLUMN IF NOT EXISTS `student_venue_id` INT UNSIGNED NULL COMMENT 'Students current venue allocation',
  ADD COLUMN IF NOT EXISTS `faculty_id` INT UNSIGNED NULL COMMENT 'Faculty assigned when student was in this venue';

-- Add foreign keys
ALTER TABLE `student_skills`
  ADD CONSTRAINT `fk_student_skills_student_venue` 
  FOREIGN KEY (`student_venue_id`) REFERENCES `venue` (`venue_id`) 
  ON DELETE SET NULL;

ALTER TABLE `student_skills`
  ADD CONSTRAINT `fk_student_skills_faculty` 
  FOREIGN KEY (`faculty_id`) REFERENCES `faculties` (`faculty_id`) 
  ON DELETE SET NULL;

-- Drop old unique constraint if exists
SET @index_exists = (SELECT COUNT(*) 
  FROM information_schema.STATISTICS 
  WHERE TABLE_SCHEMA = 'studentconnections' 
  AND TABLE_NAME = 'student_skills' 
  AND INDEX_NAME = 'unique_student_course_venue');

SET @sql = IF(@index_exists > 0, 
  'ALTER TABLE student_skills DROP INDEX unique_student_course_venue', 
  'SELECT "Index does not exist"');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add new unique constraint (student + course + Excel venue name)
ALTER TABLE `student_skills`
  ADD UNIQUE KEY `unique_student_course_excel_venue` (`student_id`, `course_name`, `excel_venue_name`);

-- Add indexes for performance
ALTER TABLE `student_skills`
  ADD INDEX IF NOT EXISTS `idx_student_venue_id` (`student_venue_id`),
  ADD INDEX IF NOT EXISTS `idx_faculty_id` (`faculty_id`),
  ADD INDEX IF NOT EXISTS `idx_excel_venue_name` (`excel_venue_name`);

-- Verify the structure
DESCRIBE student_skills;

SELECT 'Migration completed successfully!' as message;
