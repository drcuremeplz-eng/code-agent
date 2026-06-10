import { CodeFile } from '../types.js';
import { LanguageDetector } from '../languages/languageDetector.js';

export interface Preview {
  language: string;
  syntax: string;
  complexity: string;
  lineCount: number;
  functions: string[];
  imports: string[];
  issues: string[];
  html: string;
}

export class PreviewGenerator {
  async generatePreview(file: CodeFile): Promise<Preview> {
    const language = LanguageDetector.detect(file.path);
    const lines = file.content.split('\n');
    const functions = this.extractFunctions(file.content, language);
    const imports = this.extractImports(file.content, language);
    const issues = this.findIssues(file.content, language);
    const complexity = this.calculateComplexity(file.content);

    const html = this.generateHTML({
      path: file.path,
      language,
      content: file.content,
      functions,
      imports,
      issues,
      lineCount: lines.length,
    });

    return {
      language,
      syntax: this.determineSyntaxHighlighting(language),
      complexity,
      lineCount: lines.length,
      functions,
      imports,
      issues,
      html,
    };
  }

  private extractFunctions(content: string, language: string): string[] {
    const functions: string[] = [];
    const patterns: Record<string, RegExp> = {
      typescript:
        /(?:function|async\s+function|const\s+\w+\s*=\s*(?:async\s*)?\(|class\s+\w+)\s*([\w$]+)/g,
      javascript:
        /(?:function|async\s+function|const\s+\w+\s*=\s*(?:async\s*)?\(|class\s+\w+)\s*([\w$]+)/g,
      python: /(?:def|class)\s+([\w_]+)/g,
      java: /(?:public|private|protected)?\s*(?:static)?\s*(?:void|String|int|boolean)\s+([\w$]+)/g,
      go: /(?:func|type)\s+\(?\w+\)?\s*([\w_]+)/g,
      rust: /(?:fn|pub fn|impl|struct|trait)\s+([\w_]+)/g,
    };

    const pattern = patterns[language] || patterns['typescript'];
    let match;
    while ((match = pattern.exec(content)) !== null) {
      if (match[1] && !functions.includes(match[1])) {
        functions.push(match[1]);
      }
    }

    return functions;
  }

  private extractImports(content: string, language: string): string[] {
    const imports: string[] = [];
    const patterns: Record<string, RegExp> = {
      typescript: /(?:import|require)\s+['"]?([^'"\n;]+)['"]?/g,
      javascript: /(?:import|require)\s+['"]?([^'"\n;]+)['"]?/g,
      python: /(?:import|from)\s+([\w.]+)/g,
      java: /import\s+([\w.]+);/g,
      go: /import\s+\(\s*([\w\/\-]+)/g,
      rust: /use\s+([\w:]+);/g,
    };

    const pattern = patterns[language] || patterns['typescript'];
    let match;
    while ((match = pattern.exec(content)) !== null) {
      if (match[1]) {
        imports.push(match[1]);
      }
    }

    return imports;
  }

  private findIssues(content: string, language: string): string[] {
    const issues: string[] = [];

    // Common issues
    if (content.includes('console.log')) {
      issues.push('Found console.log - remove in production');
    }
    if (content.includes('TODO')) {
      issues.push('Found TODO comment');
    }
    if (content.includes('FIXME')) {
      issues.push('Found FIXME comment');
    }
    if (/\s+$/.test(content)) {
      issues.push('Trailing whitespace detected');
    }

    // Language-specific
    if (language === 'typescript') {
      if (/:\s*any/g.test(content)) {
        issues.push('Found any type - use specific types');
      }
    }

    if (language === 'python') {
      if (/import \*/g.test(content)) {
        issues.push('Found import * - import specific names');
      }
    }

    return issues;
  }

  private calculateComplexity(content: string): string {
    let score = 0;
    score += (content.match(/if\s*\(/g) || []).length * 2;
    score += (content.match(/for\s*\(/g) || []).length * 3;
    score += (content.match(/while\s*\(/g) || []).length * 3;
    score += (content.match(/switch\s*\(/g) || []).length * 2;
    score += (content.match(/catch\s*\(/g) || []).length * 2;

    if (score <= 10) return 'Low';
    if (score <= 20) return 'Medium';
    if (score <= 40) return 'High';
    return 'Very High';
  }

  private determineSyntaxHighlighting(language: string): string {
    const highlightMap: Record<string, string> = {
      typescript: 'typescript',
      javascript: 'javascript',
      python: 'python',
      java: 'java',
      go: 'go',
      rust: 'rust',
      cpp: 'cpp',
      csharp: 'csharp',
      ruby: 'ruby',
      php: 'php',
      gdscript: 'gdscript',
    };

    return highlightMap[language] || 'text';
  }

  private generateHTML(data: {
    path: string;
    language: string;
    content: string;
    functions: string[];
    imports: string[];
    issues: string[];
    lineCount: number;
  }): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <title>${data.path}</title>
  <style>
    body { font-family: monospace; background: #1e1e1e; color: #d4d4d4; margin: 0; padding: 20px; }
    .container { max-width: 1200px; margin: 0 auto; }
    .header { border-bottom: 2px solid #007acc; padding-bottom: 10px; margin-bottom: 20px; }
    .header h1 { margin: 0; color: #007acc; }
    .stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 20px; }
    .stat { background: #252526; padding: 10px; border-left: 3px solid #007acc; }
    .stat-value { font-size: 20px; font-weight: bold; color: #4ec9b0; }
    .stat-label { font-size: 12px; color: #858585; }
    .section { margin-bottom: 20px; }
    .section-title { background: #007acc; color: white; padding: 8px 12px; margin-bottom: 10px; }
    .section-content { background: #252526; padding: 12px; border-radius: 4px; }
    .item { padding: 4px 0; color: #ce9178; }
    .issue { color: #f48771; }
    .code-preview { background: #1e1e1e; border: 1px solid #3e3e42; padding: 12px; overflow-x: auto; }
    .line-number { color: #858585; margin-right: 10px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${data.path}</h1>
      <p>Language: ${data.language}</p>
    </div>

    <div class="stats">
      <div class="stat">
        <div class="stat-value">${data.lineCount}</div>
        <div class="stat-label">Lines</div>
      </div>
      <div class="stat">
        <div class="stat-value">${data.functions.length}</div>
        <div class="stat-label">Functions</div>
      </div>
      <div class="stat">
        <div class="stat-value">${data.imports.length}</div>
        <div class="stat-label">Imports</div>
      </div>
      <div class="stat">
        <div class="stat-value">${data.issues.length}</div>
        <div class="stat-label">Issues</div>
      </div>
    </div>

    <div class="section">
      <div class="section-title">Functions</div>
      <div class="section-content">
        ${data.functions.map((fn) => `<div class="item">• ${fn}</div>`).join('')}
      </div>
    </div>

    <div class="section">
      <div class="section-title">Imports</div>
      <div class="section-content">
        ${data.imports.map((imp) => `<div class="item">• ${imp}</div>`).join('')}
      </div>
    </div>

    ${data.issues.length > 0 ? `
    <div class="section">
      <div class="section-title" style="background-color: #d16969;">Issues</div>
      <div class="section-content">
        ${data.issues.map((issue) => `<div class="item issue">⚠ ${issue}</div>`).join('')}
      </div>
    </div>
    ` : ''}

    <div class="section">
      <div class="section-title">Code Preview</div>
      <div class="code-preview">
        ${data.content
          .split('\n')
          .slice(0, 20)
          .map((line, i) => `<div><span class="line-number">${String(i + 1).padStart(3)}</span>${line}</div>`)
          .join('')}
      </div>
    </div>
  </div>
</body>
</html>
`;
  }
}

export const previewGenerator = new PreviewGenerator();
