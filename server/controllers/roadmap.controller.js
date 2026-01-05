import db from '../config/db.js';

// ============ STUDENT ENDPOINTS ============

// Get all roadmaps for a student (based on their groups)
export const getStudentRoadmaps = async (req, res) => {
  try {
    const { studentId } = req.params;

    const [roadmaps] = await db.query(`
      SELECT DISTINCT
        r.roadmap_id,
        r.roadmap_code,
        r.title,
        r.description,
        r.instructor_name,
        r.status,
        COUNT(DISTINCT rm.module_id) as total_modules,
        COUNT(DISTINCT CASE WHEN smp.is_completed = 1 THEN smp.module_id END) as completed_modules
      FROM roadmaps r
      INNER JOIN \`groups\` g ON r.group_id = g.group_id
      INNER JOIN group_students gs ON g.group_id = gs.group_id
      LEFT JOIN roadmap_modules rm ON r.roadmap_id = rm.roadmap_id
      LEFT JOIN student_module_progress smp ON rm.module_id = smp.module_id AND smp.student_id = ?
      WHERE gs.student_id = ? AND gs.status = 'Active' AND r.status = 'active'
      GROUP BY r.roadmap_id
      ORDER BY r.created_at DESC
    `, [studentId, studentId]);

    const formattedRoadmaps = roadmaps.map(roadmap => ({
      roadmap_id: roadmap.roadmap_id,
      code: roadmap.roadmap_code,
      title: roadmap.title,
      description: roadmap.description,
      instructor: roadmap.instructor_name,
      totalModules: roadmap.total_modules,
      completedModules: roadmap.completed_modules,
      progress: roadmap.total_modules > 0 
        ? Math.round((roadmap.completed_modules / roadmap.total_modules) * 100) 
        : 0
    }));

    res.status(200).json({ success: true, data: formattedRoadmaps });
  } catch (error) {
    console.error('Error fetching student roadmaps:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch student roadmaps' });
  }
};

// Get roadmap details with modules and resources
export const getRoadmapDetails = async (req, res) => {
  try {
    const { roadmapId } = req.params;
    const studentId = req.query.studentId; // Optional for student progress

    // Get roadmap info
    const [roadmapInfo] = await db.query(`
      SELECT 
        r.roadmap_id,
        r.roadmap_code,
        r.title,
        r.description,
        r.instructor_name,
        r.status
      FROM roadmaps r
      WHERE r.roadmap_id = ?
    `, [roadmapId]);

    if (roadmapInfo.length === 0) {
      return res.status(404).json({ success: false, message: 'Roadmap not found' });
    }

    // Get modules with resources
    const [modules] = await db.query(`
      SELECT 
        rm.module_id,
        rm.day_number,
        rm.title,
        rm.description,
        rm.status,
        ${studentId ? 'COALESCE(smp.is_completed, 0) as is_completed,' : ''}
        ${studentId ? 'smp.completed_at,' : ''}
        JSON_ARRAYAGG(
          JSON_OBJECT(
            'resource_id', mr.resource_id,
            'name', mr.resource_name,
            'type', mr.resource_type,
            'url', mr.resource_url,
            'kind', mr.resource_type
          )
        ) as resources
      FROM roadmap_modules rm
      LEFT JOIN module_resources mr ON rm.module_id = mr.module_id
      ${studentId ? 'LEFT JOIN student_module_progress smp ON rm.module_id = smp.module_id AND smp.student_id = ?' : ''}
      WHERE rm.roadmap_id = ?
      GROUP BY rm.module_id
      ORDER BY rm.day_number ASC
    `, studentId ? [studentId, roadmapId] : [roadmapId]);

    const formattedModules = modules.map(module => ({
      id: module.module_id,
      day: module.day_number,
      title: module.title,
      description: module.description,
      status: studentId 
        ? (module.is_completed ? 'completed' : 'current')
        : module.status,
      completedAt: module.completed_at || null,
      resources: module.resources[0].resource_id ? module.resources : []
    }));

    res.status(200).json({
      success: true,
      data: {
        ...roadmapInfo[0],
        modules: formattedModules
      }
    });
  } catch (error) {
    console.error('Error fetching roadmap details:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch roadmap details' });
  }
};

