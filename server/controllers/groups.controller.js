import db from '../config/db.js';
import csv from 'csv-parser';
import { Readable } from 'stream';

// Get all groups
export const getAllGroups = async (req, res) => {
  try {
    const [groups] = await db.query(`
      SELECT 
        g.group_id,
        g.group_code,
        g.group_name,
        g.schedule_days,
        g.schedule_time,
        g.max_students,
        g.status,
        g.department,
        v.venue_name,
        v.venue_id,
        f.faculty_id,
        u.name as faculty_name,
        COUNT(DISTINCT gs.student_id) as current_students
      FROM \`groups\` g
      INNER JOIN venue v ON g.venue_id = v.venue_id
      INNER JOIN faculties f ON g.faculty_id = f.faculty_id
      INNER JOIN users u ON f.user_id = u.user_id
      LEFT JOIN group_students gs ON g. group_id = gs.group_id AND gs.status = 'Active'
      GROUP BY g.group_id
      ORDER BY g.created_at DESC
    `);

    const formattedGroups = groups.map(group => ({
      id: group.group_id,
      code: group.group_code,
      venue: group.venue_name,
      event: group.group_name,
      faculty: group.faculty_name,
      schedule: `${group.schedule_days} ${group.schedule_time}`,
      students: group.current_students,
      total:  group.max_students,
      status: group.status,
      department: group.department,
      venue_id: group. venue_id,
      faculty_id: group.faculty_id
    }));

    res.status(200).json({ success: true, data: formattedGroups });
  } catch (error) {
    console.error('Error fetching groups:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch groups' });
  }
};

// Create new group
export const createGroup = async (req, res) => {
  const connection = await db.getConnection();
  
  try {
    const { 
      group_code, 
      group_name, 
      venue_id, 
      faculty_id, 
      schedule_days, 
      schedule_time,
      max_students,
      department,
      status 
    } = req.body;

    // Validation
    if (!group_code || !group_name || !venue_id || !faculty_id || ! schedule_days || !schedule_time || !department) {
      return res.status(400).json({ 
        success: false, 
        message: 'All fields are required' 
      });
    }

    // Check if group code already exists
    const [existing] = await connection.query(
      'SELECT group_code FROM \`groups\` WHERE group_code = ?',
      [group_code]
    );
    
    if (existing.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Group code already exists' 
      });
    }

    await connection.beginTransaction();

    const [result] = await connection.query(`
      INSERT INTO \`groups\` 
      (group_code, group_name, venue_id, faculty_id, schedule_days, schedule_time, max_students, department, status) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [group_code, group_name, venue_id, faculty_id, schedule_days, schedule_time, max_students || 50, department, status || 'Active']);

    await connection.commit();

    res.status(201).json({ 
      success: true, 
      message: 'Group created successfully',
      data: { group_id: result.insertId }
    });

  } catch (error) {
    await connection.rollback();
    console.error('Error creating group:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to create group' 
    });
  } finally {
    connection.release();
  }
};

// Update group
export const updateGroup = async (req, res) => {
  const connection = await db.getConnection();
  
  try {
    const { groupId } = req.params;
    const { venue_id, schedule_days, schedule_time, status, max_students } = req.body;

    await connection.beginTransaction();

    await connection.query(`
      UPDATE \`groups\` 
      SET venue_id = ?, schedule_days = ?, schedule_time = ?, status = ?, max_students = ?  
      WHERE group_id = ?
    `, [venue_id, schedule_days, schedule_time, status, max_students, groupId]);

    await connection. commit();

    res.status(200).json({ 
      success: true, 
      message:  'Group updated successfully' 
    });

  } catch (error) {
    await connection.rollback();
    console.error('Error updating group:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update group' 
    });
  } finally {
    connection. release();
  }
};

// Delete group
export const deleteGroup = async (req, res) => {
  const connection = await db.getConnection();
  
  try {
    const { groupId } = req.params;

    await connection.beginTransaction();

    // Delete group students first
    await connection.query('DELETE FROM group_students WHERE group_id = ?', [groupId]);

    // Delete group
    await connection.query('DELETE FROM \`groups\` WHERE group_id = ?', [groupId]);

    await connection.commit();

    res.status(200).json({ 
      success: true, 
      message: 'Group deleted successfully' 
    });

  } catch (error) {
    await connection.rollback();
    console.error('Error deleting group:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to delete group' 
    });
  } finally {
    connection.release();
  }
};

// Get all venues
export const getAllVenues = async (req, res) => {
  try {
    const [venues] = await db.query(`
      SELECT 
        v. venue_id,
        v. venue_name,
        GROUP_CONCAT(DISTINCT s. skill_name ORDER BY s.skill_name SEPARATOR ', ') as required_skills
      FROM venue v
      LEFT JOIN venue_skills vs ON v.venue_id = vs.venue_id
      LEFT JOIN skills s ON vs.skill_id = s.skill_id
      GROUP BY v.venue_id
      ORDER BY v.venue_name
    `);

    res.status(200).json({ success: true, data: venues });
  } catch (error) {
    console.error('Error fetching venues:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch venues' });
  }
};

