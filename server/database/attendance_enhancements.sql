-- =====================================================
-- ATTENDANCE SYSTEM ENHANCEMENTS
-- =====================================================
-- Purpose: Add PS status, attendance_date, and half_day support
-- Date: 2026-01-22
-- =====================================================

-- Step 1: Add new columns to attendance table
ALTER TABLE `attendance`
ADD COLUMN `attendance_date` DATE NOT NULL AFTER `venue_id`,
ADD COLUMN `is_ps` TINYINT(1) NOT NULL DEFAULT '0' COMMENT 'PS (Placement/Training) status - counts as present' AFTER `is_present`,
ADD COLUMN `is_half_day` TINYINT(1) NOT NULL DEFAULT '0' COMMENT 'Half day present (attended only 1 session)' AFTER `is_ps`,
ADD INDEX `idx_attendance_date` (`attendance_date`),
ADD INDEX `idx_attendance_date_venue` (`attendance_date`, `venue_id`),
ADD INDEX `idx_attendance_student_date` (`student_id`, `attendance_date`);

-- Step 2: Backfill attendance_date from created_at for existing records
UPDATE `attendance`
SET `attendance_date` = DATE(`created_at`)
WHERE `attendance_date` IS NULL OR `attendance_date` = '0000-00-00';

-- Step 3: Create view for daily attendance summary (helps with half-day calculation)
CREATE OR REPLACE VIEW `v_daily_attendance_summary` AS
SELECT 
    a.student_id,
    a.attendance_date,
    a.venue_id,
    a.faculty_id,
    COUNT(DISTINCT a.session_id) as sessions_attended,
    SUM(CASE WHEN a.is_present = 1 OR a.is_ps = 1 THEN 1 ELSE 0 END) as present_sessions,
    MAX(a.is_ps) as has_ps_status,
    CASE 
        WHEN MAX(a.is_ps) = 1 THEN 'present'  -- PS counts as full present
        WHEN COUNT(DISTINCT CASE WHEN a.is_present = 1 THEN a.session_id END) >= 2 THEN 'present'  -- 2+ sessions = present
        WHEN COUNT(DISTINCT CASE WHEN a.is_present = 1 THEN a.session_id END) = 1 THEN 'half_day'  -- 1 session = half day
        ELSE 'absent'
    END as attendance_status
FROM attendance a
GROUP BY a.student_id, a.attendance_date, a.venue_id, a.faculty_id;

-- Step 4: Create stored procedure to calculate and update half_day status
DELIMITER $$

CREATE PROCEDURE `sp_calculate_daily_attendance`(
    IN p_date DATE,
    IN p_venue_id INT UNSIGNED
)
BEGIN
    -- Update half_day flag based on session count per day
    UPDATE attendance a
    INNER JOIN (
        SELECT 
            student_id,
            attendance_date,
            venue_id,
            COUNT(DISTINCT session_id) as session_count,
            SUM(CASE WHEN is_present = 1 OR is_ps = 1 THEN 1 ELSE 0 END) as present_count
        FROM attendance
        WHERE attendance_date = p_date
        AND venue_id = p_venue_id
        GROUP BY student_id, attendance_date, venue_id
    ) daily ON a.student_id = daily.student_id 
        AND a.attendance_date = daily.attendance_date 
        AND a.venue_id = daily.venue_id
    SET 
        a.is_half_day = CASE 
            WHEN a.is_ps = 1 THEN 0  -- PS is always full present
            WHEN daily.present_count = 1 THEN 1  -- Only 1 session present = half day
            ELSE 0
        END
    WHERE a.attendance_date = p_date
    AND a.venue_id = p_venue_id;
END$$

DELIMITER ;

-- Step 5: Add unique constraint to prevent duplicate attendance records
-- (student + date + session + venue should be unique)
ALTER TABLE `attendance`
ADD UNIQUE KEY `unique_attendance_record` (`student_id`, `attendance_date`, `session_id`, `venue_id`);

-- Step 6: Create helper view for attendance reporting
CREATE OR REPLACE VIEW `v_attendance_calculation` AS
SELECT 
    s.student_id,
    u.name as student_name,
    u.email as student_email,
    u.ID as roll_number,
    a.venue_id,
    v.venue_name,
    a.attendance_date,
    a.faculty_id,
    f_user.name as faculty_name,
    GROUP_CONCAT(DISTINCT sess.session_name ORDER BY sess.session_name SEPARATOR ', ') as sessions,
    COUNT(DISTINCT a.session_id) as total_sessions_marked,
    SUM(CASE WHEN a.is_present = 1 THEN 1 ELSE 0 END) as sessions_present,
    MAX(a.is_ps) as is_ps,
    MAX(a.is_half_day) as is_half_day,
    CASE 
        WHEN MAX(a.is_ps) = 1 THEN 1.0  -- PS = full present
        WHEN SUM(CASE WHEN a.is_present = 1 THEN 1 ELSE 0 END) >= 2 THEN 1.0  -- 2+ sessions = full present
        WHEN SUM(CASE WHEN a.is_present = 1 THEN 1 ELSE 0 END) = 1 THEN 0.5  -- 1 session = half day
        ELSE 0.0  -- No sessions present = absent
    END as attendance_value,
    GROUP_CONCAT(DISTINCT a.remarks SEPARATOR '; ') as all_remarks
FROM students s
INNER JOIN users u ON s.user_id = u.user_id
LEFT JOIN attendance a ON s.student_id = a.student_id
LEFT JOIN venue v ON a.venue_id = v.venue_id
LEFT JOIN faculties f ON a.faculty_id = f.faculty_id
LEFT JOIN users f_user ON f.user_id = f_user.user_id
LEFT JOIN attendance_session sess ON a.session_id = sess.session_id
GROUP BY s.student_id, a.attendance_date, a.venue_id, a.faculty_id;

-- Step 7: Add comments to document the new logic
ALTER TABLE `attendance` 
MODIFY COLUMN `is_present` TINYINT(1) NOT NULL DEFAULT '0' COMMENT 'Present in this session',
MODIFY COLUMN `is_ps` TINYINT(1) NOT NULL DEFAULT '0' COMMENT 'PS status - automatically counts as full day present',
MODIFY COLUMN `is_half_day` TINYINT(1) NOT NULL DEFAULT '0' COMMENT 'Auto-calculated: 1 session present = half day, 2+ sessions or PS = full day';

-- =====================================================
-- USAGE NOTES:
-- =====================================================
-- 1. After marking attendance, call: CALL sp_calculate_daily_attendance('2026-01-22', 1);
-- 2. PS status (is_ps = 1) always counts as full present regardless of session count
-- 3. Half day calculation: 1 session present = 0.5, 2+ sessions = 1.0
-- 4. Use v_attendance_calculation view for reporting
-- 5. Teachers can now update attendance by querying with date + session
-- =====================================================
