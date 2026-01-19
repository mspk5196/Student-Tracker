import db from '../config/db.js';

/**
 * =====================================================
 * SKILL COMPLETION STATUS CONTROLLER
 * =====================================================
 * Handles all skill completion tracking for venues/groups
 * - Summary statistics
 * - Student attempt tracking
 * - Course-wise completion status
 * - Not attempted students identification
 * =====================================================
 */

/**
 * Get skill completion summary for a venue
 * Returns: total students, cleared, not cleared, ongoing, not attempted counts
 */
export const getVenueSkillSummary = async (req, res) => {
  try {
    const { venueId } = req.params;
    const { groupId, courseFilter } = req.query;

    if (!venueId) {
      return res.status(400).json({ success: false, message: 'Venue ID is required' });
    }

    // Get total students in this venue through groups
    let totalStudentsQuery = `
      SELECT COUNT(DISTINCT gs.student_id) as total
      FROM group_students gs
      INNER JOIN \`groups\` g ON gs.group_id = g.group_id
      WHERE g.venue_id = ? AND gs.status = 'Active' AND g.status = 'Active'
    `;
    const totalParams = [venueId];

    if (groupId) {
      totalStudentsQuery += ' AND g.group_id = ?';
      totalParams.push(groupId);
    }

    const [totalResult] = await db.execute(totalStudentsQuery, totalParams);
    const totalStudents = totalResult[0].total;

    // Get skill completion statistics
    let statsQuery = `
      SELECT 
        COUNT(DISTINCT CASE WHEN ss.status = 'Cleared' THEN ss.student_id END) as cleared,
        COUNT(DISTINCT CASE WHEN ss.status = 'Not Cleared' THEN ss.student_id END) as not_cleared,
        COUNT(DISTINCT CASE WHEN ss.status = 'Ongoing' THEN ss.student_id END) as ongoing,
        COUNT(DISTINCT ss.student_id) as attempted
      FROM student_skills ss
      INNER JOIN group_students gs ON ss.student_id = gs.student_id
      INNER JOIN \`groups\` g ON gs.group_id = g.group_id
      WHERE g.venue_id = ? AND gs.status = 'Active' AND g.status = 'Active'
    `;
    const statsParams = [venueId];

    if (groupId) {
      statsQuery += ' AND g.group_id = ?';
      statsParams.push(groupId);
    }

    if (courseFilter) {
      statsQuery += ' AND ss.course_name = ?';
      statsParams.push(courseFilter);
    }

    const [statsResult] = await db.execute(statsQuery, statsParams);
    const stats = statsResult[0];

    // Calculate not attempted
    const notAttempted = totalStudents - stats.attempted;

    // Get unique courses for this venue
    let coursesQuery = `
      SELECT DISTINCT ss.course_name, COUNT(DISTINCT ss.student_id) as student_count
      FROM student_skills ss
      INNER JOIN group_students gs ON ss.student_id = gs.student_id
      INNER JOIN \`groups\` g ON gs.group_id = g.group_id
      WHERE g.venue_id = ? AND gs.status = 'Active' AND g.status = 'Active'
    `;
    const coursesParams = [venueId];

    if (groupId) {
      coursesQuery += ' AND g.group_id = ?';
      coursesParams.push(groupId);
    }

    coursesQuery += ' GROUP BY ss.course_name ORDER BY ss.course_name';

    const [courses] = await db.execute(coursesQuery, coursesParams);

    res.status(200).json({
      success: true,
      data: {
        venue_id: parseInt(venueId),
        total_students: totalStudents,
        cleared: stats.cleared || 0,
        not_cleared: stats.not_cleared || 0,
        ongoing: stats.ongoing || 0,
        not_attempted: notAttempted,
        attempted: stats.attempted || 0,
        completion_rate: totalStudents > 0 ? ((stats.cleared / totalStudents) * 100).toFixed(2) : 0,
        courses: courses
      }
    });

  } catch (error) {
    console.error('Error fetching venue skill summary:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch skill summary', error: error.message });
  }
};

/**
 * Get students who have NOT attempted any skill in a venue
 */
