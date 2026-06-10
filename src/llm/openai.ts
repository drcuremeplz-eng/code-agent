import OpenAI from 'openai';
import { BaseLLM, LLMMessage, LLMResponse } from './base.js';
import { AgentConfig } from '../types.js';

export class OpenAILLM extends BaseLLM {
  private client: OpenAI;

  constructor(config: AgentConfig) {
    super(config);
    this.validateConfig();
    this.client = new OpenAI({
      apiKey: config.apiKey,
    });
  }

  async sendMessage(
    messages: LLMMessage[],
    systemPrompt?: string
  ): Promise<LLMResponse> {
    const allMessages: OpenAI.Chat.ChatCompletionMessageParam[] = [];

    if (systemPrompt) {
      allMessages.push({
        role: 'system',
        content: systemPrompt,
      });
    }

    allMessages.push(...messages);

    const response = await this.client.chat.completions.create({
      model: this.config.model,
      max_tokens: this.config.maxTokens || 4096,
      temperature: this.config.temperature || 0.7,
      messages: allMessages,
    });

    const textContent = response.choices[0].message.content;
    if (!textContent) {
      throw new Error('No text content in response');
    }

    return {
      text: textContent,
      stopReason: response.choices[0].finish_reason || 'stop',
      usage: response.usage
        ? {
            inputTokens: response.usage.prompt_tokens,
            outputTokens: response.usage.completion_tokens,
          }
        : undefined,
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
