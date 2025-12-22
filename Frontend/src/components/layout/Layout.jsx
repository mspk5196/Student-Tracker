import React from 'react';
import { Outlet } from 'react-router-dom';
import FacultyTab from '../TabRouter/FacultyTab/FacultyTab';

const Layout = () => {
  return (
    <div className="layout-grid">
      <FacultyTab />
      <main className="main-content">
        <div className="animate-fade-in">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
