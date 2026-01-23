# Road Map Enhancement - Implementation Guide

## Overview
This document describes the enhancements made to the Road Map feature to support course-based organization and learning objectives.

## Changes Made

### 1. Database Schema Enhancement
**File:** `server/database/roadmap_course_enhancement.sql`

**New Columns Added to `roadmap` table:**
- `course_type` - ENUM('frontend', 'backend', 'react-native', 'devops') - Categorizes modules by course
- `learning_objectives` - TEXT - Stores learning outcomes for each module
- `module_order` - INT - Maintains order within each course (replaces day-based ordering)

**Migration Steps:**
```sql
-- Run this SQL file to update your database
SOURCE server/database/roadmap_course_enhancement.sql;
```

### 2. Backend API Updates
**File:** `server/controllers/roadmap.controller.js`

**Updated Endpoints:**
- `GET /roadmap/venue/:venue_id` - Now returns course_type and learning_objectives
- `POST /roadmap` - Now accepts course_type and learning_objectives
- `PUT /roadmap/:roadmap_id` - Now updates course_type and learning_objectives

**Query Changes:**
- Results are now ordered by `course_type, module_order` instead of just `day`
- All queries now include the new fields

### 3. Frontend UI Updates
**Files:** 
- `Frontend/src/pages/SuperAdmin/Task&Assignments/TaskHeader/Study-Road-Map/RoadMap.jsx`
- `Frontend/src/pages/Faculty/Task&Assignments/TaskHeader/Study-Road-Map/RoadMap.jsx`

**New Features:**

#### Course Selector
- Added a prominent course selector with 4 options:
  - Frontend
  - Backend
  - React Native
  - DevOps
- Modules are filtered based on selected course
- Active course is highlighted with blue background

#### Module Numbering
- Changed from "DAY X" to "M X" (Module X)
- Badge displays "M 1", "M 2", etc. instead of "DAY 1", "DAY 2"
- Removes the chronological/day-wise concept

#### Learning Objectives Field
- New "What You Will Learn" section for each module
- During edit mode: Textarea for entering learning objectives
- Display mode: Styled box with blue accent showing learning objectives
- Supports multi-line content with proper formatting

#### UI Enhancements
- Course selector panel at the top with button-style options
- Section titles with blue underline accent
- Learning objectives displayed in a highlighted box
- Clear visual hierarchy between Description and Learning Objectives

## How to Use

### For Administrators/Faculty:

1. **Select a Venue** from the dropdown

2. **Choose a Course Type** using the course selector buttons:
   - Click on Frontend, Backend, React Native, or DevOps
   - Only modules for the selected course will be displayed

3. **Add a New Module**:
   - Click "Add First Module" (if no modules exist) or "Add Another Module"
   - Module will be created for the currently selected course
   - Module numbering is independent per course (Frontend Module 1, Backend Module 1, etc.)

4. **Setup Module Content**:
   - Click "Setup Content" on a draft module
   - Enter the module title
   - Add description
   - Add learning objectives (what students will learn)
   - Click "Save"

5. **Add Resources**:
   - Click "Add Resource or File"
   - Upload PDFs or add links to videos/external resources

### Example Learning Objectives Format:
```
• Understanding React component lifecycle
• Implementing state management with hooks
• Building responsive layouts with CSS Grid
• Handling API calls and async operations
• Debugging React applications using DevTools
```

## Technical Details

### State Management
- New state variable: `selectedCourse` - tracks the currently selected course filter
- Updated `editData` state to include `learning_objectives`
- `filteredRoadmap` - computed array of modules filtered by selected course

### Filtering Logic
```javascript
const filteredRoadmap = roadmap.filter(item => item.course_type === selectedCourse);
```

### Module Creation
Modules are now created with:
- `course_type`: The currently selected course
- `module_order`: Auto-incremented based on existing modules in the same course
- `learning_objectives`: Empty by default, filled during setup

## Styling

### New Style Definitions:
- `courseSelectorContainer` - Container for course selector
- `courseLabel` - Label for course selector
- `courseButtons` - Flex container for course buttons
- `courseBtn` - Inactive course button style
- `courseBtnActive` - Active course button style (blue with shadow)
- `fieldLabel` - Labels for form fields
- `sectionTitle` - Section headers with blue underline
- `learningObjectives` - Styled box for learning objectives display

## Migration from Old System

### For Existing Data:
1. Run the SQL migration script first
2. All existing modules will default to 'frontend' course type
3. `module_order` will be set to the current `day` value
4. `learning_objectives` will be empty (can be filled later)

### Backward Compatibility:
- The `day` field is retained for backward compatibility
- It's now used as `module_order` but displayed as "Module X"
- Can be safely renamed in future updates if needed

## Testing Checklist

- [ ] Database migration runs successfully
- [ ] Can create new modules for each course type
- [ ] Course filtering works correctly
- [ ] Learning objectives save and display properly
- [ ] Module numbering is independent per course
- [ ] Resources still work with new structure
- [ ] Edit and delete operations work
- [ ] Both SuperAdmin and Faculty views work identically

## Future Enhancements

Potential improvements:
1. Bulk course assignment tool
2. Learning objective templates
3. Export roadmap by course
4. Copy modules between courses
5. Reorder modules within a course
6. Course completion tracking

## Support

For issues or questions, refer to:
- Database schema: `server/database/roadmap_course_enhancement.sql`
- Backend logic: `server/controllers/roadmap.controller.js`
- Frontend component: `Frontend/src/pages/SuperAdmin/Task&Assignments/TaskHeader/Study-Road-Map/RoadMap.jsx`

---
**Last Updated:** January 23, 2026
**Version:** 2.0.0
