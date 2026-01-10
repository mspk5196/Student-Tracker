# Student Skill & Task Tracker

A premium React application for Faculty to track student progress, attendance, and tasks.

## Features
- **Dashboard**: Overview of classes, students, and pending tasks.
- **Class Management**: Create venues (classes), view details, and map students.
- **Task Tracking**: Assign daily tasks to classes and track them.
- **Attendance**: Mark daily attendance with a visual grid.
- **Skill Matrix**: Track student proficiency in various skills.

## Technology Stack
- **Framework**: React (Vite)
- **Styling**: Vanilla CSS (Modern Glassmorphism Design)
- **Icons**: Lucide React
- **State Management**: React Context API & LocalStorage

## How to Run

1. Navigate to the frontend directory:
   ```bash
   cd Frontend
   ```

2. Install dependencies (if not already done):
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser at `http://localhost:5173` (or the URL shown in terminal).

## Usage Guide
1. **Create a Class**: Go to "My Classes" and click "Create Class".
2. **Add Students**: In "My Classes", click "Add Student" on a class card.
3. **Assign Tasks**: Go to "Tasks" to create new assignments.
4. **Mark Attendance**: Go to "Attendance", select a class and date, and toggle status.
5. **Update Skills**: Go to "Skill Tracking" to update student progress.

Note: Data is saved to your browser's LocalStorage.


 Important Notes
Student Upload - Creates new users if they don't exist
Skill Reports - Students must already exist in the database
Venue matching - Venue names must match exactly (case-insensitive)
Date format - Preferred: YYYY-MM-DD (e.g., 2026-01-07)
Time format - Preferred: HH:MM or HH:MM:SS (24-hour)
Max file size - 10 MB
Max records - 5000 rows per upload



lc 3rd floor  balamurugan sir  student bulk upload 


