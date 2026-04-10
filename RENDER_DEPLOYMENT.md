# 🚀 Render Deployment Guide

## Quick Start - Deploy Backend to Render

### Step 1: Prepare Your Repository
Your repository is already ready: https://github.com/suyashbelhekar/Ai-resume-Analyzer-

### Step 2: Create Render Account
1. Go to: https://render.com/
2. Sign up with GitHub (free)
3. Authorize access to your repository

### Step 3: Create New Web Service
1. Click **"New +"** → **"Web Service"**
2. **Connect Repository**: Select `Ai-resume-Analyzer-`
3. **Name**: `ai-resume-analyzer-api`
4. **Environment**: `Python 3`
5. **Region**: Choose nearest region
6. **Branch**: `main`
7. **Root Directory**: `backend`
8. **Build Command**: 
   ```
   pip install -r requirements.txt && python -m spacy download en_core_web_sm
   ```
9. **Start Command**: 
   ```
   uvicorn main:app --host 0.0.0.0 --port $PORT
   ```

### Step 4: Environment Variables
Add these environment variables:
```
PYTHONUNBUFFERED=1
PYTHON_VERSION=3.11.0
```

### Step 5: Deploy
1. Click **"Create Web Service"**
2. Wait for deployment (2-3 minutes)
3. Your API will be available at: `https://ai-resume-analyzer-api.onrender.com`

---

## Full Stack Deployment (Backend + Frontend)

### Step 1: Deploy Backend (Above)
Follow the steps above to deploy the backend first.

### Step 2: Deploy Frontend
1. Go to Render Dashboard
2. Click **"New +"** → **"Web Service"**
3. **Connect Repository**: Same repository
4. **Name**: `ai-resume-analyzer-frontend`
5. **Environment**: `Static`
6. **Root Directory**: `frontend`
7. **Build Command**: 
   ```
   npm install && npm run build
   ```
8. **Publish Directory**: `dist`
9. **Environment Variables**:
   ```
   VITE_API_URL=https://ai-resume-analyzer-api.onrender.com
   ```

### Step 3: Update Frontend CORS
The backend is already configured to accept requests from your Render frontend.

---

## Automatic Deployment with render.yaml

### Option 1: Use render.yaml (Recommended)
1. Create `render.yaml` in your repository root (already created)
2. Push to GitHub
3. Render will automatically detect and deploy both services

### Option 2: Manual Setup
Follow the manual steps above for more control.

---

## Testing Your Deployment

### Backend API Tests
```bash
# Test health endpoint
curl https://ai-resume-analyzer-api.onrender.com/

# Test roles endpoint
curl https://ai-resume-analyzer-api.onrender.com/api/roles

# Test API docs
Visit: https://ai-resume-analyzer-api.onrender.com/docs
```

### Frontend Tests
1. Visit your frontend URL
2. Upload a resume file
3. Select a job role
4. Click "Analyze Resume"
5. Should show analysis results

---

## Environment Variables

### Backend Variables
```
PYTHONUNBUFFERED=1
PYTHON_VERSION=3.11.0
PORT=10000 (Render sets this automatically)
```

### Frontend Variables
```
VITE_API_URL=https://ai-resume-analyzer-api.onrender.com
VITE_APP_TITLE=AI Resume Skill Gap Analyzer
```

---

## Troubleshooting

### Common Issues

#### Build Fails
- Check `requirements.txt` format
- Verify spaCy model download command
- Check Python version compatibility

#### CORS Errors
- Verify frontend URL in backend CORS settings
- Check environment variables
- Ensure both services are deployed

#### 502 Bad Gateway
- Check backend logs in Render dashboard
- Verify start command
- Check if port is correctly set

#### 404 Not Found
- Verify root directory settings
- Check file paths
- Ensure build command creates output

### Debug Commands
```bash
# Check backend health
curl -I https://ai-resume-analyzer-api.onrender.com/api/roles

# Check frontend build
curl -I https://ai-resume-analyzer-frontend.onrender.com/
```

---

## Deployment URLs

After successful deployment:
- **Backend API**: https://ai-resume-analyzer-api.onrender.com
- **API Documentation**: https://ai-resume-analyzer-api.onrender.com/docs
- **Frontend**: https://ai-resume-analyzer-frontend.onrender.com

---

## Production Checklist

- [ ] Repository connected to Render
- [ ] Backend deployed successfully
- [ ] Frontend deployed successfully
- [ ] Environment variables set
- [ ] CORS configured
- [ ] API endpoints tested
- [ ] Frontend-backend integration tested
- [ ] Custom domain configured (optional)

---

## 🆘 Need Help?

1. **Render Dashboard**: Check deployment logs
2. **API Documentation**: Test endpoints directly
3. **GitHub Issues**: Report deployment problems
4. **Render Support**: https://render.com/support

---

## 🎉 Success!

Once deployed, your AI Resume Analyzer will be:
- **Live on the internet**
- **Accessible 24/7**
- **Free tier hosting**
- **Auto-deploy on git push**
