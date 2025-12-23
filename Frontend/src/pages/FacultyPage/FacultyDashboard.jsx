// import { Users, BookOpen, Clock, Activity } from "lucide-react";

// const StatCard = ({ title, value, icon: Icon }) => (
//   <div style={{ padding: 24, background: "#fff", borderRadius: 12 }}>
//     <p>{title}</p>
//     <h2>{value}</h2>
//     <Icon />
//   </div>
// );

// const FacultyDashboard = () => {
//   return (
//     <>
//       <h1>Faculty Dashboard</h1>
//       <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(4,1fr)" }}>
//         <StatCard title="Classes" value={5} icon={BookOpen} />
//         <StatCard title="Students" value={120} icon={Users} />
//         <StatCard title="Tasks" value={7} icon={Clock} />
//         <StatCard title="Attendance" value="87%" icon={Activity} />
//       </div>
//     </>
//   );
// };

// export default FacultyDashboard;

import React from "react";
import SideTab from "../../components/TabRouter/SideTab";
import { Users, BookOpen, Clock } from "lucide-react";

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="glass-panel p-6 flex justify-between items-center">
    <div>
      <p className="text-sm text-muted">{title}</p>
      <h3 className="text-3xl font-bold">{value}</h3>
    </div>
    <Icon size={28} color={color} />
  </div>
);

const FacultyDashboard = () => {
  const myClasses = [1, 2];
  const students = [1, 2, 3, 4];
  const tasks = [1, 2];

  return (
    <div className="flex min-h-screen">
      <SideTab />

      <main className="flex-1 p-8">
        <h2 className="text-3xl font-bold mb-2">Faculty Dashboard</h2>
        <p className="text-muted mb-8">
          Track your classes and students.
        </p>

        <div className="grid grid-cols-auto-fit gap-6 mb-8">
          <StatCard title="My Classes" value={myClasses.length} icon={BookOpen} color="#6366f1" />
          <StatCard title="Students" value={students.length} icon={Users} color="#22c55e" />
          <StatCard title="Pending Tasks" value={tasks.length} icon={Clock} color="#f97316" />
        </div>
      </main>
    </div>
  );
};

export default FacultyDashboard;