// Get student's progress for a specific roadmap
export const getStudentProgress = async (req, res) => {
  try {
    const { studentId, roadmapId } = req.params;

    const [progress] = await db.query(`
      SELECT 
        COUNT(rm.module_id) as total_modules,
        COUNT(CASE WHEN smp.is_completed = 1 THEN 1 END) as completed_modules
      FROM roadmap_modules rm
      LEFT JOIN student_module_progress smp ON rm.module_id = smp.module_id AND smp.student_id = ?
      WHERE rm.roadmap_id = ?
    `, [studentId, roadmapId]);

    const result = progress[0];
    const progressPercentage = result.total_modules > 0
      ? Math.round((result.completed_modules / result.total_modules) * 100)
      : 0;

    res.status(200).json({
      success: true,
      data: {
        totalModules: result.total_modules,
        completedModules: result.completed_modules,
        progress: progressPercentage
      }
    });
  } catch (error) {
    console.error('Error fetching student progress:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch student progress' });
  }
};

// Update module progress (mark complete/incomplete)
export const updateModuleProgress = async (req, res) => {
  const connection = await db.getConnection();
  
  try {
    const { moduleId } = req.params;
    const { studentId, isCompleted } = req.body;

    if (!studentId) {
      return res.status(400).json({ success: false, message: 'Student ID is required' });
    }

    await connection.beginTransaction();

    // Check if progress record exists
    const [existing] = await connection.query(
      'SELECT progress_id FROM student_module_progress WHERE student_id = ? AND module_id = ?',
      [studentId, moduleId]
    );

    if (existing.length > 0) {
      // Update existing record
      await connection.query(`
        UPDATE student_module_progress 
        SET is_completed = ?, completed_at = ${isCompleted ? 'NOW()' : 'NULL'}
        WHERE student_id = ? AND module_id = ?
      `, [isCompleted, studentId, moduleId]);
    } else {
      // Insert new record
      await connection.query(`
        INSERT INTO student_module_progress (student_id, module_id, is_completed, completed_at)
        VALUES (?, ?, ?, ${isCompleted ? 'NOW()' : 'NULL'})
      `, [studentId, moduleId, isCompleted]);
    }

    await connection.commit();

    res.status(200).json({ 
      success: true, 
      message: isCompleted ? 'Module marked as completed' : 'Module marked as incomplete'
    });

  } catch (error) {
    await connection.rollback();
    console.error('Error updating module progress:', error);
    res.status(500).json({ success: false, message: 'Failed to update module progress' });
  } finally {
    connection.release();
  }
};

// ============ FACULTY/ADMIN ENDPOINTS ============

// Get all roadmaps (with optional group filter)
export const getAllRoadmaps = async (req, res) => {
  try {
    const { groupId } = req.query;

    let query = `
      SELECT 
        r.roadmap_id,
        r.roadmap_code,
        r.title,
        r.description,
        r.instructor_name,
        r.status,
        r.created_at,
        g.group_name,
        g.group_code,
        COUNT(DISTINCT rm.module_id) as total_modules
      FROM roadmaps r
      INNER JOIN \`groups\` g ON r.group_id = g.group_id
      LEFT JOIN roadmap_modules rm ON r.roadmap_id = rm.roadmap_id
    `;

    const params = [];
    if (groupId) {
      query += ' WHERE r.group_id = ?';
      params.push(groupId);
    }

    query += ' GROUP BY r.roadmap_id ORDER BY r.created_at DESC';

    const [roadmaps] = await db.query(query, params);

    res.status(200).json({ success: true, data: roadmaps });
  } catch (error) {
    console.error('Error fetching all roadmaps:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch roadmaps' });
  }
};

// Create a new roadmap
export const createRoadmap = async (req, res) => {
  const connection = await db.getConnection();
  
  try {
    const { 
      groupId, 
      roadmapCode, 
      title, 
      description, 
      instructorName 
    } = req.body;

    // Validation
    if (!groupId || !roadmapCode || !title) {
      return res.status(400).json({ 
        success: false, 
        message: 'Group ID, roadmap code, and title are required' 
      });
    }

    // Check if roadmap code already exists
    const [existing] = await connection.query(
      'SELECT roadmap_code FROM roadmaps WHERE roadmap_code = ?',
      [roadmapCode]
    );

    if (existing.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Roadmap code already exists' 
      });
    }

    await connection.beginTransaction();

    const [result] = await connection.query(`
      INSERT INTO roadmaps (group_id, roadmap_code, title, description, instructor_name, created_by, status)
      VALUES (?, ?, ?, ?, ?, ?, 'active')
    `, [groupId, roadmapCode, title, description, instructorName, req.user?.user_id || 1]);

    await connection.commit();

    res.status(201).json({ 
      success: true, 
      message: 'Roadmap created successfully',
      data: { roadmapId: result.insertId }
    });

  } catch (error) {
    await connection.rollback();
    console.error('Error creating roadmap:', error);
    res.status(500).json({ success: false, message: 'Failed to create roadmap' });
  } finally {
    connection.release();
  }
};

