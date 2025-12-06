import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors();

  // Enable validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('AI Document Summarizer API')
    .setDescription(
      `
      A powerful API for document processing and AI-powered analysis.
      
      **Features:**
      - Upload PDF documents (max 5MB)
      - Automatic text extraction
      - AI-powered document analysis
      - Document type classification
      - Metadata extraction
      - Secure storage with MinIO
      
      **Workflow:**
      1. Upload a PDF using \`POST /documents/upload\`
      2. Analyze the document using \`POST /documents/{id}/analyze\`
      3. Retrieve results using \`GET /documents/{id}\`
      
      **Supported Document Types:**
      - Invoices
      - CVs/Resumes
      - Reports
      - Letters
      - Contracts
      - And more...
      `,
    )
    .setVersion('1.0')
    .addTag('Documents', 'Document upload, analysis, and retrieval endpoints')
    .setContact(
      'API Support',
      'https://github.com/yourusername/ai-doc-summarizer',
      'support@example.com',
    )
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    customSiteTitle: 'AI Document Summarizer API',
    customCss: `
      .swagger-ui .topbar { display: none }
      .swagger-ui .info { margin: 50px 0 }
      .swagger-ui .info .title { font-size: 36px }
    `,
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'none',
      filter: true,
      showRequestDuration: true,
    },
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🚀 AI Document Summarizer API is running!              ║
║                                                           ║
║   📝 API URL:      http://localhost:${port}                   ║
║   📚 Swagger UI:   http://localhost:${port}/api               ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `);
}
bootstrap();
