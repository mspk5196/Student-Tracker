/**
 * =====================================================
 * SKILL COMPLETION STATUS API SERVICE
 * =====================================================
 * Frontend API service for skill completion tracking
 * =====================================================
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'API request failed');
  }
  return data;
};

/**
 * ===== VENUE-LEVEL APIs =====
 */

/**
 * Get skill completion summary for a venue
 * @param {number} venueId - Venue ID
 * @param {object} params - { groupId, courseFilter }
 */
export const getVenueSkillSummary = async (venueId, params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = `${API_URL}/skill-completion/venues/${venueId}/summary${queryString ? `?${queryString}` : ''}`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders()
  });
  
  return handleResponse(response);
};

/**
 * Get students who haven't attempted any skill in a venue
 * @param {number} venueId - Venue ID
 * @param {object} params - { groupId, page, limit, search }
 */
export const getNotAttemptedStudents = async (venueId, params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = `${API_URL}/skill-completion/venues/${venueId}/not-attempted${queryString ? `?${queryString}` : ''}`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders()
  });
  
  return handleResponse(response);
};

/**
 * Get all students with their skill status in a venue
 * @param {number} venueId - Venue ID
 * @param {object} params - { groupId, status, courseFilter, page, limit, search, sortBy, sortOrder }
 */
export const getVenueStudentSkillStatus = async (venueId, params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = `${API_URL}/skill-completion/venues/${venueId}/students${queryString ? `?${queryString}` : ''}`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders()
  });
  
  return handleResponse(response);
};

/**
 * Get course-wise completion breakdown for a venue
 * @param {number} venueId - Venue ID
 * @param {object} params - { groupId }
 */
export const getCourseWiseCompletion = async (venueId, params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = `${API_URL}/skill-completion/venues/${venueId}/courses${queryString ? `?${queryString}` : ''}`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders()
  });
  
  return handleResponse(response);
};

/**
 * Get list of courses available in a venue (for filters)
 * @param {number} venueId - Venue ID
 */
export const getVenueCourses = async (venueId) => {
  const url = `${API_URL}/skill-completion/venues/${venueId}/course-list`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders()
  });
  
  return handleResponse(response);
};

/**
 * Get all groups in a venue with their skill completion stats
 * @param {number} venueId - Venue ID
 */
export const getVenueGroupsWithStats = async (venueId) => {
  const url = `${API_URL}/skill-completion/venues/${venueId}/groups`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders()
  });
  
  return handleResponse(response);
};

/**
 * Get analytics/charts data for skill completion
 * @param {number} venueId - Venue ID
 * @param {object} params - { groupId, dateFrom, dateTo }
 */
export const getSkillCompletionAnalytics = async (venueId, params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = `${API_URL}/skill-completion/venues/${venueId}/analytics${queryString ? `?${queryString}` : ''}`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders()
  });
  
  return handleResponse(response);
};

/**
 * Export skill completion data for a venue
 * @param {number} venueId - Venue ID
 * @param {object} params - { groupId, status, courseFilter }
 */
export const exportSkillCompletionData = async (venueId, params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = `${API_URL}/skill-completion/venues/${venueId}/export${queryString ? `?${queryString}` : ''}`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders()
  });
  
  return handleResponse(response);
};

/**
 * ===== GROUP-LEVEL APIs =====
 */

/**
 * Get detailed skill completion for a specific group
 * @param {number} groupId - Group ID
 * @param {object} params - { status, courseFilter, page, limit, search }
 */
export const getGroupSkillCompletion = async (groupId, params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = `${API_URL}/skill-completion/groups/${groupId}${queryString ? `?${queryString}` : ''}`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders()
  });
  
  return handleResponse(response);
};

/**
 * ===== STUDENT-LEVEL APIs =====
 */

/**
 * Get individual student's skill progress
 * @param {number} studentId - Student ID
 * @param {object} params - { venueId }
 */
export const getStudentSkillProgress = async (studentId, params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = `${API_URL}/skill-completion/students/${studentId}${queryString ? `?${queryString}` : ''}`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders()
  });
  
  return handleResponse(response);
};

/**
 * ===== UTILITY FUNCTIONS =====
 */

/**
 * Convert API data to CSV format
 * @param {Array} data - Data array from export API
 * @returns {string} - CSV string
 */
export const convertToCSV = (data) => {
  if (!data || data.length === 0) return '';
  
  const headers = Object.keys(data[0]);
  const csvRows = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        // Handle values that contain commas or quotes
        if (value === null || value === undefined) return '';
        const stringValue = String(value);
        if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
      }).join(',')
    )
  ];
  
  return csvRows.join('\n');
};

/**
 * Download data as CSV file
 * @param {Array} data - Data array
 * @param {string} filename - Filename without extension
 */
export const downloadAsCSV = (data, filename = 'skill_completion_data') => {
  const csv = convertToCSV(data);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export default {
  getVenueSkillSummary,
  getNotAttemptedStudents,
  getVenueStudentSkillStatus,
  getCourseWiseCompletion,
  getVenueCourses,
  getVenueGroupsWithStats,
  getSkillCompletionAnalytics,
  exportSkillCompletionData,
  getGroupSkillCompletion,
  getStudentSkillProgress,
  convertToCSV,
  downloadAsCSV
};
