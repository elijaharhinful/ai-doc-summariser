# API Usage Guide

This guide provides detailed examples of how to use the AI Document Summarizer API.

## Table of Contents
- [Quick Start](#quick-start)
- [Authentication](#authentication)
- [Endpoints](#endpoints)
- [Error Handling](#error-handling)
- [Code Examples](#code-examples)

## Quick Start

### 1. Start the Services

```bash
# Start infrastructure
docker-compose up -d

# Start the API
npm run start:dev
```

### 2. Access Swagger UI

Visit http://localhost:3000/api to explore the interactive API documentation.

## Authentication

Currently, the API does not require authentication. For production use, consider implementing:
- API Keys
- JWT tokens
- OAuth 2.0

## Endpoints

### POST /documents/upload

Upload a PDF document for processing.

**Request:**
```bash
curl -X POST http://localhost:3000/documents/upload \
  -F "file=@/path/to/document.pdf"
```

**Response (201 Created):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "originalName": "invoice.pdf",
  "mimeType": "application/pdf",
  "size": 245678,
  "extractedText": "INVOICE\n\nDate: January 15, 2024...",
  "summary": null,
  "documentType": null,
  "metadata": null,
  "analyzed": false,
  "createdAt": "2024-12-06T03:30:00.000Z",
  "updatedAt": "2024-12-06T03:30:00.000Z"
}
```

**Possible Errors:**
- `400 Bad Request` - No file uploaded or invalid format
- `413 Payload Too Large` - File exceeds 5MB
- `415 Unsupported Media Type` - File is not a PDF

---

### POST /documents/:id/analyze

Analyze an uploaded document using AI.

**Request:**
```bash
curl -X POST http://localhost:3000/documents/550e8400-e29b-41d4-a716-446655440000/analyze
```

**Response (200 OK):**
```json
{
  "summary": "This invoice is for consulting services provided by Acme Corp in January 2024, totaling $1,500.00.",
  "documentType": "invoice",
  "metadata": {
    "date": "2024-01-15",
    "sender": "Acme Corp",
    "recipient": "John Doe",
    "totalAmount": "$1,500.00",
    "invoiceNumber": "INV-2024-001",
    "dueDate": "2024-02-15"
  },
  "documentId": "550e8400-e29b-41d4-a716-446655440000",
  "analyzedAt": "2024-12-06T03:35:00.000Z"
}
```

**Possible Errors:**
- `404 Not Found` - Document ID doesn't exist
- `500 Internal Server Error` - AI analysis failed

---

### GET /documents/:id

Retrieve complete document information.

**Request:**
```bash
curl http://localhost:3000/documents/550e8400-e29b-41d4-a716-446655440000
```

**Response (200 OK):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "originalName": "invoice.pdf",
  "mimeType": "application/pdf",
  "size": 245678,
  "extractedText": "INVOICE\n\nDate: January 15, 2024...",
  "summary": "This invoice is for consulting services...",
  "documentType": "invoice",
  "metadata": {
    "date": "2024-01-15",
    "sender": "Acme Corp",
    "totalAmount": "$1,500.00"
  },
  "analyzed": true,
  "createdAt": "2024-12-06T03:30:00.000Z",
  "updatedAt": "2024-12-06T03:35:00.000Z"
}
```

**Possible Errors:**
- `404 Not Found` - Document ID doesn't exist

---

## Error Handling

All errors follow this format:

```json
{
  "statusCode": 400,
  "message": "Error description",
  "error": "Error Type"
}
```

### Common Status Codes

| Code | Meaning | Description |
|------|---------|-------------|
| 200 | OK | Request successful |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid request parameters |
| 404 | Not Found | Resource not found |
| 413 | Payload Too Large | File size exceeds limit |
| 415 | Unsupported Media Type | Invalid file type |
| 500 | Internal Server Error | Server error |

---

## Code Examples

### JavaScript/Node.js

```javascript
const FormData = require('form-data');
const fs = require('fs');
const axios = require('axios');

const API_BASE = 'http://localhost:3000';

// Upload a document
async function uploadDocument(filePath) {
  const form = new FormData();
  form.append('file', fs.createReadStream(filePath));

  const response = await axios.post(`${API_BASE}/documents/upload`, form, {
    headers: form.getHeaders(),
  });

  return response.data;
}

// Analyze a document
async function analyzeDocument(documentId) {
  const response = await axios.post(
    `${API_BASE}/documents/${documentId}/analyze`
  );

  return response.data;
}

// Get document details
async function getDocument(documentId) {
  const response = await axios.get(`${API_BASE}/documents/${documentId}`);
  return response.data;
}

// Complete workflow
async function processDocument(filePath) {
  try {
    // 1. Upload
    console.log('Uploading document...');
    const uploadResult = await uploadDocument(filePath);
    console.log('Document uploaded:', uploadResult.id);

    // 2. Analyze
    console.log('Analyzing document...');
    const analysisResult = await analyzeDocument(uploadResult.id);
    console.log('Analysis complete:', analysisResult);

    // 3. Get full details
    console.log('Fetching complete document...');
    const document = await getDocument(uploadResult.id);
    console.log('Document:', document);

    return document;
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    throw error;
  }
}

// Usage
processDocument('./invoice.pdf');
```

---

### Python

```python
import requests
import json

API_BASE = 'http://localhost:3000'

def upload_document(file_path):
    """Upload a document"""
    with open(file_path, 'rb') as f:
        files = {'file': f}
        response = requests.post(f'{API_BASE}/documents/upload', files=files)
        response.raise_for_status()
        return response.json()

def analyze_document(document_id):
    """Analyze a document"""
    response = requests.post(f'{API_BASE}/documents/{document_id}/analyze')
    response.raise_for_status()
    return response.json()

def get_document(document_id):
    """Get document details"""
    response = requests.get(f'{API_BASE}/documents/{document_id}')
    response.raise_for_status()
    return response.json()

def process_document(file_path):
    """Complete workflow"""
    try:
        # 1. Upload
        print('Uploading document...')
        upload_result = upload_document(file_path)
        print(f"Document uploaded: {upload_result['id']}")

        # 2. Analyze
        print('Analyzing document...')
        analysis_result = analyze_document(upload_result['id'])
        print(f"Analysis complete: {analysis_result['documentType']}")

        # 3. Get full details
        print('Fetching complete document...')
        document = get_document(upload_result['id'])
        print(json.dumps(document, indent=2))

        return document
    except requests.exceptions.RequestException as e:
        print(f'Error: {e}')
        raise

# Usage
if __name__ == '__main__':
    process_document('./invoice.pdf')
```

---

### cURL Examples

```bash
# 1. Upload a document
UPLOAD_RESPONSE=$(curl -s -X POST http://localhost:3000/documents/upload \
  -F "file=@invoice.pdf")

# Extract document ID
DOCUMENT_ID=$(echo $UPLOAD_RESPONSE | jq -r '.id')
echo "Document ID: $DOCUMENT_ID"

# 2. Analyze the document
curl -X POST http://localhost:3000/documents/$DOCUMENT_ID/analyze

# 3. Get document details
curl http://localhost:3000/documents/$DOCUMENT_ID
```

---

## Document Type Examples

### Invoice Metadata
```json
{
  "date": "2024-01-15",
  "sender": "Acme Corp",
  "recipient": "John Doe",
  "totalAmount": "$1,500.00",
  "invoiceNumber": "INV-2024-001",
  "dueDate": "2024-02-15"
}
```

### CV/Resume Metadata
```json
{
  "name": "Jane Smith",
  "email": "jane.smith@email.com",
  "phone": "+1-555-0123",
  "experience": "5 years in software development",
  "education": "BS Computer Science",
  "skills": ["JavaScript", "Python", "React"]
}
```

### Report Metadata
```json
{
  "title": "Q4 2024 Financial Report",
  "author": "Finance Department",
  "date": "2024-12-01",
  "department": "Finance",
  "reportType": "Financial"
}
```

### Contract Metadata
```json
{
  "parties": ["Company A", "Company B"],
  "effectiveDate": "2024-01-01",
  "expirationDate": "2025-01-01",
  "contractType": "Service Agreement",
  "value": "$50,000"
}
```

---

## Best Practices

1. **Always check the response status** before proceeding to the next step
2. **Store document IDs** for future reference
3. **Handle errors gracefully** with try-catch blocks
4. **Validate file size** before uploading (max 5MB)
5. **Use appropriate timeouts** for analysis requests (AI processing may take 5-10 seconds)
6. **Cache results** if you need to access the same document multiple times

---

## Rate Limiting

Currently, there are no rate limits. For production:
- Implement rate limiting per IP/API key
- Consider queueing for analysis requests
- Use caching for frequently accessed documents

---

## Support

For issues or questions:
- Check the [main README](./README.md)
- Open an issue on GitHub
- Review Swagger documentation at http://localhost:3000/api
