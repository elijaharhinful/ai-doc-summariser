import { ApiProperty } from '@nestjs/swagger';

export class AnalysisResponseDto {
  @ApiProperty({
    description: 'AI-generated summary of the document',
    example:
      'This invoice is for consulting services provided in January 2024, totaling $1,500.00.',
  })
  summary: string;

  @ApiProperty({
    description: 'Detected document type',
    example: 'invoice',
    enum: ['invoice', 'cv', 'report', 'letter', 'contract', 'other'],
  })
  documentType: string;

  @ApiProperty({
    description: 'Extracted metadata from the document',
    example: {
      date: '2024-01-15',
      sender: 'Acme Corp',
      recipient: 'John Doe',
      totalAmount: '$1,500.00',
      invoiceNumber: 'INV-2024-001',
    },
  })
  metadata: Record<string, unknown>;

  @ApiProperty({
    description: 'Document ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  documentId: string;

  @ApiProperty({
    description: 'Analysis completion timestamp',
    example: '2024-12-06T03:35:00.000Z',
  })
  analyzedAt: Date;
}
