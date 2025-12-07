import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiConsumes,
  ApiBody,
  ApiResponse,
  ApiBadRequestResponse,
  ApiPayloadTooLargeResponse,
  ApiUnsupportedMediaTypeResponse,
} from '@nestjs/swagger';
import { DocumentResponseDto } from '../dto/document-response.dto';

export function UploadDocumentDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Upload a PDF or DOCX document',
      description: `
        Upload a PDF or DOCX document for text extraction and storage.
      `,
    }),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      description: 'PDF or DOCX file to upload',
      schema: {
        type: 'object',
        required: ['file'],
        properties: {
          file: {
            type: 'string',
            format: 'binary',
            description: 'PDF or DOCX file (max 5MB)',
          },
        },
      },
    }),
    ApiResponse({
      status: 201,
      description: 'Document uploaded and processed successfully',
      type: DocumentResponseDto,
      schema: {
        example: {
          id: '123e4567-e89b-12d3-a456-426614174000',
          originalName: 'invoice-2024.pdf',
          mimeType: 'application/pdf',
          size: 245678,
          extractedText: 'INVOICE\\n\\nDate: January 15, 2024\\nFrom: Acme Corp...',
          summary: null,
          documentType: null,
          metadata: null,
          analyzed: false,
          createdAt: '2024-12-06T03:30:00.000Z',
          updatedAt: '2024-12-06T03:30:00.000Z',
        },
      },
    }),
    ApiBadRequestResponse({
      description: 'Invalid request - missing file or invalid format',
      schema: {
        example: {
          statusCode: 400,
          message: 'No file uploaded',
          error: 'Bad Request',
        },
      },
    }),
    ApiPayloadTooLargeResponse({
      description: 'File size exceeds 5MB limit',
      schema: {
        example: {
          statusCode: 413,
          message: 'File size exceeds maximum limit of 5MB',
          error: 'Payload Too Large',
        },
      },
    }),
    ApiUnsupportedMediaTypeResponse({
      description: 'File type not supported (only PDF and DOCX allowed)',
      schema: {
        example: {
          statusCode: 415,
          message: 'Only PDF and DOCX files are supported',
          error: 'Unsupported Media Type',
        },
      },
    }),
  );
}
