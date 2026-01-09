# Skill Reports Management System - Frontend Implementation

## Overview
Complete frontend implementation for Student Skill Reports Management with Excel upload functionality for Admin and viewing capabilities for both Admin and Faculty.

## Files Created

### 1. API Service
**Location:** `Frontend/src/api/skillReportService.js`

**Functions:**
- `uploadSkillReport(file, onProgress)` - Admin: Upload Excel file with progress tracking
- `getFacultyVenues()` - Get venues assigned to the logged-in user
- `getSkillReportsByVenue(venueId, params)` - Get paginated skill reports for a specific venue
- `searchStudentSkillReports(searchQuery)` - Search students by name/roll number
- `getMySkillReports()` - Student: Get personal skill reports

### 2. Admin Component
**Location:** `Frontend/src/pages/SuperAdmin/SkillReports/AdminSkillReport.jsx`

**Features:**
- ✅ Excel file upload with drag & drop support
- ✅ Upload progress indicator
- ✅ Detailed upload summary (inserted, updated, errors)
- ✅ Real-time statistics (Total, Cleared, Not Cleared, Ongoing, Avg Score)
- ✅ Advanced filters:
  - Search by name/roll number
  - Filter by venue
  - Filter by status (Cleared, Not Cleared, Ongoing)
  - Filter by date
- ✅ Paginated table view (50 records per page)
- ✅ Color-coded status badges
- ✅ Attendance status display
- ✅ Responsive design

### 3. Faculty Component
**Location:** `Frontend/src/pages/Faculty/SkillReports/FacultySkillReport.jsx`

**Features:**
- ✅ View-only access (no upload)
- ✅ Real-time statistics dashboard
- ✅ Advanced filters (same as Admin except no upload)
- ✅ Export to CSV functionality
- ✅ Paginated table view
- ✅ Access restricted to assigned venues only
- ✅ Search functionality
- ✅ Responsive design

## Navigation Updates

### SideTab.jsx
Added "Skill Reports" menu item with FileSpreadsheet icon to:
- Admin menu (academic section)
- Faculty menu (academic section)

### AppNavigator.jsx
Added routes:
- `/skill-reports` - Admin → `AdminSkillReport` component
- `/skill-reports` - Faculty → `FacultySkillReport` component

## Features Summary

### Admin Features:
1. **Upload Excel Files**
   - Supports .xlsx and .xls formats
   - Max file size: 10MB
   - Real-time progress tracking
   - Detailed error reporting

2. **View & Filter Reports**
   - Filter by venue, status, date
   - Search by name or roll number
   - Pagination support

3. **Statistics Dashboard**
   - Total students
   - Cleared/Not Cleared/Ongoing counts
   - Average best score

### Faculty Features:
1. **View Reports**
   - Access only to assigned venues
   - All filtering capabilities
   - Export to CSV

2. **Search & Filter**
   - Name/roll number search
   - Status filtering
   - Date filtering

3. **Export Data**
   - Download reports as CSV
   - Includes all visible columns

## Filter Options

### Available Filters:
1. **Search** - Name or Roll Number (min 2 characters)
2. **Venue** - Dropdown of assigned venues
3. **Status** - Cleared, Not Cleared, Ongoing
4. **Date** - Filter by last slot date
5. **Reset** - Clear all filters

## Table Columns

1. Roll No
2. Student Name (with email)
3. Department (Faculty view)
4. Course Name
5. Venue
6. Total Attempts
7. Best Score (highlighted badge)
8. Latest Score (highlighted badge)
9. Status (color-coded icon + text)
10. Last Date (formatted)
11. Attendance (color-coded badge)

## API Integration

### Backend Routes Used:
```
POST   /api/skill-reports/upload              (Admin only)
GET    /api/skill-reports/faculty/venues      (Admin/Faculty)
GET    /api/skill-reports/faculty/venue/:id   (Admin/Faculty)
GET    /api/skill-reports/faculty/search      (Admin/Faculty)
GET    /api/skill-reports/student/my-reports  (Student)
```

### Environment Variable:
Make sure `VITE_API_URL` is set in your `.env` file:
```
VITE_API_URL=http://localhost:5000/api
```

## Excel File Format

### Required Columns:
- `roll_number` or `user_id` - Student roll number
- `course_name` - Course name
- `venue` - Venue name
- `score` - Score (numeric)
- `status` - "Cleared", "Not Cleared", or "Ongoing"
- `attendance` - "Present" or "Absent"
- `slot_date` - Date (YYYY-MM-DD)
- `start_time` - Time (HH:MM)
- `end_time` - Time (HH:MM)

## Design Features

### Colors & Status:
- **Cleared** - Green (#10b981)
- **Not Cleared** - Red (#ef4444)
- **Ongoing** - Orange (#f59e0b)
- **Present** - Light Green background
- **Absent** - Light Red background

### Responsive:
- Mobile-friendly table with horizontal scroll
- Adaptive grid layout for statistics
- Flexible filter row

## Usage Instructions

### For Admin:
1. Navigate to "Skill Reports" from sidebar
2. Upload Excel file using the upload section
3. View upload summary and any errors
4. Use filters to view specific reports
5. Pagination for large datasets

### For Faculty:
1. Navigate to "Skill Reports" from sidebar
2. Select venue from dropdown (shows only assigned venues)
3. Use filters to find specific students
4. Export filtered data to CSV if needed

## Error Handling

- File validation (type and size)
- API error messages displayed
- Empty state when no data
- Loading indicators during data fetch
- Pagination error handling

## Security

- JWT token authentication
- Role-based access control (Admin vs Faculty)
- Faculty can only see their assigned venues
- File upload restricted to Admin only

## Testing Checklist

- [ ] Admin can upload Excel files
- [ ] Upload progress shows correctly
- [ ] Upload summary displays with stats
- [ ] Table shows all columns properly
- [ ] Filters work (search, venue, status, date)
- [ ] Pagination works
- [ ] Faculty can only see assigned venues
- [ ] Faculty cannot upload files
- [ ] CSV export works for Faculty
- [ ] Status badges show correct colors
- [ ] Responsive on mobile devices
- [ ] Error messages display properly

## Next Steps (Optional Enhancements)

1. Add bulk delete functionality
2. Add individual record edit capability
3. Add print functionality
4. Add advanced sorting options
5. Add date range filtering
6. Add email notifications for upload completion
7. Add chart visualizations for statistics
8. Add download template functionality

## Support

For issues or questions, refer to:
- Backend: `server/controllers/skillReportController.js`
- Backend Routes: `server/routes/skillReportRoutes.js`
- Database Schema: See user's SQL ALTER statements
