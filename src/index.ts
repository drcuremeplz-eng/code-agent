import dotenv from 'dotenv';
import { CodeAgent } from './agent/index.js';

dotenv.config();

const PROVIDER = (process.env.LLM_PROVIDER || 'claude') as 'claude' | 'openai';
const MODEL =
  process.env.LLM_MODEL ||
  (PROVIDER === 'claude'
    ? 'claude-3-5-sonnet-20241022'
    : 'gpt-4o-mini');
const API_KEY =
  PROVIDER === 'claude'
    ? process.env.ANTHROPIC_API_KEY
    : process.env.OPENAI_API_KEY;

async function main() {
  if (!API_KEY) {
    throw new Error(
      `${PROVIDER.toUpperCase()}_API_KEY is not set in .env file`
    );
  }

  // Initialize the agent
  const agent = new CodeAgent({
    provider: PROVIDER,
    model: MODEL,
    apiKey: API_KEY,
    temperature: 0.7,
    maxTokens: 4096,
  });

  console.log(`🚀 Code Agent initialized with ${PROVIDER.toUpperCase()}`);
  console.log(`📦 Model: ${MODEL}\n`);

  // Example 1: Analyze code
  console.log('='.repeat(60));
  console.log('EXAMPLE 1: Code Analysis');
  console.log('='.repeat(60));
  const analysisResults = await agent.analyzeCode(['src/agent/index.ts']);
  console.log(JSON.stringify(analysisResults, null, 2));

  // Example 2: Interactive chat
  console.log('\n' + '='.repeat(60));
  console.log('EXAMPLE 2: Interactive Chat');
  console.log('='.repeat(60));
  await agent.chat(
    'What are best practices for error handling in TypeScript?'
  );

  // Example 3: Modify code
  console.log('\n' + '='.repeat(60));
  console.log('EXAMPLE 3: Code Modification');
  console.log('='.repeat(60));
  const exampleCode: { path: string; content: string; language: string } = {
    path: 'example.ts',
    content: `function addNumbers(a, b) {
  return a + b;
}

function multiply(a, b) {
  return a * b;
}`,
    language: 'typescript',
  };

  const modifyResult = await agent.modifyCode({
    files: [exampleCode],
    task: 'Add TypeScript types, error handling, and JSDoc comments',
    constraints: [
      'Maintain backward compatibility',
      'Add input validation',
      'Include unit test examples',
    ],
  });

  console.log('\nModified Code:');
  console.log(modifyResult.modified[0].content);
  console.log('\nReasoning:');
  console.log(modifyResult.reasoning);

  // Example 4: Generate tests
  console.log('\n' + '='.repeat(60));
  console.log('EXAMPLE 4: Test Generation');
  console.log('='.repeat(60));
  const tests = await agent.generateTests(['src/tools/fileHandler.ts']);
  console.log(`\nGenerated ${tests.length} test file(s)`);
  tests.forEach((t) => console.log(`- ${t.path}`));
}

main().catch(console.error);
