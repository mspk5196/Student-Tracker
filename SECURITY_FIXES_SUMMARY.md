# Security Fixes - JWT-Only Authentication

## Overview
This document summarizes all security improvements made to eliminate ID parameters from API requests and store only JWT tokens in localStorage.

## ✅ Completed Changes

### 1. Frontend - Auth Store (useAuthStore.js)
**Changes:**
- ❌ Removed: `localStorage.setItem("user", JSON.stringify(user))`
- ✅ Now: Only JWT token stored in localStorage
- ✅ User data fetched fresh from `/auth/me` on app load
- ✅ Added `refreshUser()` method to fetch user data on demand

**Benefits:**
- No sensitive user data exposed in browser localStorage
- User data always fresh from server
- Tokens can be invalidated server-side

### 2. Backend - Attendance Routes & Controller
**Routes Updated:**
- ✅ `/venues` - Was `/venues/:facultyId` → Now uses JWT
- ✅ `/late-students` - Was `/late-students/:facultyId` → Now uses JWT
- ✅ `/history` - Was `/history/:studentId` → Now uses JWT
- ✅ `/dashboard` - Was `/dashboard/:studentId` → Now uses JWT

**Controller Changes:**
- ✅ `getVenueAllocations()` - Extracts `userId` from `req.user.user_id`
- ✅ `getLateStudents()` - Uses JWT to determine faculty filter
- ✅ `getStudentAttendanceHistory()` - Uses JWT to get student data
- ✅ `getStudentAttendanceDashboard()` - Uses JWT for all queries

### 3. Backend - Tasks Routes & Controller
**Routes Updated:**
- ✅ `/venues` - Was `/venues/:faculty_id` → Now uses JWT
- ❌ Removed: `/venues/by-email/:email` (unnecessary with JWT)

**Controller Changes:**
- ✅ `getVenuesForFaculty()` - Extracts `userId` from `req.user.user_id`
- Admin users get all venues, faculty users get assigned venues only

## 🚧 Remaining Changes Needed

### 4. Backend - Roadmap Routes & Controller
**Routes to Update:**
```javascript
// Current:
router.get('/venue/:venue_id', authenticate, getRoadmapByVenue);
router.post('/', authenticate, createRoadmapModule);

// No changes needed - venue_id is resource identifier, not user ID
// But createRoadmapModule should extract faculty_id from JWT
```

**Controller Changes Needed:**
- ✅ `getRoadmapByVenue()` - Already uses `req.user.user_id`
- ⚠️ `createRoadmapModule()` - Should extract faculty_id from JWT instead of request body

### 5. Backend - Student Routes
**Routes to Review:**
```javascript
router.get('/:studentId', authenticate, getStudentById);
router.get('/:studentId/download-report', authenticate, downloadStudentReport);
router.get('/:studentId/attendance-dashboard', authenticate, getStudentAttendanceDashboard);
router.get('/:studentId/overview', authenticate, getStudentOverview);
router.get('/:studentId/ranking', authenticate, getStudentRanking);
router.put('/:studentId', authenticate, updateStudent);
router.delete('/:studentId', authenticate, deleteStudent);
router.get('/:studentId/task-grade', authenticate, getStudentTaskGrade);
```

**Decision:**
- These endpoints are for **Admin/Faculty viewing specific students**
- `studentId` in URL is a **resource identifier**, not authentication
- ✅ **Keep as-is** - BUT add authorization check (only admin/faculty/self can view)

### 6. Frontend Components - Remove ID Parameters
**Files to Update:**

#### Attendance Pages:
- `Frontend/src/pages/Faculty/AttendancePage/Attendance.jsx`
  - Remove `user.user_id` from `/venues/${user.user_id}` call
  - Change to `/venues`

- `Frontend/src/pages/Student/StudentAttendance/Attendance.jsx`
  - Remove student ID from API calls
  - Change `/history/${studentId}` to `/history`
  - Change `/dashboard/${studentId}` to `/dashboard`

