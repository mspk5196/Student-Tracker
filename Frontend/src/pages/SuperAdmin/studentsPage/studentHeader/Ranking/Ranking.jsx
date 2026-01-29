  import React, { useState, useEffect } from 'react';
import { apiGet } from '../../../../../utils/api';

  const PSDashboard = ({ studentId }) => {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  const [skillReports, setSkillReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 992);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (studentId) {
      fetchSkillCompletionStatus();
    }
  }, [studentId]);

  const fetchSkillCompletionStatus = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiGet(`/students/${studentId}/skill-progress`);
      const data = await response.json();
      
      if (data.success) {
        setSkillReports(data.data.skills || []);
      } else {
        setError('Failed to load skill progress');
      }
    } catch (err) {
      console.error('Error fetching skill completion status:', err);
      setError('Failed to load skill progress');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px', color: '#6B7280' }}>
        Loading skill completion status...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px', color: '#991b1b' }}>
        {error}
      </div>
    );
  }

  const styles = {
    container: {
      fontFamily: 'Inter, system-ui, sans-serif',
      backgroundColor: '#f3f4f6',
      padding: isMobile ? '15px' : '24px',
      minHeight: '100vh',
    },
    header: {
      marginBottom: '28px',
    },
    title: {
      fontSize: isMobile ? '20px' : '26px',
      fontWeight: '700',
      color: '#111827',
      margin: '0 0 8px 0',
    },
    subtitle: {
      fontSize: '14px',
      color: '#6b7280',
      margin: 0,
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: isMobile 
        ? '1fr' 
        : 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '24px',
      maxWidth: '1400px',
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '0',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      border: '1px solid #e5e7eb',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      overflow: 'hidden',
      height: '320px',
      display: 'flex',
      flexDirection: 'column',
    },
    imageContainer: {
      width: '100%',
      height: '160px',
      overflow: 'hidden',
      backgroundColor: '#f3f4f6',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    cardContent: {
      padding: '20px',
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
    },
    skillName: {
      fontSize: '16px',
      fontWeight: '700',
      color: '#111827',
      margin: '0 0 12px 0',
      lineHeight: '1.4',
    },
    skillMeta: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      fontSize: '12px',
      color: '#6b7280',
      marginBottom: '16px',
    },
    levelsBadge: {
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      fontSize: '12px',
      fontWeight: '500',
    },
    categoryBadge: {
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      fontSize: '12px',
      fontWeight: '500',
    },
    progressSection: {
      marginTop: 'auto',
    },
    segmentedProgressBar: {
      display: 'flex',
      gap: '4px',
      marginBottom: '10px',
    },
    progressSegment: (isCompleted) => ({
      flex: 1,
      height: '8px',
      backgroundColor: isCompleted ? '#7c3aed' : '#e5e7eb',
      borderRadius: '4px',
      transition: 'background-color 0.3s ease',
    }),
    progressText: {
      fontSize: '12px',
      color: '#6b7280',
      textAlign: 'center',
      fontWeight: '500',
    },
    emptyState: {
      textAlign: 'center',
      padding: '60px 20px',
      color: '#9ca3af',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>PS Dashboard</h1>
        <p style={styles.subtitle}>Track your progress across all skills</p>
      </div>

      {skillReports.length === 0 ? (
        <div style={styles.emptyState}>
          <p style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 8px 0' }}>No Skills Found</p>
          <p style={{ fontSize: '14px', margin: 0 }}>You haven't attempted any skills yet.</p>
        </div>
      ) : (
        <div style={styles.grid}>
          {skillReports.map((skill, index) => {
            // Create array of segments based on total levels
            const segments = Array.from({ length: skill.totalLevels }, (_, i) => i < skill.completedLevels);
            
            return (
              <div
                key={index}
                style={styles.card}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {/* Image placeholder with gradient */}
                <div style={{
                  ...styles.imageContainer,
                  background: `linear-gradient(135deg, ${getGradientColors(index)})`,
                }}>
                  <div style={{
                    fontSize: '48px',
                    fontWeight: '700',
                    color: 'white',
                    opacity: 0.3,
                  }}>
                    {skill.name.charAt(0)}
                  </div>
                </div>

                <div style={styles.cardContent}>
                  <h3 style={styles.skillName}>{skill.name}</h3>
                  
                  <div style={styles.skillMeta}>
                    <div style={styles.levelsBadge}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      </svg>
                      <span>Levels: {skill.totalLevels}</span>
                    </div>
                    
                    <div style={styles.categoryBadge}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                      </svg>
                      <span>{skill.category}</span>
                    </div>
                  </div>

                  <div style={styles.progressSection}>
                    {/* Segmented progress bar */}
                    <div style={styles.segmentedProgressBar}>
                      {segments.map((isCompleted, segIndex) => (
                        <div 
                          key={segIndex} 
                          style={styles.progressSegment(isCompleted)}
                        />
                      ))}
                    </div>
                    
                    <p style={styles.progressText}>
                      Progress: {skill.completedLevels}/{skill.totalLevels} levels ({skill.progressPercentage}%)
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// Helper function to generate gradient colors
const getGradientColors = (index) => {
  const gradients = [
    '#60a5fa, #3b82f6', // Blue
    '#06b6d4, #0891b2', // Cyan
    '#14b8a6, #0d9488', // Teal
    '#a855f7, #9333ea', // Purple
    '#f59e0b, #d97706', // Amber
    '#10b981, #059669', // Green
    '#ec4899, #db2777', // Pink
    '#8b5cf6, #7c3aed', // Violet
  ];
  return gradients[index % gradients.length];
};

export default PSDashboard;