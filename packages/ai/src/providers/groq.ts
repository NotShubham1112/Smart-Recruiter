import type { MCPResponse } from '@helix/types';

export interface GroqConfig {
  apiKey: string;
  baseUrl?: string;
  defaultModel?: string;
}

export interface CompletionParams {
  model: string;
  messages: { role: 'system' | 'user' | 'assistant'; content: string }[];
  temperature?: number;
  maxTokens?: number;
}

export class GroqClient {
  private config: GroqConfig;

  constructor(config: GroqConfig) {
    this.config = {
      baseUrl: 'https://api.groq.com/openai/v1',
      defaultModel: 'qwen-3-32b',
      ...config,
    };
  }

  async complete(params: CompletionParams): Promise<string> {
    const response = await fetch(`${this.config.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: params.model,
        messages: params.messages,
        temperature: params.temperature ?? 0.7,
        max_tokens: params.maxTokens ?? 4096,
      }),
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json() as { choices: { message: { content: string } }[] };
    return data.choices[0]?.message?.content ?? '';
  }

  async completeWithMetadata(params: CompletionParams): Promise<MCPResponse> {
    const startTime = Date.now();
    const content = await this.complete(params);
    return {
      id: crypto.randomUUID(),
      result: content,
      metadata: {
        timestamp: new Date().toISOString(),
        durationMs: Date.now() - startTime,
        model: params.model,
      },
    };
  }
}