// Get all faculties
export const getAllFacultiesForGroups = async (req, res) => {
  try {
    const [faculties] = await db.query(`
      SELECT 
        f.faculty_id,
        u.name as faculty_name,
        u.department,
        f.designation
      FROM faculties f
      INNER JOIN users u ON f.user_id = u.user_id
      WHERE u.is_active = 1
      ORDER BY u.name
    `);

    res.status(200).json({ success: true, data: faculties });
  } catch (error) {
    console.error('Error fetching faculties:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch faculties' });
  }
};

// Bulk upload students with skills (CSV)
export const bulkUploadStudents = async (req, res) => {
  const connection = await db.getConnection();
  
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'No file uploaded' 
      });
    }

    const results = [];
    const csvData = req.file.buffer.toString('utf8');
    
    // Parse CSV
    const stream = Readable.from(csvData);
    
    await new Promise((resolve, reject) => {
      stream
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', resolve)
        .on('error', reject);
    });

    await connection.beginTransaction();

    let studentsAdded = 0;
    let skillsAdded = 0;

    for (const row of results) {
      // Expected CSV format: name, email, studentId, department, year, semester, skills (comma-separated), proficiency_levels (comma-separated)
      const { name, email, studentId, department, year, semester, skills, proficiency_levels } = row;

      // Check if student exists
      const [existingUser] = await connection.query(
        'SELECT user_id FROM users WHERE email = ?  OR ID = ?',
        [email, studentId]
      );

      let userId;

      if (existingUser.length === 0) {
        // Insert new student
        const [userResult] = await connection.query(
          `INSERT INTO users (role_id, name, email, ID, department, created_at, is_active) 
           VALUES (3, ?, ?, ?, ?, NOW(), 1)`,
          [name, email, studentId, department]
        );

        userId = userResult.insertId;

        await connection.query(
          'INSERT INTO students (user_id, year, semester, assigned_faculty_id) VALUES (?, ?, ?, 0)',
          [userId, year, semester]
        );

        studentsAdded++;
      } else {
        userId = existingUser[0].user_id;
      }

      // Add skills
      if (skills && skills.trim()) {
        const skillsList = skills.split(',').map(s => s.trim());
        const proficiencyList = proficiency_levels ? proficiency_levels.split(',').map(p => p.trim()) : [];

        for (let i = 0; i < skillsList.length; i++) {
          const skillName = skillsList[i];
          const proficiency = proficiencyList[i] || 'Beginner';

          // Get or create skill
          let [skillRecord] = await connection.query(
            'SELECT skill_id FROM skills WHERE skill_name = ?',
            [skillName]
          );

          let skillId;
          if (skillRecord.length === 0) {
            const [skillResult] = await connection.query(
              'INSERT INTO skills (skill_name, created_at) VALUES (?, NOW())',
              [skillName]
            );
            skillId = skillResult.insertId;
          } else {
            skillId = skillRecord[0].skill_id;
          }

          // Get student_id
          const [student] = await connection.query(
            'SELECT student_id FROM students WHERE user_id = ?',
            [userId]
          );

          if (student.length > 0) {
            // Check if skill already exists for student
            const [existingSkill] = await connection.query(
              'SELECT id FROM student_skills WHERE student_id = ?  AND skill_id = ?',
              [student[0].student_id, skillId]
            );

            if (existingSkill.length === 0) {
              await connection.query(
                'INSERT INTO student_skills (student_id, skill_id, proficiency_level, created_at) VALUES (?, ?, ?, NOW())',
                [student[0].student_id, skillId, proficiency]
              );
              skillsAdded++;
            }
          }
        }
      }
    }

    await connection.commit();

    res.status(201).json({ 
      success: true, 
      message: `Successfully processed ${results.length} records.  Added ${studentsAdded} new students and ${skillsAdded} skills.`
    });

  } catch (error) {
    await connection. rollback();
    console.error('Error bulk uploading students:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to upload students',
      error: error.message 
    });
  } finally {
    connection.release();
  }
};

