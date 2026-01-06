import mysql from 'mysql2/promise';

const conn = await mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'student_tracking'
});

console.log('=== SESSION NAME SAMPLES ===');
const [samples] = await conn.query(`
  SELECT session_name FROM attendance_session LIMIT 3
`);
console.table(samples);

console.log('\n=== DAILY BREAKDOWN BY SESSION DATE (Using REGEXP) ===');
const [daily] = await conn.query(`
  SELECT 
    SUBSTRING(ats.session_name, LOCATE('_20', ats.session_name) + 1, 10) as session_date,
    COUNT(*) as total_hours,
    SUM(CASE WHEN a.is_present = 1 AND a.is_late = 0 THEN 1 ELSE 0 END) as present_hours
  FROM attendance a 
  INNER JOIN attendance_session ats ON a.session_id = ats.session_id
  WHERE a.student_id = 1
  GROUP BY SUBSTRING(ats.session_name, LOCATE('_20', ats.session_name) + 1, 10)
  ORDER BY session_date DESC
`);

console.table(daily);
conn.end();
