import { AgentConfig, ModificationRequest, ModificationResult, AnalysisResult, CodeFile } from '../types.js';
import { BaseLLM, LLMMessage } from '../llm/base.js';
import { ClaudeLLM } from '../llm/claude.js';
import { OpenAILLM } from '../llm/openai.js';
import { codeAnalyzer } from '../tools/codeAnalyzer.js';
import { codeModifier } from '../tools/codeModifier.js';
import { fileHandler } from '../tools/fileHandler.js';

export class CodeAgent {
  private llm: BaseLLM;
  private conversationHistory: LLMMessage[] = [];

  constructor(config: AgentConfig) {
    if (config.provider === 'claude') {
      this.llm = new ClaudeLLM(config);
    } else if (config.provider === 'openai') {
      this.llm = new OpenAILLM(config);
    } else {
      throw new Error(`Unknown provider: ${config.provider}`);
    }
  }

  /**
   * Analyze code files for issues and improvements
   */
  async analyzeCode(filePaths: string[]): Promise<AnalysisResult[]> {
    console.log(`\n📊 Analyzing ${filePaths.length} file(s)...`);

    const files = await fileHandler.readFiles(filePaths);
    const analyses = await Promise.all(
      files.map((file) => codeAnalyzer.analyzeCode(file))
    );

    return analyses;
  }

  /**
   * Modify code based on a task description
   */
  async modifyCode(request: ModificationRequest): Promise<ModificationResult> {
    console.log(`\n🔧 Modifying code for task: ${request.task}`);

    const systemPrompt = this.buildSystemPrompt(request);
    const userMessage = this.buildUserMessage(request);

    this.conversationHistory.push({
      role: 'user',
      content: userMessage,
    });

    const response = await this.llm.sendMessage(
      this.conversationHistory,
      systemPrompt
    );

    this.conversationHistory.push({
      role: 'assistant',
      content: response.text,
    });

    const result = await codeModifier.modifyCode(request, response.text);

    console.log(`\n✅ Modifications complete:`);
    console.log(`   Files modified: ${result.modified.length}`);
    console.log(`   Summary: ${result.summary}`);

    return result;
  }

  /**
   * Interactive conversation with the agent
   */
  async chat(userMessage: string): Promise<string> {
    console.log(`\n💬 You: ${userMessage}`);

    this.conversationHistory.push({
      role: 'user',
      content: userMessage,
    });

    const systemPrompt = `You are an expert code agent assistant. You help with:
- Code analysis and review
- Bug fixing
- Refactoring
- Test generation
- Best practices

Provide clear, actionable responses with code examples when relevant.`;

    const response = await this.llm.sendMessage(
      this.conversationHistory,
      systemPrompt
    );

    this.conversationHistory.push({
      role: 'assistant',
      content: response.text,
    });

    console.log(`\n🤖 Agent: ${response.text}`);
    console.log(`   (Tokens - In: ${response.usage?.inputTokens || 0}, Out: ${response.usage?.outputTokens || 0})`);

    return response.text;
  }

  /**
   * Generate tests for code
   */
  async generateTests(filePaths: string[]): Promise<CodeFile[]> {
    console.log(`\n🧪 Generating tests for ${filePaths.length} file(s)...`);

    const files = await fileHandler.readFiles(filePaths);
    const testCodes: CodeFile[] = [];

    for (const file of files) {
      const userMessage = `Generate comprehensive unit tests for this ${file.language} file. Include edge cases and error handling.\n\n\`\`\`${file.language}\n${file.content}\n\`\`\``;

      this.conversationHistory.push({
        role: 'user',
        content: userMessage,
      });

      const response = await this.llm.sendMessage(this.conversationHistory);

      this.conversationHistory.push({
        role: 'assistant',
        content: response.text,
      });

      testCodes.push({
        path: file.path.replace(/\.(ts|js)$/, '.test.$1'),
        content: response.text,
        language: file.language,
      });
    }

    return testCodes;
  }

  /**
   * Clear conversation history
   */
  clearHistory(): void {
    this.conversationHistory = [];
  }

  private buildSystemPrompt(request: ModificationRequest): string {
    return `You are an expert code agent. Your task is to modify code according to requirements.

Task: ${request.task}

${request.constraints ? `Constraints:\n${request.constraints.map((c) => `- ${c}`).join('\n')}` : ''}

Respond with modified code in code blocks (\`\`\`language\ncode\`\`\`).`;
  }

  private buildUserMessage(request: ModificationRequest): string {
    const files = request.files
      .map((f) => `File: ${f.path}\n\`\`\`${f.language}\n${f.content}\n\`\`\``)
      .join('\n\n');

    return `Please modify the following code to: ${request.task}\n\n${files}`;
  }
}
