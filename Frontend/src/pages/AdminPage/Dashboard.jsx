import React from 'react';
import { useApp } from '../../context/AppContext';
import { Users, BookOpen, Clock, Activity } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="glass-panel p-6" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
    <div>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>{title}</p>
      <h3 style={{ fontSize: '1.875rem', fontWeight: 'bold' }}>{value}</h3>
    </div>
    <div style={{ 
      width: '3rem', height: '3rem', borderRadius: '50%', 
      background: `${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: color
    }}>
      <Icon size={24} />
    </div>
  </div>
);

const Dashboard = () => {
  const { classes, students, tasks } = useApp();

  return (
    <div>
      <header style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Dashboard Overview</h2>
        <p style={{ color: 'var(--text-muted)' }}>Welcome back, Faculty. Here's what's happening today.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <StatCard title="Total Classes" value={classes.length} icon={BookOpen} color="#8b5cf6" />
        <StatCard title="Active Students" value={students.length} icon={Users} color="#ec4899" />
        <StatCard title="Pending Tasks" value={tasks.length} icon={Clock} color="#f59e0b" />
        <StatCard title="Avg. Attendance" value="87%" icon={Activity} color="#10b981" />
      </div>

      <div className="glass-panel" style={{ padding: '2rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Recent Activity</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {tasks.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No recent activity.</p>}
          {tasks.slice(0, 5).map(task => (
             <div key={task.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '0.5rem' }}>
               <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#8b5cf6' }}></div>
               <div>
                 <p style={{ fontWeight: 500 }}>New Task Added: {task.title}</p>
                 <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{new Date(task.createdAt).toLocaleDateString()}</p>
               </div>
             </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
