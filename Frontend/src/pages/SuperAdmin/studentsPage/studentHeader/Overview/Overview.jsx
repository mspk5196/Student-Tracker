import React, { useState, useEffect } from 'react';

// Student Data JSON
const studentData = {
  name: "Emma Watson",
  email: "emma.watson@uni.edu",
  phone: "+1 (555) 123-4567",
  dateOfBirth: "April 15, 2002",
  enrollmentDate: "Sept 01, 2021",
  advisor: "Dr. Alan Grant",
  currentSemester: 3,
  profilePic: "", // Empty to show initial
  
  overview: {
    overallAttendance: 94,
    classAverage: 88,
    taskCompletion: 85,
    tasksSubmitted: "12/14",
    cgpa: 3.8,
    cgpaRank: "Top 5% of Class"
  },
  
  skills: [
    { name: "Data Structures", rating: 84 },
    { name: "Python Programming", rating: 94 },
    { name: "SQL & Databases", rating: 84 },
    { name: "Web Development", rating: 84 },
    { name: "Research Methodology", rating: 82 },
    { name: "Team Leadership", rating: 84 }
  ],
  
  weeklyActivity: [
    { day: "Mon", value: 65 },
    { day: "Tue", value: 78 },
    { day: "Wed", value: 72 },
    { day: "Thu", value: 85 },
    { day: "Fri", value: 68 },
    { day: "Sat", value: 92 },
    { day: "Sun", value: 95 }
  ],
  
  taskStatus: {
    completed: 8,
    inProgress: 4,
    total: 14
  },
  
  performance: [
    { subject: "DSA", individual: 92, average: 75 },
    { subject: "Web", individual: 88, average: 78 },
    { subject: "SQL", individual: 95, average: 82 },
    { subject: "Math", individual: 78, average: 85 },
    { subject: "Algo", individual: 85, average: 72 },
    { subject: "Python", individual: 94, average: 80 },
    { subject: "Algo", individual: 88, average: 78 },
    { subject: "Lead", individual: 96, average: 85 }
  ],
  
  credits: {
    earned: 18,
    total: 20
  },
  
  semesterGPA: 3.92,
  
  standing: "Dean's List",
  
  nextWorkshop: {
    title: "Advanced React Patterns",
    date: "Room 204 • Tomorrow, 10 AM"
  }
};


