import express from 'express';
import multer from 'multer';
import { 
  getAllFaculties, 
  createFaculty, 
  updateFaculty, 
  deleteFaculty,
  getFacultyById,
  bulkUploadFaculties,
  getFacultyClasses
} from '../controllers/faculty.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

// Configure multer for Excel file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel'
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only Excel files are allowed'), false);
    }
  }
});

// All routes are protected
router.get('/', authenticate, getAllFaculties);
router.get('/my-classes', authenticate, getFacultyClasses);
router.get('/:userId', authenticate, getFacultyById);
router.post('/', authenticate, createFaculty);
router.post('/bulk-upload', authenticate, upload.single('file'), bulkUploadFaculties);
router.put('/:userId', authenticate, updateFaculty);
router.delete('/:userId', authenticate, deleteFaculty);

export default router;