export const getNotAttemptedStudents = async (req, res) => {
  try {
    const { venueId } = req.params;
    const { groupId, page = 1, limit = 50, search } = req.query;

    if (!venueId) {
      return res.status(400).json({ success: false, message: 'Venue ID is required' });
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);

    // Get students in venue groups who have no skill records
    let query = `
      SELECT DISTINCT
        s.student_id,
        u.ID as roll_number,
        u.name as student_name,
        u.email,
        u.department,
        s.year,
        s.semester,
        g.group_name,
        g.group_code,
        gs.allocation_date
      FROM group_students gs
      INNER JOIN \`groups\` g ON gs.group_id = g.group_id
      INNER JOIN students s ON gs.student_id = s.student_id
      INNER JOIN users u ON s.user_id = u.user_id
      WHERE g.venue_id = ? 
        AND gs.status = 'Active' 
        AND g.status = 'Active'
        AND s.student_id NOT IN (
          SELECT DISTINCT ss.student_id 
          FROM student_skills ss
          INNER JOIN group_students gs2 ON ss.student_id = gs2.student_id
          INNER JOIN \`groups\` g2 ON gs2.group_id = g2.group_id
          WHERE g2.venue_id = ? AND gs2.status = 'Active'
        )
    `;
    const params = [venueId, venueId];

    if (groupId) {
      query += ' AND g.group_id = ?';
      params.push(groupId);
    }

    if (search) {
      query += ' AND (u.name LIKE ? OR u.ID LIKE ? OR u.email LIKE ?)';
      const searchPattern = `%${search}%`;
      params.push(searchPattern, searchPattern, searchPattern);
    }

    query += ' ORDER BY u.name ASC';
    query += ` LIMIT ${parseInt(limit)} OFFSET ${offset}`;

    const [students] = await db.execute(query, params);

    // Get total count
    let countQuery = `
      SELECT COUNT(DISTINCT s.student_id) as total
      FROM group_students gs
      INNER JOIN \`groups\` g ON gs.group_id = g.group_id
      INNER JOIN students s ON gs.student_id = s.student_id
      INNER JOIN users u ON s.user_id = u.user_id
      WHERE g.venue_id = ? 
        AND gs.status = 'Active' 
        AND g.status = 'Active'
        AND s.student_id NOT IN (
          SELECT DISTINCT ss.student_id 
          FROM student_skills ss
          INNER JOIN group_students gs2 ON ss.student_id = gs2.student_id
          INNER JOIN \`groups\` g2 ON gs2.group_id = g2.group_id
          WHERE g2.venue_id = ? AND gs2.status = 'Active'
        )
    `;
    const countParams = [venueId, venueId];

    if (groupId) {
      countQuery += ' AND g.group_id = ?';
      countParams.push(groupId);
    }

    if (search) {
      countQuery += ' AND (u.name LIKE ? OR u.ID LIKE ? OR u.email LIKE ?)';
      const searchPattern = `%${search}%`;
      countParams.push(searchPattern, searchPattern, searchPattern);
    }

    const [countResult] = await db.execute(countQuery, countParams);
    const total = countResult[0].total;

    res.status(200).json({
      success: true,
      data: {
        students: students,
        pagination: {
          total: total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / parseInt(limit))
        }
      }
    });

  } catch (error) {
    console.error('Error fetching not attempted students:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch students', error: error.message });
  }
};

/**
 * Get all students with their skill completion status for a venue
 * Shows: attempted students with status, and identifies not attempted ones
 */