const Overview = () => {
  const [toggleTab, setToggleTab] = useState(0);
  const [skillsExpanded, setSkillsExpanded] = useState(false);
  const [showWeekModal, setShowWeekModal] = useState(false);
  const [animated, setAnimated] = useState(false);
  const [currentWeek, setCurrentWeek] = useState(0);

  useEffect(() => {
    setAnimated(true);
  }, []);

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('');
  };

  const toRoman = (num) => {
    const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'];
    return romanNumerals[num - 1] || num;
  };

  const completionPercentage = (studentData.taskStatus.completed / studentData.taskStatus.total) * 100;
  const progressPercentage = (studentData.taskStatus.inProgress / studentData.taskStatus.total) * 100;

  return (
    <div style={styles.container}>

      {/* Tab Content */}
      {toggleTab === 0 && (
        <div style={styles.content}>
          <div style={styles.mainContent}>
            {/* Stats Cards */}
            <div style={styles.statsRow}>
              <div style={{...styles.statCard, ...(animated ? styles.slideIn : {})}}>
                <p style={styles.statLabel}>OVERALL ATTENDANCE</p>
                <h2 style={styles.statValue}>{studentData.overview.overallAttendance}%</h2>
                <p style={styles.statSubtext}>Class Average: {studentData.overview.classAverage}%</p>
              </div>
              <div style={{...styles.statCard, ...(animated ? styles.slideIn : {}), animationDelay: '0.1s'}}>
                <p style={styles.statLabel}>TASK COMPLETION</p>
                <h2 style={styles.statValue}>{studentData.overview.taskCompletion}%</h2>
                <p style={styles.statSubtext}>{studentData.overview.tasksSubmitted} Submitted</p>
              </div>
              <div style={{...styles.statCard, ...(animated ? styles.slideIn : {}), animationDelay: '0.2s'}}>
                <p style={styles.statLabel}>CGPA</p>
                <h2 style={styles.statValue}>{studentData.overview.cgpa}</h2>
                <p style={styles.statSubtext}>{studentData.overview.cgpaRank}</p>
              </div>
            </div>

            {/* Skills Acquired */}
            <div style={{...styles.card, ...(animated ? styles.fadeIn : {}), animationDelay: '0.3s'}}>
              <div style={styles.cardHeader}>
                <h3 style={styles.cardTitle}>Skills Acquired</h3>
                <button 
                  style={styles.expandButton}
                  onClick={() => setSkillsExpanded(!skillsExpanded)}
                >
                  {skillsExpanded ? 'Collapse' : 'Expand'}
                </button>
              </div>
              <div style={styles.skillsGrid}>
                {(skillsExpanded ? studentData.skills : studentData.skills.slice(0, 3)).map((skill, index) => (
                  <div key={index} style={styles.skillBadge}>
                    <span style={styles.skillName}>{skill.name}</span>
                    <span style={styles.skillRating}>{skill.rating}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Charts Row */}
            <div style={styles.chartsRow}>
              {/* Weekly Activity Trend */}
              <div style={{...styles.card, ...styles.chartCard, ...(animated ? styles.fadeIn : {}), animationDelay: '0.4s'}}>
                <div style={styles.cardHeader}>
                  <h3 style={styles.cardTitle}>Weekly Activity Trend</h3>
                  <button 
                    style={styles.moreButton}
                    onClick={() => setShowWeekModal(!showWeekModal)}
                  >
                    ⋯
                  </button>
                </div>
                {showWeekModal && (
                  <div style={styles.modal}>
                    <button style={styles.modalOption} onClick={() => { setCurrentWeek(0); setShowWeekModal(false); }}>Current Week</button>
                    <button style={styles.modalOption} onClick={() => { setCurrentWeek(1); setShowWeekModal(false); }}>Last Week</button>
                    <button style={styles.modalOption} onClick={() => { setCurrentWeek(2); setShowWeekModal(false); }}>2 Weeks Ago</button>
                  </div>
                )}
                <div style={styles.chart}>
                  <svg width="100%" height="200" style={{overflow: 'visible'}}>
                    {/* Y-axis grid lines */}
                    {[0, 25, 50, 75, 100].map((val, i) => (
                      <line
                        key={i}
                        x1="30"
                        y1={160 - (val * 1.6)}
                        x2="100%"
                        y2={160 - (val * 1.6)}
                        stroke="#f0f0f0"
                        strokeWidth="1"
                      />
                    ))}
                    
                    {/* Line chart */}
                    <polyline
                      points={studentData.weeklyActivity.map((d, i) => 
                        `${50 + i * 60},${160 - d.value * 1.6}`
                      ).join(' ')}
                      fill="none"
                      stroke="#4169E1"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{
                        strokeDasharray: animated ? '0' : '1000',
                        strokeDashoffset: animated ? '0' : '1000',
                        animation: animated ? 'drawLine 1.5s ease-out forwards' : 'none'
                      }}
                    />
                    
                    {/* Data points */}
                    {studentData.weeklyActivity.map((d, i) => (
                      <circle
                        key={i}
                        cx={50 + i * 60}
                        cy={160 - d.value * 1.6}
                        r="5"
                        fill="#4169E1"
                        style={{
                          opacity: animated ? 1 : 0,
                          animation: animated ? `fadeInPoint 0.3s ease-out ${0.5 + i * 0.1}s forwards` : 'none'
                        }}
                      />
                    ))}
                    
                    {/* X-axis labels */}
                    {studentData.weeklyActivity.map((d, i) => (
                      <text
                        key={i}
                        x={50 + i * 60}
                        y="185"
                        textAnchor="middle"
                        fontSize="12"
                        fill="#999"
                      >
                        {d.day}
                      </text>
                    ))}
                  </svg>
                </div>
              </div>

              {/* Task Status */}
              <div style={{...styles.card, ...styles.taskCard, ...(animated ? styles.fadeIn : {}), animationDelay: '0.5s'}}>
                <h3 style={styles.cardTitle}>Task Status</h3>
                <div style={styles.donutContainer}>
                  <svg width="150" height="150" viewBox="0 0 150 150">
                    <circle
                      cx="75"
                      cy="75"
                      r="60"
                      fill="none"
                      stroke="#e0e0e0"
                      strokeWidth="20"
                    />
                    <circle
                      cx="75"
                      cy="75"
                      r="60"
                      fill="none"
                      stroke="#4169E1"
                      strokeWidth="20"
                      strokeDasharray={`${completionPercentage * 3.77} ${377 - completionPercentage * 3.77}`}
                      strokeDashoffset="0"
                      transform="rotate(-90 75 75)"
                      style={{
                        transition: 'stroke-dasharray 1s ease-out',
                        strokeDasharray: animated ? `${completionPercentage * 3.77} ${377 - completionPercentage * 3.77}` : '0 377'
                      }}
                    />
                    <circle
                      cx="75"
                      cy="75"
                      r="60"
                      fill="none"
                      stroke="#34C759"
                      strokeWidth="20"
                      strokeDasharray={`${progressPercentage * 3.77} ${377 - progressPercentage * 3.77}`}
                      strokeDashoffset={`-${completionPercentage * 3.77}`}
                      transform="rotate(-90 75 75)"
                      style={{
                        transition: 'stroke-dasharray 1s ease-out 0.3s',
                        strokeDasharray: animated ? `${progressPercentage * 3.77} ${377 - progressPercentage * 3.77}` : '0 377'
                      }}
                    />
                    <text x="75" y="70" textAnchor="middle" fontSize="32" fontWeight="bold" fill="#333">
                      {studentData.taskStatus.total}
                    </text>
                    <text x="75" y="90" textAnchor="middle" fontSize="14" fill="#999">
                      Total Tasks
                    </text>
                  </svg>
                </div>
                <div style={styles.legend}>
                  <div style={styles.legendItem}>
                    <div style={{...styles.legendDot, backgroundColor: '#34C759'}}></div>
                    <span style={styles.legendText}>Completed ({studentData.taskStatus.completed})</span>
                  </div>
                  <div style={styles.legendItem}>
                    <div style={{...styles.legendDot, backgroundColor: '#4169E1'}}></div>
                    <span style={styles.legendText}>In Progress ({studentData.taskStatus.inProgress})</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance vs Class Average */}
            <div style={{...styles.card, ...(animated ? styles.fadeIn : {}), animationDelay: '0.6s'}}>
              <h3 style={styles.cardTitle}>Performance vs Class Average</h3>
              <div style={styles.performanceGrid}>
                {studentData.performance.map((perf, index) => (
                  <div key={index} style={styles.performanceItem}>
                    <p style={styles.performanceLabel}>{perf.subject}</p>
                    <div style={styles.barGroup}>
                      <div style={styles.barContainer}>
                        <div 
                          style={{
                            ...styles.bar,
                            ...styles.individualBar,
                            height: animated ? `${perf.individual}%` : '0%',
                            transition: `height 0.8s ease-out ${0.7 + index * 0.05}s`
                          }}
                        ></div>
                        <span style={styles.barLabel}>You</span>
                      </div>
                      <div style={styles.barContainer}>
                        <div 
                          style={{
                            ...styles.bar,
                            ...styles.averageBar,
                            height: animated ? `${perf.average}%` : '0%',
                            transition: `height 0.8s ease-out ${0.8 + index * 0.05}s`
                          }}
                        ></div>
                        <span style={styles.barLabel}>Avg</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Info */}
            <div style={styles.bottomInfo}>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Current Semester</span>
                <span style={styles.infoValue}>{toRoman(studentData.currentSemester)}</span>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Credits Earned</span>
                <span style={styles.infoValue}>{studentData.credits.earned} / {studentData.credits.total}</span>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Semester GPA</span>
                <span style={styles.infoValue}>{studentData.semesterGPA}</span>
              </div>
              <button style={styles.transcriptButton}>View Transcript</button>
            </div>
          </div>

          {/* Sidebar */}
          <div style={styles.sidebar}>
            <div style={{...styles.card, ...(animated ? styles.slideInRight : {})}}>
              <h3 style={styles.sidebarTitle}>Personal Details</h3>
              <div style={styles.detailItem}>
                <p style={styles.detailLabel}>Email Address</p>
                <p style={styles.detailValue}>{studentData.email}</p>
              </div>
              <div style={styles.detailItem}>
                <p style={styles.detailLabel}>Phone Number</p>
                <p style={styles.detailValue}>{studentData.phone}</p>
              </div>
              <div style={styles.detailItem}>
                <p style={styles.detailLabel}>Date of Birth</p>
                <p style={styles.detailValue}>{studentData.dateOfBirth}</p>
              </div>
              <div style={styles.detailItem}>
                <p style={styles.detailLabel}>Enrollment Date</p>
                <p style={styles.detailValue}>{studentData.enrollmentDate}</p>
              </div>
              <div style={styles.detailItem}>
                <p style={styles.detailLabel}>Advisor</p>
                <p style={styles.detailValue}>{studentData.advisor}</p>
              </div>
              <div style={styles.detailItem}>
                <p style={styles.detailLabel}>Next Workshop</p>
                <p style={styles.detailValueBold}>{studentData.nextWorkshop.title}</p>
                <p style={styles.detailValueSmall}>{studentData.nextWorkshop.date}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {toggleTab === 1 && <Attendance />}
      {toggleTab === 2 && <TaskGrades />}
      {toggleTab === 3 && <Ranking />}

      <style>{keyframesStyles}</style>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
    backgroundColor: '#f5f7fa',
    minHeight: '100vh',
    padding: '20px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  profilePic: {
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    overflow: 'hidden',
    backgroundColor: '#4169E1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  profileInitial: {
    color: 'white',
    fontSize: '24px',
    fontWeight: '600',
  },
  studentName: {
    margin: '0',
    fontSize: '24px',
    fontWeight: '600',
    color: '#1a1a1a',
  },
  studentEmail: {
    margin: '4px 0 0 0',
    fontSize: '14px',
    color: '#666',
  },
  tabContainer: {
    display: 'flex',
    gap: '0',
    borderBottom: '2px solid #e5e7eb',
    marginBottom: '24px',
  },
  tab: {
    padding: '12px 24px',
    backgroundColor: 'transparent',
    border: 'none',
    borderBottom: '2px solid transparent',
    color: '#6b7280',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s',
    marginBottom: '-2px',
  },
  activeTab: {
    color: '#4169E1',
    borderBottom: '2px solid #4169E1',
  },
  content: {
    display: 'flex',
    gap: '24px',
  },
  mainContent: {
    flex: '1',
  },
  sidebar: {
    width: '320px',
  },
  statsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '20px',
    marginBottom: '24px',
  },
  statCard: {
    backgroundColor: 'white',
    padding: '24px',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    opacity: 0,
  },
  statLabel: {
    margin: '0 0 8px 0',
    fontSize: '11px',
    fontWeight: '600',
    color: '#9ca3af',
    letterSpacing: '0.5px',
  },
  statValue: {
    margin: '0 0 8px 0',
    fontSize: '36px',
    fontWeight: '700',
    color: '#16a34a',
  },
  statSubtext: {
    margin: '0',
    fontSize: '13px',
    color: '#6b7280',
  },
  card: {
    backgroundColor: 'white',
    padding: '24px',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    marginBottom: '24px',
    opacity: 0,
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  cardTitle: {
    margin: '0',
    fontSize: '16px',
    fontWeight: '600',
    color: '#1a1a1a',
  },
  expandButton: {
    padding: '6px 16px',
    backgroundColor: '#f3f4f6',
    border: 'none',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: '500',
    color: '#4b5563',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  skillsGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '12px',
  },
  skillBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    backgroundColor: '#eff6ff',
    borderRadius: '20px',
    fontSize: '13px',
  },
  skillName: {
    color: '#1e40af',
    fontWeight: '500',
  },
  skillRating: {
    color: 'white',
    backgroundColor: '#4169E1',
    padding: '2px 8px',
    borderRadius: '10px',
    fontSize: '12px',
    fontWeight: '600',
  },
  chartsRow: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: '20px',
    marginBottom: '24px',
  },
  chartCard: {
    position: 'relative',
  },
  taskCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  moreButton: {
    width: '32px',
    height: '32px',
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: '6px',
    fontSize: '20px',
    color: '#6b7280',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.2s',
  },
  modal: {
    position: 'absolute',
    top: '50px',
    right: '24px',
    backgroundColor: 'white',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    zIndex: 10,
    overflow: 'hidden',
  },
  modalOption: {
    display: 'block',
    width: '100%',
    padding: '12px 20px',
    backgroundColor: 'transparent',
    border: 'none',
    textAlign: 'left',
    fontSize: '14px',
    color: '#374151',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  chart: {
    marginTop: '20px',
  },
  donutContainer: {
    marginTop: '20px',
    marginBottom: '20px',
  },
  legend: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginTop: '20px',
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  legendDot: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
  },
  legendText: {
    fontSize: '13px',
    color: '#6b7280',
  },
  performanceGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(8, 1fr)',
    gap: '20px',
    marginTop: '30px',
  },
  performanceItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  performanceLabel: {
    margin: '0 0 12px 0',
    fontSize: '12px',
    color: '#6b7280',
    fontWeight: '500',
  },
  barGroup: {
    display: 'flex',
    gap: '6px',
    alignItems: 'flex-end',
    height: '150px',
  },
  barContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '6px',
    height: '100%',
  },
  bar: {
    width: '24px',
    borderRadius: '4px 4px 0 0',
    transition: 'height 0.8s ease-out',
  },
  individualBar: {
    backgroundColor: '#4169E1',
  },
  averageBar: {
    backgroundColor: '#d1d5db',
  },
  barLabel: {
    fontSize: '11px',
    color: '#9ca3af',
    fontWeight: '500',
  },
  bottomInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '40px',
    padding: '20px 0',
  },
  infoItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  infoLabel: {
    fontSize: '12px',
    color: '#6b7280',
  },
  infoValue: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1a1a1a',
  },
  transcriptButton: {
    marginLeft: 'auto',
    padding: '10px 24px',
    backgroundColor: 'white',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  sidebarTitle: {
    margin: '0 0 20px 0',
    fontSize: '16px',
    fontWeight: '600',
    color: '#1a1a1a',
  },
  detailItem: {
    marginBottom: '20px',
  },
  detailLabel: {
    margin: '0 0 4px 0',
    fontSize: '12px',
    color: '#9ca3af',
  },
  detailValue: {
    margin: '0',
    fontSize: '14px',
    color: '#1a1a1a',
  },
  detailValueBold: {
    margin: '0 0 4px 0',
    fontSize: '14px',
    fontWeight: '600',
    color: '#1a1a1a',
  },
  detailValueSmall: {
    margin: '0',
    fontSize: '12px',
    color: '#6b7280',
  },
  tabContent: {
    padding: '40px',
    textAlign: 'center',
    fontSize: '18px',
    color: '#6b7280',
  },
  slideIn: {
    animation: 'slideIn 0.6s ease-out forwards',
  },
  fadeIn: {
    animation: 'fadeIn 0.8s ease-out forwards',
  },
  slideInRight: {
    animation: 'slideInRight 0.6s ease-out forwards',
  },
};

const keyframesStyles = `
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  
  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translateX(30px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  @keyframes drawLine {
    from {
      stroke-dashoffset: 1000;
    }
    to {
      stroke-dashoffset: 0;
    }
  }
  
  @keyframes fadeInPoint {
    from {
      opacity: 0;
      transform: scale(0);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  button:hover {
    filter: brightness(0.95);
  }
  
  .modalOption:hover {
    background-color: #f3f4f6;
  }
`;

export default Overview;