# Skill Reports API Reference

## Base URL
```
/api/skill-reports
```

## Authentication
All endpoints require JWT authentication via Bearer token in Authorization header:
```
Authorization: Bearer <token>
```

---

## Endpoints

### 1. Upload Skill Report (Admin Only)
Upload an Excel file containing student skill reports.

**Endpoint:** `POST /api/skill-reports/upload`

**Access:** Admin only (role_id = 1)

**Content-Type:** `multipart/form-data`

**Request Body:**
```
file: Excel file (.xlsx or .xls)
```

**Success Response (200):**
```json
{
  "message": "Skill reports uploaded successfully",
  "summary": {
    "totalRecords": 100,
    "processed": 98,
    "inserted": 75,
    "updated": 23,
    "errors": 2,
    "errorDetails": [
      {
        "row": 5,
        "message": "Student not found: CSE2021999"
      },
      {
        "row": 12,
        "message": "Venue not found: Lab X"
      }
    ]
  }
}
```

**Error Responses:**
- `403` - Only admins can upload skill reports
- `400` - No file uploaded / Excel file is empty / Maximum 5000 records allowed
- `500` - Failed to process upload

---

### 2. Get Faculty Venues
Get list of venues assigned to the logged-in faculty member.

**Endpoint:** `GET /api/skill-reports/faculty/venues`

**Access:** Admin, Faculty

**Success Response (200):**
```json
{
  "venues": [
    {
      "venue_id": 1,
      "venue_name": "Lab A",
      "location": "Building A, Floor 2",
      "capacity": 50
    },
    {
      "venue_id": 2,
      "venue_name": "Lab B",
      "location": "Building B, Floor 1",
      "capacity": 40
    }
  ]
}
```

**Error Responses:**
- `403` - Faculty record not found
- `500` - Failed to fetch venues

---

### 3. Get Skill Reports by Venue
Get paginated skill reports for a specific venue.

**Endpoint:** `GET /api/skill-reports/faculty/venue/:venueId`

**Access:** Admin, Faculty (restricted to assigned venues)

**Query Parameters:**
- `page` (optional) - Page number (default: 1)
- `limit` (optional) - Records per page (default: 50)
- `status` (optional) - Filter by status: "Cleared", "Not Cleared", "Ongoing"
- `sortBy` (optional) - Sort column: "updated_at", "best_score", "total_attempts", "status" (default: "updated_at")
- `sortOrder` (optional) - Sort order: "ASC" or "DESC" (default: "DESC")

**Example Request:**
```
GET /api/skill-reports/faculty/venue/1?page=1&limit=50&status=Cleared&sortBy=best_score&sortOrder=DESC
```

**Success Response (200):**
```json
{
  "venue": {
    "venue_id": 1,
    "venue_name": "Lab A"
  },
  "reports": [
    {
      "id": 123,
      "roll_number": "CSE2021001",
      "student_name": "John Doe",
      "email": "john@example.com",
      "department": "Computer Science",
      "skill_name": "Python",
      "course_name": "Python Programming",
      "venue_name": "Lab A",
      "proficiency_level": "Advanced",
      "total_attempts": 3,
      "best_score": 85.5,
      "latest_score": 82.0,
      "status": "Cleared",
      "last_attendance": "Present",
      "last_slot_date": "2026-01-07",
      "last_start_time": "09:00:00",
      "last_end_time": "12:00:00",
      "updated_at": "2026-01-07T10:30:00.000Z"
    }
  ],
  "statistics": {
    "total": 150,
    "cleared": 85,
    "not_cleared": 40,
    "ongoing": 25,
    "avg_best_score": 75.5
  },
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 150,
    "totalPages": 3
  }
}
```

**Error Responses:**
- `403` - Faculty record not found / No access to this venue
- `500` - Failed to fetch skill reports

---

### 4. Search Student Skill Reports
Search for students by name, roll number, or course name.

**Endpoint:** `GET /api/skill-reports/faculty/search`

**Access:** Admin, Faculty (restricted to assigned venues)

**Query Parameters:**
- `q` (required) - Search query (minimum 2 characters)

**Example Request:**
```
GET /api/skill-reports/faculty/search?q=john
```

**Success Response (200):**
```json
{
  "reports": [
    {
      "id": 123,
      "roll_number": "CSE2021001",
      "student_name": "John Doe",
      "email": "john@example.com",
      "department": "Computer Science",
      "skill_name": "Python",
      "course_name": "Python Programming",
      "venue_name": "Lab A",
      "total_attempts": 3,
      "best_score": 85.5,
      "latest_score": 82.0,
      "status": "Cleared",
      "last_slot_date": "2026-01-07",
      "updated_at": "2026-01-07T10:30:00.000Z"
    }
  ]
}
```

**Error Responses:**
- `400` - Search query must be at least 2 characters
- `403` - Faculty record not found
- `500` - Search failed

---

### 5. Get My Skill Reports (Student)
Get skill reports for the logged-in student.

**Endpoint:** `GET /api/skill-reports/student/my-reports`

**Access:** Student only

**Success Response (200):**
```json
{
  "reports": [
    {
      "id": 123,
      "skill_name": "Python",
      "course_name": "Python Programming",
      "venue_name": "Lab A",
      "proficiency_level": "Advanced",
      "total_attempts": 3,
      "best_score": 85.5,
      "latest_score": 82.0,
      "status": "Cleared",
      "last_attendance": "Present",
      "last_slot_date": "2026-01-07",
      "last_start_time": "09:00:00",
      "last_end_time": "12:00:00",
      "created_at": "2026-01-01T08:00:00.000Z",
      "updated_at": "2026-01-07T10:30:00.000Z"
    }
  ],
  "summary": {
    "totalCourses": 5,
    "cleared": 3,
    "notCleared": 1,
    "ongoing": 1,
    "totalAttempts": 12,
    "averageBestScore": "78.50"
  }
}
```

**Error Responses:**
- `403` - Student record not found
- `500` - Failed to fetch skill reports

---

## Status Flow

### Status Progression:
1. **Ongoing** → Initial status when first record is created
2. **Not Cleared** → Can be set if student doesn't meet requirements
3. **Cleared** → Final status (cannot be changed back)

### Status Protection:
Once a student's status is "Cleared" for a particular course, it cannot be changed to "Not Cleared" or "Ongoing" in subsequent uploads.

---

## Proficiency Levels

Automatically calculated based on score:
- **Expert** - Score >= 90
- **Advanced** - Score >= 75 and < 90
- **Intermediate** - Score >= 50 and < 75
- **Beginner** - Score < 50

---

## Excel File Requirements

### Supported Formats:
- `.xlsx` (Excel 2007+)
- `.xls` (Excel 97-2003)

### Max File Size: 10 MB

### Required Columns:
- `roll_number` (or `user_id`)
- `course_name`
- `venue`

### Optional Columns:
- `score`
- `status`
- `attendance`
- `slot_date`
- `start_time`
- `end_time`

---

## Error Codes

| Code | Description |
|------|-------------|
| 200  | Success |
| 400  | Bad Request (invalid data, missing file, etc.) |
| 403  | Forbidden (access denied, role restriction) |
| 500  | Internal Server Error |

---

## Rate Limiting

No specific rate limiting implemented, but large file uploads (>5000 records) are rejected.

---

## Testing with cURL

### Upload Excel File (Admin):
```bash
curl -X POST http://localhost:5000/api/skill-reports/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@/path/to/skill_reports.xlsx"
```

### Get Faculty Venues:
```bash
curl -X GET http://localhost:5000/api/skill-reports/faculty/venues \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get Reports by Venue:
```bash
curl -X GET "http://localhost:5000/api/skill-reports/faculty/venue/1?page=1&limit=50" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Search Students:
```bash
curl -X GET "http://localhost:5000/api/skill-reports/faculty/search?q=john" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get My Reports (Student):
```bash
curl -X GET http://localhost:5000/api/skill-reports/student/my-reports \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Database Schema

### student_skills Table (Modified):
```sql
id                  INT PRIMARY KEY AUTO_INCREMENT
student_id          INT (FK to students)
skill_id            INT (FK to skills)
venue_id            INT (FK to venue) -- NEW
course_name         VARCHAR(255)       -- NEW
proficiency_level   ENUM(...)
total_attempts      INT DEFAULT 1      -- NEW
best_score          DECIMAL(5,2)       -- NEW
latest_score        DECIMAL(5,2)       -- NEW
status              ENUM('Cleared', 'Not Cleared', 'Ongoing') -- NEW
last_attendance     ENUM('Present', 'Absent') -- NEW
last_slot_date      DATE               -- NEW
last_start_time     TIME               -- NEW
last_end_time       TIME               -- NEW
created_at          DATETIME
updated_at          DATETIME           -- NEW
```

---

## Notes

1. **Batch Processing**: Upload processes records in batches of 100 for performance
2. **Transaction Safety**: All uploads are wrapped in database transactions
3. **Duplicate Handling**: Smart duplicate detection based on student_id + skill_id + course_name
4. **Skill Auto-Creation**: New skills are automatically created if they don't exist
5. **Venue Validation**: Venues must exist in the database before upload
6. **Student Validation**: Students must exist in the database before upload

---

## Support

For backend issues, check:
- `server/controllers/skillReportController.js` - Controller logic
- `server/routes/skillReportRoutes.js` - Route definitions
- `server/config/db.js` - Database configuration
