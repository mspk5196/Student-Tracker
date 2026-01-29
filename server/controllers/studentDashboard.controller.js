import db from '../config/db.js';

async function resolveStudentIdFromToken(req) {
  const userId = req.user?.user_id || req.user?.userId || req.user?.id;
  if (!userId) return null;

  const [rows] = await db.query('SELECT student_id FROM students WHERE user_id = ? LIMIT 1', [userId]);
  return rows.length ? rows[0].student_id : null;
}

async function resolveStudentVenueIds(studentId) {
  // Get ONLY the student's current active venue (primary assignment)
  // This matches the logic in getStudentTasks which shows tasks from current venue only
  const [rows] = await db.query(
    `
    SELECT g.venue_id
    FROM group_students gs
    INNER JOIN \`groups\` g ON gs.group_id = g.group_id
    WHERE gs.student_id = ? AND gs.status = 'Active' AND g.status = 'Active'
    LIMIT 1
    `,
    [studentId]
  );
  return rows.map(r => r.venue_id).filter(v => v != null);
}

function computeLetterGrade(percentage) {
  const p = Number(percentage);
  if (Number.isNaN(p)) return 'N/A';
  if (p >= 90) return 'A+';
  if (p >= 80) return 'A';
  if (p >= 70) return 'B+';
  if (p >= 60) return 'B';
  if (p >= 50) return 'C';
  return 'F';
}

export const getStudentDashboardStats = async (req, res) => {
  try {
    const studentId = await resolveStudentIdFromToken(req);
    if (!studentId) {
      return res.status(404).json({ success: false, message: 'Student not found for this user' });
    }

    const venueIds = await resolveStudentVenueIds(studentId);

    // Attendance (last 30 days)
    const [attNowRows] = await db.query(
      `
      SELECT
        COALESCE(ROUND((SUM(CASE WHEN is_present = 1 THEN 1 ELSE 0 END) / NULLIF(COUNT(*), 0)) * 100, 1), 0) as attendance
      FROM attendance
      WHERE student_id = ? AND created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
      `,
      [studentId]
    );

    // Attendance trend: compare last 30 days vs previous 30 days
    const [attPrevRows] = await db.query(
      `
      SELECT
        COALESCE(ROUND((SUM(CASE WHEN is_present = 1 THEN 1 ELSE 0 END) / NULLIF(COUNT(*), 0)) * 100, 1), 0) as attendance
      FROM attendance
      WHERE student_id = ?
        AND created_at >= DATE_SUB(NOW(), INTERVAL 60 DAY)
        AND created_at < DATE_SUB(NOW(), INTERVAL 30 DAY)
      `,
      [studentId]
    );

    const overallAttendance = Number(attNowRows?.[0]?.attendance || 0);
    const prevAttendance = Number(attPrevRows?.[0]?.attendance || 0);
    const attendanceTrend = Number((overallAttendance - prevAttendance).toFixed(1));

    // Tasks: pending & due tomorrow
    let pendingTasks = 0;
    let tasksDueTomorrow = 0;
    let courseProgress = 0;
    let completedTasks = 0;
    let totalTasks = 0;

    if (venueIds.length) {
      const placeholders = venueIds.map(() => '?').join(',');

      const [taskCounts] = await db.query(
        `
        SELECT
          COUNT(DISTINCT t.task_id) as total_tasks,
          COUNT(DISTINCT CASE WHEN ts.status = 'Graded' THEN t.task_id END) as graded_tasks,
          COUNT(DISTINCT CASE
            WHEN ts.submission_id IS NULL THEN t.task_id
            WHEN ts.status IS NULL THEN t.task_id
            WHEN ts.status <> 'Graded' THEN t.task_id
            ELSE NULL
          END) as pending_tasks,
          COUNT(DISTINCT CASE
            WHEN t.due_date IS NOT NULL
              AND t.due_date >= CURDATE()
              AND t.due_date < DATE_ADD(CURDATE(), INTERVAL 2 DAY)
              AND (ts.submission_id IS NULL OR ts.status <> 'Graded')
            THEN t.task_id
            ELSE NULL
          END) as due_tomorrow
        FROM tasks t
        LEFT JOIN task_submissions ts
          ON ts.task_id = t.task_id AND ts.student_id = ?
        WHERE t.status = 'Active'
          AND t.venue_id IN (${placeholders})
        `,
        [studentId, ...venueIds]
      );

      totalTasks = Number(taskCounts?.[0]?.total_tasks || 0);
      completedTasks = Number(taskCounts?.[0]?.graded_tasks || 0);
      pendingTasks = Number(taskCounts?.[0]?.pending_tasks || 0);
      tasksDueTomorrow = Number(taskCounts?.[0]?.due_tomorrow || 0);
      courseProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    }

    // Tasks Completed: use graded tasks count as "completed" metric
    // (skill_completion table may not exist, so we use task completion instead)
    const tasksCompleted = completedTasks;

    return res.status(200).json({
      success: true,
      data: {
        overallAttendance,
        pendingTasks,
        tasksCompleted,
        totalTasks,
        courseProgress,
        attendanceTrend,
        tasksDueTomorrow,
      },
    });
  } catch (error) {
    console.error('Error in getStudentDashboardStats:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch dashboard stats', error: error.message });
  }
};