#### Tasks Pages:
- `Frontend/src/pages/SuperAdmin/Task&Assignments/TaskHeader/TaskHeader.jsx`
  - Remove `user.user_id` from `/venues/${user.user_id}` call
  - Change to `/venues`

- `Frontend/src/pages/SuperAdmin/Task&Assignments/TaskHeader/Task-Assignment-page/Task&assignments.jsx`
  - Remove `faculty_id` from formData
  - Backend will extract from JWT

- `Frontend/src/pages/SuperAdmin/Task&Assignments/TaskHeader/Study-Road-Map/RoadMap.jsx`
  - Remove `faculty_id` from request body
  - Backend will extract from JWT

#### Student Dashboard Pages:
- `Frontend/src/pages/Student/Dashboard/StudentDashboard.jsx`
  - Remove any student_id parameters from API calls
  - Use JWT for authentication

### 7. Backend - Tasks Controller
**createTask() Function:**
```javascript
// Current:
const { title, description, venue_id, faculty_id, day, due_date, max_score, material_type, external_url } = req.body;

// Should be:
const { title, description, venue_id, day, due_date, max_score, material_type, external_url } = req.body;

// Get faculty_id from JWT:
const userId = req.user.user_id;
const [faculty] = await db.query('SELECT faculty_id FROM faculties WHERE user_id = ?', [userId]);
const faculty_id = faculty[0]?.faculty_id;
```

### 8. Backend - Roadmap Controller
**createRoadmapModule() Function:**
```javascript
// Current:
const { venue_id, faculty_id, day, title, description, status } = req.body;

// Should be:
const { venue_id, day, title, description, status } = req.body;

// Get faculty_id from JWT:
const userId = req.user.user_id;
const [faculty] = await db.query('SELECT faculty_id FROM faculties WHERE user_id = ?', [userId]);
const faculty_id = faculty[0]?.faculty_id;
```

## Security Benefits

### Before:
```javascript
// localStorage contains:
{
  "token": "eyJhbGc...",
  "user": {
    "user_id": 123,
    "email": "admin@example.com",
    "role": "admin",
    "name": "Admin User",
    "department": "CSE"
  }
}

// API Call:
fetch(`${API_URL}/attendance/venues/123`, {
  headers: { 'Authorization': `Bearer ${token}` }
})
```

### After:
```javascript
// localStorage contains:
{
  "token": "eyJhbGc..."
}

// API Call:
fetch(`${API_URL}/attendance/venues`, {
  headers: { 'Authorization': `Bearer ${token}` }
})

// Backend extracts user_id from JWT:
const userId = req.user.user_id;
```

## Key Principles

1. **JWT is Single Source of Truth**: User ID always comes from validated JWT token
2. **No IDs in URLs**: User-identifying IDs never passed as URL parameters
3. **Resource IDs OK**: IDs for resources (venues, tasks, submissions) are fine in URLs
4. **Minimal localStorage**: Only JWT token stored, no user data
5. **Fresh Data**: User data fetched from server, not cached client-side

## Testing Checklist

- [ ] Login stores only JWT token in localStorage
- [ ] User data is fetched from `/auth/me` after login
- [ ] Attendance pages work without passing user IDs
- [ ] Tasks pages work without passing faculty IDs
- [ ] Student dashboard works without passing student IDs
- [ ] Admin can access all resources
- [ ] Faculty can only access assigned resources
- [ ] Students can only access their own data
- [ ] No sensitive data visible in browser DevTools → Application → localStorage
- [ ] Inspect Network tab - no IDs in URL parameters (except resource IDs)

## Migration Steps for Frontend

1. Update API service files to remove ID parameters
2. Update component API calls to use new endpoints
3. Test each feature thoroughly
4. Clear localStorage before testing (force fresh login)

## Next Actions

See TODO list in conversation for remaining tasks to complete this security overhaul.
