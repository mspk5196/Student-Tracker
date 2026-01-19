import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.routes.js";
import facultyRoutes from "./routes/faculty.routes.js";
import studentRoutes from "./routes/student.routes.js";
import attendanceRoutes from "./routes/attendance.routes.js";
import groupsRoutes from "./routes/groups.routes.js";
import tasksRoutes from "./routes/tasks.routes.js";
import roadmapRoutes from "./routes/roadmap.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import skillReportRoutes from "./routes/skillReportRoutes.js";
// import facultyDashboardRoutes from './routes/facultyDashboardRoutes.js';
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Optional API prefix (e.g. "/pbl" in production)
const API_PREFIX = process.env.API_PREFIX || '';

// Serve uploaded files statically
app.use(`${API_PREFIX}/api/uploads`, express.static(path.join(__dirname, 'uploads')));

app.use(`${API_PREFIX}/api/auth`, authRoutes);
app.use(`${API_PREFIX}/api/faculty`, facultyRoutes);
app.use(`${API_PREFIX}/api/students`, studentRoutes);
app.use(`${API_PREFIX}/api/attendance`, attendanceRoutes);
app.use(`${API_PREFIX}/api/groups`, groupsRoutes);
app.use(`${API_PREFIX}/api/tasks`, tasksRoutes);
 app.use(`${API_PREFIX}/api/roadmap`, roadmapRoutes);
app.use(`${API_PREFIX}/api/dashboard`, dashboardRoutes);
app.use(`${API_PREFIX}/api/skill-reports`, skillReportRoutes);
// app.use('/api/faculty/dashboard', facultyDashboardRoutes); 
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));