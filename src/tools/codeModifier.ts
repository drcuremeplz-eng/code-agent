import { CodeFile, ModificationRequest, ModificationResult } from '../types.js';

export class CodeModifier {
  /**
   * Modify code based on a task description
   * This is a framework for LLM-based modifications
   */
  async modifyCode(
    request: ModificationRequest,
    llmResponse: string
  ): Promise<ModificationResult> {
    // Parse LLM response to extract modifications
    const modified = this.applyModifications(request.files, llmResponse);
    const summary = this.generateSummary(request, modified);

    return {
      modified,
      summary,
      reasoning: llmResponse,
      testCases: this.generateTestCases(modified),
    };
  }

  private applyModifications(
    originalFiles: CodeFile[],
    llmResponse: string
  ): CodeFile[] {
    // In a real scenario, parse the LLM response to extract code blocks
    // and apply them as modifications. For now, return original files.
    return originalFiles.map((file) => ({
      ...file,
      content: llmResponse.includes(file.path)
        ? this.extractCodeBlock(llmResponse, file.path) || file.content
        : file.content,
    }));
  }

  private extractCodeBlock(
    llmResponse: string,
    filename: string
  ): string | null {
    const regex = new RegExp(
      `(?:\`\`\`(?:ts|js|typescript|javascript)?\n)([\\s\\S]*?)\`\`\``,
      'g'
    );
    const matches = llmResponse.matchAll(regex);

    for (const match of matches) {
      if (match[1]) {
        return match[1];
      }
    }

    return null;
  }

  private generateSummary(
    request: ModificationRequest,
    modified: CodeFile[]
  ): string {
    return `Modified ${modified.length} file(s) to: ${request.task}`;
  }

  private generateTestCases(modified: CodeFile[]): string[] {
    return [
      'Test all public functions',
      'Test edge cases',
      'Test error handling',
    ];
  }
}

export const codeModifier = new CodeModifier();
