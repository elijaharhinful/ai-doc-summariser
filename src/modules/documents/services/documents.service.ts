import {
  Injectable,
  NotFoundException,
  BadRequestException,
  PayloadTooLargeException,
  UnsupportedMediaTypeException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Document } from '../entities/document.entity';
import { StorageService } from '../../storage/storage.service';
import { LlmService } from '../../llm/llm.service';
import { DocumentResponseDto } from '../dto/document-response.dto';
import { AnalysisResponseDto } from '../dto/analysis-response.dto';
@Injectable()
export class DocumentsService {
  private readonly logger = new Logger(DocumentsService.name);
  private readonly maxFileSize: number;

  constructor(
    @InjectRepository(Document)
    private documentRepository: Repository<Document>,
    private storageService: StorageService,
    private llmService: LlmService,
    private configService: ConfigService,
  ) {
    this.maxFileSize = this.configService.get<number>('maxFileSize') || 5242880;
  }

  async uploadDocument(file: Express.Multer.File): Promise<DocumentResponseDto> {
    // Validate file
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    // Check file size
    if (file.size > this.maxFileSize) {
      throw new PayloadTooLargeException(
        `File size exceeds maximum limit of ${this.maxFileSize / 1024 / 1024}MB`,
      );
    }

    // Check file type
    const supportedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!supportedTypes.includes(file.mimetype)) {
      throw new UnsupportedMediaTypeException('Only PDF and DOCX files are supported');
    }

    try {
      // Extract text based on file type
      let extractedText: string;
      if (file.mimetype === 'application/pdf') {
        extractedText = await this.extractTextFromPdf(file.buffer);
      } else {
        extractedText = await this.extractTextFromDocx(file.buffer);
      }

      if (!extractedText || extractedText.trim().length === 0) {
        throw new BadRequestException(
          'Could not extract text from document. The file may be empty or contain only images.',
        );
      }

      // Upload to MinIO
      const minioPath = await this.storageService.uploadFile(
        file.originalname,
        file.buffer,
        file.mimetype,
      );

      // Save to database
      const document = this.documentRepository.create({
        filename: minioPath,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        minioPath,
        extractedText,
        analyzed: false,
      });

      const savedDocument = await this.documentRepository.save(document);
      this.logger.log(`Document uploaded successfully: ${savedDocument.id}`);

      return this.mapToResponseDto(savedDocument);
    } catch (error) {
      this.logger.error(`Error uploading document: ${error.message}`);
      throw error;
    }
  }

  async analyzeDocument(id: string): Promise<AnalysisResponseDto> {
    const document = await this.documentRepository.findOne({ where: { id } });

    if (!document) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }

    try {
      // Analyze with LLM
      const analysis = await this.llmService.analyzeDocument(
        document.extractedText,
      );

      // Update document with analysis results
      document.summary = analysis.summary;
      document.documentType = analysis.documentType;
      document.metadata = analysis.metadata;
      document.analyzed = true;

      await this.documentRepository.save(document);
      this.logger.log(`Document analyzed successfully: ${id}`);

      return {
        summary: analysis.summary,
        documentType: analysis.documentType,
        metadata: analysis.metadata,
        documentId: document.id,
        analyzedAt: new Date(),
      };
    } catch (error) {
      this.logger.error(`Error analyzing document: ${error.message}`);
      throw error;
    }
  }

  async getDocument(id: string): Promise<DocumentResponseDto> {
    const document = await this.documentRepository.findOne({ where: { id } });

    if (!document) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }

    return this.mapToResponseDto(document);
  }

  async getAllDocuments(): Promise<DocumentResponseDto[]> {
    const documents = await this.documentRepository.find({
      order: { createdAt: 'DESC' },
    });

    return documents.map((doc) => this.mapToResponseDto(doc));
  }

  private async extractTextFromPdf(buffer: Buffer): Promise<string> {
    try {
      this.logger.debug(`Attempting to parse PDF, buffer size: ${buffer.length} bytes`);
      
      // Using pdfjs-dist (Mozilla's PDF.js) for better reliability
      const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs');
      
      // Load the PDF document
      const loadingTask = pdfjsLib.getDocument({
        data: new Uint8Array(buffer),
        useSystemFonts: true,
      });
      
      const pdfDocument = await loadingTask.promise;
      const numPages = pdfDocument.numPages;
      this.logger.debug(`PDF loaded successfully, pages: ${numPages}`);
      
      // Extract text from all pages
      let fullText = '';
      for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        const page = await pdfDocument.getPage(pageNum);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');
        fullText += pageText + '\n';
      }
      
      this.logger.debug(`PDF parsed successfully, text length: ${fullText.length}`);
      return fullText.trim();
    } catch (error) {
      this.logger.error(`Error extracting text from PDF: ${error.message}`);
      this.logger.error(`Error stack: ${error.stack}`);
      this.logger.error(`Error type: ${typeof error}, Error: ${JSON.stringify(error, null, 2)}`);
      throw new BadRequestException(`Failed to extract text from PDF: ${error.message}`);
    }
  }

  private async extractTextFromDocx(buffer: Buffer): Promise<string> {
    try {
      this.logger.debug(`Attempting to parse DOCX, buffer size: ${buffer.length} bytes`);
      
      // Using mammoth to extract text from DOCX
      const mammoth = require('mammoth');
      const result = await mammoth.extractRawText({ buffer });
      
      this.logger.debug(`DOCX parsed successfully, text length: ${result.value.length}`);
      return result.value.trim();
    } catch (error) {
      this.logger.error(`Error extracting text from DOCX: ${error.message}`);
      this.logger.error(`Error stack: ${error.stack}`);
      throw new BadRequestException(`Failed to extract text from DOCX: ${error.message}`);
    }
  }

  private mapToResponseDto(document: Document): DocumentResponseDto {
    return {
      id: document.id,
      originalName: document.originalName,
      mimeType: document.mimeType,
      size: document.size,
      extractedText: document.extractedText,
      summary: document.summary,
      documentType: document.documentType,
      metadata: document.metadata,
      analyzed: document.analyzed,
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
    };
  }
}
