-- Roadmaps & Materials Schema
-- Run this SQL script to create the required tables for roadmaps feature

-- Table: roadmaps
-- Stores roadmap information linked to groups
CREATE TABLE IF NOT EXISTS roadmaps (
    roadmap_id INT PRIMARY KEY AUTO_INCREMENT,
    group_id INT NOT NULL,
    roadmap_code VARCHAR(50) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    instructor_name VARCHAR(255),
    status ENUM('active', 'archived', 'draft') DEFAULT 'active',
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (group_id) REFERENCES `groups`(group_id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(user_id),
    INDEX idx_group (group_id),
    INDEX idx_code (roadmap_code),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: roadmap_modules
-- Stores individual modules/days in a roadmap
CREATE TABLE IF NOT EXISTS roadmap_modules (
    module_id INT PRIMARY KEY AUTO_INCREMENT,
    roadmap_id INT NOT NULL,
    day_number INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status ENUM('published', 'draft', 'archived') DEFAULT 'draft',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (roadmap_id) REFERENCES roadmaps(roadmap_id) ON DELETE CASCADE,
    INDEX idx_roadmap (roadmap_id),
    INDEX idx_day (day_number),
    UNIQUE KEY unique_roadmap_day (roadmap_id, day_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: module_resources
-- Stores resources (PDFs, videos, links) attached to modules
CREATE TABLE IF NOT EXISTS module_resources (
    resource_id INT PRIMARY KEY AUTO_INCREMENT,
    module_id INT NOT NULL,
    resource_name VARCHAR(255) NOT NULL,
    resource_type ENUM('pdf', 'video', 'link', 'file') NOT NULL,
    resource_url TEXT,
    file_path VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (module_id) REFERENCES roadmap_modules(module_id) ON DELETE CASCADE,
    INDEX idx_module (module_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: student_module_progress
-- Tracks which modules each student has completed
CREATE TABLE IF NOT EXISTS student_module_progress (
    progress_id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    module_id INT NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    FOREIGN KEY (module_id) REFERENCES roadmap_modules(module_id) ON DELETE CASCADE,
    UNIQUE KEY unique_student_module (student_id, module_id),
    INDEX idx_student (student_id),
    INDEX idx_module (module_id),
    INDEX idx_completed (is_completed)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Optional: Add some sample data for testing
-- INSERT INTO roadmaps (group_id, roadmap_code, title, description, instructor_name, created_by) 
-- VALUES (1, 'REACT-101', 'React Mastery Workshop', 'Complete React.js learning path', 'Prof. Sarah Johnson', 1);
