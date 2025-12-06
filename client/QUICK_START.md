# Quick Start Guide

## Servers Running

✅ **Backend Server**: http://localhost:3000
- API Base URL: http://localhost:3000/api/v1
- Swagger UI: http://localhost:3000/docs
- Health Check: http://localhost:3000/health

✅ **Frontend Server**: http://localhost:5173
- UI URL: http://localhost:5173
- API Connection: Configured to http://localhost:3000/api/v1

## Access Points

### Frontend UI
- **Login Page**: http://localhost:5173/login
- **Register Hospital**: http://localhost:5173/register

### Backend API
- **Swagger Documentation**: http://localhost:3000/docs
- **API JSON**: http://localhost:3000/docs.json

## Testing the Connection

1. **Open Browser**: Navigate to http://localhost:5173
2. **Check Console**: Open browser DevTools (F12) to see any errors
3. **Test Login**: Try logging in with test credentials
4. **Check Network Tab**: Verify API calls are being made to http://localhost:3000/api/v1

## Troubleshooting Blank Page

If you see a blank page:

1. **Check Browser Console** (F12 → Console tab)
   - Look for JavaScript errors
   - Check for failed network requests

2. **Verify Servers Running**:
   ```bash
   # Backend
   curl http://localhost:3000/health
   
   # Frontend
   curl http://localhost:5173
   ```

3. **Check API Connection**:
   - Open browser DevTools → Network tab
   - Try logging in
   - Verify requests go to http://localhost:3000/api/v1

4. **Clear Browser Cache**:
   - Hard refresh: Ctrl+Shift+R (Linux/Windows) or Cmd+Shift+R (Mac)
   - Or clear cache and reload

5. **Check Environment Variables**:
   - Ensure `.env` file exists in `U-HRESui/client/`
   - Should contain: `VITE_API_URL=http://localhost:3000/api/v1`

## Common Issues

### CORS Errors
- Backend has CORS enabled
- Should work out of the box

### 401 Unauthorized
- Token expired or invalid
- Try logging in again

### Network Errors
- Verify backend is running on port 3000
- Check firewall settings
- Verify API URL in `.env`

### Blank Page
- Check browser console for errors
- Verify all CSS files are loading
- Check if React app is mounting (look for `#root` element)

## Next Steps

1. **Register a Hospital**: http://localhost:5173/register
2. **Login as Admin**: Use admin credentials from `.env`
3. **Verify Hospital**: Use admin panel to verify registered hospital
4. **Login as Hospital**: Use hospital code to login
5. **Create UHID**: Register a new patient with profile picture
6. **Create Visit**: Record a visit with doctor contact info

---

**Both servers are running and connected!** 🎉

