import db from '../config/db.js';

// Get all faculties with user details
export const getAllFaculties = async (req, res) => {
  try {
    const [faculties] = await db.query(`
      SELECT 
        u.user_id,
        u.name,
        u.email,
        u.ID as facultyId,
        u.department,
        u.is_active,
        u.created_at as joinDate,
        f.faculty_id,
        f.designation,
        CASE 
          WHEN u.is_active = 1 THEN 'Active'
          WHEN u.is_active = 0 THEN 'Inactive'
          ELSE 'On Leave'
        END as status
      FROM users u
      INNER JOIN faculties f ON u. user_id = f.user_id
      WHERE u.role_id = 2
      ORDER BY u.created_at DESC
    `);
    
    res.status(200).json({ success: true, data: faculties });
  } catch (error) {
    console.error('Error fetching faculties:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch faculties' });
  }
};

// Create new faculty
export const createFaculty = async (req, res) => {
  const connection = await db.getConnection();
  
  try {
    const { name, designation, facultyId, email, department } = req.body;

    // Validation
    if (!name || !designation || !facultyId || !email || !department) {
      return res.status(400).json({ 
        success: false, 
        message: 'All fields are required' 
      });
    }

    // Check if email already exists
    const [existingEmail] = await connection.query(
      'SELECT email FROM users WHERE email = ?',
      [email]
    );
    
    if (existingEmail.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email already exists' 
      });
    }

    // Check if faculty ID already exists
    const [existingId] = await connection.query(
      'SELECT ID FROM users WHERE ID = ?',
      [facultyId]
    );
    
    if (existingId.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Faculty ID already exists' 
      });
    }

    await connection.beginTransaction();

    // Insert into users table
    const [userResult] = await connection.query(
      `INSERT INTO users (role_id, name, email, ID, department, created_at, is_active) 
       VALUES (2, ?, ?, ?, ?, NOW(), 1)`,
      [name, email, facultyId, department]
    );

    const userId = userResult.insertId;

    // Insert into faculties table
    await connection.query(
      'INSERT INTO faculties (user_id, designation) VALUES (?, ?)',
      [userId, designation]
    );

    await connection.commit();

    res.status(201).json({ 
      success: true, 
      message: 'Faculty created successfully',
      data: { userId, facultyId }
    });

  } catch (error) {
    await connection. rollback();
    console.error('Error creating faculty:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to create faculty' 
    });
  } finally {
    connection.release();
  }
};

// Update faculty
export const updateFaculty = async (req, res) => {
  const connection = await db.getConnection();
  
  try {
    const { userId } = req.params;
    const { name, designation, email, department, is_active } = req.body;

    // Validation
    if (!name || !designation || !email || !department) {
      return res.status(400).json({ 
        success: false, 
        message: 'All fields are required' 
      });
    }

    // Check if user exists and is faculty
    const [existingUser] = await connection.query(
      'SELECT user_id, role_id FROM users WHERE user_id = ?  AND role_id = 2',
      [userId]
    );
    
    if (existingUser.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Faculty not found' 
      });
    }

    // Check if email is being changed and if it already exists
    const [emailCheck] = await connection.query(
      'SELECT user_id FROM users WHERE email = ?  AND user_id != ?',
      [email, userId]
    );
    
    if (emailCheck.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email already exists' 
      });
    }

    await connection.beginTransaction();

    // Update users table
    await connection. query(
      `UPDATE users 
       SET name = ?, email = ?, department = ?, is_active = ? 
       WHERE user_id = ? `,
      [name, email, department, is_active !== undefined ? is_active : 1, userId]
    );

    // Update faculties table
    await connection.query(
      'UPDATE faculties SET designation = ? WHERE user_id = ?',
      [designation, userId]
    );

    await connection.commit();

    res.status(200).json({ 
      success: true, 
      message: 'Faculty updated successfully' 
    });

  } catch (error) {
    await connection.rollback();
    console.error('Error updating faculty:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update faculty' 
    });
  } finally {
    connection.release();
  }
};

// Delete faculty
export const deleteFaculty = async (req, res) => {
  const connection = await db.getConnection();
  
  try {
    const { userId } = req.params;

    // Check if user exists and is faculty
    const [existingUser] = await connection.query(
      'SELECT user_id, role_id FROM users WHERE user_id = ? AND role_id = 2',
      [userId]
    );
    
    if (existingUser.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Faculty not found' 
      });
    }

    await connection.beginTransaction();

    // Delete from faculties table first (foreign key constraint)
    await connection. query('DELETE FROM faculties WHERE user_id = ?', [userId]);

    // Delete from users table
    await connection.query('DELETE FROM users WHERE user_id = ?', [userId]);

    await connection.commit();

    res.status(200).json({ 
      success: true, 
      message: 'Faculty deleted successfully' 
    });

  } catch (error) {
    await connection.rollback();
    console.error('Error deleting faculty:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to delete faculty' 
    });
  } finally {
    connection.release();
  }
};

// Get single faculty by user_id
export const getFacultyById = async (req, res) => {
  try {
    const { userId } = req.params;

    const [faculty] = await db.query(`
      SELECT 
        u. user_id,
        u. name,
        u.email,
        u.ID as facultyId,
        u.department,
        u.is_active,
        u.created_at as joinDate,
        f.faculty_id,
        f.designation
      FROM users u
      INNER JOIN faculties f ON u.user_id = f.user_id
      WHERE u.user_id = ? AND u.role_id = 2
    `, [userId]);

    if (faculty.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message:  'Faculty not found' 
      });
    }

    res.status(200).json({ success: true, data: faculty[0] });
  } catch (error) {
    console.error('Error fetching faculty:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch faculty' 
    });
  }
};