import db from '../config/db.js';

function toISODate(date) {
  // Returns YYYY-MM-DD in local time
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function clampActivityLevel(count) {
  // Ensure: 0 = no activity, >=1 shows as filled.
  if (!count || count <= 0) return 0;
  if (count === 1) return 1;
  if (count === 2) return 2;
  if (count <= 4) return 3;
  return 4;
}

async function resolveStudentIdFromToken(req) {
  const userId = req.user?.user_id || req.user?.userId || req.user?.id;
  if (!userId) return null;

  const [rows] = await db.query('SELECT student_id FROM students WHERE user_id = ? LIMIT 1', [userId]);
  return rows.length > 0 ? rows[0].student_id : null;
}

/**
 * GET /api/activity/heatmap?year=2024
 * Returns: [{ date: 'YYYY-MM-DD', activity_level: 0-4, activities: string[] }]
 *
 * Activity is currently driven by task submissions (submitted_at).
 */
export const getStudentActivityHeatmap = async (req, res) => {
  try {
    const year = Number(req.query.year) || new Date().getFullYear();

    const studentId = await resolveStudentIdFromToken(req);
    if (!studentId) {
      return res.status(404).json({ success: false, message: 'Student not found for this user' });
    }

    // Aggregate submissions by date for the selected year.
    const [submissionByDay] = await db.query(
      `
      SELECT
        DATE(ts.submitted_at) as day,
        COUNT(*) as submissions_count,
        GROUP_CONCAT(DISTINCT t.title ORDER BY ts.submitted_at DESC SEPARATOR '||') as titles
      FROM task_submissions ts
      INNER JOIN tasks t ON t.task_id = ts.task_id
      WHERE ts.student_id = ?
        AND ts.submitted_at IS NOT NULL
        AND YEAR(ts.submitted_at) = ?
      GROUP BY DATE(ts.submitted_at)
      ORDER BY day ASC
      `,
      [studentId, year]
    );

    const dayMap = new Map();
    submissionByDay.forEach(row => {
      const iso = row.day instanceof Date ? toISODate(row.day) : String(row.day);
      const titles = row.titles ? String(row.titles).split('||').filter(Boolean) : [];
      dayMap.set(iso, {
        count: Number(row.submissions_count) || 0,
        titles,
      });
    });

    // Build a full-year array so the UI can render consistently.
    const start = new Date(year, 0, 1);
    const end = new Date(year, 11, 31);

    const result = [];
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const iso = toISODate(d);
      const info = dayMap.get(iso);
      const count = info?.count || 0;

      result.push({
        date: iso,
        activity_level: clampActivityLevel(count),
        activities: info?.titles?.length
          ? info.titles.map(title => `Submitted: ${title}`)
          : [],
      });
    }

    res.status(200).json({
      success: true,
      data: result,
      meta: {
        year,
        source: 'task_submissions',
      },
    });
  } catch (error) {
    console.error('Error fetching activity heatmap:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch heatmap activity',
      error: error.message,
    });
  }
};
