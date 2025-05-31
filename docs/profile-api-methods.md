# Profile API Methods Documentation

## Overview
The profile API integration uses proper HTTP methods based on the type of operation being performed.

## API Endpoints

### 1. Fetch Profile Data
**Endpoint:** `GET /api/v1/account/info`
**Method:** `GET`
**Purpose:** Retrieve user profile information
**Request Body:** None
**Response Format:**
```json
{
  "status": true,
  "status_code": 200,
  "message": "Operation Success",
  "data": {
    "id": 126,
    "first_name": "Omar",
    "last_name": "Matter",
    "mobile_number": "966598149475",
    "email": "omar@test.com",
    "gender": "Male",
    "date_of_birth": null,
    "address": null,
    "image_profile": "https://...",
    "wallet": { "balance": 0 },
    "healthy_ifo": { ... },
    // ... other fields
  }
}
```

### 2. Update Profile (Without File Upload)
**Endpoint:** `PUT /api/v1/account/update`
**Method:** `PUT`
**Purpose:** Update profile fields (text data only)
**Content-Type:** `application/json`
**Request Body:**
```json
{
  "first_name": "Updated Name",
  "last_name": "Updated Last Name",
  "email": "updated@email.com",
  "gender": "Male",
  "date_of_birth": "1990-01-01",
  "address": "Updated Address"
}
```

### 3. Update Profile (With File Upload)
**Endpoint:** `POST /api/v1/account/update`
**Method:** `POST` (with `_method=PUT` override)
**Purpose:** Update profile including image upload
**Content-Type:** `multipart/form-data`
**Request Body (FormData):**
```
first_name: "Updated Name"
last_name: "Updated Last Name"
email: "updated@email.com"
gender: "Male"
date_of_birth: "1990-01-01"
address: "Updated Address"
image_profile: [File object]
_method: "PUT"
```

## Implementation Logic

### Store Method: `updateProfile(profileData)`

The method automatically detects whether a file upload is required and uses the appropriate HTTP method:

```typescript
// Check if file upload is needed
const hasFileUpload = profileData.image_profile instanceof File;

if (hasFileUpload) {
    // Use FormData with POST + _method override
    const formData = new FormData();
    // Add all fields to FormData
    formData.append('_method', 'PUT');
    
    return useApi('account/update', {
        method: 'POST',
        body: formData
    }, { ... });
} else {
    // Use proper PUT method for regular updates
    return useApi('account/update', {
        method: 'PUT',
        body: updateData
    }, { ... });
}
```

## Why This Approach?

### PUT Method for Regular Updates
- **RESTful Standard:** PUT is the correct HTTP method for updating resources
- **Semantic Clarity:** Clearly indicates an update operation
- **JSON Support:** Works perfectly with JSON payloads

### POST + _method Override for File Uploads
- **Laravel Compatibility:** Laravel requires this approach for file uploads with PUT
- **FormData Requirement:** File uploads need multipart/form-data encoding
- **Browser Limitations:** HTML forms with files can only use POST method

## Usage Examples

### Update Text Fields Only
```typescript
const profileStore = useProfile();

await profileStore.updateProfile({
  first_name: 'John',
  last_name: 'Doe',
  email: 'john@example.com'
});
// Uses PUT method automatically
```

### Update with Image Upload
```typescript
const profileStore = useProfile();
const fileInput = document.querySelector('input[type="file"]');
const file = fileInput.files[0];

await profileStore.updateProfile({
  first_name: 'John',
  last_name: 'Doe',
  image_profile: file
});
// Uses POST + _method=PUT automatically
```

## Error Handling

Both methods include comprehensive error handling:
- Network errors
- Validation errors
- Server errors
- File upload errors (size, type validation)

## Response Handling

Both methods expect the same response format and update the store state accordingly:
- Update local profile data
- Show success/error notifications
- Manage loading states
- Handle validation errors
