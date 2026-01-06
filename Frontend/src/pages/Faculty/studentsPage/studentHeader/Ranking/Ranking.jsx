import React, { useState, useEffect, useMemo } from 'react';
import useAuthStore from '../../../../../store/useAuthStore';

const Ranking = ({ studentId }) => {
  const { token } = useAuthStore();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  const [rankingData, setRankingData] = useState(null);
  const [selectedSkill, setSelectedSkill] = useState('global');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 992);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (token && studentId) {
      fetchRankingData();
    }
  }, [token, studentId]);

  const fetchRankingData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/students/${studentId}/ranking`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (data.success) {
        setRankingData(data.data);
      }
    } catch (err) {
      console.error('Error fetching ranking:', err);
    } finally {
      setLoading(false);
    }
  };

  const renderAvatar = (name, url) => {
    if (url) {
      return <img src={url} alt={name} style={styles.avatarImg} />;
    }
    const firstLetter = name.charAt(0).toUpperCase();
    return <div style={styles.avatarFallback}>{firstLetter}</div>;
  };

  const leaderboardData = useMemo(() => {
    if (!rankingData) return [];

    const sorted = [...rankingData.students].sort(
      (a, b) => (b.points[selectedSkill] || 0) - (a.points[selectedSkill] || 0)
    );

    const userIndex = sorted.findIndex((s) => s.id === studentId);
    const topFive = sorted.slice(0, 5).map((s, i) => ({ ...s, rank: i + 1 }));

    if (userIndex < 5) {
      return topFive;
    } else {
      const userRow = { ...sorted[userIndex], rank: userIndex + 1 };
      const nextRow = sorted[userIndex + 1] ? { ...sorted[userIndex + 1], rank: userIndex + 2 } : null;
      const result = [...topFive, userRow];
      if (nextRow) result.push(nextRow);
      return result;
    }
  }, [rankingData, selectedSkill, studentId]);

  const getUserRankForSkill = (skillId) => {
    if (!rankingData) return 'N/A';
    const sorted = [...rankingData.students].sort((a, b) => (b.points[skillId] || 0) - (a.points[skillId] || 0));
    return sorted.findIndex((s) => s.id === studentId) + 1;
  };

  const currentTitle = useMemo(() => {
    if (!rankingData) return 'Leaderboard';
    if (selectedSkill === 'global') return 'Global Leaderboard';
    const ws = rankingData.workshops.find((w) => w.id === selectedSkill);
    return ws ? `${ws.title} Leaderboard` : 'Leaderboard';
  }, [selectedSkill, rankingData]);

  if (loading || !rankingData) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px', color: '#6B7280' }}>
        Loading ranking data...
      </div>
    );
  }

  const styles = {
    page: {
      fontFamily: 'Inter, system-ui, sans-serif',
      backgroundColor: '#F8FAFF',
      padding: '15px',
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      gap: '35px',
      minHeight: '100vh',
      color: '#1e293b',
      borderRadius:'10px'
    },
    leftSection: {
      flex: 2,
      backgroundColor: '#fff',
      borderRadius: '16px',
      padding: isMobile ? '20px' : '32px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
      border: '1px solid #f1f5f9',
    },
    rightSection: {
      flex: isMobile ? 'none' : 1,
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
    },
    workshopScroll: {
      overflowY: 'auto',
      maxHeight: isMobile ? 'none' : '85vh',
      paddingRight: '10px',
    },
    headerRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '30px',
    },
    title: { fontSize: isMobile ? '18px' : '22px', fontWeight: '800', color: '#1e3a8a', margin: 0 },
    subtitle: { fontSize: '13px', color: '#94a3b8', marginTop: '6px' },
    globalToggle: {
      width: '40px',
      height: '20px',
      backgroundColor: '#2563eb',
      borderRadius: '20px',
      border: 'none',
      cursor: 'pointer',
    },
    tableHead: {
      display: 'grid',
      gridTemplateColumns: '50px 1fr 100px',
      padding: '0 15px',
      marginBottom: '15px',
      fontSize: '11px',
      fontWeight: '800',
      color: '#94a3b8',
      letterSpacing: '0.5px',
    },
    listRow: (isMe) => ({
      display: 'grid',
      gridTemplateColumns: '50px 1fr 100px',
      alignItems: 'center',
      padding: '12px 15px',
      borderRadius: '12px',
      backgroundColor: isMe ? '#2563eb' : 'transparent',
      color: isMe ? '#fff' : '#1e293b',
      marginBottom: '6px',
      transition: 'background 0.2s',
    }),
    rankNum: (rank) => ({
      width: '28px',
      height: '28px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '12px',
      fontWeight: '800',
      backgroundColor: 
        rank === 1 ? '#fef3c7' : rank === 2 ? '#f1f5f9' : rank === 3 ? '#ffedd5' : 'transparent',
      color: rank === 1 ? '#a16207' : rank === 2 ? '#475569' : rank === 3 ? '#9a3412' : 'inherit',
    }),
    avatarWrapper: {
      width: '30px',
      height: '30px',
      borderRadius: '50%',
      overflow: 'hidden',
      marginRight: '12px',
      flexShrink: 0,
    },
    avatarImg: { width: '100%', height: '100%', objectFit: 'cover' },
    avatarFallback: {
      width: '100%',
      height: '100%',
      backgroundColor: '#eff6ff',
      color: '#3b82f6',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '11px',
      fontWeight: '700',
    },
    card: (active) => ({
      backgroundColor: active ? '#2563eb' : '#fff',
      borderRadius: '16px',
      padding: '20px',
      border: '1px solid #e2e8f0',
      cursor: 'pointer',
      transition: 'all 0.2s',
      position: 'relative',
      marginBottom: '12px',
    }),
    cardTitle: (active) => ({
      fontSize: '14px',
      fontWeight: '800',
      color: active ? '#fff' : '#2563eb',
      margin: '0 0 4px 0',
    }),
    cardStatus: (active) => ({
      fontSize: '11px',
      color: active ? '#bfdbfe' : '#94a3b8',
      fontWeight: '600',
    }),
    rankBadge: (active) => ({
      backgroundColor: active ? '#fff' : '#eff6ff',
      color: active ? '#2563eb' : '#3b82f6',
      padding: '5px 10px',
      borderRadius: '8px',
      fontSize: '10px',
      fontWeight: '800',
      marginTop: '15px',
      display: 'inline-block',
    }),
    cardPts: (active) => ({
      position: 'absolute',
      bottom: '22px',
      right: '20px',
      display: 'flex',
      alignItems: 'center',
      gap: '5px',
      fontSize: '12px',
      fontWeight: '700',
      color: active ? '#fff' : '#94a3b8',
    }),
  };

  return (
    <div style={styles.page}>
      {/* LEFT: Leaderboard Panel */}
      <div style={styles.leftSection}>
        <div style={styles.headerRow}>
          <div>
            <h2 style={styles.title}>{currentTitle}</h2>
            <p style={styles.subtitle}>Accumulated activity points for this category</p>
          </div>
          {selectedSkill !== 'global' && (
            <button
              style={styles.globalToggle}
              onClick={() => setSelectedSkill('global')}
              title="Back to Global"
            />
          )}
        </div>

        <div style={styles.tableHead}>
          <span>RANK</span>
          <span>NAME</span>
          <span style={{ textAlign: 'right' }}>POINTS</span>
        </div>

        <div>
          {leaderboardData.map((student) => {
            const isMe = student.id === studentId;
            const pointsValue = student.points[selectedSkill] || 0;

            return (
              <div key={student.id} style={styles.listRow(isMe)}>
                <div
                  style={{
                    ...styles.rankNum(student.rank),
                    color: isMe ? '#fff' : styles.rankNum(student.rank).color,
                  }}
                >
                  {student.rank}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
                  <div style={styles.avatarWrapper}>{renderAvatar(student.name, student.profilePic)}</div>
                  <span
                    style={{
                      fontWeight: '600',
                      fontSize: '13px',
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis',
                      overflow: 'hidden',
                    }}
                  >
                    {student.name}
                  </span>
                </div>
                <div style={{ textAlign: 'right', fontWeight: '800', fontSize: '14px' }}>
                  {pointsValue.toLocaleString()}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* RIGHT: Standings Sidebar */}
      <div style={styles.rightSection}>
        <h3 style={{ fontSize: '15px', fontWeight: '800', margin: isMobile ? '10px 0' : '0 0 10px 0' }}>
          Workshop Standings
        </h3>
        <div style={styles.workshopScroll} className="custom-scrollbar">
          <div
            style={styles.card(selectedSkill === 'global')}
            onClick={() => setSelectedSkill('global')}
          >
            <h4 style={styles.cardTitle(selectedSkill === 'global')}>Global Leadership</h4>
            <p style={styles.cardStatus(selectedSkill === 'global')}>
              Aggregate performance across all skills
            </p>
            <div style={styles.rankBadge(selectedSkill === 'global')}>
              Rank #{getUserRankForSkill('global')}
            </div>
            <div style={styles.cardPts(selectedSkill === 'global')}>
              <StarIcon color={selectedSkill === 'global' ? '#fff' : '#94a3b8'} />
              {rankingData.students.find((s) => s.id === studentId)?.points.global || 0} Pts
            </div>
          </div>

          {rankingData.workshops.map((ws) => {
            const isAct = selectedSkill === ws.id;
            const myPts = rankingData.students.find((s) => s.id === studentId)?.points[ws.id] || 0;
            return (
              <div key={ws.id} style={styles.card(isAct)} onClick={() => setSelectedSkill(ws.id)}>
                <h4 style={styles.cardTitle(isAct)}>{ws.title}</h4>
                <p style={styles.cardStatus(isAct)}>{ws.status}</p>
                <div style={styles.rankBadge(isAct)}>Rank #{getUserRankForSkill(ws.id)}</div>
                <div style={styles.cardPts(isAct)}>
                  <StarIcon color={isAct ? '#fff' : '#94a3b8'} />
                  {myPts} Pts
                </div>
                {isAct && (
                  <div style={{ position: 'absolute', top: '15px', right: '15px', opacity: 0.4 }}>
                    <GraphIcon />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
      `}</style>
    </div>
  );
};

const StarIcon = ({ color }) => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill={color}>
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

const GraphIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
  </svg>
);

export default Ranking;