# Quick Start Guide - Security Updates

## 🚀 What Changed?

Your Student Tracker now uses **JWT-only authentication** with NO sensitive user data in browser storage.

## ⚡ Quick Setup (3 Steps)

### Step 1: Clear Browser Storage
Open browser console (F12) and run:
```javascript
localStorage.clear();
```

### Step 2: Restart Servers

**Backend:**
```bash
cd server
nodemon index.js
```

**Frontend:**
```bash
cd Frontend  
npm run dev
```

### Step 3: Test Login
1. Go to `http://localhost:5173` (or your frontend URL)
2. Login with Google
3. Verify functionality works

## ✅ How to Verify It's Working

### Check localStorage (Should Only Have Token):
1. Open DevTools (F12)
2. Go to: **Application → Local Storage**
3. You should see:
   ```
   token: "eyJhbGc..."
   ```
4. You should NOT see any `user` key

### Check Network Requests:
1. Open DevTools (F12) → **Network** tab
2. Use any feature (attendance, tasks, etc.)
3. Check API calls:
   - ✅ Should have: `/attendance/venues`
   - ❌ Should NOT have: `/attendance/venues/123`
   - ✅ All requests should have `Authorization: Bearer ...` header

## 🧪 Testing Scenarios

### 1. Faculty User
- [ ] Can view assigned venues
- [ ] Can mark attendance
- [ ] Can create tasks/assignments
- [ ] Can manage roadmap

### 2. Admin User
- [ ] Can view ALL venues
- [ ] Can mark attendance for any venue
- [ ] Can create tasks for any venue
- [ ] Can manage all roadmaps

### 3. Student User
- [ ] Can view own attendance dashboard
- [ ] Can view attendance history
- [ ] Can view assigned tasks
- [ ] Can submit assignments

## ⚠️ Common Issues & Fixes

### Issue: "User not found" or 403 errors
**Solution:** Clear localStorage and login again
```javascript
localStorage.clear();
// Then refresh page and login
```

### Issue: "Faculty record not found"
**Solution:** Check database - user needs entry in `faculties` table
```sql
SELECT * FROM faculties WHERE user_id = YOUR_USER_ID;
```

### Issue: Venues not showing
**Solution:** 
1. Check JWT token is present: `localStorage.getItem('token')`
2. Check user role in `/auth/me` response
3. Verify backend JWT middleware is working

## 🔧 Debugging Tools

### Check Current User Data:
```javascript
// In browser console:
fetch('http://localhost:3000/auth/me', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
})
.then(r => r.json())
.then(console.log);
```

### Verify Token is Valid:
```javascript
// Token should exist and be a JWT format:
const token = localStorage.getItem('token');
console.log('Token exists:', !!token);
console.log('Token format valid:', token?.split('.').length === 3);
```

## 📝 What to Report if Issues Occur

1. **Browser console errors** (F12 → Console tab)
2. **Network request details** (F12 → Network tab)
3. **localStorage contents** (F12 → Application → Local Storage)
4. **User role and permissions** (from `/auth/me` response)
5. **Server terminal output** (any errors in nodemon)

## 🎯 Success Indicators

✅ **Login:** Only JWT token in localStorage  
✅ **Security:** No user_id/faculty_id in URLs  
✅ **Functionality:** All features work as before  
✅ **Authorization:** Users see only what they should  

## 🔄 If You Need to Rollback

```bash
git status  # See what changed
git diff    # Review changes
git checkout -- <file>  # Revert specific file
# OR
git reset --hard HEAD~1  # Revert all (BE CAREFUL!)
```

## 📚 More Information

See complete documentation:
- [SECURITY_IMPLEMENTATION_COMPLETE.md](./SECURITY_IMPLEMENTATION_COMPLETE.md) - Full details
- [SECURITY_FIXES_SUMMARY.md](./SECURITY_FIXES_SUMMARY.md) - Technical summary

---

**Need Help?** Check server logs and browser console first!
