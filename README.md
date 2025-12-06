# AI Document Summarizer API

AI-powered document processing API built with NestJS, OpenRouter, and MinIO. Upload PDFs, extract text, and get intelligent summaries with metadata extraction.

## Features

- PDF upload and text extraction (using PDF.js)
- AI-powered document analysis and summarization
- Automatic document type classification (invoice, CV, report, contract, etc.)
- Smart metadata extraction
- MinIO object storage
- PostgreSQL database
- Swagger API documentation

## Prerequisites

- Node.js 18+
- Docker and Docker Compose
- OpenRouter API key ([Get one here](https://openrouter.ai/keys))

## Setup

### 1. Clone and Install

```bash
git clone https://github.com/elijaharhinful/ai-doc-summariser.git
cd ai-doc-summariser
npm install
```

### 2. Configure Environment

Create `.env` file (or copy from `.env.example`):

```env
# API
PORT=3000

# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=doc_summarizer

# MinIO
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_BUCKET=documents

# OpenRouter (Required)
OPENROUTER_API_KEY=your_api_key_here
OPENROUTER_MODEL=openai/gpt-4o-mini

# Upload
MAX_FILE_SIZE=5242880
```

### 3. Start Services

```bash
# Start PostgreSQL and MinIO
docker-compose up -d

# Start API (development)
npm run start:dev

# OR build and run production
npm run build
npm run start:prod
```

### 4. Verify

- API: http://localhost:3000
- Swagger UI: http://localhost:3000/api
- MinIO Console: http://localhost:9001 (minioadmin/minioadmin)

## API Endpoints

### Upload Document

```bash
POST /documents/upload
Content-Type: multipart/form-data

curl -X POST http://localhost:3000/documents/upload \
  -F "file=@document.pdf"
```

**Response:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "originalName": "invoice.pdf",
  "extractedText": "INVOICE...",
  "analyzed": false,
  "createdAt": "2024-12-06T03:30:00.000Z"
}
```

### Analyze Document

```bash
POST /documents/{id}/analyze

curl -X POST http://localhost:3000/documents/{id}/analyze
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
  "documentId": "550e8400-e29b-41d4-a716-446655440000",
  "analyzedAt": "2024-12-06T03:35:00.000Z"
}
```

### Get Document

```bash
GET /documents/{id}

curl http://localhost:3000/documents/{id}
```

### Get All Documents

```bash
GET /documents

curl http://localhost:3000/documents
```

## Testing

### Quick Test (Swagger UI)

1. Go to http://localhost:3000/api
2. Click **POST /documents/upload** → Try it out
3. Upload a PDF file
4. Copy the returned `id`
5. Click **POST /documents/{id}/analyze** → Try it out
6. Paste the `id` and execute

### Using cURL

```bash
# Upload
RESPONSE=$(curl -s -X POST http://localhost:3000/documents/upload \
  -F "file=@invoice.pdf")

# Extract ID
ID=$(echo $RESPONSE | jq -r '.id')

# Analyze
curl -X POST http://localhost:3000/documents/$ID/analyze

# Get details
curl http://localhost:3000/documents/$ID
```

### Using JavaScript

```javascript
const FormData = require('form-data');
const fs = require('fs');
const axios = require('axios');

async function processDocument(filePath) {
  // Upload
  const form = new FormData();
  form.append('file', fs.createReadStream(filePath));
  
  const upload = await axios.post('http://localhost:3000/documents/upload', form, {
    headers: form.getHeaders()
  });
  
  const docId = upload.data.id;
  
  // Analyze
  const analysis = await axios.post(`http://localhost:3000/documents/${docId}/analyze`);
  
  console.log('Summary:', analysis.data.summary);
  console.log('Type:', analysis.data.documentType);
  console.log('Metadata:', analysis.data.metadata);
}

processDocument('./invoice.pdf');
```

### Using Python

```python
import requests

def process_document(file_path):
    # Upload
    with open(file_path, 'rb') as f:
        upload = requests.post('http://localhost:3000/documents/upload', 
                              files={'file': f})
    
    doc_id = upload.json()['id']
    
    # Analyze
    analysis = requests.post(f'http://localhost:3000/documents/{doc_id}/analyze')
    
    result = analysis.json()
    print(f"Summary: {result['summary']}")
    print(f"Type: {result['documentType']}")
    print(f"Metadata: {result['metadata']}")

process_document('./invoice.pdf')
```

## Document Types & Metadata

The API automatically detects document types and extracts relevant metadata:

| Type | Metadata Extracted |
|------|-------------------|
| **Invoice** | Date, sender, recipient, amount, invoice number, due date |
| **CV/Resume** | Name, email, phone, experience, education, skills |
| **Report** | Title, author, date, department, report type |
| **Contract** | Parties, effective date, expiration date, contract type, value |
| **Letter** | Date, sender, recipient, subject, purpose |

## Error Handling

All errors return:
```json
{
  "statusCode": 400,
  "message": "Error description",
  "error": "Error Type"
}
```

**Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad request (invalid file, no text extracted)
- `404` - Document not found
- `413` - File too large (max 5MB)
- `415` - Unsupported file type (PDF only)
- `500` - Server error

## Troubleshooting

### Database Connection Failed
```bash
docker ps | grep postgres
docker logs doc-summarizer-db
docker-compose restart postgres
```

### MinIO Connection Failed
```bash
docker ps | grep minio
docker logs doc-summarizer-minio
docker-compose restart minio
```

### PDF Extraction Failed
- Ensure PDF contains extractable text (not scanned images)
- Check file size is under 5MB
- Try a different PDF

### OpenRouter API Error
- Verify API key in `.env`
- Check you have credits at https://openrouter.ai
- Verify model name is correct

## Commands

```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod

# Testing
npm run test
npm run test:e2e
npm run test:cov

# Code quality
npm run lint
npm run format

# Docker
docker-compose up -d          # Start services
docker-compose down           # Stop services
docker-compose logs -f        # View logs
```

## License

MIT
