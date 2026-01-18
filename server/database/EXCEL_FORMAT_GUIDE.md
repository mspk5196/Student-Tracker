# Excel Upload Format for Student Skills

## Required Columns

Your Excel file must have the following columns (case-insensitive):

| Column Name | Type | Description | Example |
|------------|------|-------------|---------|
| roll_number | Text | Student's roll number (must match users.ID) | 7376231CD102 |
| name | Text | Student's name (optional, for reference) | ABHISHEK R |
| email | Text | Student's email (optional, for reference) | abhishek.cd23@bitsathy.ac.in |
| course_name | Text | Name of the course/skill | HTML / CSS - Level 1 |
| venue | Text | Venue name (must match venue table) | CT Lab |
| attendance | Text | Present or Absent | Present |
| score | Number | Score (0-100) | 75.5 |
| attempt | Number | Attempt number (auto-incremented by system) | 2 |
| status | Text | Cleared, Not Cleared, or Ongoing | Not Cleared |
| slot_date | Date | Date of assessment (YYYY-MM-DD) | 2025-12-24 |
| start_time | Time | Start time (HH:MM:SS) | 13:30:00 |
| end_time | Time | End time (HH:MM:SS) | 15:00:00 |

## Sample Data

```
roll_number	name	email	course_name	venue	attendance	score	attempt	status	slot_date	start_time	end_time
7376231CD102	ABHISHEK R	abhishek.cd23@bitsathy.ac.in	HTML / CSS - Level 1	CT Lab	Present	75.5	2	Not Cleared	2025-12-24	13:30:00	15:00:00
7376231CD102	ABHISHEK R	abhishek.cd23@bitsathy.ac.in	HTML / CSS - Level 1	Digital Library	Present	98.75	2	Cleared	2025-12-27	15:10:00	16:40:00
```

## Important Notes

### Update Logic
- **Unique Key**: student_id + course_name + venue_id
- **If record exists**:
  - Increments `total_attempts` by 1
  - Updates `best_score` if new score is higher
  - Updates `latest_score` to current score
  - Updates `status` from Excel (unless previously Cleared)
  - Updates attendance, date, and times
- **If record doesn't exist**:
  - Creates new record with attempt = 1
  - Sets best_score = latest_score = current score

### Status Rules
- **Once Cleared, Always Cleared**: If a student has previously cleared a course, the status remains "Cleared" even if they fail in subsequent attempts
- Valid status values: `Cleared`, `Not Cleared`, `Ongoing`

### Score Tracking
- `best_score`: Highest score achieved across all attempts
- `latest_score`: Most recent score from current upload
- `total_attempts`: Automatically incremented with each upload

### Venue Matching
- Venue name must exactly match an entry in the `venue` table
- Case-insensitive matching
- Common venues: "AI & Machine Learning Lab", "CT Lab", "Digital Library", "Blockchain Lab"

### Student Matching
- Roll number must exactly match a user's `ID` field in the database
- Case-insensitive matching
- Student must have an active account and student record

## Upload Process

1. **Admin Only**: Only users with admin role can upload
2. **File Format**: .xlsx or .xls Excel files
3. **Maximum Records**: 5000 rows per upload
4. **Batch Processing**: Processed in batches of 100 for performance
5. **Transaction Safety**: All-or-nothing upload with rollback on errors

## Response Format

```json
{
  "message": "Skill reports uploaded successfully",
  "summary": {
    "totalRecords": 100,
    "processed": 98,
    "inserted": 50,
    "updated": 48,
    "errors": 2,
    "errorDetails": [
      { "row": 5, "message": "Student not found: 12345" },
      { "row": 10, "message": "Venue not found: Invalid Lab" }
    ]
  }
}
```

## Common Errors

1. **Student not found**: Roll number doesn't match any user
2. **Venue not found**: Venue name doesn't match venue table
3. **Missing required fields**: roll_number, course_name, or venue is empty
4. **Invalid score**: Score must be a number between 0-100
5. **Invalid date format**: Use YYYY-MM-DD format
6. **Invalid time format**: Use HH:MM:SS format (24-hour)

## Tips

- Use Excel's data validation for status column (dropdown with: Cleared, Not Cleared, Ongoing)
- Use date picker for slot_date column
- Use time format for start_time and end_time columns
- Keep venue names consistent (copy-paste from a reference list)
- Verify roll numbers before upload
- Test with small batch first (10-20 records)

## Database Structure

The data is stored in `student_skills` table with these columns:
- id (auto-increment)
- student_id (FK to students table)
- course_name (text - course/skill name)
- venue_id (FK to venue table)
- total_attempts (auto-incremented)
- best_score (decimal 5,2)
- latest_score (decimal 5,2)
- status (enum: Cleared/Not Cleared/Ongoing)
- last_attendance (enum: Present/Absent)
- last_slot_date (date)
- last_start_time (time)
- last_end_time (time)
- created_at (timestamp)
- updated_at (timestamp)

**Unique Constraint**: (student_id, course_name, venue_id)
