import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';

@Injectable()
export class StorageService implements OnModuleInit {
  private readonly logger = new Logger(StorageService.name);
  private minioClient: Minio.Client;
  private bucketName: string;

  constructor(private configService: ConfigService) {
    const minioConfig = this.configService.get('minio');
    this.bucketName = minioConfig.bucket;

    this.minioClient = new Minio.Client({
      endPoint: minioConfig.endPoint,
      port: minioConfig.port,
      useSSL: minioConfig.useSSL,
      accessKey: minioConfig.accessKey,
      secretKey: minioConfig.secretKey,
    });
  }

  async onModuleInit() {
    await this.ensureBucketExists();
  }

  private async ensureBucketExists() {
    try {
      const exists = await this.minioClient.bucketExists(this.bucketName);
      if (!exists) {
        await this.minioClient.makeBucket(this.bucketName, 'us-east-1');
        this.logger.log(`Bucket ${this.bucketName} created successfully`);
      } else {
        this.logger.log(`Bucket ${this.bucketName} already exists`);
      }
    } catch (error) {
      this.logger.error(`Error ensuring bucket exists: ${error.message}`);
      throw error;
    }
  }

  async uploadFile(
    filename: string,
    buffer: Buffer,
    mimeType: string,
  ): Promise<string> {
    try {
      const objectName = `${Date.now()}-${filename}`;
      await this.minioClient.putObject(
        this.bucketName,
        objectName,
        buffer,
        buffer.length,
        {
          'Content-Type': mimeType,
        },
      );
      this.logger.log(`File uploaded successfully: ${objectName}`);
      return objectName;
    } catch (error) {
      this.logger.error(`Error uploading file: ${error.message}`);
      throw error;
    }
  }

  async getFile(objectName: string): Promise<Buffer> {
    try {
      const chunks: Buffer[] = [];
      const stream = await this.minioClient.getObject(
        this.bucketName,
        objectName,
      );

      return new Promise((resolve, reject) => {
        stream.on('data', (chunk) => chunks.push(chunk));
        stream.on('end', () => resolve(Buffer.concat(chunks)));
        stream.on('error', reject);
      });
    } catch (error) {
      this.logger.error(`Error getting file: ${error.message}`);
      throw error;
    }
  }

  async deleteFile(objectName: string): Promise<void> {
    try {
      await this.minioClient.removeObject(this.bucketName, objectName);
      this.logger.log(`File deleted successfully: ${objectName}`);
    } catch (error) {
      this.logger.error(`Error deleting file: ${error.message}`);
      throw error;
    }
  }

  async getFileUrl(objectName: string, expirySeconds = 3600): Promise<string> {
    try {
      return await this.minioClient.presignedGetObject(
        this.bucketName,
        objectName,
        expirySeconds,
      );
    } catch (error) {
      this.logger.error(`Error generating file URL: ${error.message}`);
      throw error;
    }
  }
}