export const getVenueStudentSkillStatus = async (req, res) => {
  try {
    const { venueId } = req.params;
    const { 
      groupId, 
      status, // 'Cleared', 'Not Cleared', 'Ongoing', 'Not Attempted'
      courseFilter,
      page = 1, 
      limit = 50, 
      search,
      sortBy = 'student_name',
      sortOrder = 'ASC'
    } = req.query;

    if (!venueId) {
      return res.status(400).json({ success: false, message: 'Venue ID is required' });
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);

    // Handle 'Not Attempted' status separately
    if (status === 'Not Attempted') {
      return getNotAttemptedStudents(req, res);
    }

    // Get students with skill records
    let query = `
      SELECT 
        s.student_id,
        u.ID as roll_number,
        u.name as student_name,
        u.email,
        u.department,
        s.year,
        s.semester,
        g.group_name,
        g.group_code,
        ss.course_name,
        ss.status as skill_status,
        ss.proficiency_level,
        ss.total_attempts,
        ss.best_score,
        ss.latest_score,
        ss.last_attendance,
        ss.last_slot_date,
        ss.last_start_time,
        ss.last_end_time,
        ss.excel_venue_name,
        ss.updated_at
      FROM group_students gs
      INNER JOIN \`groups\` g ON gs.group_id = g.group_id
      INNER JOIN students s ON gs.student_id = s.student_id
      INNER JOIN users u ON s.user_id = u.user_id
      LEFT JOIN student_skills ss ON s.student_id = ss.student_id
      WHERE g.venue_id = ? 
        AND gs.status = 'Active' 
        AND g.status = 'Active'
    `;
    const params = [venueId];

    if (groupId) {
      query += ' AND g.group_id = ?';
      params.push(groupId);
    }

    if (status && ['Cleared', 'Not Cleared', 'Ongoing'].includes(status)) {
      query += ' AND ss.status = ?';
      params.push(status);
    }

    if (courseFilter) {
      query += ' AND ss.course_name = ?';
      params.push(courseFilter);
    }

    if (search) {
      query += ' AND (u.name LIKE ? OR u.ID LIKE ? OR u.email LIKE ? OR ss.course_name LIKE ?)';
      const searchPattern = `%${search}%`;
      params.push(searchPattern, searchPattern, searchPattern, searchPattern);
    }

    // Sorting
    const allowedSortColumns = ['student_name', 'roll_number', 'best_score', 'latest_score', 'total_attempts', 'last_slot_date', 'skill_status'];
    const sortColumn = allowedSortColumns.includes(sortBy) ? sortBy : 'student_name';
    const order = sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    // Map sorting column names
    const sortColumnMap = {
      'student_name': 'u.name',
      'roll_number': 'u.ID',
      'best_score': 'ss.best_score',
      'latest_score': 'ss.latest_score',
      'total_attempts': 'ss.total_attempts',
      'last_slot_date': 'ss.last_slot_date',
      'skill_status': 'ss.status'
    };

    query += ` ORDER BY ${sortColumnMap[sortColumn]} ${order}`;
    query += ` LIMIT ${parseInt(limit)} OFFSET ${offset}`;

    const [students] = await db.execute(query, params);

    // Get total count
    let countQuery = `
      SELECT COUNT(*) as total
      FROM group_students gs
      INNER JOIN \`groups\` g ON gs.group_id = g.group_id
      INNER JOIN students s ON gs.student_id = s.student_id
      INNER JOIN users u ON s.user_id = u.user_id
      LEFT JOIN student_skills ss ON s.student_id = ss.student_id
      WHERE g.venue_id = ? 
        AND gs.status = 'Active' 
        AND g.status = 'Active'
    `;
    const countParams = [venueId];

    if (groupId) {
      countQuery += ' AND g.group_id = ?';
      countParams.push(groupId);
    }

    if (status && ['Cleared', 'Not Cleared', 'Ongoing'].includes(status)) {
      countQuery += ' AND ss.status = ?';
      countParams.push(status);
    }

    if (courseFilter) {
      countQuery += ' AND ss.course_name = ?';
      countParams.push(courseFilter);
    }

    if (search) {
      countQuery += ' AND (u.name LIKE ? OR u.ID LIKE ? OR u.email LIKE ? OR ss.course_name LIKE ?)';
      const searchPattern = `%${search}%`;
      countParams.push(searchPattern, searchPattern, searchPattern, searchPattern);
    }

    const [countResult] = await db.execute(countQuery, countParams);
    const total = countResult[0].total;

    res.status(200).json({
      success: true,
      data: {
        students: students,
        pagination: {
          total: total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / parseInt(limit))
        }
      }
    });

  } catch (error) {
    console.error('Error fetching student skill status:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch student skill status', error: error.message });
  }
};

/**
 * Get course-wise skill completion breakdown for a venue
 * FIXED: Count each student only once per course based on their latest record
 */
