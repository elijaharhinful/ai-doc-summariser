# 🚀 Getting Started Checklist

Follow these steps to get your AI Document Summarizer API up and running!

## ✅ Pre-Installation Checklist

- [ ] Node.js 18+ installed (`node --version`)
- [ ] npm installed (`npm --version`)
- [ ] Docker installed (`docker --version`)
- [ ] Docker Compose installed (`docker-compose --version`)
- [ ] OpenRouter account created ([openrouter.ai](https://openrouter.ai))
- [ ] OpenRouter API key obtained

## 📦 Installation Steps

### Step 1: Verify Dependencies (Already Done ✅)
```bash
# Dependencies are already installed!
# If you need to reinstall:
npm install
```

### Step 2: Configure Environment Variables
```bash
# 1. Open the .env file
# 2. Update the OpenRouter API key:
OPENROUTER_API_KEY=your_actual_api_key_here

# 3. (Optional) Adjust other settings if needed
```

**Important:** Get your API key from [openrouter.ai/keys](https://openrouter.ai/keys)

### Step 3: Start Infrastructure Services
```bash
# Start PostgreSQL and MinIO
docker-compose up -d

# Verify services are running
docker ps
```

You should see:
- `doc-summarizer-db` (PostgreSQL)
- `doc-summarizer-minio` (MinIO)

### Step 4: Start the Application
```bash
# Development mode (with hot reload)
npm run start:dev

# OR Production mode
npm run build
npm run start:prod
```

### Step 5: Verify Everything Works
Visit these URLs:
- [ ] **API**: http://localhost:3000
- [ ] **Swagger UI**: http://localhost:3000/api
- [ ] **MinIO Console**: http://localhost:9001 (login: minioadmin/minioadmin)

## 🧪 Testing the API

### Option 1: Using Swagger UI (Recommended for First Test)

1. Visit http://localhost:3000/api
2. Click on **POST /documents/upload**
3. Click "Try it out"
4. Choose a PDF file (max 5MB)
5. Click "Execute"
6. Copy the `id` from the response
7. Go to **POST /documents/{id}/analyze**
8. Paste the `id` and click "Execute"
9. View the AI analysis results!

### Option 2: Using cURL

```bash
# 1. Upload a document
curl -X POST http://localhost:3000/documents/upload \
  -F "file=@path/to/your/document.pdf"

# Copy the "id" from the response

# 2. Analyze the document
curl -X POST http://localhost:3000/documents/{paste-id-here}/analyze

# 3. Get full document details
curl http://localhost:3000/documents/{paste-id-here}
```

### Option 3: Using Postman

1. Import `postman-collection.json`
2. Set the `documentId` variable
3. Run the requests in order:
   - Upload Document
   - Analyze Document
   - Get Document

## 🔍 Troubleshooting

### Issue: "Cannot connect to database"
```bash
# Check if PostgreSQL is running
docker ps | grep postgres

# View logs
docker logs doc-summarizer-db

# Restart if needed
docker-compose restart postgres
```

### Issue: "MinIO connection failed"
```bash
# Check if MinIO is running
docker ps | grep minio

# View logs
docker logs doc-summarizer-minio

# Restart if needed
docker-compose restart minio
```

### Issue: "OpenRouter API error"
- [ ] Verify your API key in `.env` is correct
- [ ] Check you have credits on OpenRouter
- [ ] Verify the model name is correct (default: `openai/gpt-4o-mini`)

### Issue: "PDF text extraction failed"
- [ ] Ensure the PDF contains extractable text (not just images)
- [ ] Try a different PDF file
- [ ] Check file size is under 5MB

### Issue: Port already in use
```bash
# Change the port in .env
PORT=3001

# Or stop the conflicting service
# On Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# On Linux/Mac:
lsof -ti:3000 | xargs kill -9
```

## 📚 Next Steps

### Learn the API
- [ ] Read [README.md](./README.md) for overview
- [ ] Read [API_GUIDE.md](./API_GUIDE.md) for detailed usage
- [ ] Explore Swagger UI at http://localhost:3000/api
- [ ] Review [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) for architecture

### Customize
- [ ] Adjust max file size in `.env` (MAX_FILE_SIZE)
- [ ] Change LLM model in `.env` (OPENROUTER_MODEL)
- [ ] Modify document type classifications in `llm.service.ts`
- [ ] Add custom metadata extraction logic

### Production Preparation
- [ ] Set `synchronize: false` in `app.module.ts` (TypeORM)
- [ ] Add authentication (JWT/API keys)
- [ ] Implement rate limiting
- [ ] Set up logging service
- [ ] Configure HTTPS
- [ ] Add monitoring (e.g., Prometheus)
- [ ] Set up CI/CD pipeline
- [ ] Create database migrations

## 🎯 Quick Reference

### Useful Commands

```bash
# Start everything
docker-compose up -d && npm run start:dev

# Stop everything
docker-compose down && # Ctrl+C to stop API

# View logs
docker-compose logs -f

# Rebuild after changes
npm run build

# Run tests
npm run test

# Format code
npm run format

# Lint code
npm run lint
```

### Service URLs

| Service | URL | Credentials |
|---------|-----|-------------|
| API | http://localhost:3000 | - |
| Swagger | http://localhost:3000/api | - |
| PostgreSQL | localhost:5432 | postgres/postgres |
| MinIO API | http://localhost:9000 | minioadmin/minioadmin |
| MinIO Console | http://localhost:9001 | minioadmin/minioadmin |

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| PORT | 3000 | API server port |
| OPENROUTER_API_KEY | - | **Required** - Your API key |
| OPENROUTER_MODEL | openai/gpt-4o-mini | LLM model to use |
| MAX_FILE_SIZE | 5242880 | Max upload (5MB) |

## ✨ Features Checklist

Your API now supports:

- [x] PDF upload (max 5MB)
- [x] Text extraction from PDFs
- [x] MinIO object storage
- [x] PostgreSQL database
- [x] AI-powered document analysis
- [x] Document type classification
- [x] Metadata extraction
- [x] Swagger documentation
- [x] Error handling
- [x] Input validation
- [x] CORS enabled
- [x] Docker Compose setup
- [x] Environment configuration

## 🎉 Success Criteria

You'll know everything is working when:

1. ✅ Docker services are running (`docker ps` shows 2 containers)
2. ✅ API starts without errors
3. ✅ Swagger UI loads at http://localhost:3000/api
4. ✅ You can upload a PDF successfully
5. ✅ AI analysis returns summary and metadata
6. ✅ You can retrieve the document with all data

## 📞 Need Help?

- **Documentation**: Check README.md and API_GUIDE.md
- **Swagger UI**: http://localhost:3000/api for interactive docs
- **Logs**: Check terminal output for error messages
- **Docker**: Run `docker-compose logs` to see service logs

---

**Ready to start?** Run these commands:

```bash
# 1. Update .env with your OpenRouter API key
# 2. Start services
docker-compose up -d

# 3. Start API
npm run start:dev

# 4. Open Swagger
# Visit: http://localhost:3000/api
```

🚀 **Happy coding!**