// Auto-allocate students to group based on skills
export const autoAllocateStudents = async (req, res) => {
  const connection = await db.getConnection();
  
  try {
    const { groupId } = req.params;

    // Get group details
    const [groups] = await connection.query(
      'SELECT * FROM \`groups\` WHERE group_id = ?',
      [groupId]
    );

    if (groups.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Group not found' 
      });
    }

    const group = groups[0];

    // Get current student count
    const [currentCount] = await connection.query(
      'SELECT COUNT(*) as count FROM group_students WHERE group_id = ?  AND status = "Active"',
      [groupId]
    );

    const availableSlots = group.max_students - currentCount[0].count;

    if (availableSlots <= 0) {
      return res.status(400).json({ 
        success: false, 
        message:  'Group is already full' 
      });
    }

    // Get required skills for this venue
    const [requiredSkills] = await connection.query(`
      SELECT vs.skill_id, s.skill_name, vs.required_level
      FROM venue_skills vs
      INNER JOIN skills s ON vs.skill_id = s.skill_id
      WHERE vs.venue_id = ? 
    `, [group.venue_id]);

    if (requiredSkills.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'No skill requirements defined for this venue' 
      });
    }

    // Find matching students
    const skillIds = requiredSkills.map(sk => sk.skill_id);

    const [matchingStudents] = await connection. query(`
      SELECT 
        s.student_id,
        u.name,
        u.department,
        COUNT(DISTINCT ss.skill_id) as matching_skills,
        AVG(
          CASE ss.proficiency_level
            WHEN 'Expert' THEN 4
            WHEN 'Advanced' THEN 3
            WHEN 'Intermediate' THEN 2
            WHEN 'Beginner' THEN 1
          END
        ) as avg_proficiency
      FROM students s
      INNER JOIN users u ON s.user_id = u. user_id
      INNER JOIN student_skills ss ON s.student_id = ss.student_id
      LEFT JOIN group_students gs ON s.student_id = gs.student_id AND gs.status = 'Active'
      WHERE ss.skill_id IN (?)
        AND u.department = ?
        AND u.is_active = 1
        AND gs.id IS NULL
      GROUP BY s. student_id
      HAVING matching_skills >= ?
      ORDER BY matching_skills DESC, avg_proficiency DESC
      LIMIT ?
    `, [skillIds, group.department, Math.ceil(requiredSkills.length / 2), availableSlots]);

    await connection.beginTransaction();

    let allocated = 0;
    for (const student of matchingStudents) {
      await connection.query(
        'INSERT INTO group_students (group_id, student_id, allocation_date, status) VALUES (?, ?, NOW(), "Active")',
        [groupId, student. student_id]
      );
      allocated++;
    }

    await connection.commit();

    res.status(200).json({ 
      success: true, 
      message: `Successfully allocated ${allocated} students to the group`,
      data: { allocated, available_slots: availableSlots }
    });

  } catch (error) {
    await connection.rollback();
    console.error('Error auto-allocating students:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to allocate students',
      error: error.message 
    });
  } finally {
    connection.release();
  }
};

// Get students in a group
export const getGroupStudents = async (req, res) => {
  try {
    const { groupId } = req.params;

    const [students] = await db.query(`
      SELECT 
        gs.id,
        s.student_id,
        u.name,
        u.email,
        u.ID as studentId,
        u.department,
        s.year,
        s.semester,
        gs.allocation_date,
        gs.status,
        GROUP_CONCAT(DISTINCT sk.skill_name ORDER BY sk. skill_name SEPARATOR ', ') as skills
      FROM group_students gs
      INNER JOIN students s ON gs. student_id = s.student_id
      INNER JOIN users u ON s.user_id = u.user_id
      LEFT JOIN student_skills ss ON s.student_id = ss.student_id
      LEFT JOIN skills sk ON ss.skill_id = sk.skill_id
      WHERE gs.group_id = ? 
      GROUP BY gs.id
      ORDER BY u.name
    `, [groupId]);

    res.status(200).json({ success: true, data: students });
  } catch (error) {
    console.error('Error fetching group students:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch group students' });
  }
};

// Remove student from group
export const removeStudentFromGroup = async (req, res) => {
  try {
    const { groupId, studentId } = req. params;

    await db.query(
      'UPDATE group_students SET status = "Dropped" WHERE group_id = ? AND student_id = ?',
      [groupId, studentId]
    );

    res.status(200).json({ 
      success: true, 
      message: 'Student removed from group successfully' 
    });
  } catch (error) {
    console.error('Error removing student:', error);
    res.status(500).json({ success: false, message: 'Failed to remove student' });
  }
};

// Get all skills
export const getAllSkills = async (req, res) => {
  try {
    const [skills] = await db.query('SELECT * FROM skills ORDER BY skill_name');
    res.status(200).json({ success: true, data: skills });
  } catch (error) {
    console.error('Error fetching skills:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch skills' });
  }
};

// Assign skills to venue
export const assignSkillsToVenue = async (req, res) => {
  const connection = await db.getConnection();
  
  try {
    const { venueId } = req.params;
    const { skills } = req.body; // Array of { skill_id, required_level }

    await connection. beginTransaction();

    // Delete existing skills
    await connection.query('DELETE FROM venue_skills WHERE venue_id = ? ', [venueId]);

    // Insert new skills
    if (skills && skills.length > 0) {
      for (const skill of skills) {
        await connection.query(
          'INSERT INTO venue_skills (venue_id, skill_id, required_level, created_at) VALUES (?, ?, ?, NOW())',
          [venueId, skill.skill_id, skill.required_level]
        );
      }
    }

    await connection.commit();

    res.status(200).json({ 
      success: true, 
      message: 'Skills assigned to venue successfully' 
    });

  } catch (error) {
    await connection.rollback();
    console.error('Error assigning skills to venue:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to assign skills to venue' 
    });
  } finally {
    connection.release();
  }
};