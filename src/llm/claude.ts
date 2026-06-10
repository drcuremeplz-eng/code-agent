import Anthropic from '@anthropic-ai/sdk';
import { BaseLLM, LLMMessage, LLMResponse } from './base.js';
import { AgentConfig } from '../types.js';

export class ClaudeLLM extends BaseLLM {
  private client: Anthropic;

  constructor(config: AgentConfig) {
    super(config);
    this.validateConfig();
    this.client = new Anthropic({
      apiKey: config.apiKey,
    });
  }

  async sendMessage(
    messages: LLMMessage[],
    systemPrompt?: string
  ): Promise<LLMResponse> {
    const response = await this.client.messages.create({
      model: this.config.model,
      max_tokens: this.config.maxTokens || 4096,
      temperature: this.config.temperature || 0.7,
      system: systemPrompt,
      messages: messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    });

    const textContent = response.content.find((c) => c.type === 'text');
    if (!textContent || textContent.type !== 'text') {
      throw new Error('No text content in response');
    }

    return {
      text: textContent.text,
      stopReason: response.stop_reason,
      usage: {
        inputTokens: response.usage.input_tokens,
        outputTokens: response.usage.output_tokens,
      },
    };
  }

  async callTool(
    toolName: string,
    toolInput: Record<string, unknown>
  ): Promise<string> {
    // Tool calling will be implemented in the Agent
    throw new Error('Tool calling handled by Agent orchestrator');
  }
}
