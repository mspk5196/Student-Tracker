# Excel Upload Template for Skill Reports

## Sample Excel File Structure

Create an Excel file (.xlsx or .xls) with the following columns:

### Required Columns:

| Column Name   | Type    | Description                          | Example            | Required |
|--------------|---------|--------------------------------------|--------------------|----------|
| roll_number  | Text    | Student roll number or ID            | CSE2021001         | Yes      |
| course_name  | Text    | Name of the course/skill             | Python Programming | Yes      |
| venue        | Text    | Venue name where training conducted  | Lab A              | Yes      |
| score        | Number  | Score achieved by student            | 85.5               | No       |
| status       | Text    | Cleared / Not Cleared / Ongoing      | Cleared            | No       |
| attendance   | Text    | Present / Absent                     | Present            | No       |
| slot_date    | Date    | Date of the session                  | 2026-01-07         | No       |
| start_time   | Time    | Start time of session                | 09:00              | No       |
| end_time     | Time    | End time of session                  | 12:00              | No       |

### Sample Data Rows:

```
roll_number | course_name         | venue  | score | status      | attendance | slot_date   | start_time | end_time
------------|---------------------|--------|-------|-------------|------------|-------------|------------|----------
CSE2021001  | Python Programming  | Lab A  | 85    | Cleared     | Present    | 2026-01-07  | 09:00      | 12:00
CSE2021002  | Java Basics         | Lab B  | 65    | Not Cleared | Present    | 2026-01-07  | 09:00      | 12:00
CSE2021003  | Data Structures     | Lab A  | 78    | Ongoing     | Absent     | 2026-01-06  | 14:00      | 17:00
CSE2021004  | Web Development     | Lab C  | 92    | Cleared     | Present    | 2026-01-05  | 10:00      | 13:00
```

## Important Notes:

### 1. Roll Number / User ID
- Must match the existing student record in the database
- Case-insensitive matching
- Leading/trailing spaces are automatically trimmed

### 2. Course Name
- If the skill doesn't exist in the database, it will be created automatically
- Case-insensitive matching
- This becomes the "skill_name" in the skills table

### 3. Venue
- Must match an existing venue name in the database
- Case-insensitive matching
- Venue must be assigned to a faculty member

### 4. Score
- Can be any number (decimals allowed)
- Used to calculate proficiency level:
  - 90-100: Expert
  - 75-89: Advanced
  - 50-74: Intermediate
  - Below 50: Beginner

### 5. Status
- Accepted values: "Cleared", "Not Cleared", "Ongoing"
- Case-insensitive
- Default: "Ongoing" if not specified
- Once "Cleared", status cannot be changed back (even in subsequent uploads)

### 6. Attendance
- Accepted values: "Present", "Absent"
- Case-insensitive
- Optional field

### 7. Date Format
- Preferred: YYYY-MM-DD (e.g., 2026-01-07)
- Also accepts: Excel serial dates, MM/DD/YYYY, DD/MM/YYYY
- Will be converted to YYYY-MM-DD format

### 8. Time Format
- Preferred: HH:MM or HH:MM:SS (24-hour format)
- Also accepts: "09:00 AM", "02:30 PM"
- Will be converted to HH:MM:SS format

## Upload Behavior:

### New Records:
- If a student-skill-course combination doesn't exist, a new record is created
- All provided data is inserted

### Existing Records:
- If a student already has a record for the same skill and course:
  - `total_attempts` is incremented by 1
  - `best_score` is updated if new score is higher
  - `latest_score` is updated with the new score
  - `status` can change from "Not Cleared" to "Cleared" or "Ongoing" to "Cleared"
  - `status` cannot change from "Cleared" to anything else (protection)
  - Other fields are updated with latest values

## Upload Limits:

- Maximum file size: **10 MB**
- Maximum records per upload: **5000 rows**
- Processing is done in batches of 100 records

## Error Handling:

The system will report errors for:
- Missing required fields (roll_number, course_name, venue)
- Student not found in database
- Venue not found in database
- Invalid data formats

Errors are reported by row number with specific error messages.

## Example Excel Template:

Download or create a file with these exact headers in the first row:

```
| roll_number | course_name | venue | score | status | attendance | slot_date | start_time | end_time |
```

Then add your data rows below.

## Tips for Best Results:

1. **Clean your data** - Remove extra spaces, check spelling
2. **Use consistent naming** - Keep venue names and course names consistent
3. **Verify roll numbers** - Ensure they match your student database
4. **Date format** - Use YYYY-MM-DD for consistency
5. **Check venues** - Make sure venues exist and are assigned to faculty
6. **Test with small file first** - Upload 10-20 records first to verify format

## Post-Upload:

After successful upload, you'll see:
- Total records processed
- Number of new records inserted
- Number of existing records updated
- Any errors with row numbers and descriptions

You can then:
- View the uploaded data in the table
- Filter by venue, status, or date
- Search for specific students
- Export the data to CSV (Faculty feature)

## Common Issues:

### "Student not found"
- Roll number doesn't exist in users table
- Check spelling and format

### "Venue not found"
- Venue name doesn't match database
- Check venue spelling exactly as it appears in venue table

### "Excel file is empty"
- No data rows after header
- Check that data starts from row 2

### "Only Excel files allowed"
- File must be .xlsx or .xls format
- Save as Excel format if using Google Sheets or other tools

## Support:

For issues with upload or data format, contact your system administrator.
