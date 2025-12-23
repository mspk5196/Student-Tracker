// import React from 'react';
// import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// import SuperAdminTab from './components/TabRouter/SuperAdminTab/SuperAdminTab';
// import EducationDashboard from './pages/SuperAdmin/DashboardPanal/Dashboard';
// import FacultyAccounts from './pages/SuperAdmin/Faculty&Accounts/Faculty&Accounts';

// import { BrowserRouter } from "react-router-dom";
// import useAuthStore from "./store/useAuthStore";

// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<SuperAdminTab />}>
//           <Route index element={<EducationDashboard />} />
//           <Route path="dashboard" element={<Navigate to="/" replace />} />
//           <Route path="faculty" element={<FacultyAccounts />} />
//           <Route path="classes" element={<div className="p-8">Classes & Groups Component Placeholder</div>} />
//           <Route path="students" element={<div className="p-8">Students Component Placeholder</div>} />
//           <Route path="attendance" element={<div className="p-8">Attendance Component Placeholder</div>} />
//           <Route path="tasks" element={<div className="p-8">Tasks & Assignments Component Placeholder</div>} />
//           <Route path="reports" element={<div className="p-8">Reports & Analytics Component Placeholder</div>} />
//           <Route path="settings" element={<div className="p-8">Settings Component Placeholder</div>} />
//         </Route>
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;


// App.jsx
import AppNavigator from "./Navigation/AppNavigator";

function App() {
  return <AppNavigator />;
}

export default App;
