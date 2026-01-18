-- Final migration for student_skills table to match Excel format
-- Run this to restructure the table

USE studentactivity;

-- Drop existing student_skills table and recreate with correct structure
DROP TABLE IF EXISTS `student_skills`;

CREATE TABLE `student_skills` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `student_id` int unsigned NOT NULL,
  `course_name` varchar(255) NOT NULL,
  `venue_id` int unsigned NOT NULL,
  `total_attempts` int NOT NULL DEFAULT 1,
  `best_score` decimal(5,2) DEFAULT NULL,
  `latest_score` decimal(5,2) DEFAULT NULL,
  `status` enum('Cleared','Not Cleared','Ongoing') NOT NULL DEFAULT 'Ongoing',
  `last_attendance` enum('Present','Absent') DEFAULT NULL,
  `last_slot_date` date DEFAULT NULL,
  `last_start_time` time DEFAULT NULL,
  `last_end_time` time DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_student_course_venue` (`student_id`,`course_name`,`venue_id`),
  KEY `venue_id` (`venue_id`),
  KEY `idx_status` (`status`),
  KEY `idx_course_name` (`course_name`),
  CONSTRAINT `student_skills_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`student_id`) ON DELETE CASCADE,
  CONSTRAINT `student_skills_ibfk_3` FOREIGN KEY (`venue_id`) REFERENCES `venue` (`venue_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Insert sample data for testing
INSERT INTO `student_skills` 
  (`student_id`, `course_name`, `venue_id`, `total_attempts`, `best_score`, `latest_score`, 
   `status`, `last_attendance`, `last_slot_date`, `last_start_time`, `last_end_time`)
VALUES
  -- Assuming student_id 1 has roll number matching the user table
  (1, 'HTML / CSS - Level 1', 1, 2, 98.75, 98.75, 'Cleared', 'Present', '2025-12-27', '15:10:00', '16:40:00'),
  (1, 'Python Fundamentals', 1, 3, 85.50, 82.00, 'Cleared', 'Present', '2026-01-05', '09:00:00', '11:00:00'),
  (8, 'JavaScript Basics', 1, 2, 75.50, 75.50, 'Not Cleared', 'Present', '2025-12-24', '13:30:00', '15:00:00'),
  (9, 'React Development', 1, 4, 88.00, 86.00, 'Cleared', 'Present', '2026-01-06', '14:00:00', '16:00:00'),
  (10, 'Node.js Backend', 2, 2, 65.00, 65.00, 'Not Cleared', 'Present', '2026-01-03', '15:00:00', '17:00:00');

-- Verify the data
SELECT 
  ss.id,
  u.ID as roll_number,
  u.name as student_name,
  ss.course_name,
  v.venue_name,
  ss.total_attempts,
  ss.best_score,
  ss.latest_score,
  ss.status,
  ss.last_attendance,
  ss.last_slot_date,
  ss.updated_at
FROM student_skills ss
JOIN students s ON ss.student_id = s.student_id
JOIN users u ON s.user_id = u.user_id
JOIN venue v ON ss.venue_id = v.venue_id
ORDER BY ss.updated_at DESC;
