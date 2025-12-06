# API Troubleshooting Guide

## 404 Error on Registration

If you're getting a 404 error when trying to register, check:

### 1. API Base URL Configuration

The API base URL should be set in your environment variables:
- **Variable Name**: `VITE_API_URL`
- **Value**: `https://u-hres.onrender.com/api/v1`

### 2. Check Browser Console

Open browser DevTools (F12) and check:
- Console tab for API URL logs
- Network tab to see the actual request URL

### 3. Verify Endpoint

The registration endpoint should be:
- **Full URL**: `https://u-hres.onrender.com/api/v1/auth/register`
- **Method**: POST
- **Content-Type**: application/json

### 4. Common Issues

#### Issue: API_BASE_URL is undefined
**Solution**: Make sure `VITE_API_URL` is set in your `.env` file or build environment

#### Issue: CORS Error
**Solution**: Backend should have CORS enabled (already configured)

#### Issue: 404 NOT_FOUND
**Possible causes**:
1. API base URL is missing `/api/v1` suffix
2. Backend route not registered
3. API version mismatch

### 5. Testing the API

Test the API directly:
```bash
curl -X POST https://u-hres.onrender.com/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Hospital",
    "type": "Public",
    "address": "123 Test St",
    "state": "Lagos",
    "lga": "Ikeja"
  }'
```

### 6. Environment Variables

For local development, create `.env` file:
```
VITE_API_URL=https://u-hres.onrender.com/api/v1
```

For production build, set in your deployment platform:
- Render: Environment variables section
- Vercel: Environment variables in project settings
- Netlify: Site settings → Environment variables

---

**Note**: The API base URL fallback is set to `https://u-hres.onrender.com/api/v1` if `VITE_API_URL` is not set.

