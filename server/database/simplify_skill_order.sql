-- Simplify skill_order to match actual task skill_filters
-- This removes the granular HTML, CSS, Git, GitHub separate entries
-- and keeps only the combined entries that tasks actually use

-- Backup current data (optional - you can remove this if you want)
-- CREATE TABLE skill_order_backup AS SELECT * FROM skill_order;

-- Delete existing frontend skills
DELETE FROM skill_order WHERE course_type = 'frontend';

-- Insert simplified frontend skill order
INSERT INTO skill_order (course_type, skill_name, display_order, is_prerequisite, description) VALUES
('frontend', 'HTML/CSS', 1, 0, 'HTML and CSS basics'),
('frontend', 'Git/GitHub', 2, 1, 'Version control with Git and GitHub'),
('frontend', 'JavaScript', 3, 1, 'JavaScript programming'),
('frontend', 'React', 4, 1, 'React.js framework'),
('frontend', 'Node.js', 5, 1, 'Node.js backend basics');

-- Verify the updated order
SELECT * FROM skill_order WHERE course_type = 'frontend' ORDER BY display_order;
