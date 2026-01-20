-- Migration to allow NULL faculty_id in groups table
-- This allows groups to exist without an assigned faculty

-- First, drop the existing foreign key constraint
ALTER TABLE `groups` 
DROP FOREIGN KEY `groups_ibfk_2`;

-- Modify the faculty_id column to allow NULL
ALTER TABLE `groups` 
MODIFY COLUMN `faculty_id` int unsigned NULL;

-- Re-add the foreign key constraint with ON DELETE SET NULL
-- This will automatically set faculty_id to NULL when a faculty is deleted
ALTER TABLE `groups` 
ADD CONSTRAINT `groups_ibfk_2` 
FOREIGN KEY (`faculty_id`) 
REFERENCES `faculties` (`faculty_id`) 
ON DELETE SET NULL 
ON UPDATE CASCADE;

-- Display the updated table structure
DESCRIBE `groups`;
