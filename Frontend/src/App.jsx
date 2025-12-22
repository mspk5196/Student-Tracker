import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Context Provider
import { AppProvider } from './context/AppContext';

// Layout Component
import Layout from './components/layout/Layout';

// Page Components
import Dashboard from './pages/Dashboard';
import Classes from './pages/Classes';
import Tasks from './pages/Tasks';
import Attendance from './pages/Attendance';
import Skills from './pages/Skills';

/**
 * Main Application Component
 * Handles routing and provides global context
 */
function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          {/* Main Layout with Sidebar */}
          <Route path="/" element={<Layout />}>
            {/* Dashboard - Default Route */}
            <Route index element={<Dashboard />} />

            {/* Classes Management */}
            <Route path="classes" element={<Classes />} />

            {/* Task Management */}
            <Route path="tasks" element={<Tasks />} />

            {/* Attendance Tracking */}
            <Route path="attendance" element={<Attendance />} />

            {/* Skill Tracking */}
            <Route path="skills" element={<Skills />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
