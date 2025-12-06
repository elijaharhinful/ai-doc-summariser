import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

export interface DocumentAnalysis {
  summary: string;
  documentType: string;
  metadata: Record<string, any>;
}

@Injectable()
export class LlmService {
  private readonly logger = new Logger(LlmService.name);
  private openai: OpenAI;
  private model: string;

  constructor(private configService: ConfigService) {
    const openrouterConfig = this.configService.get('openrouter');
    this.model = openrouterConfig.model;

    this.openai = new OpenAI({
      baseURL: 'https://openrouter.ai/api/v1',
      apiKey: openrouterConfig.apiKey,
      defaultHeaders: {
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'AI Document Summarizer',
      },
    });
  }

  async analyzeDocument(text: string): Promise<DocumentAnalysis> {
    try {
      const prompt = this.buildAnalysisPrompt(text);

      const completion = await this.openai.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: `You are an expert document analyzer. Analyze documents and extract:
1. A concise summary (2-3 sentences)
2. Document type (invoice, cv, report, letter, contract, memo, proposal, or other)
3. Relevant metadata based on document type

Return ONLY valid JSON in this exact format:
{
  "summary": "Brief summary here",
  "documentType": "type here",
  "metadata": {
    "key": "value"
  }
}

For different document types, extract:
- Invoice: date, sender, recipient, totalAmount, invoiceNumber, dueDate
- CV: name, email, phone, experience, education, skills
- Report: title, author, date, department, reportType
- Letter: date, sender, recipient, subject, purpose
- Contract: parties, effectiveDate, expirationDate, contractType, value
- Other: any relevant fields you can identify`,
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.3,
        max_tokens: 1000,
      });

      const responseText = completion.choices[0]?.message?.content;
      if (!responseText) {
        throw new Error('No response from LLM');
      }

      // Parse the JSON response
      const analysis = this.parseAnalysisResponse(responseText);
      this.logger.log(`Document analyzed successfully as ${analysis.documentType}`);
      
      return analysis;
    } catch (error) {
      this.logger.error(`Error analyzing document: ${error.message}`);
      throw new Error(`Failed to analyze document: ${error.message}`);
    }
  }

  private buildAnalysisPrompt(text: string): string {
    // Truncate text if too long (keep first 4000 chars for context)
    const truncatedText = text.length > 4000 ? text.substring(0, 4000) + '...' : text;
    
    return `Analyze the following document and provide a summary, document type, and extracted metadata:

${truncatedText}`;
  }

  private parseAnalysisResponse(responseText: string): DocumentAnalysis {
    try {
      // Remove markdown code blocks if present
      let cleanedText = responseText.trim();
      if (cleanedText.startsWith('```json')) {
        cleanedText = cleanedText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      } else if (cleanedText.startsWith('```')) {
        cleanedText = cleanedText.replace(/```\n?/g, '');
      }

      const parsed = JSON.parse(cleanedText);

      // Validate required fields
      if (!parsed.summary || !parsed.documentType) {
        throw new Error('Missing required fields in LLM response');
      }

      return {
        summary: parsed.summary,
        documentType: parsed.documentType.toLowerCase(),
        metadata: parsed.metadata || {},
      };
    } catch (error) {
      this.logger.error(`Error parsing LLM response: ${error.message}`);
      this.logger.debug(`Raw response: ${responseText}`);
      
      // Fallback response
      return {
        summary: 'Unable to generate summary',
        documentType: 'other',
        metadata: { error: 'Failed to parse LLM response' },
      };
    }
  }
}
