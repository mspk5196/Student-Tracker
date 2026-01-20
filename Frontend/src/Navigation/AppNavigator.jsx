

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
import ClassDetails from "../pages/SuperAdmin/Classes&Groups/ClassDetails/ClassDetails";
//Super Admin -> Reports & Analytics
import ReportsAnalytics from "../pages/SuperAdmin/Reports&Analytics/Reporst&analytics";
//Super Admin -> Students
import StudentHeader from "../pages/SuperAdmin/studentsPage/studentHeader/StudentHeader";
import StudentPage from "../pages/SuperAdmin/studentsPage/AllStudents/studentsPage";
//Super Admin -> Task & Assignments
import TaskHeader from "../pages/SuperAdmin/Task&Assignments/TaskHeader/TaskHeader";
//Super Admin -> Skill Reports
import AdminSkillReport from "../pages/SuperAdmin/SkillReports/AdminSkillReport";
//Super Admin -> Group Insights
import GroupInsights from "../pages/SuperAdmin/GroupInsights/GroupInsights";

// Faculty Pages
import ClassHeader from "../pages/Faculty/Class&Group/ClassHeader/ClassHeader";
import MyClasses from "../pages/Faculty/Class&Group/MyClasses/MyClasses";
import AllClasses from "../pages/Faculty/Class&Group/AllClasses/AllClasses";
import FacultyClassDetails from "../pages/Faculty/Class&Group/ClassDetails/ClassDetails";
import StudentsPage from "../pages/SuperAdmin/studentsPage/AllStudents/studentsPage";
import Reports from "../pages/SuperAdmin/Reports&Analytics/Reporst&analytics";
//Faculty -> Skill Reports
import FacultySkillReport from "../pages/Faculty/SkillReports/FacultySkillReport";

// Student Pages
import StudentDashboard from "../pages/Student/Dashboard/StudentDashboard";
import MyClassRoom from "../pages/Student/MyClassRoom/MyClassRoom";
import StudentAttendance from "../pages/Student/StudentAttendance/Attendance";
import TasksAssignments from "../pages/Student/Tasks&Assignments/Tasks&Assignment"
import StudentRoadmap from "../pages/Student/RoadMap&Material/RoadMap&Material";

import Performance from "../pages/Student/Performance/Performance";
const AppNavigator = () => {
  const user = useAuthStore((s) => s.user);

  return (
    <BrowserRouter basename="/pbl/">
      <Routes>
        {/* COMMON */}
        <Route path="/login" element={<Login />} />

        {/* Not logged in → only login */}
        {! user && <Route path="*" element={<Navigate to="/login" replace />} />}

        {/* ADMIN (role === "admin") */}
        {user?.role === "admin" && (
          <Route path="/" element={<SideTab />}>
            <Route index element={<AdminDashboard />} />
            <Route path="faculty" element={<FacultyAccounts />} />
            <Route path="classes">
              <Route index element={<GroupsClasses />} />
              <Route path=":venueId" element={<ClassDetails />} />
            </Route>
            <Route path="students">
              <Route index element={<StudentsPage />} />
              <Route path=":studentId" element={<StudentHeader />} />
            </Route>
            <Route path="attendance" element={<Attendance />} />
            <Route path="tasks" element={<TaskHeader />} />  {/* ✅ Already correct */}
            <Route path="skill-reports" element={<AdminSkillReport />} />  {/* ✅ Skill Reports */}
            <Route path="group-insights" element={<GroupInsights />} /> {/* ✅ Group Insights */}
            <Route path="reports" element={<ReportsAnalytics />} />  {/* ✅ Already correct */}
          </Route>
        )}

        {/* FACULTY (role === "faculty") */}
        {user?.role === "faculty" && (
          <Route path="/" element={<SideTab />}>
            {/* <Route index element={<FacultyDashboard />} /> */}
            <Route path="classes" element={<FacultyClassDetails />} />
            <Route path="classes/:venueId" element={<FacultyClassDetails />} />
            <Route path="students">
              <Route index element={<StudentsPage />} />
              <Route path=":studentId" element={<StudentHeader />} />
            </Route>
            <Route path="attendance" element={<Attendance />} />
            {/* <Route path="skill-reports" element={<FacultySkillReport />} />  ✅ Skill Reports */}
            <Route path="group-insights" element={<GroupInsights />} />  {/* ✅ Group Insights for Faculty */}
            <Route path="tasks" element={<TaskHeader />} />  {/* ✅ Already correct */}
            {/* <Route path="students" element={<div>Students</div>} /> */}
            <Route path="reports" element={<Reports />} />  {/* ✅ Faculty can also access reports */}
          </Route>
        )}

        {/* STUDENT (role === "student") */}
        {user?.role === "student" && (
          <Route path="/" element={<SideTab />}>
            {/* <Route index element={<StudentDashboard/>} /> */}
            <Route path="classes" element={<MyClassRoom />}/>
            <Route path="attendance" element={<StudentAttendance />}/>
            <Route path="/" element={<StudentRoadmap />}/>
            <Route path="tasks" element={<TasksAssignments />} />
            {/* <Route path="performance" element={<Performance />} /> */}
          </Route>
        )}

        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppNavigator;