# Roadmaps & Materials API Documentation

## Overview
Complete backend implementation for the Roadmaps & Materials feature. This allows faculty/admins to create learning roadmaps with modules and resources, and students to track their progress.

## Database Setup

Run the SQL schema first:
```bash
# Execute the SQL file in your MySQL database
mysql -u your_user -p your_database < server/database/roadmaps_schema.sql
```

## API Endpoints

### Student Endpoints

#### 1. Get Student's Roadmaps
**GET** `/api/roadmaps/student/:studentId`

Returns all roadmaps available to a student based on their enrolled groups.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "roadmap_id": 1,
      "code": "REACT-101",
      "title": "React Mastery Workshop",
      "description": "Complete React.js learning path",
      "instructor": "Prof. Sarah Johnson",
      "totalModules": 10,
      "completedModules": 3,
      "progress": 30
    }
  ]
}
```

#### 2. Get Roadmap Details
**GET** `/api/roadmaps/:roadmapId?studentId=123`

Returns full roadmap with modules and resources. Include `studentId` query param to get progress data.

**Response:**
```json
{
  "success": true,
  "data": {
    "roadmap_id": 1,
    "roadmap_code": "REACT-101",
    "title": "React Mastery Workshop",
    "instructor_name": "Prof. Sarah Johnson",
    "modules": [
      {
        "id": 1,
        "day": 1,
        "title": "React Fundamentals",
        "description": "Introduction to React",
        "status": "completed",
        "resources": [
          {
            "resource_id": 1,
            "name": "React_Docs.pdf",
            "type": "pdf",
            "url": "https://...",
            "kind": "pdf"
          }
        ]
      }
    ]
  }
}
```

#### 3. Get Student Progress
**GET** `/api/roadmaps/student/:studentId/progress/:roadmapId`

Returns completion statistics for a student on a specific roadmap.

**Response:**
```json
{
  "success": true,
  "data": {
    "totalModules": 10,
    "completedModules": 3,
    "progress": 30
  }
}
```

#### 4. Update Module Progress
**PUT** `/api/roadmaps/modules/:moduleId/progress`

Mark a module as completed or incomplete.

**Request Body:**
```json
{
  "studentId": 123,
  "isCompleted": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Module marked as completed"
}
```

### Faculty/Admin Endpoints

#### 5. Get All Roadmaps
**GET** `/api/roadmaps?groupId=1`

Returns all roadmaps. Optional `groupId` filter.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "roadmap_id": 1,
      "roadmap_code": "REACT-101",
      "title": "React Mastery Workshop",
      "group_name": "Morning Batch",
      "group_code": "MB-2024",
      "total_modules": 10,
      "status": "active",
      "created_at": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

#### 6. Create Roadmap
**POST** `/api/roadmaps`

Create a new roadmap for a group.

**Request Body:**
```json
{
  "groupId": 1,
  "roadmapCode": "REACT-101",
  "title": "React Mastery Workshop",
  "description": "Complete React.js learning path",
  "instructorName": "Prof. Sarah Johnson"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Roadmap created successfully",
  "data": {
    "roadmapId": 5
  }
}
```

#### 7. Add Module
**POST** `/api/roadmaps/:roadmapId/modules`

Add a new module/day to a roadmap.

**Request Body:**
```json
{
  "dayNumber": 1,
  "title": "React Fundamentals & JSX",
  "description": "Introduction to React and JSX syntax",
  "status": "published"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Module added successfully",
  "data": {
    "moduleId": 42,
    "dayNumber": 1
  }
}
```

#### 8. Update Module
**PUT** `/api/roadmaps/modules/:moduleId`

Update module details.

**Request Body:**
```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "status": "published"
}
```

#### 9. Delete Module
**DELETE** `/api/roadmaps/modules/:moduleId`

Delete a module and all its resources.

#### 10. Add Resource
**POST** `/api/roadmaps/modules/:moduleId/resources`

Add a resource (PDF, video, link) to a module.

**Request Body:**
```json
{
  "resourceName": "React Official Docs",
  "resourceType": "pdf",
  "resourceUrl": "https://react.dev/learn",
  "filePath": null
}
```

**Resource Types:** `pdf`, `video`, `link`, `file`

#### 11. Delete Resource
**DELETE** `/api/roadmaps/resources/:resourceId`

Delete a resource from a module.

## Database Schema

### Tables Created:
1. **roadmaps** - Main roadmap info linked to groups
2. **roadmap_modules** - Individual modules/days in a roadmap
3. **module_resources** - Resources attached to modules
4. **student_module_progress** - Tracks student completion

### Key Features:
- Automatic cascade deletion (delete roadmap → deletes modules → deletes resources)
- Unique constraint on roadmap codes
- Unique constraint on (roadmap, day_number)
- Progress tracking per student per module
- Support for multiple resource types

## Frontend Integration

Update your frontend API calls to match these endpoints:

```javascript
// Student fetching their roadmaps
const response = await fetch(`/api/roadmaps/student/${studentId}`);

// Get roadmap with student progress
const response = await fetch(`/api/roadmaps/${roadmapId}?studentId=${studentId}`);

// Mark module complete
await fetch(`/api/roadmaps/modules/${moduleId}/progress`, {
  method: 'PUT',
  body: JSON.stringify({ studentId, isCompleted: true })
});

// Faculty creating roadmap
await fetch('/api/roadmaps', {
  method: 'POST',
  body: JSON.stringify({ groupId, roadmapCode, title, description, instructorName })
});
```

## Testing

Test the endpoints manually or create a test file:

```bash
# In the node terminal
cd server
node
# Then test queries or use a tool like Postman/Thunder Client
```

## Next Steps

1. Run the SQL schema to create tables
2. Test the endpoints with Postman/Thunder Client
3. Update frontend components to use the real API
4. Add file upload handling for PDF/document resources
5. Add authorization checks (ensure students can only see their roadmaps)
6. Consider adding pagination for large roadmap lists