export const getStudentUpcomingSchedule = async (req, res) => {
  try {
    const studentId = await resolveStudentIdFromToken(req);
    if (!studentId) {
      return res.status(404).json({ success: false, message: 'Student not found for this user' });
    }

    const [rows] = await db.query(
      `
      SELECT
        g.group_id,
        g.group_name,
        g.schedule_time,
        g.schedule_days,
        v.location,
        v.venue_name,
        u_fac.name as faculty_name
      FROM group_students gs
      INNER JOIN \`groups\` g ON gs.group_id = g.group_id
      INNER JOIN venue v ON g.venue_id = v.venue_id
      LEFT JOIN faculties f ON g.faculty_id = f.faculty_id
      LEFT JOIN users u_fac ON f.user_id = u_fac.user_id
      WHERE gs.student_id = ?
        AND gs.status = 'Active'
        AND g.status = 'Active'
      ORDER BY g.group_name ASC
      LIMIT 10
      `,
      [studentId]
    );

    // Keep response shape compatible with StudentDashboard mapping
    const data = rows.map(r => ({
      class_id: r.group_id,
      subject_name: r.group_name,
      class_type: 'Lecture',
      start_time: null,
      end_time: null,
      location: r.location || r.venue_name || 'TBD',
      faculty_name: r.faculty_name || 'TBA',
      schedule_time: r.schedule_time,
      schedule_days: r.schedule_days,
    }));

    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error in getStudentUpcomingSchedule:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch upcoming schedule', error: error.message });
  }
};

export const getStudentRecentAssignments = async (req, res) => {
  try {
    const studentId = await resolveStudentIdFromToken(req);
    if (!studentId) {
      return res.status(404).json({ success: false, message: 'Student not found for this user' });
    }

    const venueIds = await resolveStudentVenueIds(studentId);
    if (!venueIds.length) {
      return res.status(200).json({ success: true, data: [] });
    }

    const placeholders = venueIds.map(() => '?').join(',');

    const [rows] = await db.query(
      `
      SELECT
        t.task_id,
        t.title,
        t.course_type,
        t.due_date,
        t.max_score,
        ts.submitted_at,
        ts.status as submission_status
      FROM tasks t
      LEFT JOIN task_submissions ts
        ON ts.task_id = t.task_id AND ts.student_id = ?
      WHERE t.status = 'Active'
        AND t.venue_id IN (${placeholders})
      ORDER BY (t.due_date IS NULL) ASC, t.due_date ASC, t.created_at DESC
      LIMIT 10
      `,
      [studentId, ...venueIds]
    );

    const data = rows.map(r => ({
      assignment_id: r.task_id,
      title: r.title,
      subject_name: r.course_type || 'Task',
      due_date: r.due_date,
      total_required: 1,
      submission_count: r.submitted_at ? 1 : 0,
      is_submitted: !!r.submitted_at,
      submission_status: r.submission_status || null,
    }));

    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error in getStudentRecentAssignments:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch recent assignments', error: error.message });
  }
};

