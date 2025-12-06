import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { DocumentResponseDto } from '../dto/document-response.dto';

export function GetDocumentDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get document details',
      description: `
        Retrieve complete information about a document including:
        - File metadata (name, size, type, upload date)
        - Extracted text content
        - AI analysis results (if analyzed)
          - Summary
          - Document type
          - Extracted metadata
        
        **Use Cases:**
        - View document details after upload
        - Check analysis status and results
        - Retrieve extracted text for further processing
        - Access structured metadata for integration
        
        **Response includes:**
        - All file information
        - Full extracted text
        - AI-generated summary (if analyzed)
        - Document classification (if analyzed)
        - Structured metadata (if analyzed)
      `,
    }),
    ApiParam({
      name: 'id',
      description: 'UUID of the document to retrieve',
      example: '123e4567-e89b-12d3-a456-426614174000',
      type: 'string',
    }),
    ApiResponse({
      status: 200,
      description: 'Document retrieved successfully',
      type: DocumentResponseDto,
      schema: {
        example: {
          id: '123e4567-e89b-12d3-a456-426614174000',
          originalName: 'invoice-2024.pdf',
          mimeType: 'application/pdf',
          size: 245678,
          extractedText: 'INVOICE\n\nDate: January 15, 2024\nFrom: Acme Corp...',
          summary:
            'This invoice is for consulting services provided by Acme Corp in January 2024, totaling $1,500.00.',
          documentType: 'invoice',
          metadata: {
            date: '2024-01-15',
            sender: 'Acme Corp',
            recipient: 'John Doe',
            totalAmount: '$1,500.00',
            invoiceNumber: 'INV-2024-001',
            dueDate: '2024-02-15',
          },
          analyzed: true,
          createdAt: '2024-12-06T03:30:00.000Z',
          updatedAt: '2024-12-06T03:35:00.000Z',
        },
      },
    }),
    ApiNotFoundResponse({
      description: 'Document not found',
      schema: {
        example: {
          statusCode: 404,
          message: 'Document with ID 123e4567-e89b-12d3-a456-426614174000 not found',
          error: 'Not Found',
        },
      },
    }),
  );
}
