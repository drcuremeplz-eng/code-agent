import { exec } from 'child_process';
import { promisify } from 'util';
import { LanguageDetector, ProgrammingLanguage } from '../languages/languageDetector.js';

const execAsync = promisify(exec);

export interface BuildConfig {
  language: ProgrammingLanguage;
  entryFile: string;
  outputDir: string;
  sourceDir?: string;
  environment?: Record<string, string>;
}

export interface BuildResult {
  success: boolean;
  language: ProgrammingLanguage;
  outputPath?: string;
  stdout: string;
  stderr: string;
  duration: number;
}

export class MultiLanguageBuilder {
  async build(config: BuildConfig): Promise<BuildResult> {
    const startTime = Date.now();
    const langConfig = LanguageDetector.getConfig(config.language);

    try {
      let stdout = '';
      let stderr = '';
      let outputPath: string | undefined;

      switch (config.language) {
        case 'typescript':
          ({ stdout, stderr } = await execAsync('tsc'));
          outputPath = config.outputDir;
          break;

        case 'javascript':
          ({ stdout, stderr } = await execAsync('npm run build'));
          outputPath = config.outputDir;
          break;

        case 'python':
          ({ stdout, stderr } = await execAsync(
            `python -m py_compile ${config.entryFile}`
          ));
          outputPath = config.entryFile.replace('.py', '.pyc');
          break;

        case 'go':
          ({ stdout, stderr } = await execAsync(
            `go build -o ${config.outputDir}/app ${config.entryFile}`
          ));
          outputPath = `${config.outputDir}/app`;
          break;

        case 'rust':
          ({ stdout, stderr } = await execAsync(
            `cargo build --release --out-dir ${config.outputDir}`
          ));
          outputPath = config.outputDir;
          break;

        case 'java':
          ({ stdout, stderr } = await execAsync(
            `javac -d ${config.outputDir} ${config.entryFile}`
          ));
          outputPath = config.outputDir;
          break;

        case 'cpp':
          ({ stdout, stderr } = await execAsync(
            `g++ -o ${config.outputDir}/app ${config.entryFile}`
          ));
          outputPath = `${config.outputDir}/app`;
          break;

        case 'csharp':
          ({ stdout, stderr } = await execAsync(
            `dotnet build -o ${config.outputDir}`
          ));
          outputPath = config.outputDir;
          break;

        case 'ruby':
          ({ stdout, stderr } = await execAsync(
            `bundler install && ruby ${config.entryFile}`
          ));
          outputPath = config.entryFile;
          break;

        case 'php':
          ({ stdout, stderr } = await execAsync(`php -l ${config.entryFile}`));
          outputPath = config.entryFile;
          break;

        default:
          throw new Error(`Build not supported for ${config.language}`);
      }

      return {
        success: true,
        language: config.language,
        outputPath,
        stdout,
        stderr,
        duration: Date.now() - startTime,
      };
    } catch (error) {
      return {
        success: false,
        language: config.language,
        stdout: '',
        stderr: (error as Error).message,
        duration: Date.now() - startTime,
      };
    }
  }

  async runTests(language: ProgrammingLanguage, testDir: string): Promise<BuildResult> {
    const startTime = Date.now();
    const testFramework = LanguageDetector.getTestFramework(language);

    try {
      let stdout = '';
      let stderr = '';

      switch (language) {
        case 'typescript':
          ({ stdout, stderr } = await execAsync('npm run test'));
          break;
        case 'python':
          ({ stdout, stderr } = await execAsync(`pytest ${testDir}`));
          break;
        case 'go':
          ({ stdout, stderr } = await execAsync('go test ./...'));
          break;
        case 'rust':
          ({ stdout, stderr } = await execAsync('cargo test'));
          break;
        case 'java':
          ({ stdout, stderr } = await execAsync('mvn test'));
          break;
        default:
          ({ stdout, stderr } = await execAsync(`${testFramework} ${testDir}`));
      }

      return {
        success: stderr === '',
        language,
        stdout,
        stderr,
        duration: Date.now() - startTime,
      };
    } catch (error) {
      return {
        success: false,
        language,
        stdout: '',
        stderr: (error as Error).message,
        duration: Date.now() - startTime,
      };
    }
  }
}

export const multiLanguageBuilder = new MultiLanguageBuilder();