export const getCourseWiseCompletion = async (req, res) => {
  try {
    const { venueId } = req.params;
    const { groupId } = req.query;

    if (!venueId) {
      return res.status(400).json({ success: false, message: 'Venue ID is required' });
    }

    // Get total students in venue
    let totalQuery = `
      SELECT COUNT(DISTINCT gs.student_id) as total
      FROM group_students gs
      INNER JOIN \`groups\` g ON gs.group_id = g.group_id
      WHERE g.venue_id = ? AND gs.status = 'Active' AND g.status = 'Active'
    `;
    const totalParams = [venueId];

    if (groupId) {
      totalQuery += ' AND g.group_id = ?';
      totalParams.push(groupId);
    }

    const [totalResult] = await db.execute(totalQuery, totalParams);
    const totalStudents = totalResult[0].total;

    // Get course-wise breakdown using ONLY the latest record per student per course
    // This ensures a student is counted only ONCE per course
    let query = `
      SELECT 
        latest_ss.course_name,
        COUNT(DISTINCT latest_ss.student_id) as total_attempted,
        COUNT(DISTINCT CASE WHEN latest_ss.status = 'Cleared' THEN latest_ss.student_id END) as cleared_count,
        COUNT(DISTINCT CASE WHEN latest_ss.status = 'Not Cleared' THEN latest_ss.student_id END) as not_cleared_count,
        COUNT(DISTINCT CASE WHEN latest_ss.status = 'Ongoing' THEN latest_ss.student_id END) as ongoing_count,
        AVG(latest_ss.best_score) as avg_best_score,
        AVG(latest_ss.latest_score) as avg_latest_score,
        MAX(latest_ss.best_score) as highest_score,
        MIN(CASE WHEN latest_ss.best_score > 0 THEN latest_ss.best_score END) as lowest_score,
        SUM(latest_ss.total_attempts) as total_attempts
      FROM (
        SELECT ss.*
        FROM student_skills ss
        INNER JOIN (
          SELECT student_id, course_name, MAX(last_slot_date) as max_date
          FROM student_skills
          GROUP BY student_id, course_name
        ) latest ON ss.student_id = latest.student_id 
                AND ss.course_name = latest.course_name 
                AND (ss.last_slot_date = latest.max_date OR (ss.last_slot_date IS NULL AND latest.max_date IS NULL))
      ) latest_ss
      INNER JOIN group_students gs ON latest_ss.student_id = gs.student_id
      INNER JOIN \`groups\` g ON gs.group_id = g.group_id
      WHERE g.venue_id = ? AND gs.status = 'Active' AND g.status = 'Active'
    `;
    const params = [venueId];

    if (groupId) {
      query += ' AND g.group_id = ?';
      params.push(groupId);
    }

    query += ' GROUP BY latest_ss.course_name ORDER BY latest_ss.course_name';

    const [courses] = await db.execute(query, params);

    // Calculate not attempted for each course
    const coursesWithNotAttempted = courses.map(course => ({
      ...course,
      not_attempted_count: totalStudents - course.total_attempted,
      completion_rate: totalStudents > 0 ? ((course.cleared_count / totalStudents) * 100).toFixed(2) : 0,
      attempt_rate: totalStudents > 0 ? ((course.total_attempted / totalStudents) * 100).toFixed(2) : 0,
      avg_best_score: course.avg_best_score ? parseFloat(course.avg_best_score).toFixed(2) : null,
      avg_latest_score: course.avg_latest_score ? parseFloat(course.avg_latest_score).toFixed(2) : null
    }));

    res.status(200).json({
      success: true,
      data: {
        venue_id: parseInt(venueId),
        total_students: totalStudents,
        courses: coursesWithNotAttempted
      }
    });

  } catch (error) {
    console.error('Error fetching course-wise completion:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch course completion data', error: error.message });
  }
};

/**
 * Get individual student's skill progress details
 */
export const getStudentSkillProgress = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { venueId } = req.query;

    if (!studentId) {
      return res.status(400).json({ success: false, message: 'Student ID is required' });
    }

    // Get student basic info
    const [studentInfo] = await db.execute(`
      SELECT 
        s.student_id,
        u.ID as roll_number,
        u.name as student_name,
        u.email,
        u.department,
        s.year,
        s.semester
      FROM students s
      INNER JOIN users u ON s.user_id = u.user_id
      WHERE s.student_id = ?
    `, [studentId]);

    if (studentInfo.length === 0) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    // Get student's groups and venues
    const [groups] = await db.execute(`
      SELECT 
        g.group_id,
        g.group_code,
        g.group_name,
        g.venue_id,
        v.venue_name,
        gs.allocation_date,
        gs.status as group_status
      FROM group_students gs
      INNER JOIN \`groups\` g ON gs.group_id = g.group_id
      INNER JOIN venue v ON g.venue_id = v.venue_id
      WHERE gs.student_id = ? AND gs.status = 'Active'
      ORDER BY gs.allocation_date DESC
    `, [studentId]);

    // Get all skill records for the student
    let skillQuery = `
      SELECT 
        ss.id,
        ss.course_name,
        ss.proficiency_level,
        ss.total_attempts,
        ss.best_score,
        ss.latest_score,
        ss.status,
        ss.last_attendance,
        ss.last_slot_date,
        ss.last_start_time,
        ss.last_end_time,
        ss.excel_venue_name,
        v.venue_name as student_venue_name,
        ss.created_at,
        ss.updated_at
      FROM student_skills ss
      LEFT JOIN venue v ON ss.student_venue_id = v.venue_id
      WHERE ss.student_id = ?
    `;
    const skillParams = [studentId];

    if (venueId) {
      skillQuery += ' AND ss.student_venue_id = ?';
      skillParams.push(venueId);
    }

    skillQuery += ' ORDER BY ss.last_slot_date DESC, ss.course_name';

    const [skills] = await db.execute(skillQuery, skillParams);

    // Calculate overall statistics
    const stats = {
      total_courses: skills.length,
      cleared: skills.filter(s => s.status === 'Cleared').length,
      not_cleared: skills.filter(s => s.status === 'Not Cleared').length,
      ongoing: skills.filter(s => s.status === 'Ongoing').length,
      avg_best_score: skills.length > 0 
        ? (skills.reduce((sum, s) => sum + (parseFloat(s.best_score) || 0), 0) / skills.length).toFixed(2)
        : null,
      total_attempts: skills.reduce((sum, s) => sum + (s.total_attempts || 0), 0)
    };

    res.status(200).json({
      success: true,
      data: {
        student: studentInfo[0],
        groups: groups,
        skills: skills,
        statistics: stats
      }
    });

  } catch (error) {
    console.error('Error fetching student skill progress:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch student progress', error: error.message });
  }
};

