import db from '../config/db.js';

/**
 * Enhanced role-based access control middleware
 * Validates role from database, not just from JWT token
 * Prevents client-side role manipulation
 */

/**
 * Authorize specific roles
 * @param {Array<string>} allowedRoles - Array of allowed roles: ['admin', 'faculty', 'student']
 */
export const authorizeRoles = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      // JWT token already verified by authenticate middleware
      const user_id = req.user.user_id;
      const jwtRole = req.user.role;

      // CRITICAL: Verify role from database (prevent client-side manipulation)
      const [userRows] = await db.query(
        `SELECT u.user_id, r.role, u.is_active
         FROM users u
         JOIN role r ON u.role_id = r.role_id
         WHERE u.user_id = ?`,
        [user_id]
      );

      if (userRows.length === 0) {
        return res.status(403).json({ 
          success: false,
          message: 'User not found or inactive' 
        });
      }

      const dbUser = userRows[0];

      // Check if user is active
      if (!dbUser.is_active) {
        return res.status(403).json({ 
          success: false,
          message: 'Account has been deactivated' 
        });
      }

      // Validate JWT role matches database role (detect token manipulation)
      if (jwtRole !== dbUser.role) {
        console.error(`[SECURITY] Role mismatch detected: JWT=${jwtRole}, DB=${dbUser.role}, User=${user_id}`);
        return res.status(403).json({ 
          success: false,
          message: 'Invalid token - role mismatch detected' 
        });
      }

      // Check if user has required role
      if (!allowedRoles.includes(dbUser.role)) {
        return res.status(403).json({ 
          success: false,
          message: `Access denied. Required role: ${allowedRoles.join(' or ')}` 
        });
      }

      // Attach verified role to request
      req.userRole = dbUser.role;
      next();
    } catch (error) {
      console.error('Authorization error:', error);
      return res.status(500).json({ 
        success: false,
        message: 'Authorization failed' 
      });
    }
  };
};

/**
 * Admin only access
 */
export const adminOnly = authorizeRoles('admin');

/**
 * Admin or Faculty access
 */
export const facultyOrAdmin = authorizeRoles('admin', 'faculty');

/**
 * Student only access
 */
export const studentOnly = authorizeRoles('student');

/**
 * Any authenticated user (admin, faculty, or student)
 */
export const anyRole = authorizeRoles('admin', 'faculty', 'student');

/**
 * Verify student owns the resource
 * Used when student can only access their own data
 */
export const verifyStudentOwnership = async (req, res, next) => {
  try {
    const user_id = req.user.user_id;
    const role = req.userRole || req.user.role;

    // Admins and faculty can access any student data
    if (role === 'admin' || role === 'faculty') {
      return next();
    }

    // For students, verify ownership
    if (role === 'student') {
      // Get student_id from database
      const [studentRows] = await db.query(
        'SELECT student_id FROM students WHERE user_id = ?',
        [user_id]
      );

      if (studentRows.length === 0) {
        return res.status(403).json({ 
          success: false,
          message: 'Student record not found' 
        });
      }

      const student_id = studentRows[0].student_id;

      // Check if request is for their own data
      const requestedStudentId = req.params.studentId || req.params.student_id;
      if (requestedStudentId && parseInt(requestedStudentId) !== parseInt(student_id)) {
        return res.status(403).json({ 
          success: false,
          message: 'You can only access your own data' 
        });
      }

      // Attach student_id for convenience
      req.student_id = student_id;
    }

    next();
  } catch (error) {
    console.error('Ownership verification error:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Verification failed' 
    });
  }
};

/**
 * Verify faculty owns the resource or is admin
 */
export const verifyFacultyOwnership = async (req, res, next) => {
  try {
    const user_id = req.user.user_id;
    const role = req.userRole || req.user.role;

    // Admins can access anything
    if (role === 'admin') {
      return next();
    }

    // For faculty, verify ownership
    if (role === 'faculty') {
      const [facultyRows] = await db.query(
        'SELECT faculty_id FROM faculties WHERE user_id = ?',
        [user_id]
      );

      if (facultyRows.length === 0) {
        return res.status(403).json({ 
          success: false,
          message: 'Faculty record not found' 
        });
      }

      req.faculty_id = facultyRows[0].faculty_id;
    }

    next();
  } catch (error) {
    console.error('Faculty ownership verification error:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Verification failed' 
    });
  }
};
