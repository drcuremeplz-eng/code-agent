export type ProgrammingLanguage =
  | 'typescript'
  | 'javascript'
  | 'python'
  | 'go'
  | 'rust'
  | 'java'
  | 'cpp'
  | 'c'
  | 'csharp'
  | 'ruby'
  | 'php'
  | 'kotlin'
  | 'swift'
  | 'dart'
  | 'lua'
  | 'r'
  | 'scala'
  | 'groovy'
  | 'bash'
  | 'gdscript';

export interface LanguageConfig {
  name: string;
  extensions: string[];
  testFrameworks: string[];
  buildSystems: string[];
  package?: {
    manager: string;
    lockFile: string;
  };
  runtime?: string;
}

export const LANGUAGE_CONFIGS: Record<ProgrammingLanguage, LanguageConfig> = {
  typescript: {
    name: 'TypeScript',
    extensions: ['.ts'],
    testFrameworks: ['vitest', 'jest', 'mocha'],
    buildSystems: ['tsc', 'esbuild', 'webpack', 'vite'],
    package: { manager: 'npm', lockFile: 'package-lock.json' },
    runtime: 'node',
  },
  javascript: {
    name: 'JavaScript',
    extensions: ['.js', '.mjs'],
    testFrameworks: ['jest', 'mocha', 'jasmine'],
    buildSystems: ['webpack', 'esbuild', 'rollup', 'vite'],
    package: { manager: 'npm', lockFile: 'package-lock.json' },
    runtime: 'node',
  },
  python: {
    name: 'Python',
    extensions: ['.py'],
    testFrameworks: ['pytest', 'unittest', 'nose2'],
    buildSystems: ['setuptools', 'poetry', 'pdm', 'flit'],
    package: { manager: 'pip', lockFile: 'requirements.txt' },
    runtime: 'python3',
  },
  go: {
    name: 'Go',
    extensions: ['.go'],
    testFrameworks: ['testing', 'testify'],
    buildSystems: ['go build', 'make'],
    package: { manager: 'go', lockFile: 'go.sum' },
    runtime: 'go',
  },
  rust: {
    name: 'Rust',
    extensions: ['.rs'],
    testFrameworks: ['cargo test'],
    buildSystems: ['cargo'],
    package: { manager: 'cargo', lockFile: 'Cargo.lock' },
    runtime: 'cargo',
  },
  java: {
    name: 'Java',
    extensions: ['.java'],
    testFrameworks: ['junit', 'testng'],
    buildSystems: ['maven', 'gradle'],
    package: { manager: 'maven', lockFile: 'pom.xml' },
    runtime: 'java',
  },
  cpp: {
    name: 'C++',
    extensions: ['.cpp', '.cc', '.cxx'],
    testFrameworks: ['gtest', 'catch2'],
    buildSystems: ['cmake', 'make', 'bazel'],
    package: { manager: 'conan', lockFile: 'conan.lock' },
    runtime: 'gcc/clang',
  },
  c: {
    name: 'C',
    extensions: ['.c', '.h'],
    testFrameworks: ['unity', 'cunit'],
    buildSystems: ['cmake', 'make', 'gcc'],
    package: { manager: 'vcpkg', lockFile: '' },
    runtime: 'gcc/clang',
  },
  csharp: {
    name: 'C#',
    extensions: ['.cs'],
    testFrameworks: ['nunit', 'xunit', 'mstest'],
    buildSystems: ['msbuild', 'dotnet'],
    package: { manager: 'nuget', lockFile: 'packages.lock.json' },
    runtime: 'dotnet',
  },
  ruby: {
    name: 'Ruby',
    extensions: ['.rb'],
    testFrameworks: ['rspec', 'minitest'],
    buildSystems: ['bundler', 'rake'],
    package: { manager: 'bundler', lockFile: 'Gemfile.lock' },
    runtime: 'ruby',
  },
  php: {
    name: 'PHP',
    extensions: ['.php'],
    testFrameworks: ['phpunit', 'pest'],
    buildSystems: ['composer', 'phing'],
    package: { manager: 'composer', lockFile: 'composer.lock' },
    runtime: 'php',
  },
  kotlin: {
    name: 'Kotlin',
    extensions: ['.kt', '.kts'],
    testFrameworks: ['junit', 'kotest'],
    buildSystems: ['gradle', 'maven'],
    package: { manager: 'gradle', lockFile: 'gradle.lock' },
    runtime: 'jvm',
  },
  swift: {
    name: 'Swift',
    extensions: ['.swift'],
    testFrameworks: ['xctest'],
    buildSystems: ['swift build', 'xcode'],
    package: { manager: 'spm', lockFile: 'Package.resolved' },
    runtime: 'swift',
  },
  dart: {
    name: 'Dart',
    extensions: ['.dart'],
    testFrameworks: ['test', 'flutter_test'],
    buildSystems: ['pub', 'flutter build'],
    package: { manager: 'pub', lockFile: 'pubspec.lock' },
    runtime: 'dart',
  },
  lua: {
    name: 'Lua',
    extensions: ['.lua'],
    testFrameworks: ['busted'],
    buildSystems: ['luarocks'],
    package: { manager: 'luarocks', lockFile: 'rockspec' },
    runtime: 'lua',
  },
  r: {
    name: 'R',
    extensions: ['.r', '.R'],
    testFrameworks: ['testthat'],
    buildSystems: ['devtools'],
    package: { manager: 'CRAN', lockFile: 'DESCRIPTION' },
    runtime: 'R',
  },
  scala: {
    name: 'Scala',
    extensions: ['.scala'],
    testFrameworks: ['scalatest', 'specs2'],
    buildSystems: ['sbt'],
    package: { manager: 'sbt', lockFile: 'build.lock' },
    runtime: 'jvm',
  },
  groovy: {
    name: 'Groovy',
    extensions: ['.groovy', '.gradle'],
    testFrameworks: ['spock', 'junit'],
    buildSystems: ['gradle', 'maven'],
    package: { manager: 'gradle', lockFile: '' },
    runtime: 'jvm',
  },
  bash: {
    name: 'Bash',
    extensions: ['.sh', '.bash'],
    testFrameworks: ['bats', 'shunit2'],
    buildSystems: ['make'],
    package: { manager: 'apt', lockFile: '' },
    runtime: 'bash',
  },
  gdscript: {
    name: 'GDScript',
    extensions: ['.gd'],
    testFrameworks: ['godottest', 'GUT'],
    buildSystems: ['godot', 'scons'],
    package: { manager: 'godot', lockFile: 'project.godot' },
    runtime: 'godot',
  },
};

export class LanguageDetector {
  static detect(filePath: string): ProgrammingLanguage {
    const ext = filePath.substring(filePath.lastIndexOf('.')).toLowerCase();

    for (const [lang, config] of Object.entries(LANGUAGE_CONFIGS)) {
      if (config.extensions.includes(ext)) {
        return lang as ProgrammingLanguage;
      }
    }

    return 'typescript';
  }

  static getConfig(language: ProgrammingLanguage): LanguageConfig {
    return LANGUAGE_CONFIGS[language];
  }

  static getTestFramework(language: ProgrammingLanguage): string {
    const config = this.getConfig(language);
    return config.testFrameworks[0] || 'default';
  }

  static getBuildSystem(language: ProgrammingLanguage): string {
    const config = this.getConfig(language);
    return config.buildSystems[0] || 'default';
  }
}
