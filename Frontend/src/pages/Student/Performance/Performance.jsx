import React, { useState } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

// Helper function to get initials from name
const getInitials = (name) => {
  return name.charAt(0).toUpperCase();
};

// Helper function to get avatar background color
const getAvatarColor = (name) => {
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F'];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
};

// Pagination helper function
const paginate = (items, page, itemsPerPage) => {
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return {
    items: items.slice(startIndex, endIndex),
    totalPages: Math.ceil(items.length / itemsPerPage),
    startIndex: startIndex + 1,
    endIndex: Math.min(endIndex, items.length),
    total: items.length
  };
};

const Performance = () => {
  const [selectedWorkshop, setSelectedWorkshop] = useState('overall');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  // JSON data for leaderboards
  const leaderboardsData = {
    overall: {
      title: "Global Leaderboard",
      students: [
        { rank: 1, name: "Sarah Jenkins", points: 1250, image: null },
        { rank: 2, name: "Michael Chen", points: 1180, image: null },
        { rank: 3, name: "Jessica Wong", points: 1150, image: null },
        { rank: 4, name: "David Kim", points: 1040, initials: "DK", image: null },
        { rank: 5, name: "Rahul Jones", points: 980, initials: "RJ", image: null },
        { rank: 12, name: "Emma Watson (You)", points: 850, isCurrentUser: true, image: null },
        { rank: 13, name: "Alex Morgan", points: 820, image: null }
      ]
    },
    advancedReact: {
      title: "Advanced React Leaderboard",
      students: [
        { rank: 1, name: "Jessica Wong", points: 485, image: null },
        { rank: 2, name: "David Kim", points: 420, initials: "DK", image: null },
        { rank: 3, name: "Sarah Jenkins", points: 395, image: null },
        { rank: 8, name: "Emma Watson (You)", points: 95, isCurrentUser: true, image: null },
        { rank: 9, name: "Michael Chen", points: 85, image: null },
        { rank: 10, name: "Alex Morgan", points: 75, image: null }
      ]
    },
    htmlCss: {
      title: "HTML & CSS Basics Leaderboard",
      students: [
        { rank: 1, name: "Emma Watson (You)", points: 350, isCurrentUser: true, image: null },
        { rank: 2, name: "Sarah Jenkins", points: 340, image: null },
        { rank: 3, name: "Michael Chen", points: 325, image: null },
        { rank: 4, name: "David Kim", points: 310, initials: "DK", image: null },
        { rank: 5, name: "Jessica Wong", points: 295, image: null },
        { rank: 6, name: "Rahul Jones", points: 280, initials: "RJ", image: null }
      ]
    },
    uiUx: {
      title: "UI/UX Sprint Leaderboard",
      students: [
        { rank: 1, name: "Michael Chen", points: 290, image: null },
        { rank: 2, name: "Sarah Jenkins", points: 275, image: null },
        { rank: 3, name: "Jessica Wong", points: 250, image: null },
        { rank: 4, name: "David Kim", points: 235, initials: "DK", image: null },
        { rank: 5, name: "Emma Watson (You)", points: 210, isCurrentUser: true, image: null },
        { rank: 6, name: "Alex Morgan", points: 195, image: null }
      ]
    },
    jsFundamentals: {
      title: "JS Fundamentals Leaderboard",
      students: [
        { rank: 1, name: "Rahul Jones", points: 320, initials: "RJ", image: null },
        { rank: 2, name: "Sarah Jenkins", points: 310, image: null },
        { rank: 3, name: "David Kim", points: 285, initials: "DK", image: null },
        { rank: 4, name: "Jessica Wong", points: 270, image: null },
        { rank: 14, name: "Emma Watson (You)", points: 195, isCurrentUser: true, image: null },
        { rank: 15, name: "Alex Morgan", points: 180, image: null }
      ]
    }
  };

  const workshopData = [
    { 
      id: 'overall',
      title: "Overall Leaderboard", 
      status: "All Workshops Combined", 
      rank: null, 
      points: 850,
      color: "#E8F4F8",
      isOverall: true
    },
    { 
      id: 'advancedReact',
      title: "Advanced React", 
      status: "In Progress (Day 3)", 
      rank: 8, 
      points: 95,
      color: "#FFF4E6"
    },
    { 
      id: 'htmlCss',
      title: "HTML & CSS Basics", 
      status: "Jan 10 - Jan 12", 
      rank: 1, 
      points: 350,
      color: "#E8F4F8"
    },
    { 
      id: 'uiUx',
      title: "UI/UX Sprint", 
      status: "Jan 05 - Jan 06", 
      rank: 5, 
      points: 210,
      color: "#E8F4F8"
    },
    { 
      id: 'jsFundamentals',
      title: "JS Fundamentals", 
      status: "Dec 15 - Dec 20", 
      rank: 14, 
      points: 195,
      color: "#E8F4F8"
    }
  ];

  const currentLeaderboard = leaderboardsData[selectedWorkshop];
  const paginatedWorkshops = paginate(workshopData, currentPage, itemsPerPage);

  const handleWorkshopClick = (workshopId) => {
    setSelectedWorkshop(workshopId);
  };

  const handlePageChange = (direction) => {
    if (direction === 'next' && currentPage < paginatedWorkshops.totalPages) {
      setCurrentPage(currentPage + 1);
    } else if (direction === 'prev' && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div style={styles.container}>
      {/* Leaderboard */}
      <div style={styles.leaderboardSection}>
        <div style={styles.header}>
          <h2 style={styles.title}>{currentLeaderboard.title}</h2>
          <p style={styles.subtitle}>Based on accumulated activity points across all workshops</p>
        </div>

        <div style={styles.tableHeader}>
          <span style={styles.headerRank}>RANK</span>
          <span style={styles.headerName}>STUDENT NAME</span>
          <span style={styles.headerPoints}>ACTIVITY POINTS</span>
        </div>

        <div style={styles.leaderboardList}>
          {currentLeaderboard.students.map((student) => (
            <div 
              key={student.rank} 
              style={{
                ...styles.leaderboardRow,
                ...(student.isCurrentUser ? styles.currentUserRow : {})
              }}
            >
              <div style={styles.rankCell}>
                <span style={{
                  ...styles.rankNumber,
                  ...(student.rank <= 3 ? styles.topRank : {}),
                  ...(student.isCurrentUser ? styles.currentUserText : {})
                }}>
                  {student.rank}
                </span>
              </div>
              
              <div style={styles.nameCell}>
                <div 
                  style={{
                    ...styles.avatar,
                    backgroundColor: getAvatarColor(student.name)
                  }}
                >
                  {student.initials || getInitials(student.name)}
                </div>
                <span style={{
                  ...styles.studentName,
                  ...(student.isCurrentUser ? styles.currentUserText : {})
                }}>
                  {student.name}
                </span>
              </div>
              
              <div style={styles.pointsCell}>
                <span style={{
                  ...styles.points,
                  ...(student.isCurrentUser ? styles.currentUserText : {})
                }}>
                  {student.points.toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Workshop Standings */}
      <div style={styles.workshopSection}>
        <h2 style={styles.workshopTitle}>Workshop Standings</h2>
        
        <div style={styles.workshopList}>
          {paginatedWorkshops.items.map((workshop) => (
            <div 
              key={workshop.id} 
              style={{
                ...styles.workshopCard,
                backgroundColor: selectedWorkshop === workshop.id ? '#EBF4FF' : 'white',
                cursor: 'pointer',
                border: selectedWorkshop === workshop.id ? '2px solid #2B6EF6' : '2px solid #E5E7EB',
                transition: 'all 0.2s ease'
              }}
              onClick={() => handleWorkshopClick(workshop.id)}
            >
              <div style={styles.workshopHeader}>
                <div>
                  <h3 style={styles.workshopName}>{workshop.title}</h3>
                  <p style={styles.workshopStatus}>{workshop.status}</p>
                </div>
              </div>
              
              <div style={styles.workshopFooter}>
                {workshop.rank && (
                  <span style={styles.rankBadge}>Rank #{workshop.rank}</span>
                )}
                {!workshop.rank && (
                  <span style={styles.rankBadge}>All Workshops</span>
                )}
                <span style={styles.workshopPoints}>
                  <Star size={14} fill="#2B6EF6" stroke="#2B6EF6" style={{marginRight: '4px', verticalAlign: 'middle'}} />
                  {workshop.points} Pts
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div style={styles.pagination}>
          <span style={styles.paginationInfo}>
            Showing {paginatedWorkshops.startIndex}-{paginatedWorkshops.endIndex} workshops
          </span>
          <div style={styles.paginationControls}>
            <button 
              style={{
                ...styles.paginationButton,
                opacity: currentPage === 1 ? 0.5 : 1,
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
              }}
              onClick={() => handlePageChange('prev')}
              disabled={currentPage === 1}
            >
              <ChevronLeft size={16} />
            </button>
            
            {Array.from({ length: paginatedWorkshops.totalPages }, (_, i) => i + 1).map((pageNum) => (
              <span 
                key={pageNum}
                style={{
                  ...styles.pageNumberBox,
                  backgroundColor: currentPage === pageNum ? '#2B6EF6' : 'white',
                  color: currentPage === pageNum ? 'white' : '#6B7280',
                  cursor: 'pointer'
                }}
                onClick={() => setCurrentPage(pageNum)}
              >
                {pageNum}
              </span>
            ))}
            
            <button 
              style={{
                ...styles.paginationButton,
                opacity: currentPage === paginatedWorkshops.totalPages ? 0.5 : 1,
                cursor: currentPage === paginatedWorkshops.totalPages ? 'not-allowed' : 'pointer'
              }}
              onClick={() => handlePageChange('next')}
              disabled={currentPage === paginatedWorkshops.totalPages}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    gap: '24px',
    minHeight: '100vh',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    flexWrap: 'wrap'
  },
  leaderboardSection: {
    flex: '2 1 600px',
    minWidth: '300px',
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  },
  header: {
    marginBottom: '24px'
  },
  title: {
    fontSize: '20px',
    fontWeight: '600',
    margin: '0 0 8px 0',
    color: '#1a1a1a'
  },
  subtitle: {
    fontSize: '13px',
    color: '#6B7280',
    margin: 0
  },
  tableHeader: {
    display: 'flex',
    padding: '12px 16px',
    borderBottom: '1px solid #E5E7EB',
    fontSize: '11px',
    fontWeight: '600',
    color: '#6B7280',
    letterSpacing: '0.5px'
  },
  headerRank: {
    width: '60px'
  },
  headerName: {
    flex: 1
  },
  headerPoints: {
    width: '120px',
    textAlign: 'right'
  },
  leaderboardList: {
    display: 'flex',
    flexDirection: 'column'
  },
  leaderboardRow: {
    display: 'flex',
    alignItems: 'center',
    padding: '16px',
    borderBottom: '1px solid #F3F4F6',
    transition: 'background-color 0.2s'
  },
  currentUserRow: {
    backgroundColor: '#2B6EF6',
    borderRadius: '8px',
    margin: '4px 0',
    border: 'none'
  },
  currentUserText: {
    color: 'white'
  },
  rankCell: {
    width: '60px'
  },
  rankNumber: {
    fontSize: '15px',
    fontWeight: '500',
    color: '#6B7280'
  },
  topRank: {
    color: '#D97706',
    fontWeight: '600'
  },
  nameCell: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  avatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: '600',
    fontSize: '13px'
  },
  studentName: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#1a1a1a'
  },
  pointsCell: {
    width: '120px',
    textAlign: 'right'
  },
  points: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#2563EB'
  },
  workshopSection: {
    flex: '1 1 350px',
    minWidth: '300px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  workshopTitle: {
    fontSize: '18px',
    fontWeight: '600',
    margin: 0,
    color: '#1a1a1a'
  },
  workshopList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  workshopCard: {
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  },
  workshopHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '16px'
  },
  workshopName: {
    fontSize: '16px',
    fontWeight: '600',
    margin: '0 0 4px 0',
    color: '#1a1a1a'
  },
  workshopStatus: {
    fontSize: '12px',
    color: '#6B7280',
    margin: 0
  },
  progressIcon: {
    width: '24px',
    height: '24px'
  },
  barIcon: {
    display: 'flex',
    gap: '3px',
    alignItems: 'flex-end',
    height: '16px'
  },
  bar: {
    width: '4px',
    backgroundColor: '#1a1a1a',
    borderRadius: '2px'
  },
  workshopFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  rankBadge: {
    backgroundColor: '#EBF4FF',
    padding: '6px 12px',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: '600',
    color: '#2563EB'
  },
  workshopPoints: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#6B7280',
    display: 'flex',
    alignItems: 'center'
  },
  pagination: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '8px',
    padding: '12px 0'
  },
  paginationInfo: {
    fontSize: '13px',
    color: '#6B7280'
  },
  paginationControls: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center'
  },
  paginationButton: {
    backgroundColor: 'white',
    border: '1px solid #E5E7EB',
    borderRadius: '6px',
    padding: '6px 8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s'
  },
  pageNumberBox: {
    backgroundColor: '#2B6EF6',
    color: 'white',
    padding: '8px 12px',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    minWidth: '36px',
    textAlign: 'center',
    border: '1px solid #E5E7EB',
    transition: 'all 0.2s'
  }
};

export default Performance;