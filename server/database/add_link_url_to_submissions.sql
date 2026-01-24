-- Add link_url column to task_submissions table to support both file and link submissions
-- Run this migration to add the new column

ALTER TABLE task_submissions 
ADD COLUMN link_url VARCHAR(500) NULL AFTER file_path;

-- Update existing link submissions: move URLs from file_path to link_url
UPDATE task_submissions 
SET link_url = file_path, 
    file_path = NULL, 
    file_name = NULL 
WHERE file_path LIKE 'http://%' OR file_path LIKE 'https://';
