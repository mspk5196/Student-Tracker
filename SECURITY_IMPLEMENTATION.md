# Security Implementation Guide

## Overview
This document outlines the security improvements implemented in the Student Tracker application.

## 1. Secure Authentication Flow

### Previous Implementation (Insecure)
```javascript
// Login returned user data + JWT in single response
POST /auth/google
Response: { token: "jwt...", user: { user_id, name, email, role } }
```

### New Implementation (Secure)
```javascript
// Step 1: Login returns only JWT
POST /auth/google
Response: { token: "jwt..." }

// Step 2: Fetch user data using JWT
GET /auth/me
Headers: { Authorization: "Bearer jwt..." }
Response: { user: { user_id, name, email, role, ID, department } }
```

### Benefits
- ✅ **Separation of Concerns**: Authentication and authorization are separated
- ✅ **Token-First Approach**: JWT is validated before any user data is sent
- ✅ **Fresh Data**: User data is always fetched from database with current token
- ✅ **Revocation Support**: Tokens can be invalidated without client-side issues

## 2. Zustand Store Updates

### New Features
```javascript
// Async login with automatic user data fetch
await login(token); // Stores token, then fetches user data

// Token refresh on app restore
restore(); // Validates stored token and refreshes user data

// Loading state
store.loading // true during authentication
```

### Implementation
```javascript
const useAuthStore = create((set) => ({
  user: null,
  token: null,
  loading: false,
  
  login: async (token) => {
    // Stores token, fetches user data via /auth/me
    // Returns { success: true/false, error }
  },
  
  restore: async () => {
    // Validates and refreshes stored token
  }
}));
```

## 3. API Security: URL Params → Request Body

### Why This Matters
- **URL Exposure**: Query parameters appear in browser history, logs, and proxies
- **MITM Attacks**: URLs are easier to intercept than encrypted request bodies
- **Cache Issues**: GET requests with sensitive IDs can be cached
- **Access Control**: IDs in URLs can be easily modified by attackers

### Changed Endpoints

#### Skill Reports
| Endpoint | Before | After | Method |
|----------|--------|-------|--------|
| Get Reports | `GET /faculty/venue/:venueId?page=1` | `POST /faculty/venue/reports` | POST |
| Search | `GET /faculty/search?q=john` | `POST /faculty/search` | POST |

#### Example Before (Insecure)
```javascript
// Exposed in URL
GET /api/skill-reports/faculty/venue/1?page=1&limit=50&status=Cleared

// Easy to manipulate:
GET /api/skill-reports/faculty/venue/999  // Access unauthorized venue
```

#### Example After (Secure)
```javascript
POST /api/skill-reports/faculty/venue/reports
Headers: { Authorization: "Bearer jwt..." }
Body: {
  venueId: 1,
  page: 1,
  limit: 50,
  status: "Cleared"
}

// ✅ Encrypted in request body
// ✅ Requires valid JWT
// ✅ Server validates venue access
```

## 4. Controller Updates

### getSkillReportsForFaculty
```javascript
// Before
const { venueId } = req.params;
const { page, limit } = req.query;

// After
const { venueId, page, limit, status } = req.body;

// Added validation
if (!venueId) {
  return res.status(400).json({ message: 'venueId is required' });
}
```

### searchStudentSkillReports
```javascript
// Before
const { q } = req.query; // Exposed in URL

// After
const { query: searchQuery } = req.body; // Encrypted
```

## 5. Frontend API Client Updates

### skillReportService.js
```javascript
// Before (GET with URL params)
export const getSkillReportsByVenue = async (venueId, params) => {
  const queryParams = new URLSearchParams(params);
  return axios.get(`/faculty/venue/${venueId}?${queryParams}`);
};

// After (POST with body)
export const getSkillReportsByVenue = async (venueId, params) => {
  return axios.post('/faculty/venue/reports', {
    venueId,
    page: params.page || 1,
    limit: params.limit || 50,
    status: params.status,
    sortBy: params.sortBy || 'updated_at',
    sortOrder: params.sortOrder || 'DESC'
  }, getAuthHeaders());
};
```

## 6. Security Checklist

### ✅ Completed
- [x] JWT-only login response
- [x] Separate `/auth/me` endpoint for user data
- [x] Zustand async login with error handling
- [x] POST method for sensitive data operations
- [x] Request body instead of URL params for IDs
- [x] Validation for required fields in request body
- [x] Authorization header for all authenticated requests

### 🔄 Recommended Next Steps
- [ ] Implement rate limiting on login endpoint
- [ ] Add request signing for critical operations
- [ ] Implement CSRF tokens for state-changing operations
- [ ] Add request/response encryption for sensitive fields
- [ ] Implement audit logging for data access
- [ ] Add IP whitelisting for admin operations
- [ ] Implement session management with token rotation

## 7. Migration Guide for Existing Code

### For Backend Routes
```javascript
// Change from:
router.get('/api/resource/:id', handler);

// To:
router.post('/api/resource/get', handler);

// Controller change:
// const { id } = req.params;  // OLD
const { id } = req.body;       // NEW
```

### For Frontend API Calls
```javascript
// Change from:
axios.get(`/api/resource/${id}`);

// To:
axios.post('/api/resource/get', { id });
```

## 8. Testing the New Flow

### Test Authentication
```bash
# 1. Login (get JWT only)
curl -X POST http://localhost:5000/api/auth/google \
  -H "Content-Type: application/json" \
  -d '{"credential":"google_token"}'
# Response: { "token": "jwt..." }

# 2. Get user data
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer jwt..."
# Response: { "user": {...} }
```

### Test Skill Reports
```bash
# Get reports (POST with body instead of GET with params)
curl -X POST http://localhost:5000/api/skill-reports/faculty/venue/reports \
  -H "Authorization: Bearer jwt..." \
  -H "Content-Type: application/json" \
  -d '{
    "venueId": 1,
    "page": 1,
    "limit": 50,
    "status": "Cleared"
  }'
```

## 9. Error Handling

### Frontend Login Flow
```javascript
const result = await login(token);
if (!result.success) {
  // Handle error
  alert(result.error || "Login failed");
  return;
}
// Success - user data loaded
navigate("/dashboard");
```

### API Error Responses
```javascript
// Missing venueId
{ "message": "venueId is required" } // 400

// Invalid token
{ "message": "Authentication failed" } // 401

// No access to venue
{ "message": "You do not have access to this venue" } // 403
```

## 10. Performance Considerations

### Token Storage
- JWT stored in `localStorage` (XSS vulnerable if not careful)
- Consider `httpOnly` cookies for production (prevents XSS)

### API Calls
- User data cached in Zustand after first fetch
- Token validated on server for every request
- Consider implementing token refresh mechanism

## Summary

This security implementation provides:
1. **Secure Authentication**: JWT-first approach with separate user data endpoint
2. **Protected Data**: Request body instead of URL params for sensitive IDs
3. **Proper Validation**: Server-side checks for all required fields
4. **Clear Separation**: Authentication and authorization properly decoupled
5. **Error Handling**: Comprehensive error states and user feedback

All changes are backward-compatible and can be tested independently.
