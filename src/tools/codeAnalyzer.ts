import { CodeFile, AnalysisResult, Issue } from '../types.js';

export class CodeAnalyzer {
  /**
   * Analyze code for issues, complexity, and improvements
   */
  async analyzeCode(file: CodeFile): Promise<AnalysisResult> {
    const issues = this.detectIssues(file);
    const complexity = this.calculateComplexity(file.content);
    const suggestions = this.generateSuggestions(file.content, issues);

    return {
      file: file.path,
      issues,
      suggestions,
      complexity,
    };
  }

  private detectIssues(file: CodeFile): Issue[] {
    const issues: Issue[] = [];
    const lines = file.content.split('\n');

    lines.forEach((line, index) => {
      const lineNum = index + 1;

      // Detect console.log
      if (line.includes('console.log')) {
        issues.push({
          line: lineNum,
          severity: 'warning',
          message: 'Remove console.log in production code',
          code: 'no-console',
        });
      }

      // Detect var usage
      if (/^\s*var\s+/.test(line)) {
        issues.push({
          line: lineNum,
          severity: 'warning',
          message: 'Use const or let instead of var',
          code: 'no-var',
        });
      }

      // Detect long lines
      if (line.length > 100) {
        issues.push({
          line: lineNum,
          severity: 'info',
          message: 'Line exceeds 100 characters',
          code: 'max-line-length',
        });
      }

      // Detect TODO/FIXME
      if (line.includes('TODO') || line.includes('FIXME')) {
        issues.push({
          line: lineNum,
          severity: 'info',
          message: line.includes('TODO') ? 'TODO found' : 'FIXME found',
          code: 'todo-comment',
        });
      }
    });

    return issues;
  }

  private calculateComplexity(content: string): number {
    let complexity = 0;
    const patterns = [
      /if\s*\(/g,
      /else\s*\{?/g,
      /for\s*\(/g,
      /while\s*\(/g,
      /switch\s*\(/g,
      /catch\s*\(/g,
      /&&/g,
      /\|\|/g,
    ];

    patterns.forEach((pattern) => {
      complexity += (content.match(pattern) || []).length;
    });

    return complexity;
  }

  private generateSuggestions(content: string, issues: Issue[]): string[] {
    const suggestions: string[] = [];

    if (issues.length > 5) {
      suggestions.push('High number of issues detected. Consider refactoring.');
    }

    if (content.length > 500) {
      suggestions.push('Function is large. Consider breaking into smaller functions.');
    }

    if (!content.includes('try') && !content.includes('catch')) {
      suggestions.push('No error handling detected. Add try-catch blocks.');
    }

    if (!content.includes('//') && !content.includes('/*')) {
      suggestions.push('Add comments to explain complex logic.');
    }

    return suggestions;
  }
}

export const codeAnalyzer = new CodeAnalyzer();
