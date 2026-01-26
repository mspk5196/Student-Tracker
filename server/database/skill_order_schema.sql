 -- Skill Order Schema for Student Activity Tracker
-- This table defines the order in which skills should be displayed and completed
-- GLOBAL for all venues - no venue_id dependency

-- Drop table if exists (for clean migration)
DROP TABLE IF EXISTS `skill_order`;

-- Create skill_order table (simplified - no venue_id)
CREATE TABLE `skill_order` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `course_type` varchar(50) NOT NULL DEFAULT 'frontend' COMMENT 'Course type: frontend, backend, devops, react-native',
  `skill_name` varchar(255) NOT NULL COMMENT 'Skill name matching course_name in student_skills and skill_filter in tasks',
  `display_order` int NOT NULL DEFAULT 1 COMMENT 'Order in which skill should be displayed (lower = earlier)',
  `is_prerequisite` tinyint(1) NOT NULL DEFAULT '1' COMMENT 'If true, previous skill must be cleared before this one unlocks',
  `description` text COMMENT 'Optional description of this skill',
  `created_by` int unsigned DEFAULT NULL COMMENT 'Faculty/Admin who created this order',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_skill_order` (`course_type`, `skill_name`),
  KEY `idx_skill_order_course` (`course_type`),
  KEY `idx_skill_order_display` (`display_order`),
  KEY `idx_created_by` (`created_by`),
  CONSTRAINT `skill_order_created_by_fk` FOREIGN KEY (`created_by`) REFERENCES `faculties` (`faculty_id`) ON DELETE SET NULL ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Insert default frontend skill order
INSERT INTO `skill_order` (`course_type`, `skill_name`, `display_order`, `is_prerequisite`, `description`) VALUES
('frontend', 'HTML', 1, 1, 'Basic HTML structure and elements'),
('frontend', 'CSS', 2, 1, 'CSS styling and layouts'),
('frontend', 'HTML/CSS', 3, 1, 'Combined HTML and CSS skills'),
('frontend', 'Git', 4, 1, 'Version control with Git'),
('frontend', 'GitHub', 5, 1, 'GitHub collaboration and workflows'),
('frontend', 'Git/GitHub', 6, 1, 'Combined Git and GitHub skills'),
('frontend', 'JavaScript', 7, 1, 'Core JavaScript programming'),
('frontend', 'React', 8, 1, 'React.js framework'),
('frontend', 'Node.js', 9, 1, 'Node.js backend basics'),
('frontend', 'Node', 10, 1, 'Node.js alternative name');

-- Insert default backend skill order
INSERT INTO `skill_order` (`course_type`, `skill_name`, `display_order`, `is_prerequisite`, `description`) VALUES
('backend', 'Node.js', 1, 1, 'Node.js fundamentals'),
('backend', 'Express', 2, 1, 'Express.js framework'),
('backend', 'MySQL', 3, 1, 'MySQL database'),
('backend', 'MongoDB', 4, 1, 'MongoDB NoSQL database'),
('backend', 'REST API', 5, 1, 'RESTful API design'),
('backend', 'Authentication', 6, 1, 'JWT and session management');

-- Insert default devops skill order
INSERT INTO `skill_order` (`course_type`, `skill_name`, `display_order`, `is_prerequisite`, `description`) VALUES
('devops', 'Linux', 1, 1, 'Linux fundamentals'),
('devops', 'Docker', 2, 1, 'Docker containerization'),
('devops', 'Kubernetes', 3, 1, 'Kubernetes orchestration'),
('devops', 'CI/CD', 4, 1, 'Continuous integration and deployment'),
('devops', 'AWS', 5, 1, 'Amazon Web Services');

-- Create indexes for faster skill lookups
CREATE INDEX idx_skill_order_lookup ON skill_order(course_type, display_order);
CREATE INDEX idx_skill_order_skill_name ON skill_order(skill_name);
