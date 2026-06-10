import { AgentConfig } from '../types.js';

export interface LLMMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface LLMResponse {
  text: string;
  stopReason: string;
  usage?: {
    inputTokens: number;
    outputTokens: number;
  };
}

export abstract class BaseLLM {
  protected config: AgentConfig;

  constructor(config: AgentConfig) {
    this.config = config;
  }

  abstract sendMessage(
    messages: LLMMessage[],
    systemPrompt?: string
  ): Promise<LLMResponse>;

  abstract callTool(
    toolName: string,
    toolInput: Record<string, unknown>
  ): Promise<string>;

  protected validateConfig(): void {
    if (!this.config.apiKey) {
      throw new Error(`API key missing for ${this.config.provider}`);
    }
  }
}
