import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";

// Layout
import SideTab from "../components/TabRouter/SideTab";

// Pages
import Login from "../pages/LoginPage/Login";


// Super Admin Pages
//Super Admin -> Dashboard
import AdminDashboard from "../pages/SuperAdmin/DashboardPanal/Dashboard";
//Super Admin -> Faculty & Accounts
import FacultyAccounts from "../pages/SuperAdmin/Faculty&Accounts/Faculty&Accounts";
//Super Admin -> Attendance
import Attendance from "../pages/SuperAdmin/AttendancePage/Attendance";
//Super Admin -> Classes & Groups
import GroupsClasses from "../pages/SuperAdmin/Classes&Groups/Classes&Groups";
//Super Admin -> Reports & Analytics
import ReportsAnalytics from "../pages/SuperAdmin/Reports&Analytics/Reporst&analytics";
//Super Admin -> Students
import StudentHeader from "../pages/SuperAdmin/studentsPage/studentHeader/StudentHeader";
import StudentPage from "../pages/SuperAdmin/studentsPage/AllStudents/studentsPage";
//Super Admin -> Task & Assignments
import AdminTaskHeader from "../pages/SuperAdmin/Task&Assignments/TaskHeader/TaskHeader";

//Faculty Page
// Faculty -> Dashboard
import FacultyDashboard from '../pages/Faculty/DashboardPanal/Dashboard'
//Faculty -> Classes & Groups
import ClassHeader from "../pages/Faculty/Class&Group/ClassHeader/ClassHeader";
import MyClasses from "../pages/Faculty/Class&Group/MyClasses/MyClasses";
import AllClasses from "../pages/Faculty/Class&Group/AllClasses/AllClasses";
import StudentsPage from "../pages/SuperAdmin/studentsPage/AllStudents/studentsPage";

//Faculty -> Task & Assignments
import FacultyTaskHeader from "../pages/Faculty/Task&Assignments/TaskHeader/TaskHeader";
//Faculty -> Reports & Analytics
import Reports from "../pages/Faculty/Reports&Analytics/Reporst&analytics";
import ClassDetails from "../pages/SuperAdmin/Classes&Groups/ClassDetails/ClassDetails";

//Student Page
// Student -> Dashboard
import StudentDashboard from "../pages/Student/Dashboard/StudentDashboard";
//Student -> RoadMap & Material
import StudentRoadmap from "../pages/Student/RoadMap&Material/RoadMap&Material";
//Student -> Tasks & Assignments
import TasksAssignments from "../pages/Student/Tasks&Assignments/Tasks&Assignment";
//Student -> Attendance
import StudentAttendance from "../pages/Student/StudentAttendance/Attendance";
//Student -> My Classroom
import MyClassRoom from "../pages/Student/MyClassRoom/MyClassRoom";


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
            <Route index element={<AdminDashboard />} />
            <Route path="faculty" element={<FacultyAccounts />} />
            <Route path="classes" element={<ClassDetails />} />  {/* change to  GroupsClasses */}
            <Route path="students">
              <Route index element={<StudentsPage />} />
              <Route path=":studentId" element={<StudentHeader />} />
            </Route>
            <Route path="attendance" element={<Attendance />} />
            <Route path="tasks" element={<AdminTaskHeader />} />
            <Route path="reports" element={<ReportsAnalytics />} />
            <Route path="settings" element={<div>Settings</div>} />
          </Route>
        )}

        {/* FACULTY (role === 2) */}
        {user?.role === "faculty" && (
          <Route path="/" element={<SideTab />}>
            <Route index element={<FacultyDashboard />} />
            <Route path="classes" element={<ClassHeader />}>
              <Route index element={<MyClasses />} />
              <Route path="all" element={<AllClasses />} />
            </Route>
            <Route path="attendance" element={<FacultyAttendance />} />
            <Route path="tasks" element={<FacultyTaskHeader />} />
            <Route path="students" element={<div>Students</div>} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<div>Settings</div>} />
          </Route>
        )}

        {/* STUDENT (role === 3) */}
        {user?.role === "student" && (
          <Route path="/" element={<SideTab />}>
            <Route index element={<StudentDashboard />} />
            <Route path="classroom" element={<MyClassRoom />} />
            <Route path="roadmap" element={<StudentRoadmap />} />
            <Route path="tasks" element={<TasksAssignments />} />
            <Route path="attendance" element={<StudentAttendance />} />
            <Route path="performance" element={<div>Performance</div>} />
          </Route>
        )}

        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppNavigator;