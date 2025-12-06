import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentsController } from './controllers/documents.controller';
import { DocumentsService } from './services/documents.service';
import { Document } from './entities/document.entity';
import { StorageModule } from '../storage/storage.module';
import { LlmModule } from '../llm/llm.module';

@Module({
  imports: [TypeOrmModule.forFeature([Document]), StorageModule, LlmModule],
  controllers: [DocumentsController],
  providers: [DocumentsService],
  exports: [DocumentsService],
})
export class DocumentsModule {}