export const getStudentRecentGrades = async (req, res) => {
  try {
    const studentId = await resolveStudentIdFromToken(req);
    if (!studentId) {
      return res.status(404).json({ success: false, message: 'Student not found for this user' });
    }

    const [rows] = await db.query(
      `
      SELECT
        ts.submission_id,
        ts.grade,
        t.max_score,
        t.title,
        t.course_type,
        ts.graded_at
      FROM task_submissions ts
      INNER JOIN tasks t ON ts.task_id = t.task_id
      WHERE ts.student_id = ?
        AND ts.status = 'Graded'
        AND ts.grade IS NOT NULL
      ORDER BY ts.graded_at DESC, ts.submitted_at DESC
      LIMIT 5
      `,
      [studentId]
    );

    const data = rows.map(r => {
      const percentage = Number(r.grade);
      return {
        grade_id: r.submission_id,
        subject_name: r.course_type || 'Task',
        subject_code: (r.course_type || 'TASK').toString().toUpperCase().slice(0, 8),
        grade_letter: computeLetterGrade(percentage),
        score_obtained: Math.round(percentage),
        total_score: 100,
        percentage,
        title: r.title,
        graded_at: r.graded_at,
      };
    });

    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error in getStudentRecentGrades:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch recent grades', error: error.message });
  }
};

export const getStudentSubjectWiseAttendance = async (req, res) => {
  try {
    const studentId = await resolveStudentIdFromToken(req);
    if (!studentId) {
      return res.status(404).json({ success: false, message: 'Student not found for this user' });
    }

    const [rows] = await db.query(
      `
      SELECT
        g.group_id,
        g.group_name,
        g.group_code,
        COALESCE(COUNT(a.attendance_id), 0) as total,
        COALESCE(SUM(CASE WHEN a.is_present = 1 THEN 1 ELSE 0 END), 0) as present
      FROM group_students gs
      INNER JOIN \`groups\` g ON gs.group_id = g.group_id
      LEFT JOIN attendance a
        ON a.student_id = gs.student_id
        AND a.venue_id = g.venue_id
        AND a.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
      WHERE gs.student_id = ?
        AND gs.status = 'Active'
        AND g.status = 'Active'
      GROUP BY g.group_id, g.group_name, g.group_code
      ORDER BY g.group_name ASC
      `,
      [studentId]
    );

    const data = rows.map(r => {
      const total = Number(r.total || 0);
      const present = Number(r.present || 0);
      const percentage = total > 0 ? Math.round((present / total) * 100) : 0;
      return {
        subject: r.group_code || r.group_name,
        subject_code: r.group_code || r.group_name,
        attendance_percentage: percentage,
        present,
        total,
      };
    });

    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error in getStudentSubjectWiseAttendance:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch subject-wise attendance', error: error.message });
  }
};

/**
 * Get task completion statistics for the donut chart
 * Returns: { completed: number, pending: number, overdue: number }
 */
export const getStudentTaskCompletionStats = async (req, res) => {
  try {
    const studentId = await resolveStudentIdFromToken(req);
    if (!studentId) {
      return res.status(404).json({ success: false, message: 'Student not found for this user' });
    }

    const venueIds = await resolveStudentVenueIds(studentId);

    if (!venueIds.length) {
      return res.status(200).json({
        success: true,
        data: { completed: 0, pending: 0, overdue: 0 },
      });
    }

    const placeholders = venueIds.map(() => '?').join(',');

    const [taskStats] = await db.query(
      `
      SELECT
        COUNT(DISTINCT CASE 
          WHEN ts.status = 'Graded' THEN t.task_id 
        END) as completed,
        COUNT(DISTINCT CASE 
          WHEN (ts.submission_id IS NULL OR (ts.status IS NOT NULL AND ts.status <> 'Graded'))
            AND (t.due_date IS NULL OR t.due_date >= CURDATE())
          THEN t.task_id 
        END) as pending,
        COUNT(DISTINCT CASE 
          WHEN (ts.submission_id IS NULL OR (ts.status IS NOT NULL AND ts.status <> 'Graded'))
            AND t.due_date IS NOT NULL 
            AND t.due_date < CURDATE()
          THEN t.task_id 
        END) as overdue
      FROM tasks t
      LEFT JOIN task_submissions ts
        ON ts.task_id = t.task_id AND ts.student_id = ?
      WHERE t.status = 'Active'
        AND t.venue_id IN (${placeholders})
      `,
      [studentId, ...venueIds]
    );

    const completed = Number(taskStats?.[0]?.completed || 0);
    const pending = Number(taskStats?.[0]?.pending || 0);
    const overdue = Number(taskStats?.[0]?.overdue || 0);

    return res.status(200).json({
      success: true,
      data: { completed, pending, overdue },
    });
  } catch (error) {
    console.error('Error in getStudentTaskCompletionStats:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch task completion stats', error: error.message });
  }
};
