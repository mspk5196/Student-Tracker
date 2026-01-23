import db from '../config/db.js';

export const getStudentSchedule = async (req, res) => {
    try {
        const userId = req.user.user_id;
        const dateParam = req.query.date ? new Date(req.query.date) : new Date();
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dayName = days[dateParam.getDay()];

        // 1. Fetch data (Fixed `groups` table name with backticks)
        const [rows] = await db.execute(`
            SELECT 
                g.group_id,
                g.group_name as subject,
                g.group_code as code,
                g.schedule_days,
                g.schedule_time,
                g.department,
                v.venue_name,
                v.location,
                u_fac.name as instructor_name
            FROM students s
            JOIN group_students gs ON s.student_id = gs.student_id
            JOIN \`groups\` g ON gs.group_id = g.group_id
            JOIN venue v ON g.venue_id = v.venue_id
            LEFT JOIN faculties f ON g.faculty_id = f.faculty_id
            LEFT JOIN users u_fac ON f.user_id = u_fac.user_id
            WHERE s.user_id = ? 
            AND gs.status = 'Active'
            AND g.status = 'Active'
        `, [userId]);

        // 2. Helper to parse time string (e.g., "09:00 AM") to minutes
        const getMinutes = (timeStr) => {
            if (!timeStr) return 0;
            // Handle formats like "09:00 AM - 10:30 AM" -> extract start time
            const startStr = timeStr.split('-')[0].trim(); 
            const [time, modifier] = startStr.split(' ');
            let [hours, minutes] = time.split(':');
            hours = parseInt(hours);
            minutes = parseInt(minutes);
            if (hours === 12 && modifier === 'AM') hours = 0;
            if (hours !== 12 && modifier === 'PM') hours += 12;
            return hours * 60 + minutes;
        };

        // 3. Define the 4 Standard Sessions (start times in minutes)
        // 8:45 AM = 525 mins
        // 10:30 AM = 630 mins
        // 1:30 PM = 810 mins
        // 3:00 PM = 900 mins
        const SLOT_1_START = 8 * 60 + 45;  // 8:45
        const SLOT_2_START = 10 * 60 + 30; // 10:30
        const SLOT_3_START = 13 * 60 + 30; // 1:30 PM
        const SLOT_4_START = 15 * 60 + 0;  // 3:00 PM

        // 4. Process Data
        const schedule = rows.filter(item => {
            if (!item.schedule_days) return false;
            return item.schedule_days.toLowerCase().includes(dayName.toLowerCase()) || 
                   item.schedule_days.toLowerCase().includes(dayName.slice(0, 3).toLowerCase());
        }).map(item => {
            const startMinutes = getMinutes(item.schedule_time);
            
            // Assign to closest slot based on start time
            let slotId = 0;
            if (startMinutes < SLOT_2_START) slotId = 1;      // ~08:45 - 10:30
            else if (startMinutes < SLOT_3_START) slotId = 2; // ~10:30 - 12:30
            else if (startMinutes < SLOT_4_START) slotId = 3; // ~01:30 - 03:00
            else slotId = 4;                                  // ~03:00 - 04:30

            let type = 'Lecture';
            if (item.subject.toLowerCase().includes('lab')) type = 'Laboratory';

            return {
                id: item.group_id,
                slotId: slotId, // We send this to frontend to place it correctly
                subject: item.subject,
                code: item.code,
                type: type,
                venue: `${item.venue_name} (${item.location})`,
                instructor: item.instructor_name || 'TBA',
                db_time: item.schedule_time // Keep original for reference
            };
        });

        res.json({ success: true, data: schedule });

    } catch (error) {
        console.error('Error fetching schedule:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};