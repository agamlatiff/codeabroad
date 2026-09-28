# API Specification
# CodeAbroad

**Version:** v1  
**Base URL:** `http://localhost:8080/api/v1`  
**Auth:** Bearer Token (JWT)  
**Last Updated:** 2026-09-28

---

## Response Format

### Success
```json
{
  "success": true,
  "message": "string",
  "data": {}
}
```

### Error
```json
{
  "success": false,
  "error": "human readable message",
  "code": "ERROR_CODE"
}
```

### Common Error Codes
| Code | HTTP Status | Description |
|------|-------------|-------------|
| `UNAUTHORIZED` | 401 | Missing or invalid token |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 422 | Invalid request body |
| `INTERNAL_ERROR` | 500 | Server error |

---

## Authentication

### POST `/auth/register`
Register a new user.

**Request Body:**
```json
{
  "name": "Rizki Pratama",
  "email": "rizki@example.com",
  "password": "SecurePass123!"
}
```

**Response `201`:**
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": {
      "id": "uuid",
      "name": "Rizki Pratama",
      "email": "rizki@example.com"
    },
    "access_token": "eyJ...",
    "refresh_token": "eyJ..."
  }
}
```

---

### POST `/auth/login`
Login with email and password.

**Request Body:**
```json
{
  "email": "rizki@example.com",
  "password": "SecurePass123!"
}
```

**Response `200`:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "access_token": "eyJ...",
    "refresh_token": "eyJ..."
  }
}
```

---

### POST `/auth/refresh`
Refresh access token.

**Request Body:**
```json
{
  "refresh_token": "eyJ..."
}
```

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "access_token": "eyJ..."
  }
}
```

---

### POST `/auth/logout`
🔒 **Auth required**

**Response `200`:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## Users

### GET `/users/me`
🔒 **Auth required** — Get current user profile.

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Rizki Pratama",
    "username": "rizki_dev",
    "email": "rizki@example.com",
    "avatar_url": "https://example.com/avatar.jpg",
    "bio": "Backend dev dreaming of Japan 🇯🇵",
    "github_url": "https://github.com/rizki_dev",
    "linkedin_url": "https://linkedin.com/in/rizki_dev",
    "career_path": "backend",
    "country_target": "JP",
    "level": "beginner",
    "xp": 1250,
    "current_level": 5,
    "streak": 7,
    "readiness_score": 34,
    "is_onboarded": true,
    "last_active_at": "2026-09-28T10:00:00Z"
  }
}
```

---

### PATCH `/users/me`
🔒 **Auth required** — Update user profile.

**Request Body (all optional):**
```json
{
  "name": "Rizki Updated",
  "username": "rizki_dev_new",
  "avatar_url": "https://example.com/new-avatar.jpg",
  "bio": "Backend dev, dreaming of Tokyo 🗼",
  "github_url": "https://github.com/rizki_dev",
  "linkedin_url": "https://linkedin.com/in/rizki_dev",
  "country_id": "uuid",
  "career_path_id": "uuid"
}
```

**Response `200`:**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": "uuid",
    "name": "Rizki Updated",
    "username": "rizki_dev_new",
    "avatar_url": "https://example.com/new-avatar.jpg",
    "bio": "Backend dev, dreaming of Tokyo 🗼",
    "github_url": "https://github.com/rizki_dev",
    "linkedin_url": "https://linkedin.com/in/rizki_dev"
  }
}
```

---

## Onboarding

### POST `/onboarding`
🔒 **Auth required** — Complete onboarding after registration.

**Request Body:**
```json
{
  "country_code": "JP",
  "career_path": "backend",
  "level": "beginner"
}
```

**Response `200`:**
```json
{
  "success": true,
  "message": "Onboarding complete",
  "data": {
    "player_profile": {
      "career_path": "Backend Developer",
      "country_target": "Japan 🇯🇵",
      "starting_quests": [
        { "id": "uuid", "title": "Set up your development environment", "xp_reward": 50 }
      ]
    }
  }
}
```

---

## Quests

### GET `/quests`
🔒 **Auth required** — Get all quests for current user.

**Query Params:**
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `type` | string | all | main / side / daily |
| `status` | string | all | locked / available / completed |

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "quests": [
      {
        "id": "uuid",
        "title": "Learn Git basics",
        "description": "Master version control with Git",
        "type": "main",
        "status": "available",
        "xp_reward": 100,
        "estimated_minutes": 60,
        "resource_url": "https://learngitbranching.js.org",
        "difficulty": "beginner",
        "order_index": 1
      }
    ],
    "total": 42,
    "completed": 8
  }
}
```

---

### GET `/quests/:id`
🔒 **Auth required** — Get quest detail.

---

### POST `/quests/:id/complete`
🔒 **Auth required** — Mark a quest as completed.

**Response `200`:**
```json
{
  "success": true,
  "message": "Quest completed!",
  "data": {
    "xp_gained": 100,
    "total_xp": 1350,
    "level_up": false,
    "current_level": 5,
    "streak": 8,
    "achievements_unlocked": []
  }
}
```

---

### GET `/quests/daily`
🔒 **Auth required** — Get today's daily quests.

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "date": "2026-09-28",
    "quests": [...],
    "resets_at": "2026-09-29T00:00:00Z"
  }
}
```

---

## Progress

### GET `/progress`
🔒 **Auth required** — Get full user progress summary.

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "xp": 1350,
    "current_level": 5,
    "xp_to_next_level": 650,
    "streak": 8,
    "readiness_score": 34,
    "quests_completed": 8,
    "total_quests": 42,
    "achievements": [
      { "id": "uuid", "name": "First Steps", "unlocked_at": "2026-09-21T10:00:00Z" }
    ]
  }
}
```

---

## Achievements

### GET `/achievements`
🔒 **Auth required** — Get all achievements (locked & unlocked).

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "achievements": [
      {
        "id": "uuid",
        "name": "First Steps",
        "description": "Complete your first quest",
        "icon": "🚀",
        "unlocked": true,
        "unlocked_at": "2026-09-21T10:00:00Z"
      },
      {
        "id": "uuid",
        "name": "On Fire",
        "description": "Maintain a 7-day streak",
        "icon": "🔥",
        "unlocked": false,
        "unlocked_at": null
      }
    ]
  }
}
```

---

## Countries

### GET `/countries`
Get list of supported countries. (Public — no auth required)

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "countries": [
      {
        "id": "uuid",
        "code": "JP",
        "name": "Japan",
        "flag": "🇯🇵",
        "visa_info": { "type": "Engineer/Humanities Visa", "requirements": [...] },
        "salary_range": { "min": 3500000, "max": 8000000, "currency": "JPY" }
      }
    ]
  }
}
```

---

## Career Paths

### GET `/career-paths`
Get list of career paths. (Public — no auth required)

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "career_paths": [
      { "id": "uuid", "slug": "frontend", "label": "Frontend Developer" },
      { "id": "uuid", "slug": "backend", "label": "Backend Developer" },
      { "id": "uuid", "slug": "fullstack", "label": "Fullstack Developer" },
      { "id": "uuid", "slug": "devops", "label": "DevOps Engineer" }
    ]
  }
}
```
