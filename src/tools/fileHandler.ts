import * as fs from 'fs/promises';
import * as path from 'path';
import { CodeFile } from '../types.js';

export class FileHandler {
  /**
   * Read a single file
   */
  async readFile(filePath: string): Promise<CodeFile> {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const language = this.detectLanguage(filePath);

      return {
        path: filePath,
        content,
        language,
      };
    } catch (error) {
      throw new Error(`Failed to read file ${filePath}: ${error}`);
    }
  }

  /**
   * Read multiple files
   */
  async readFiles(filePaths: string[]): Promise<CodeFile[]> {
    return Promise.all(filePaths.map((fp) => this.readFile(fp)));
  }

  /**
   * Write modified files
   */
  async writeFile(file: CodeFile): Promise<void> {
    try {
      const dir = path.dirname(file.path);
      await fs.mkdir(dir, { recursive: true });
      await fs.writeFile(file.path, file.content, 'utf-8');
    } catch (error) {
      throw new Error(`Failed to write file ${file.path}: ${error}`);
    }
  }

  /**
   * Scan directory for files
   */
  async scanDirectory(
    dirPath: string,
    extensions: string[] = ['.ts', '.js']
  ): Promise<string[]> {
    const files: string[] = [];

    const scan = async (dir: string) => {
      const entries = await fs.readdir(dir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
          if (!entry.name.startsWith('.') && entry.name !== 'node_modules') {
            await scan(fullPath);
          }
        } else if (extensions.some((ext) => fullPath.endsWith(ext))) {
          files.push(fullPath);
        }
      }
    };

    await scan(dirPath);
    return files;
  }

  private detectLanguage(filePath: string): string {
    const ext = path.extname(filePath).toLowerCase();
    const languageMap: Record<string, string> = {
      '.ts': 'typescript',
      '.js': 'javascript',
      '.py': 'python',
      '.go': 'go',
      '.rs': 'rust',
      '.java': 'java',
      '.cpp': 'cpp',
      '.c': 'c',
      '.cs': 'csharp',
      '.rb': 'ruby',
      '.php': 'php',
    };

    return languageMap[ext] || 'unknown';
  }
}

export const fileHandler = new FileHandler();
