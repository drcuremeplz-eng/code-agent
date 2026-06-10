# 🤖 Code Agent - Strong AI Code Assistant

A powerful TypeScript-based AI agent for code analysis, modification, refactoring, and generation using Claude or GPT-4 APIs.

## Features

✨ **Core Capabilities**
- 🔍 **Code Analysis** - Detect issues, complexity metrics, and improvement suggestions
- ✏️ **Code Modification** - Refactor, fix bugs, apply transformations based on natural language
- 🧪 **Test Generation** - Auto-generate unit tests with edge cases
- 💬 **Interactive Chat** - Conversational code assistance
- 📊 **Multi-file Support** - Analyze and modify multiple files simultaneously

## Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Claude API key (Anthropic) OR OpenAI API key

### Installation

```bash
git clone https://github.com/drcuremeplz-eng/code-agent.git
cd code-agent
npm install
```

### Configuration

1. Copy `.env.example` to `.env`
2. Add your API keys:

```bash
# Claude (Recommended)
ANTHROPIC_API_KEY=sk-ant-...
LLM_PROVIDER=claude
LLM_MODEL=claude-3-5-sonnet-20241022

# OR OpenAI
OPENAI_API_KEY=sk-...
LLM_PROVIDER=openai
LLM_MODEL=gpt-4o-mini
```

### Run Agent

```bash
npm run dev
```

## Usage Examples

### 1. Analyze Code

```typescript
const agent = new CodeAgent(config);
const results = await agent.analyzeCode(['src/myFile.ts']);
console.log(results);
```

### 2. Modify Code

```typescript
const result = await agent.modifyCode({
  files: [{ path: 'app.ts', content: '...', language: 'typescript' }],
  task: 'Add error handling and logging',
  constraints: ['Maintain backward compatibility'],
});
```

### 3. Interactive Chat

```typescript
await agent.chat('How do I implement a singleton pattern?');
await agent.chat('Can you refactor my code for better performance?');
```

### 4. Generate Tests

```typescript
const tests = await agent.generateTests(['src/utils.ts']);
for (const test of tests) {
  await fileHandler.writeFile(test);
}
```

## Architecture

```
src/
├── agent/           # Main agent orchestrator
├── llm/             # LLM provider implementations (Claude, OpenAI)
├── tools/           # Code analysis, modification, file handling
├── types.ts         # TypeScript type definitions
└── index.ts         # Entry point
```

## API Reference

### CodeAgent

#### `constructor(config: AgentConfig)`
Initialize agent with LLM configuration.

#### `analyzeCode(filePaths: string[]): Promise<AnalysisResult[]>`
Analyze files for issues and complexity.

#### `modifyCode(request: ModificationRequest): Promise<ModificationResult>`
Modify code based on task description.

#### `chat(message: string): Promise<string>`
Send a message to the agent.

#### `generateTests(filePaths: string[]): Promise<CodeFile[]>`
Generate unit tests for files.

## LLM Providers

### Claude (Anthropic) - Recommended
- Model: `claude-3-5-sonnet-20241022`
- Excellent for code understanding
- 200K context window

### OpenAI GPT-4 Mini
- Model: `gpt-4o-mini`
- Fast and cost-effective
- Great for quick tasks

## Configuration Options

```typescript
interface AgentConfig {
  provider: 'claude' | 'openai';
  model: string;              // Model name
  temperature?: number;       // 0-1, controls randomness
  maxTokens?: number;         // Max output tokens
  apiKey: string;             // Your API key
}
```

## Cost Considerations

- **Claude 3.5 Sonnet**: ~$3 per 1M input tokens, ~$15 per 1M output tokens
- **GPT-4o Mini**: ~$0.15 per 1M input tokens, ~$0.60 per 1M output tokens

Typical code analysis: 1K-50K tokens depending on file size.

## Advanced Usage

### Custom System Prompts

Modify `buildSystemPrompt()` in `src/agent/index.ts` for domain-specific instructions.

### Tool Integration

Add new tools in `src/tools/` and register them in the agent.

### Batch Processing

```typescript
const files = await fileHandler.scanDirectory('./src');
const results = await agent.analyzeCode(files);
```

## Limitations

- Context window constraints on very large files (>100KB)
- LLM hallucinations possible - always review generated code
- Requires valid API key with sufficient quota

## Contributing

Contributions welcome! Areas for enhancement:
- [ ] GitHub integration for PR analysis
- [ ] ESLint plugin backend
- [ ] AST-based analysis
- [ ] Custom tool framework
- [ ] Database storage for analysis history
- [ ] Web UI dashboard

## License

MIT

## Support

For issues or questions:
1. Check existing GitHub issues
2. Create a new issue with details
3. Include your OS, Node version, and error logs

---

**Made with ❤️ by drcuremeplz-eng**
