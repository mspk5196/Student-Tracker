# 🚀 Quick Start Guide - Skill Reports Management

## Overview
This guide will help you quickly start using the Skill Reports Management system.

---

## For Administrators

### Step 1: Access Skill Reports
1. Login to the application with admin credentials
2. Look for **"Skill Reports"** in the sidebar (under ACADEMIC section)
3. Click to open the Skill Reports page

### Step 2: Prepare Your Excel File
Create an Excel file with these columns:

| id | roll_number | user_id | name | year | email | course_name | venue | attendance | score | attempt | status | slot_date | start_time | end_time |
|----|-------------|---------|------|------|-------|-------------|-------|------------|-------|---------|--------|-----------|------------|----------|

**Column Details:**
- `id` - Slot ID (stored as slot_id in database)
- `roll_number` - Student roll number (must match users.ID)
- `user_id` - Optional user ID reference
- `name` - Student name from Excel
- `year` - Student year (supports Roman numerals: I, II, III, IV or numbers 1, 2, 3, 4)
- `email` - Student email
- `course_name` - Name of the skill/course
- `venue` - Venue name
- `attendance` - Present/Absent
- `score` - Score (0-100)
- `attempt` - Attempt count (entered by admin, NOT auto-incremented)
- `status` - Cleared/Not Cleared/Ongoing
- `slot_date` - Date (YYYY-MM-DD format)
- `start_time` - Start time (HH:MM or HH:MM:SS)
- `end_time` - End time (HH:MM or HH:MM:SS)

**Example Data:**
```
1 | 7376242AL101 | 265 | ABARNA S | II | abarnas@example.com | Python Programming | Lab A | Present | 85 | 1 | Cleared | 2026-01-07 | 09:00 | 12:00
2 | 7376242AL102 | 266 | ABISHEK K | II | abishek@example.com | Java Basics | Lab B | Present | 65 | 2 | Not Cleared | 2026-01-07 | 09:00 | 12:00
```

**Upload Rules:**
- If same student + course + same date exists → **SKIP** (no duplicate)
- If same student + course + different date → **INSERT** new record
- Attempt count comes from Excel (not auto-incremented)
- Frontend displays only the **latest record** (most recent slot_date)

### Step 3: Upload the File
1. Click the upload area or drag your Excel file
2. Selected file name will appear
3. Click **"Upload File"** button
4. Watch the progress bar (0-100%)
5. Review the upload summary

### Step 4: View Results
After upload, you'll see:
- ✅ **Processed**: How many records were handled
- 📊 **Inserted**: New records added
- 🔄 **Updated**: Existing records modified
- ❌ **Errors**: Failed records (with details)

### Step 5: Filter and Search
Use the filter bar to:
- 🔍 **Search**: Type student name or roll number
- 🏢 **Venue**: Select specific venue
- ✅ **Status**: Filter by Cleared/Not Cleared/Ongoing
- 📅 **Date**: Select specific date
- 🔄 **Reset**: Clear all filters

---

## For Faculty

### Step 1: Access Skill Reports
1. Login with faculty credentials
2. Click **"Skill Reports"** in sidebar
3. You'll see reports for your assigned venues only

### Step 2: Select Your Venue
1. Use the venue dropdown
2. Only your assigned venues appear
3. Select a venue to view reports

### Step 3: Search and Filter
- Search students by name or roll number
- Filter by status (Cleared/Not Cleared/Ongoing)
- Filter by date
- Click Reset to clear filters

### Step 4: Export Data
1. Apply filters if needed
2. Click **"Export CSV"** button (top-right)
3. File will download automatically
4. Open in Excel or Google Sheets

---

## Understanding the Table

### Columns Explained:

| Column | Description |
|--------|-------------|
| **Roll No** | Student ID/Roll Number |
| **Student Name** | Name and email of student |
| **Department** | Student's department |
| **Course** | Name of the skill/course |
| **Venue** | Where training was conducted |
| **Attempts** | Number of times attempted |
| **Best Score** | Highest score achieved |
| **Latest Score** | Most recent score |
| **Status** | Cleared ✅ / Not Cleared ❌ / Ongoing ⏰ |
| **Last Date** | Date of last attempt |
| **Attendance** | Present ✅ / Absent ❌ |

### Status Colors:
- 🟢 **Green (Cleared)**: Student successfully completed
- 🔴 **Red (Not Cleared)**: Student did not meet requirements
- 🟡 **Orange (Ongoing)**: Still in progress

---

## Statistics Dashboard

At the top of the page, you'll see:

📊 **Total Students**: Total number of unique student records
✅ **Cleared**: Students who successfully completed
❌ **Not Cleared**: Students who didn't meet requirements
⏰ **Ongoing**: Students still in progress
📈 **Avg. Best Score**: Average of all best scores

---

## Common Tasks

