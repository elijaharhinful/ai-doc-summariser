import {
  Controller,
  Post,
  Get,
  Param,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { DocumentsService } from '../services/documents.service';
import { DocumentResponseDto } from '../dto/document-response.dto';
import { AnalysisResponseDto } from '../dto/analysis-response.dto';
import { UploadDocumentDocs } from '../docs/upload.docs';
import { AnalyzeDocumentDocs } from '../docs/analyze.docs';
import { GetDocumentDocs } from '../docs/get-document.docs';

@ApiTags('Documents')
@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post('upload')
  @UploadDocumentDocs()
  @UseInterceptors(FileInterceptor('file'))
  async uploadDocument(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<DocumentResponseDto> {
    return this.documentsService.uploadDocument(file);
  }

  @Post(':id/analyze')
  @AnalyzeDocumentDocs()
  async analyzeDocument(@Param('id') id: string): Promise<AnalysisResponseDto> {
    return this.documentsService.analyzeDocument(id);
  }

  @Get(':id')
  @GetDocumentDocs()
  async getDocument(@Param('id') id: string): Promise<DocumentResponseDto> {
    return this.documentsService.getDocument(id);
  }
}
