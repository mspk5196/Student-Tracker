import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";

// Layout
import SideTab from "../components/TabRouter/SideTab";

// Pages
import Login from "../pages/LoginPage/Login";
import EducationDashboard from "../pages/SuperAdmin/DashboardPanal/Dashboard";
import FacultyAccounts from "../pages/SuperAdmin/Faculty&Accounts/Faculty&Accounts";
import Attendance from "../pages/SuperAdmin/AttendancePage/Attendance";
import GroupsClasses from "../pages/SuperAdmin/Classes&Groups/Classes&Groups"
import StudentsPage from "../pages/SuperAdmin/studentsPage/studentsPage";
import StudyRoadmap from "../pages/SuperAdmin/Task&Assignments/Study-Road-Map/RoadMap";
import ReportsAnalytics from "../pages/SuperAdmin/Reports&Analytics/Reporst&analytics";
const AppNavigator = () => {
  const user = useAuthStore((s) => s.user);

  return (
    <BrowserRouter>
      <Routes>
        {/* COMMON */}
        <Route path="/login" element={<Login />} />

        {/* Not logged in → only login */}
        {!user && <Route path="*" element={<Navigate to="/login" replace />} />}

        {/* ADMIN (role === 1) */}
        {user?.role === "admin" && (
          <Route path="/" element={<SideTab />}>
            <Route index element={<EducationDashboard />} />
            <Route path="faculty" element={<FacultyAccounts />} />
            <Route path="classes" element={<GroupsClasses />} />
            <Route path="students" element={<StudentsPage />} />
            <Route path="attendance" element={<Attendance />} />
            <Route path="tasks" element={<StudyRoadmap />} />
            <Route path="reports" element={<ReportsAnalytics />} />
            <Route path="settings" element={<div>Settings</div>} />
          </Route>
        )}

        {/* FACULTY (role === 2) */}
        {user?.role === "faculty" && (
          <Route path="/" element={<SideTab />}>
            <Route index element={<div>Faculty Dashboard</div>} />
            <Route path="classes" element={<div>My Classes</div>} />
            <Route path="attendance" element={<div>Attendance</div>} />
            <Route path="tasks" element={<div>Assignments</div>} />
          </Route>
        )}

        {/* STUDENT (role === 3) */}
        {user?.role === "student" && (
          <Route path="/" element={<SideTab />}>
            <Route index element={<div>Student Dashboard</div>} />
            <Route path="classes" element={<div>My Classes</div>} />
            <Route path="attendance" element={<div>My Attendance</div>} />
            <Route path="tasks" element={<div>My Tasks</div>} />
          </Route>
        )}
      </Routes>
    </BrowserRouter>
  );
};

export default AppNavigator;