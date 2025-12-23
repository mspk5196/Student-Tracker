import React from "react";
import SideTab from "../../components/TabRouter/SideTab";
import { BookOpen, Clock, Activity } from "lucide-react";

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="glass-panel p-6 flex justify-between items-center">
    <div>
      <p className="text-sm text-muted">{title}</p>
      <h3 className="text-3xl font-bold">{value}</h3>
    </div>
    <Icon size={28} color={color} />
  </div>
);

const StudentDashboard = () => {
  const enrolledCourses = 5;
  const assignments = 3;
  const attendance = "89%";

  return (
    <div className="flex min-h-screen">
      <SideTab />

      <main className="flex-1 p-8">
        <h2 className="text-3xl font-bold mb-2">Student Dashboard</h2>
        <p className="text-muted mb-8">
          Your academic overview.
        </p>

        <div className="grid grid-cols-auto-fit gap-6 mb-8">
          <StatCard title="Courses" value={enrolledCourses} icon={BookOpen} color="#3b82f6" />
          <StatCard title="Assignments Due" value={assignments} icon={Clock} color="#ef4444" />
          <StatCard title="Attendance" value={attendance} icon={Activity} color="#10b981" />
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;
