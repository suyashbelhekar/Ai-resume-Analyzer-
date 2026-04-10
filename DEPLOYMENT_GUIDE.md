# 🚀 AI Resume Analyzer - Complete Deployment Guide

## Quick Start Options

### Option 1: Local Development (Recommended for Testing)

#### Backend Setup:
```bash
cd backend
pip install -r requirements.txt
pip install https://github.com/explosion/spacy-models/releases/download/en_core_web_sm-3.7.1/en_core_web_sm-3.7.1-py3-none-any.whl
python main.py
```

#### Frontend Setup:
```bash
cd frontend
npm install
npm run dev
```

Access: http://localhost:5173

---

### Option 2: Docker Deployment (Production Ready)

#### Prerequisites:
1. Install Docker Desktop from: https://docs.docker.com/get-docker/
2. Clone repository: `git clone https://github.com/suyashbelhekar/Ai-resume-Analyzer-.git`
3. Navigate: `cd Ai-resume-Analyzer-`

#### Windows Deployment:
```cmd
deploy-fullstack.sh
```

#### Linux/Mac Deployment:
```bash
chmod +x deploy-fullstack.sh
./deploy-fullstack.sh
```

#### Manual Docker Commands:
```bash
# Build backend
docker build -t ai-resume-analyzer-backend ./backend

# Run backend
docker run -d -p 8000:8000 --name ai-resume-backend ai-resume-analyzer-backend

# Build frontend
docker build -t ai-resume-analyzer-frontend ./frontend

# Run frontend
docker run -d -p 80:80 --link ai-resume-backend:backend ai-resume-analyzer-frontend
```

---

### Option 3: Cloud Deployment

#### Deploy to Render (Free Tier):
1. Push to GitHub (already done)
2. Go to: https://render.com/
3. Connect GitHub account
4. Create new "Web Service"
5. Select: `suyashbelhekar/Ai-resume-Analyzer-`
6. Build Command: `docker build -t ai-resume-analyzer ./backend`
7. Start Command: `docker run -p 8000:8000 ai-resume-analyzer`

#### Deploy to Railway:
1. Go to: https://railway.app/
2. Connect GitHub
3. Select repository
4. Deploy with Dockerfile

#### Deploy to Heroku:
1. Install Heroku CLI
2. Login: `heroku login`
3. Create app: `heroku create ai-resume-analyzer`
4. Deploy: `heroku container:push web`

---

### Environment Configuration

#### Create .env file:
```bash
# Backend
PYTHONUNBUFFERED=1
BACKEND_HOST=0.0.0.0
BACKEND_PORT=8000

# Frontend
VITE_API_URL=http://localhost:8000
VITE_APP_TITLE=AI Resume Skill Gap Analyzer
```

---

### Access URLs

#### Local Development:
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

#### Docker Deployment:
- Frontend: http://localhost:80
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

#### Cloud Deployment:
- Frontend: https://your-app-name.onrender.com
- Backend API: https://your-app-name.onrender.com/api

---

### Troubleshooting

#### Backend Issues:
```bash
# Check logs
docker logs ai-resume-analyzer-backend

# Restart container
docker restart ai-resume-analyzer-backend

# Check if running
docker ps
```

#### Frontend Issues:
```bash
# Clear node modules
rm -rf node_modules package-lock.json
npm install

# Rebuild
npm run build
```

#### Port Conflicts:
```bash
# Kill processes on ports 8000 and 80
netstat -ano | findstr :8000
netstat -ano | findstr :80

# Windows
taskkill /PID <number> /F
```

---

### Production Checklist

- [ ] Docker Desktop installed
- [ ] Repository cloned
- [ ] Environment variables set
- [ ] Ports 8000 and 80 available
- [ ] Firewall configured
- [ ] SSL certificate (for production)
- [ ] Domain configured (optional)
- [ ] Monitoring setup (optional)

---

## 🆘 Support

For deployment issues:
1. Check Docker logs: `docker logs <container-name>`
2. Verify port availability: `netstat -ano | findstr :8000`
3. Test API directly: `curl http://localhost:8000/api/roles`
4. Check frontend build: `npm run build`

## 📞 Need Help?

- Check the GitHub repository: https://github.com/suyashbelhekar/Ai-resume-Analyzer-
- Review deployment logs
- Test with local development first
