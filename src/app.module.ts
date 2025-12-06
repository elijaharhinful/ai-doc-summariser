import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import configuration from './config/configuration';
import { DocumentsModule } from './modules/documents/documents.module';
import { StorageModule } from './modules/storage/storage.module';
import { LlmModule } from './modules/llm/llm.module';
import { Document } from './modules/documents/entities/document.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('database.host'),
        port: configService.get('database.port'),
        username: configService.get('database.username'),
        password: configService.get('database.password'),
        database: configService.get('database.database'),
        entities: [Document],
        synchronize: true, // Set to false in production
        logging: true,
      }),
      inject: [ConfigService],
    }),
    DocumentsModule,
    StorageModule,
    LlmModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
