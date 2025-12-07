import { ApiProperty } from '@nestjs/swagger';

export class DocumentResponseDto {
  @ApiProperty({
    description: 'Unique identifier of the document',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Original filename of the uploaded document',
    example: 'invoice-2024.pdf',
  })
  originalName: string;

  @ApiProperty({
    description: 'MIME type of the document',
    example: 'application/pdf',
  })
  mimeType: string;

  @ApiProperty({
    description: 'File size in bytes',
    example: 245678,
  })
  size: number;

  @ApiProperty({
    description: 'Extracted text content from the document',
    example: 'This is the extracted text from the PDF...',
  })
  extractedText: string;

  @ApiProperty({
    description: 'AI-generated summary of the document',
    example: 'This invoice is for consulting services...',
    nullable: true,
  })
  summary: string | null;

  @ApiProperty({
    description: 'Detected document type',
    example: 'invoice',
    nullable: true,
  })
  documentType: string | null;

  @ApiProperty({
    description: 'Extracted metadata from the document',
    example: {
      date: '2024-01-15',
      sender: 'Acme Corp',
      totalAmount: '$1,500.00',
    },
    nullable: true,
  })
  metadata: Record<string, unknown> | null;

  @ApiProperty({
    description: 'Whether the document has been analyzed by AI',
    example: true,
  })
  analyzed: boolean;

  @ApiProperty({
    description: 'Document creation timestamp',
    example: '2024-12-06T03:30:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Document last update timestamp',
    example: '2024-12-06T03:35:00.000Z',
  })
  updatedAt: Date;
}