### How to find a specific student:
1. Type name or roll number in search box
2. Press Enter or wait for auto-search
3. Results will filter automatically

### How to see only cleared students:
1. Select "Cleared" from Status dropdown
2. Table updates automatically

### How to export specific data:
1. Apply your filters (status, date, etc.)
2. Click "Export CSV"
3. Exported file contains filtered data

### How to refresh data:
- Click the **Refresh** button (↻) next to "Skill Reports" title
- Or click **Reset** to clear filters and reload

---

## Tips & Tricks

### For Best Results:
1. 📝 **Clean Data**: Ensure Excel file has no empty rows
2. ✅ **Verify Names**: Check venue and student names match database
3. 📅 **Date Format**: Use YYYY-MM-DD (e.g., 2026-01-07)
4. 🔢 **Scores**: Use numbers only (decimals allowed)
5. 📊 **Small Tests**: Upload 10-20 records first to test

### Keyboard Shortcuts:
- **Enter** in search box → Trigger search
- **Escape** → Clear search (when search box is focused)

### Pagination:
- Each page shows 50 records
- Use Previous/Next buttons at bottom
- Page info shows current position

---

## Excel File Rules

### Required Fields:
- ✅ `roll_number` - Must exist in database (users.ID)
- ✅ `course_name` - Course/skill name
- ✅ `venue` - Venue name

### Recommended Fields:
- `id` - Slot ID (stored as slot_id)
- `name` - Student name from Excel
- `year` - Year (I, II, III, IV or 1, 2, 3, 4)
- `email` - Student email
- `attempt` - Attempt count (admin enters this)
- `score` - Any number (0-100 typical)
- `status` - Cleared/Not Cleared/Ongoing
- `attendance` - Present/Absent
- `slot_date` - Date of session (YYYY-MM-DD)
- `start_time` - Start time
- `end_time` - End time

### Important Notes:
- **File Size Limit**: 10 MB maximum
- **Record Limit**: 5000 rows per upload
- **File Format**: .xlsx or .xls only
- **Duplicate Handling**: 
  - Same date = SKIP (not inserted)
  - Different date = INSERT new record
- **Attempt Count**: NOT auto-incremented, use value from Excel
- **Display**: Frontend shows only the LATEST record (most recent slot_date)

---

## Troubleshooting

### "Student not found" Error:
- Roll number doesn't exist
- Check spelling and format
- Verify in student database

### "Venue not found" Error:
- Venue name doesn't match
- Check exact spelling (case-insensitive)
- Contact admin to create venue

### No data showing:
- Check if venue has any reports
- Try resetting filters
- Refresh the page

### Upload failed:
- Check file format (.xlsx or .xls)
- Verify file size (<10 MB)
- Check required columns present

### Can't see upload button (Faculty):
- This is correct! Faculty cannot upload
- Only admins can upload Excel files
- Contact admin to upload data

---

## Need Help?

### Documentation:
- 📖 **Frontend Guide**: `Frontend/SKILL_REPORTS_README.md`
- 📋 **Excel Template**: `Frontend/EXCEL_TEMPLATE_GUIDE.md`
- 🔌 **API Reference**: `server/SKILL_REPORTS_API.md`
- ✅ **Implementation**: `IMPLEMENTATION_COMPLETE.md`

### Contact:
- System Administrator for access issues
- IT Support for technical problems
- Database Team for data-related queries

---

## Quick Reference

### Admin Checklist:
- [ ] Login as admin
- [ ] Navigate to Skill Reports
- [ ] Prepare Excel file with required columns
- [ ] Upload file
- [ ] Review upload summary
- [ ] Check for errors
- [ ] Use filters to verify data
- [ ] Done! ✅

### Faculty Checklist:
- [ ] Login as faculty
- [ ] Navigate to Skill Reports
- [ ] Select your venue
- [ ] Search/filter students
- [ ] Review data
- [ ] Export CSV if needed
- [ ] Done! ✅

---

## Sample Excel Template

Download or create with these headers:

```
| id | roll_number | user_id | name | year | email | course_name | venue | attendance | score | attempt | status | slot_date | start_time | end_time |
```

**Notes:**
- `id` = Slot ID (stored as slot_id)
- `year` = Supports Roman numerals (I, II, III, IV) or numbers
- `attempt` = Manual entry by admin (not auto-incremented)
- Same student + course + same date = SKIP
- Same student + course + different date = INSERT new record
- Frontend shows only the LATEST record per student/course

Add your data rows below the headers.

---

**Version**: 1.0.0
**Last Updated**: January 7, 2026
**Status**: Ready to Use 🚀

---

## Quick Command Reference

### Start Application:
```bash
# Backend
cd server && npm start

# Frontend  
cd Frontend && npm run dev
```

### Access Application:
```
Frontend: http://localhost:5173
Backend API: http://localhost:5000/api
```

---

**Happy tracking! 📊✨**
