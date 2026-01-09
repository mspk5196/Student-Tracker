-- Migration to add skill report tracking columns to student_skills table
-- Run this SQL script to update your database structure

USE studentconnections;

-- Add missing columns to student_skills table
ALTER TABLE `student_skills` 
  ADD COLUMN `venue_id` INT UNSIGNED NULL AFTER `skill_id`,
  ADD COLUMN `course_name` VARCHAR(255) NULL AFTER `venue_id`,
  ADD COLUMN `total_attempts` INT DEFAULT 0 AFTER `proficiency_level`,
  ADD COLUMN `best_score` DECIMAL(5,2) DEFAULT 0.00 AFTER `total_attempts`,
  ADD COLUMN `latest_score` DECIMAL(5,2) DEFAULT 0.00 AFTER `best_score`,
  ADD COLUMN `status` ENUM('Cleared', 'Not Cleared', 'Ongoing') DEFAULT 'Ongoing' AFTER `latest_score`,
  ADD COLUMN `last_attendance` VARCHAR(50) NULL AFTER `status`,
  ADD COLUMN `last_slot_date` DATE NULL AFTER `last_attendance`,
  ADD COLUMN `last_start_time` TIME NULL AFTER `last_slot_date`,
  ADD COLUMN `last_end_time` TIME NULL AFTER `last_start_time`,
  ADD COLUMN `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER `created_at`;

-- Add foreign key for venue_id
ALTER TABLE `student_skills`
  ADD CONSTRAINT `fk_student_skills_venue` 
  FOREIGN KEY (`venue_id`) REFERENCES `venue` (`venue_id`) 
  ON DELETE SET NULL;

-- Modify unique constraint to include venue_id if needed
ALTER TABLE `student_skills` 
  DROP INDEX `unique_student_skill`;

ALTER TABLE `student_skills`
  ADD UNIQUE KEY `unique_student_skill_venue` (`student_id`, `skill_id`, `venue_id`);

-- Insert sample data for testing (adjust IDs based on your existing data)
-- Sample: Add skill report data for student_id 1, skill_id 1 (Python), venue_id 1

INSERT INTO `student_skills` 
  (`student_id`, `skill_id`, `venue_id`, `course_name`, `proficiency_level`, 
   `total_attempts`, `best_score`, `latest_score`, `status`, 
   `last_attendance`, `last_slot_date`, `last_start_time`, `last_end_time`)
VALUES
  -- Student 1 - Python Programming
  (1, 1, 1, 'Python Fundamentals', 'Intermediate', 5, 85.50, 82.00, 'Cleared', 
   'Present', '2026-01-05', '09:00:00', '11:00:00'),
  
  -- Student 1 - JavaScript
  (1, 2, 1, 'JavaScript Basics', 'Beginner', 3, 72.00, 72.00, 'Ongoing', 
   'Present', '2026-01-06', '14:00:00', '16:00:00'),
  
  -- Student 2 - Python Programming
  (2, 1, 1, 'Python Fundamentals', 'Advanced', 8, 92.50, 90.00, 'Cleared', 
   'Present', '2026-01-05', '09:00:00', '11:00:00'),
  
  -- Student 2 - React
  (2, 3, 1, 'React Development', 'Intermediate', 4, 78.00, 76.00, 'Ongoing', 
   'Absent', '2026-01-04', '10:00:00', '12:00:00'),
  
  -- Student 3 - Node.js
  (3, 4, 2, 'Node.js Backend', 'Beginner', 2, 65.00, 65.00, 'Not Cleared', 
   'Present', '2026-01-03', '15:00:00', '17:00:00'),
  
  -- Student 3 - SQL Database
  (3, 5, 2, 'Database Design', 'Intermediate', 6, 88.00, 85.00, 'Cleared', 
   'Present', '2026-01-06', '11:00:00', '13:00:00'),
  
  -- Student 4 - Java
  (4, 7, 1, 'Java Programming', 'Advanced', 10, 95.00, 93.00, 'Cleared', 
   'Present', '2026-01-05', '13:00:00', '15:00:00'),
  
  -- Student 5 - Machine Learning
  (5, 9, 2, 'ML Fundamentals', 'Beginner', 3, 70.00, 68.00, 'Ongoing', 
   'Present', '2026-01-04', '09:00:00', '12:00:00'),
  
  -- Student 6 - Data Structures
  (6, 10, 3, 'DS & Algorithms', 'Intermediate', 7, 82.00, 80.00, 'Cleared', 
   'Present', '2026-01-06', '14:00:00', '16:00:00'),
  
  -- Student 7 - Web Development
  (7, 11, 1, 'Full Stack Web Dev', 'Advanced', 9, 90.00, 88.00, 'Cleared', 
   'Present', '2026-01-05', '10:00:00', '13:00:00'),
  
  -- Student 8 - Cyber Security
  (8, 18, 3, 'Network Security', 'Intermediate', 5, 75.00, 73.00, 'Ongoing', 
   'Absent', '2026-01-03', '15:00:00', '17:00:00'),
  
  -- Student 9 - Cloud Computing
  (9, 13, 2, 'AWS Basics', 'Beginner', 2, 60.00, 60.00, 'Not Cleared', 
   'Present', '2026-01-02', '11:00:00', '13:00:00'),
  
  -- Student 10 - UI/UX Design
  (10, 15, 1, 'User Interface Design', 'Intermediate', 6, 85.00, 83.00, 'Cleared', 
   'Present', '2026-01-06', '09:00:00', '11:00:00');

-- Verify the data
SELECT 
  ss.id,
  u.ID as roll_number,
  u.name as student_name,
  sk.skill_name,
  ss.course_name,
  v.venue_name,
  ss.best_score,
  ss.latest_score,
  ss.status,
  ss.updated_at
FROM student_skills ss
JOIN students s ON ss.student_id = s.student_id
JOIN users u ON s.user_id = u.user_id
JOIN skills sk ON ss.skill_id = sk.skill_id
JOIN venue v ON ss.venue_id = v.venue_id
ORDER BY ss.updated_at DESC
LIMIT 10;
