import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.routes.js';
import facultyRoutes from './routes/faculty.routes.js';
import studentRoutes from './routes/student.routes.js';
import attendanceRoutes from './routes/attendance.routes.js'; 
 import groupsRoutes from './routes/groups.routes.js';
 import tasksRoutes from './routes/tasks.routes.js';
 import roadmapRoutes from './routes/roadmap.routes.js'; 
import dashboardRoutes from './routes/dashboard.routes.js';
// import facultyDashboardRoutes from './routes/facultyDashboardRoutes.js';
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Serve uploaded files statically
app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/faculty', facultyRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/groups', groupsRoutes);
app.use('/api/tasks', tasksRoutes);
 app.use('/api/roadmap', roadmapRoutes);
app.use('/api/dashboard', dashboardRoutes);
// app.use('/api/faculty/dashboard', facultyDashboardRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT,'0.0.0.0', () => console.log(`Server running on ${PORT}`));