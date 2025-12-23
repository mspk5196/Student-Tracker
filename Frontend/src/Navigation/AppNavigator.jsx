import { Routes, Route, Navigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";

import Login from "../pages/LoginPage/Login";
import AdminDashboard from "../pages/AdminPage/Dashboard";
import FacultyDashboard from "../pages/FacultyPage/FacultyDashboard";
import StudentDashboard from "../pages/StudentPage/Dashboard";
import Attendance from "../pages/AdminPage/Attendance";
const AppNavigator = () => {
  const user = useAuthStore((s) => s.user);

  // 🚨 NOT LOGGED IN → ONLY LOGIN
  if (!user) {
    return (
      <Routes>
        <Route path="*" element={<Login />} />
      </Routes>
    );
  }

  // ✅ LOGGED IN → ROLE DASHBOARD
  return (
    <Routes>
      <Route
        path="/"
        element={
          user.role === "ADMIN" ? (
            <AdminDashboard />
          ) : user.role === "FACULTY" ? (
            <FacultyDashboard />
          ) : (
            <StudentDashboard />
          )
        }
      />
   
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppNavigator;



// import { Routes, Route } from 'react-router-dom';
// import Login from '../pages/LoginPage/Login';
// import ProtectedRoute from '../components/ProtectedRoute';

// import StudentDashboard from '../pages/AdminPage/Dashboard';
// import FacultyDashboard from '../pages/AdminPage/Attendance';
// import AdminDashboard from '../pages/AdminPage/Dashboard';

// const AppNavigator = () => (
//   <Routes>
//     <Route path="/" element={<Login />} />

//     <Route
//       path="/student-dashboard"
//       element={
//         <ProtectedRoute roles={['STUDENT']}>
//           <StudentDashboard />
//         </ProtectedRoute>
//       }
//     />

//     <Route
//       path="/faculty-dashboard"
//       element={
//         <ProtectedRoute roles={['FACULTY']}>
//           <FacultyDashboard />
//         </ProtectedRoute>
//       }
//     />

//     <Route
//       path="/admin-dashboard"
//       element={
//         <ProtectedRoute roles={['ADMIN']}>
//           <AdminDashboard />
//         </ProtectedRoute>
//       }
//     />
//   </Routes>
// );

// export default AppNavigator;