/**
 * Get groups in a venue with skill completion stats
 */
export const getVenueGroupsWithStats = async (req, res) => {
  try {
    const { venueId } = req.params;

    if (!venueId) {
      return res.status(400).json({ success: false, message: 'Venue ID is required' });
    }

    // Get groups with student counts and skill stats
    const [groups] = await db.execute(`
      SELECT 
        g.group_id,
        g.group_code,
        g.group_name,
        g.schedule_days,
        g.schedule_time,
        g.max_students,
        g.department,
        g.status,
        g.created_at,
        v.venue_name,
        f.faculty_id,
        u.name as faculty_name,
        COUNT(DISTINCT gs.student_id) as total_students,
        COUNT(DISTINCT CASE WHEN ss.status = 'Cleared' THEN ss.student_id END) as cleared_students,
        COUNT(DISTINCT CASE WHEN ss.status = 'Not Cleared' THEN ss.student_id END) as not_cleared_students,
        COUNT(DISTINCT CASE WHEN ss.status = 'Ongoing' THEN ss.student_id END) as ongoing_students,
        COUNT(DISTINCT ss.student_id) as attempted_students
      FROM \`groups\` g
      INNER JOIN venue v ON g.venue_id = v.venue_id
      LEFT JOIN faculties f ON g.faculty_id = f.faculty_id
      LEFT JOIN users u ON f.user_id = u.user_id
      LEFT JOIN group_students gs ON g.group_id = gs.group_id AND gs.status = 'Active'
      LEFT JOIN student_skills ss ON gs.student_id = ss.student_id
      WHERE g.venue_id = ? AND g.status = 'Active'
      GROUP BY g.group_id
      ORDER BY g.group_name
    `, [venueId]);

    // Calculate not attempted for each group
    const groupsWithStats = groups.map(group => ({
      ...group,
      not_attempted_students: group.total_students - group.attempted_students,
      completion_rate: group.total_students > 0 
        ? ((group.cleared_students / group.total_students) * 100).toFixed(2) 
        : 0
    }));

    res.status(200).json({
      success: true,
      data: groupsWithStats
    });

  } catch (error) {
    console.error('Error fetching venue groups with stats:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch groups', error: error.message });
  }
};

/**
 * Get detailed skill completion for a specific group
 */
export const getGroupSkillCompletion = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { 
      status, 
      courseFilter,
      page = 1, 
      limit = 50, 
      search 
    } = req.query;

    if (!groupId) {
      return res.status(400).json({ success: false, message: 'Group ID is required' });
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);

    // Get group info
    const [groupInfo] = await db.execute(`
      SELECT 
        g.group_id,
        g.group_code,
        g.group_name,
        g.venue_id,
        v.venue_name,
        g.schedule_days,
        g.schedule_time,
        f.faculty_id,
        u.name as faculty_name
      FROM \`groups\` g
      INNER JOIN venue v ON g.venue_id = v.venue_id
      LEFT JOIN faculties f ON g.faculty_id = f.faculty_id
      LEFT JOIN users u ON f.user_id = u.user_id
      WHERE g.group_id = ?
    `, [groupId]);

    if (groupInfo.length === 0) {
      return res.status(404).json({ success: false, message: 'Group not found' });
    }

    // Handle 'Not Attempted' status
    if (status === 'Not Attempted') {
      let notAttemptedQuery = `
        SELECT DISTINCT
          s.student_id,
          u.ID as roll_number,
          u.name as student_name,
          u.email,
          u.department,
          s.year,
          s.semester,
          gs.allocation_date,
          'Not Attempted' as skill_status
        FROM group_students gs
        INNER JOIN students s ON gs.student_id = s.student_id
        INNER JOIN users u ON s.user_id = u.user_id
        WHERE gs.group_id = ? 
          AND gs.status = 'Active'
          AND s.student_id NOT IN (
            SELECT DISTINCT ss.student_id 
            FROM student_skills ss
            WHERE ss.student_id IN (
              SELECT student_id FROM group_students WHERE group_id = ? AND status = 'Active'
            )
          )
      `;
      const params = [groupId, groupId];

      if (search) {
        notAttemptedQuery += ' AND (u.name LIKE ? OR u.ID LIKE ? OR u.email LIKE ?)';
        const searchPattern = `%${search}%`;
        params.push(searchPattern, searchPattern, searchPattern);
      }

      notAttemptedQuery += ' ORDER BY u.name ASC';
      notAttemptedQuery += ` LIMIT ${parseInt(limit)} OFFSET ${offset}`;

      const [students] = await db.execute(notAttemptedQuery, params);

      // Count query
      let countQuery = `
        SELECT COUNT(DISTINCT s.student_id) as total
        FROM group_students gs
        INNER JOIN students s ON gs.student_id = s.student_id
        INNER JOIN users u ON s.user_id = u.user_id
        WHERE gs.group_id = ? 
          AND gs.status = 'Active'
          AND s.student_id NOT IN (
            SELECT DISTINCT ss.student_id 
            FROM student_skills ss
            WHERE ss.student_id IN (
              SELECT student_id FROM group_students WHERE group_id = ? AND status = 'Active'
            )
          )
      `;
      const countParams = [groupId, groupId];

      if (search) {
        countQuery += ' AND (u.name LIKE ? OR u.ID LIKE ? OR u.email LIKE ?)';
        const searchPattern = `%${search}%`;
        countParams.push(searchPattern, searchPattern, searchPattern);
      }

      const [countResult] = await db.execute(countQuery, countParams);

      return res.status(200).json({
        success: true,
        data: {
          group: groupInfo[0],
          students: students,
          pagination: {
            total: countResult[0].total,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(countResult[0].total / parseInt(limit))
          }
        }
      });
    }

    // Get students with skill data
    let query = `
      SELECT 
        s.student_id,
        u.ID as roll_number,
        u.name as student_name,
        u.email,
        u.department,
        s.year,
        s.semester,
        gs.allocation_date,
        ss.course_name,
        ss.status as skill_status,
        ss.proficiency_level,
        ss.total_attempts,
        ss.best_score,
        ss.latest_score,
        ss.last_attendance,
        ss.last_slot_date,
        ss.excel_venue_name,
        ss.updated_at
      FROM group_students gs
      INNER JOIN students s ON gs.student_id = s.student_id
      INNER JOIN users u ON s.user_id = u.user_id
      LEFT JOIN student_skills ss ON s.student_id = ss.student_id
      WHERE gs.group_id = ? AND gs.status = 'Active'
    `;
    const params = [groupId];

    if (status && ['Cleared', 'Not Cleared', 'Ongoing'].includes(status)) {
      query += ' AND ss.status = ?';
      params.push(status);
    }

    if (courseFilter) {
      query += ' AND ss.course_name = ?';
      params.push(courseFilter);
    }

    if (search) {
      query += ' AND (u.name LIKE ? OR u.ID LIKE ? OR ss.course_name LIKE ?)';
      const searchPattern = `%${search}%`;
      params.push(searchPattern, searchPattern, searchPattern);
    }

    query += ' ORDER BY u.name ASC, ss.course_name ASC';
    query += ` LIMIT ${parseInt(limit)} OFFSET ${offset}`;

    const [students] = await db.execute(query, params);

    // Count query
    let countQuery = `
      SELECT COUNT(*) as total
      FROM group_students gs
      INNER JOIN students s ON gs.student_id = s.student_id
      INNER JOIN users u ON s.user_id = u.user_id
      LEFT JOIN student_skills ss ON s.student_id = ss.student_id
      WHERE gs.group_id = ? AND gs.status = 'Active'
    `;
    const countParams = [groupId];

    if (status && ['Cleared', 'Not Cleared', 'Ongoing'].includes(status)) {
      countQuery += ' AND ss.status = ?';
      countParams.push(status);
    }

    if (courseFilter) {
      countQuery += ' AND ss.course_name = ?';
      countParams.push(courseFilter);
    }

    if (search) {
      countQuery += ' AND (u.name LIKE ? OR u.ID LIKE ? OR ss.course_name LIKE ?)';
      const searchPattern = `%${search}%`;
      countParams.push(searchPattern, searchPattern, searchPattern);
    }

    const [countResult] = await db.execute(countQuery, countParams);

    // Get summary statistics for the group
    const [summaryResult] = await db.execute(`
      SELECT 
        COUNT(DISTINCT gs.student_id) as total_students,
        COUNT(DISTINCT CASE WHEN ss.status IS NOT NULL THEN ss.student_id END) as attempted_students,
        COUNT(DISTINCT CASE WHEN ss.status = 'Cleared' THEN ss.student_id END) as cleared_students,
        COUNT(DISTINCT CASE WHEN ss.status = 'Not Cleared' THEN ss.student_id END) as not_cleared_students,
        COUNT(DISTINCT CASE WHEN ss.status = 'Ongoing' THEN ss.student_id END) as ongoing_students
      FROM group_students gs
      INNER JOIN students s ON gs.student_id = s.student_id
      LEFT JOIN student_skills ss ON s.student_id = ss.student_id
      WHERE gs.group_id = ? AND gs.status = 'Active'
    `, [groupId]);

    const summary = summaryResult[0];
    summary.not_attempted_students = summary.total_students - summary.attempted_students;

    res.status(200).json({
      success: true,
      data: {
        group: groupInfo[0],
        summary: summary,
        students: students,
        pagination: {
          total: countResult[0].total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(countResult[0].total / parseInt(limit))
        }
      }
    });

  } catch (error) {
    console.error('Error fetching group skill completion:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch group data', error: error.message });
  }
};

/**
 * Get available courses in a venue (for filter dropdowns)
 */
export const getVenueCourses = async (req, res) => {
  try {
    const { venueId } = req.params;

    if (!venueId) {
      return res.status(400).json({ success: false, message: 'Venue ID is required' });
    }

    const [courses] = await db.execute(`
      SELECT DISTINCT ss.course_name
      FROM student_skills ss
      INNER JOIN group_students gs ON ss.student_id = gs.student_id
      INNER JOIN \`groups\` g ON gs.group_id = g.group_id
      WHERE g.venue_id = ? AND gs.status = 'Active' AND g.status = 'Active'
      ORDER BY ss.course_name
    `, [venueId]);

    res.status(200).json({
      success: true,
      data: courses.map(c => c.course_name)
    });

  } catch (error) {
    console.error('Error fetching venue courses:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch courses', error: error.message });
  }
};

/**
 * Export skill completion data for a venue/group (CSV format)
 */
export const exportSkillCompletionData = async (req, res) => {
  try {
    const { venueId } = req.params;
    const { groupId, status, courseFilter } = req.query;

    if (!venueId) {
      return res.status(400).json({ success: false, message: 'Venue ID is required' });
    }

    // Build query
    let query = `
      SELECT 
        u.ID as roll_number,
        u.name as student_name,
        u.email,
        u.department,
        s.year,
        s.semester,
        g.group_name,
        g.group_code,
        COALESCE(ss.course_name, 'N/A') as course_name,
        COALESCE(ss.status, 'Not Attempted') as skill_status,
        COALESCE(ss.proficiency_level, 'N/A') as proficiency_level,
        COALESCE(ss.total_attempts, 0) as total_attempts,
        COALESCE(ss.best_score, 0) as best_score,
        COALESCE(ss.latest_score, 0) as latest_score,
        COALESCE(ss.last_attendance, 'N/A') as last_attendance,
        ss.last_slot_date,
        ss.excel_venue_name
      FROM group_students gs
      INNER JOIN \`groups\` g ON gs.group_id = g.group_id
      INNER JOIN students s ON gs.student_id = s.student_id
      INNER JOIN users u ON s.user_id = u.user_id
      LEFT JOIN student_skills ss ON s.student_id = ss.student_id
      WHERE g.venue_id = ? 
        AND gs.status = 'Active' 
        AND g.status = 'Active'
    `;
    const params = [venueId];

    if (groupId) {
      query += ' AND g.group_id = ?';
      params.push(groupId);
    }

    if (status && ['Cleared', 'Not Cleared', 'Ongoing'].includes(status)) {
      query += ' AND ss.status = ?';
      params.push(status);
    }

    if (courseFilter) {
      query += ' AND ss.course_name = ?';
      params.push(courseFilter);
    }

    query += ' ORDER BY u.name ASC, ss.course_name ASC';

    const [data] = await db.execute(query, params);

    res.status(200).json({
      success: true,
      data: data
    });

  } catch (error) {
    console.error('Error exporting skill completion data:', error);
    res.status(500).json({ success: false, message: 'Failed to export data', error: error.message });
  }
};

/**
 * Get skill completion analytics/charts data for a venue
 */
export const getSkillCompletionAnalytics = async (req, res) => {
  try {
    const { venueId } = req.params;
    const { groupId, dateFrom, dateTo } = req.query;

    if (!venueId) {
      return res.status(400).json({ success: false, message: 'Venue ID is required' });
    }

    // Get overall status distribution
    let statusQuery = `
      SELECT 
        COALESCE(ss.status, 'Not Attempted') as status,
        COUNT(DISTINCT gs.student_id) as count
      FROM group_students gs
      INNER JOIN \`groups\` g ON gs.group_id = g.group_id
      LEFT JOIN student_skills ss ON gs.student_id = ss.student_id
      WHERE g.venue_id = ? AND gs.status = 'Active' AND g.status = 'Active'
    `;
    const statusParams = [venueId];

    if (groupId) {
      statusQuery += ' AND g.group_id = ?';
      statusParams.push(groupId);
    }

    statusQuery += ' GROUP BY COALESCE(ss.status, \'Not Attempted\')';

    const [statusDist] = await db.execute(statusQuery, statusParams);

    // Get score distribution (buckets: 0-25, 26-50, 51-75, 76-100)
    let scoreQuery = `
      SELECT 
        CASE 
          WHEN ss.best_score <= 25 THEN '0-25'
          WHEN ss.best_score <= 50 THEN '26-50'
          WHEN ss.best_score <= 75 THEN '51-75'
          ELSE '76-100'
        END as score_range,
        COUNT(*) as count
      FROM student_skills ss
      INNER JOIN group_students gs ON ss.student_id = gs.student_id
      INNER JOIN \`groups\` g ON gs.group_id = g.group_id
      WHERE g.venue_id = ? AND gs.status = 'Active' AND g.status = 'Active' AND ss.best_score IS NOT NULL
    `;
    const scoreParams = [venueId];

    if (groupId) {
      scoreQuery += ' AND g.group_id = ?';
      scoreParams.push(groupId);
    }

    scoreQuery += ` GROUP BY CASE 
      WHEN ss.best_score <= 25 THEN '0-25'
      WHEN ss.best_score <= 50 THEN '26-50'
      WHEN ss.best_score <= 75 THEN '51-75'
      ELSE '76-100'
    END`;

    const [scoreDist] = await db.execute(scoreQuery, scoreParams);

    // Get trend data (completions over time)
    let trendQuery = `
      SELECT 
        DATE(ss.last_slot_date) as date,
        COUNT(CASE WHEN ss.status = 'Cleared' THEN 1 END) as cleared,
        COUNT(CASE WHEN ss.status = 'Not Cleared' THEN 1 END) as not_cleared,
        COUNT(*) as total_attempts
      FROM student_skills ss
      INNER JOIN group_students gs ON ss.student_id = gs.student_id
      INNER JOIN \`groups\` g ON gs.group_id = g.group_id
      WHERE g.venue_id = ? AND gs.status = 'Active' AND g.status = 'Active' AND ss.last_slot_date IS NOT NULL
    `;
    const trendParams = [venueId];

    if (groupId) {
      trendQuery += ' AND g.group_id = ?';
      trendParams.push(groupId);
    }

    if (dateFrom) {
      trendQuery += ' AND ss.last_slot_date >= ?';
      trendParams.push(dateFrom);
    }

    if (dateTo) {
      trendQuery += ' AND ss.last_slot_date <= ?';
      trendParams.push(dateTo);
    }

    trendQuery += ' GROUP BY DATE(ss.last_slot_date) ORDER BY date DESC LIMIT 30';

    const [trendData] = await db.execute(trendQuery, trendParams);

    // Get top performers
    let topQuery = `
      SELECT 
        s.student_id,
        u.ID as roll_number,
        u.name as student_name,
        AVG(ss.best_score) as avg_score,
        COUNT(CASE WHEN ss.status = 'Cleared' THEN 1 END) as courses_cleared,
        COUNT(*) as total_courses
      FROM student_skills ss
      INNER JOIN students s ON ss.student_id = s.student_id
      INNER JOIN users u ON s.user_id = u.user_id
      INNER JOIN group_students gs ON ss.student_id = gs.student_id
      INNER JOIN \`groups\` g ON gs.group_id = g.group_id
      WHERE g.venue_id = ? AND gs.status = 'Active' AND g.status = 'Active'
    `;
    const topParams = [venueId];

    if (groupId) {
      topQuery += ' AND g.group_id = ?';
      topParams.push(groupId);
    }

    topQuery += ' GROUP BY s.student_id ORDER BY avg_score DESC, courses_cleared DESC LIMIT 10';

    const [topPerformers] = await db.execute(topQuery, topParams);

    res.status(200).json({
      success: true,
      data: {
        statusDistribution: statusDist,
        scoreDistribution: scoreDist,
        trendData: trendData.reverse(), // Oldest to newest
        topPerformers: topPerformers.map(tp => ({
          ...tp,
          avg_score: tp.avg_score ? parseFloat(tp.avg_score).toFixed(2) : 0
        }))
      }
    });

  } catch (error) {
    console.error('Error fetching skill completion analytics:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch analytics', error: error.message });
  }
};
