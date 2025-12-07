import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiNotFoundResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { AnalysisResponseDto } from '../dto/analysis-response.dto';

export function AnalyzeDocumentDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Analyze a document using AI',
      description: `
        Analyze an uploaded document using OpenRouter's LLM to extract insights.`,
    }),
    ApiParam({
      name: 'id',
      description: 'UUID of the document to analyze',
      example: '123e4567-e89b-12d3-a456-426614174000',
      type: 'string',
    }),
    ApiResponse({
      status: 200,
      description: 'Document analyzed successfully',
      type: AnalysisResponseDto,
      schema: {
        example: {
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
          documentId: '123e4567-e89b-12d3-a456-426614174000',
          analyzedAt: '2024-12-06T03:35:00.000Z',
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
    ApiInternalServerErrorResponse({
      description: 'AI analysis failed or service unavailable',
      schema: {
        example: {
          statusCode: 500,
          message: 'Failed to analyze document: OpenRouter API error',
          error: 'Internal Server Error',
        },
      },
    }),
  );
}
