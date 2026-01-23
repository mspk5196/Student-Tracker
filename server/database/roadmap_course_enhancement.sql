-- Enhancement for Roadmap: Add course selection and learning objectives
-- Remove day-wise concept, add course categorization

-- Step 1: Add new columns to roadmap table
ALTER TABLE roadmap
ADD COLUMN course_type ENUM('frontend', 'backend', 'react-native', 'devops') DEFAULT 'frontend' AFTER venue_id,
ADD COLUMN learning_objectives TEXT AFTER description,
ADD COLUMN module_order INT DEFAULT 0 AFTER day;

-- Step 2: Update existing records to set module_order based on day
UPDATE roadmap SET module_order = day;

-- Step 3: Set default course_type for existing records (you can adjust this based on venue)
UPDATE roadmap SET course_type = 'frontend';

-- Step 4: Create index for better performance on course filtering
CREATE INDEX idx_roadmap_course_venue ON roadmap(venue_id, course_type);

-- Note: We're keeping the 'day' column for backward compatibility
-- but will display it as 'Module X' in the frontend instead of 'Day X'
