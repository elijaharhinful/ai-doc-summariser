# AI Document Summarizer API

A powerful NestJS-based API for document processing and AI-powered analysis. Upload PDF documents, extract text, and get intelligent summaries with metadata extraction using OpenRouter's LLM models.

## 🚀 Features

- **📄 PDF Upload**: Upload PDF documents up to 5MB
- **📝 Text Extraction**: Automatic text extraction from PDFs
- **🤖 AI Analysis**: Powered by OpenRouter (GPT-4o-mini or other models)
- **📊 Document Classification**: Automatic document type detection (invoice, CV, report, etc.)
- **🔍 Metadata Extraction**: Smart extraction of dates, amounts, names, and more
- **💾 Secure Storage**: MinIO object storage for file management
- **📚 Swagger Documentation**: Interactive API documentation
- **🗄️ PostgreSQL Database**: Reliable data persistence

## 📋 Prerequisites

- Node.js 18+ and npm
- Docker and Docker Compose (for database and storage)
- OpenRouter API key ([Get one here](https://openrouter.ai/))

## 🛠️ Installation

### 1. Clone and Install Dependencies

```bash
# Install dependencies
npm install
```

### 2. Set Up Environment Variables

Copy the `.env.example` file to `.env` and update with your configuration:

```bash
cp .env.example .env
```

Update the `.env` file with your OpenRouter API key:

```env
OPENROUTER_API_KEY=your_actual_api_key_here
```

### 3. Start Infrastructure Services

Start PostgreSQL and MinIO using Docker Compose:

```bash
docker-compose up -d
```

This will start:
- **PostgreSQL** on `localhost:5432`
- **MinIO** on `localhost:9000` (API) and `localhost:9001` (Console)

### 4. Run the Application

```bash
# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

The API will be available at:
- **API**: http://localhost:3000
- **Swagger UI**: http://localhost:3000/api

## 📖 API Documentation

### Swagger UI

Visit http://localhost:3000/api for interactive API documentation.

### Endpoints

#### 1. Upload Document
```http
POST /documents/upload
Content-Type: multipart/form-data

file: [PDF file]
```

**Response:**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "originalName": "invoice.pdf",
  "mimeType": "application/pdf",
  "size": 245678,
  "extractedText": "INVOICE...",
  "analyzed": false,
  "createdAt": "2024-12-06T03:30:00.000Z"
}
```

#### 2. Analyze Document
```http
POST /documents/{id}/analyze
```

**Response:**
```json
{
  "summary": "This invoice is for consulting services...",
  "documentType": "invoice",
  "metadata": {
    "date": "2024-01-15",
    "sender": "Acme Corp",
    "totalAmount": "$1,500.00"
  },
  "documentId": "123e4567-e89b-12d3-a456-426614174000",
  "analyzedAt": "2024-12-06T03:35:00.000Z"
}
```

#### 3. Get Document
```http
GET /documents/{id}
```

**Response:**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "originalName": "invoice.pdf",
  "extractedText": "INVOICE...",
  "summary": "This invoice is for consulting services...",
  "documentType": "invoice",
  "metadata": {
    "date": "2024-01-15",
    "sender": "Acme Corp"
  },
  "analyzed": true
}
```

## 🏗️ Project Structure

```
src/
├── config/
│   └── configuration.ts          # Environment configuration
├── modules/
│   ├── documents/
│   │   ├── controllers/          # API controllers
│   │   ├── services/             # Business logic
│   │   ├── entities/             # Database entities
│   │   ├── dto/                  # Data transfer objects
│   │   └── docs/                 # Swagger documentation
│   ├── storage/                  # MinIO integration
│   └── llm/                      # OpenRouter LLM service
└── main.ts                       # Application entry point
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | API server port | `3000` |
| `DATABASE_HOST` | PostgreSQL host | `localhost` |
| `DATABASE_PORT` | PostgreSQL port | `5432` |
| `DATABASE_USER` | Database username | `postgres` |
| `DATABASE_PASSWORD` | Database password | `postgres` |
| `DATABASE_NAME` | Database name | `doc_summarizer` |
| `MINIO_ENDPOINT` | MinIO endpoint | `localhost` |
| `MINIO_PORT` | MinIO port | `9000` |
| `MINIO_ACCESS_KEY` | MinIO access key | `minioadmin` |
| `MINIO_SECRET_KEY` | MinIO secret key | `minioadmin` |
| `MINIO_BUCKET` | MinIO bucket name | `documents` |
| `OPENROUTER_API_KEY` | OpenRouter API key | *Required* |
| `OPENROUTER_MODEL` | LLM model to use | `openai/gpt-4o-mini` |
| `MAX_FILE_SIZE` | Max upload size (bytes) | `5242880` (5MB) |

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 📦 Supported Document Types

The AI can classify and extract metadata from:

- **Invoices**: Date, sender, recipient, amount, invoice number
- **CVs/Resumes**: Name, contact info, experience, education, skills
- **Reports**: Title, author, date, department, type
- **Letters**: Date, sender, recipient, subject, purpose
- **Contracts**: Parties, dates, contract type, value
- **Other**: Generic metadata extraction

## 🔐 Security Notes

- Set `synchronize: false` in production (TypeORM)
- Use strong passwords for database and MinIO
- Keep your OpenRouter API key secure
- Implement rate limiting for production
- Add authentication/authorization as needed

## 🐛 Troubleshooting

### MinIO Connection Issues
```bash
# Check if MinIO is running
docker ps | grep minio

# View MinIO logs
docker logs doc-summarizer-minio
```

### Database Connection Issues
```bash
# Check if PostgreSQL is running
docker ps | grep postgres

# View PostgreSQL logs
docker logs doc-summarizer-db
```

### PDF Text Extraction Fails
- Ensure the PDF contains extractable text (not just images)
- Scanned PDFs may require OCR preprocessing

## 📝 License

MIT

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues and questions, please open an issue on GitHub.

---

Built with ❤️ using NestJS, OpenRouter, and MinIO