// Add module to roadmap
export const addModule = async (req, res) => {
  const connection = await db.getConnection();
  
  try {
    const { roadmapId } = req.params;
    const { dayNumber, title, description, status } = req.body;

    if (!title) {
      return res.status(400).json({ 
        success: false, 
        message: 'Module title is required' 
      });
    }

    await connection.beginTransaction();

    // Auto-calculate day number if not provided
    let finalDayNumber = dayNumber;
    if (!finalDayNumber) {
      const [maxDay] = await connection.query(
        'SELECT COALESCE(MAX(day_number), 0) + 1 as next_day FROM roadmap_modules WHERE roadmap_id = ?',
        [roadmapId]
      );
      finalDayNumber = maxDay[0].next_day;
    }

    const [result] = await connection.query(`
      INSERT INTO roadmap_modules (roadmap_id, day_number, title, description, status)
      VALUES (?, ?, ?, ?, ?)
    `, [roadmapId, finalDayNumber, title, description, status || 'draft']);

    await connection.commit();

    res.status(201).json({ 
      success: true, 
      message: 'Module added successfully',
      data: { moduleId: result.insertId, dayNumber: finalDayNumber }
    });

  } catch (error) {
    await connection.rollback();
    console.error('Error adding module:', error);
    
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ 
        success: false, 
        message: 'A module with this day number already exists in this roadmap' 
      });
    }
    
    res.status(500).json({ success: false, message: 'Failed to add module' });
  } finally {
    connection.release();
  }
};

// Update module
export const updateModule = async (req, res) => {
  const connection = await db.getConnection();
  
  try {
    const { moduleId } = req.params;
    const { title, description, status } = req.body;

    await connection.beginTransaction();

    const updates = [];
    const values = [];

    if (title) {
      updates.push('title = ?');
      values.push(title);
    }
    if (description !== undefined) {
      updates.push('description = ?');
      values.push(description);
    }
    if (status) {
      updates.push('status = ?');
      values.push(status);
    }

    if (updates.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'No fields to update' 
      });
    }

    values.push(moduleId);

    await connection.query(`
      UPDATE roadmap_modules 
      SET ${updates.join(', ')}
      WHERE module_id = ?
    `, values);

    await connection.commit();

    res.status(200).json({ 
      success: true, 
      message: 'Module updated successfully' 
    });

  } catch (error) {
    await connection.rollback();
    console.error('Error updating module:', error);
    res.status(500).json({ success: false, message: 'Failed to update module' });
  } finally {
    connection.release();
  }
};

// Delete module
export const deleteModule = async (req, res) => {
  const connection = await db.getConnection();
  
  try {
    const { moduleId } = req.params;

    await connection.beginTransaction();

    // Delete module (resources and progress will cascade)
    await connection.query('DELETE FROM roadmap_modules WHERE module_id = ?', [moduleId]);

    await connection.commit();

    res.status(200).json({ 
      success: true, 
      message: 'Module deleted successfully' 
    });

  } catch (error) {
    await connection.rollback();
    console.error('Error deleting module:', error);
    res.status(500).json({ success: false, message: 'Failed to delete module' });
  } finally {
    connection.release();
  }
};

// Add resource to module
export const addResource = async (req, res) => {
  const connection = await db.getConnection();
  
  try {
    const { moduleId } = req.params;
    const { resourceName, resourceType, resourceUrl, filePath } = req.body;

    if (!resourceName || !resourceType) {
      return res.status(400).json({ 
        success: false, 
        message: 'Resource name and type are required' 
      });
    }

    await connection.beginTransaction();

    const [result] = await connection.query(`
      INSERT INTO module_resources (module_id, resource_name, resource_type, resource_url, file_path)
      VALUES (?, ?, ?, ?, ?)
    `, [moduleId, resourceName, resourceType, resourceUrl, filePath]);

    await connection.commit();

    res.status(201).json({ 
      success: true, 
      message: 'Resource added successfully',
      data: { resourceId: result.insertId }
    });

  } catch (error) {
    await connection.rollback();
    console.error('Error adding resource:', error);
    res.status(500).json({ success: false, message: 'Failed to add resource' });
  } finally {
    connection.release();
  }
};

// Delete resource
export const deleteResource = async (req, res) => {
  const connection = await db.getConnection();
  
  try {
    const { resourceId } = req.params;

    await connection.beginTransaction();

    await connection.query('DELETE FROM module_resources WHERE resource_id = ?', [resourceId]);

    await connection.commit();

    res.status(200).json({ 
      success: true, 
      message: 'Resource deleted successfully' 
    });

  } catch (error) {
    await connection.rollback();
    console.error('Error deleting resource:', error);
    res.status(500).json({ success: false, message: 'Failed to delete resource' });
  } finally {
    connection.release();
  }
};
