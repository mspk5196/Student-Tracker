# 🚨 CRITICAL: Database Schema Issues Found

## Date: January 9, 2026

---

## ⚠️ **CRITICAL BUG DISCOVERED**

### **facultyDashboard.js has INCORRECT column references!**

The file `server/controllers/facultyDashboard.js` is using **WRONG** column names that **DO NOT EXIST** in your database schema:

#### ❌ **Incorrect Usage:**
```javascript
// Line 51: groups table does NOT have 'ID' column
WHERE g.ID = ?  // WRONG! groups table uses 'faculty_id'

// Line 76: tasks table does NOT have 'ID' column  
WHERE t.ID = ?  // WRONG! tasks table uses 'faculty_id'

// Line 233: attendance table does NOT have 'ID' column
WHERE ID = ?    // WRONG! attendance table uses 'faculty_id'
```

#### ✅ **Should be:**
```javascript
// groups table has 'faculty_id'
WHERE g.faculty_id = ?

// tasks table has 'faculty_id'
WHERE t.faculty_id = ?

// attendance table has 'faculty_id'
WHERE faculty_id = ?
```

---

## 🔍 **Re-Verified Analysis Results**

After thorough re-verification of ALL files, here are the **CONFIRMED** findings:

### ✅ **UNUSED TABLES (Safe to Drop - 4 tables)**

1. **`mapping_history`**
   - ❌ No references found anywhere
   - Status: Completely unused
   - Action: DROP

2. **`resources`**
   - ❌ Replaced by `roadmap_resources` table
   - Old table from previous implementation
   - Action: DROP

3. **`venue_skills`**
   - ❌ No references found anywhere
   - Feature never implemented
   - Action: DROP

4. **`student_report`**
   - ⚠️ **PARTIALLY USED BUT INCORRECTLY**
   - Found in `student.controller.js` lines 86, 91, 167, 172, 241-242
   - **BUT** the queries are wrong - they query `student_report` but should use `task_submissions`
   - The table appears empty and functionality replaced by `task_submissions`
   - Action: DROP (after fixing queries)

---

## 🐛 **BUGS TO FIX IMMEDIATELY**

### **Bug #1: facultyDashboard.js - Wrong Column Names**

**File:** `server/controllers/facultyDashboard.js`  
**Lines:** 51, 58, 65, 76, 85, 139, 188, 199, 208, 224, 233, 286, 372, 383, 466, 535, 566, 575, 591, 693

**Issue:** Using `ID` column which doesn't exist in `groups`, `tasks`, and `attendance` tables

**Fix Required:** Replace all instances of:
- `g.ID` → `g.faculty_id` (in groups queries)
- `t.ID` → `t.faculty_id` (in tasks queries)  
- `WHERE ID = ?` → `WHERE faculty_id = ?` (in attendance queries)

### **Bug #2: student.controller.js - Wrong Table References**

**File:** `server/controllers/student.controller.js`  
**Lines:** 86, 91, 167, 172, 241, 242

**Issue:** Queries reference `student_report` table which is obsolete

**Fix Required:** Replace all `student_report` references with `task_submissions`:

```sql
-- OLD (WRONG):
(SELECT COUNT(*) FROM student_report sr WHERE sr.student_id = s.student_id)

-- NEW (CORRECT):
(SELECT COUNT(*) FROM task_submissions ts WHERE ts.student_id = s.student_id AND ts.status = 'Graded')
```

---

## 📊 **Database Cleanup Summary**

### **Tables to DROP (4)**
- `mapping_history` ✅
- `resources` ✅
- `venue_skills` ✅
- `student_report` ✅ (after fixing bugs above)

### **Tables in ACTIVE Use (18)**
All other tables are correctly used

### **Columns Status**
- ❌ **Missing columns referenced in code:**
  - `groups.ID` - Does NOT exist (bug in facultyDashboard.js)
  - `tasks.ID` - Does NOT exist (bug in facultyDashboard.js)
  - `attendance.ID` - Does NOT exist (bug in facultyDashboard.js)

- ✅ **All other columns exist and are used**

### **Table Issues Found**
1. `venue_allocation` - Partially used, consider consolidating later
2. `attendance.remarks` - Column exists but never used in queries
3. `groups` table - Has extra columns but they may be used for future features

---

## 🛠️ **Action Items - PRIORITY ORDER**

### **URGENT - Fix Code Bugs First**
1. ✅ Fix `facultyDashboard.js` - Replace all `ID` with `faculty_id`
2. ✅ Fix `student.controller.js` - Replace `student_report` with `task_submissions`
3. ✅ Test application thoroughly after fixes

### **After Bug Fixes - Database Cleanup**
4. Backup database
5. Run cleanup script to drop unused tables
6. Add performance indexes
7. Verify application works correctly

---

## 📝 **Verification Checklist**

- [x] Searched all controller files
- [x] Searched all route files
- [x] Searched frontend components
- [x] Cross-referenced with actual schema
- [x] Found code bugs using wrong column names
- [x] Verified unused tables
- [x] Checked all foreign key relationships

---

## ⚡ **Updated Migration Script Needed**

The previous migration script is **INVALID** until you fix the code bugs first!

**New recommended order:**
1. Fix the code bugs in facultyDashboard.js and student.controller.js
2. Test the application
3. Then run database cleanup

---

## 🎯 **FINAL RECOMMENDATION**

**DO NOT run the database cleanup script yet!**

Your application has critical bugs where it's trying to use columns that don't exist:
- `groups.ID` (should be `faculty_id`)
- `tasks.ID` (should be `faculty_id`)
- `attendance.ID` (should be `faculty_id`)

**Fix these bugs first**, then you can safely clean up the unused tables.

---

## 📧 **Questions to Answer:**

1. Is `facultyDashboard.js` currently working? (It shouldn't be if it's using wrong columns)
2. Should we fix the bugs first or is this code not being used?
3. Do you want me to create the bug fix script?

