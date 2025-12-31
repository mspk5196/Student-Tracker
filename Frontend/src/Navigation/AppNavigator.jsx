// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import useAuthStore from "../store/useAuthStore";

// // Layout
// import SideTab from "../components/TabRouter/SideTab";

// // Pages
// import Login from "../pages/LoginPage/Login";

// // Super Admin Pages
// import AdminDashboard from "../pages/SuperAdmin/DashboardPanal/Dashboard";
// import FacultyAccounts from "../pages/SuperAdmin/Faculty&Accounts/Faculty&Accounts";
// import Attendance from "../pages/SuperAdmin/AttendancePage/Attendance";
// import GroupsClasses from "../pages/SuperAdmin/Classes&Groups/Classes&Groups";
// import ReportsAnalytics from "../pages/SuperAdmin/Reports&Analytics/Reporst&analytics";
// import StudentHeader from "../pages/SuperAdmin/studentsPage/studentHeader/StudentHeader";
// import StudentPage from "../pages/SuperAdmin/studentsPage/AllStudents/studentsPage";
// import TaskHeader from "../pages/SuperAdmin/Task&Assignments/TaskHeader/TaskHeader";

// import FacultyDashboard from '../pages/Faculty/DashboardPanal/Dashboard'
// import ClassHeader from "../pages/Faculty/Class&Group/ClassHeader/ClassHeader"
// // import MyClasses from "../pages/Faculty/Class&Group/MyClasses/MyClasses"
// // import AllClasses from "../pages/Faculty/Class&Group/AllClasses/AllClasses"

// // Faculty Pages
// // import FacultyDashboard from "../pages/Faculty/DashboardPanal/Dashboard";
// //Faculty -> Classes & Groups
// // import ClassHeader from "../pages/Faculty/Class&Group/ClassHeader/ClassHeader";
// import MyClasses from "../pages/Faculty/Class&Group/MyClasses/MyClasses";
// import AllClasses from "../pages/Faculty/Class&Group/AllClasses/AllClasses";
// import StudentsPage from "../pages/SuperAdmin/studentsPage/AllStudents/studentsPage";
// //Faculty -> Reports & Analytics
// import Reports from "../pages/Faculty/Reports&Analytics/Reporst&analytics";


// const AppNavigator = () => {
//   const user = useAuthStore((s) => s.user);

//   return (
//     <BrowserRouter>
//       <Routes>
//         {/* COMMON */}
//         <Route path="/login" element={<Login />} />

//         {/* Not logged in → only login */}
//         {!user && <Route path="*" element={<Navigate to="/login" replace />} />}

//         {/* ADMIN (role === 1) */}
//         {user?.role === "admin" && (
//           <Route path="/" element={<SideTab />}>
//             <Route index element={<AdminDashboard />} />
//             <Route path="faculty" element={<FacultyAccounts />} />
//             <Route path="classes" element={<GroupsClasses />} />
//             <Route path="students">
//               <Route index element={<StudentsPage />} />
//               <Route path=":studentId" element={<StudentHeader />} />
//             </Route>
//             <Route path="attendance" element={<Attendance />} />
//             <Route path="tasks" element={<TaskHeader/>} />
//             <Route path="reports" element={<ReportsAnalytics />} />
//             <Route path="settings" element={<div>Settings</div>} />
//           </Route>
//         )}

//         {/* FACULTY (role === 2) */}
//         {user?.role === "faculty" && (
//           <Route path="/" element={<SideTab />}>
//             <Route index element={<FacultyDashboard />} />
//             <Route path="classes" element={<ClassHeader />}>
//               <Route index element={<MyClasses />} />
//               <Route path="all" element={<AllClasses />} />
//             </Route>
//             <Route path="attendance" element={<Attendance />} />
//             <Route path="tasks" element={<TaskHeader />} />
//             <Route path="students" element={<div>Students</div>} />
//             <Route path="reports" element={<Reports />} />
//             <Route path="settings" element={<div>Settings</div>} />
//           </Route>
//         )}

//         {/* STUDENT (role === 3) */}
//         {user?.role === "student" && (
//           <Route path="/" element={<SideTab />}>
//             <Route index element={<div>Student Dashboard</div>} />
//             <Route path="classes" element={<div>My Classes</div>} />
//             <Route path="attendance" element={<div>My Attendance</div>} />
//             <Route path="tasks" element={<div>My Tasks</div>} />
//           </Route>
//         )}

//         {/* Catch all - redirect to home */}
//         <Route path="*" element={<Navigate to="/" replace />} />
//       </Routes>
//     </BrowserRouter>
//   );
// };

// export default AppNavigator;


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
import TaskHeader from "../pages/SuperAdmin/Task&Assignments/TaskHeader/TaskHeader";

// Faculty Pages
import FacultyDashboard from '../pages/Faculty/DashboardPanal/Dashboard';
import ClassHeader from "../pages/Faculty/Class&Group/ClassHeader/ClassHeader";
import MyClasses from "../pages/Faculty/Class&Group/MyClasses/MyClasses";
import AllClasses from "../pages/Faculty/Class&Group/AllClasses/AllClasses";
import StudentsPage from "../pages/SuperAdmin/studentsPage/AllStudents/studentsPage";
import Reports from "../pages/Faculty/Reports&Analytics/Reporst&analytics";
import ClassDetails from "../pages/SuperAdmin/Classes&Groups/ClassDetails/ClassDetails";


const AppNavigator = () => {
  const user = useAuthStore((s) => s.user);

  return (
    <BrowserRouter>
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
            <Route path="classes" element={<GroupsClasses />} />  {/* change to  GroupsClasses */}
            <Route path="students">
              <Route index element={<StudentsPage />} />
              <Route path=":studentId" element={<StudentHeader />} />
            </Route>
            <Route path="attendance" element={<Attendance />} />
            <Route path="tasks" element={<TaskHeader />} />  {/* ✅ Already correct */}
            <Route path="reports" element={<ReportsAnalytics />} />  {/* ✅ Already correct */}
            <Route path="settings" element={<div>Settings</div>} />
          </Route>
        )}

        {/* FACULTY (role === "faculty") */}
        {user?.role === "faculty" && (
          <Route path="/" element={<SideTab />}>
            <Route index element={<FacultyDashboard />} />
            <Route path="students">
              <Route index element={<StudentsPage />} />
              <Route path=":studentId" element={<StudentHeader />} />
            </Route>
            <Route path="classes" element={<ClassHeader />}>
              <Route index element={<MyClasses />} />
              <Route path="all" element={<AllClasses />} />
            </Route>
            <Route path="attendance" element={<Attendance />} />
            <Route path="tasks" element={<TaskHeader />} />  {/* ✅ Already correct */}
            <Route path="students" element={<div>Students</div>} />
            <Route path="reports" element={<Reports />} />  {/* ✅ Faculty can also access reports */}
            <Route path="settings" element={<div>Settings</div>} />
          </Route>
        )}

        {/* STUDENT (role === "student") */}
        {user?.role === "student" && (
          <Route path="/" element={<SideTab />}>
            <Route index element={<div style={{padding: '40px'}}>Student Dashboard</div>} />
            <Route path="classes" element={<div style={{padding: '40px'}}>My Classes</div>} />
            <Route path="attendance" element={<div style={{padding: '40px'}}>My Attendance</div>} />
            <Route path="tasks" element={<div style={{padding: '40px'}}>My Tasks</div>} />
          </Route>
        )}

        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppNavigator;