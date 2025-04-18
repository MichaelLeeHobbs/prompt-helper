// src/types.ts

export interface FileNode {
  name: string;
  path: string;
  isDirectory: boolean;
  children?: FileNode[];
  dependencies?: string[];
  missingHeader?: boolean;
  error?: string;
}

export interface FtaMetrics {
  file_name: string;
  cyclo: number;
  halstead: {
    uniq_operators: number;
    uniq_operands: number;
    total_operators: number;
    total_operands: number;
    program_length: number;
    vocabulary_size: number;
    volume: number;
    difficulty: number;
    effort: number;
    time: number;
    bugs: number;
  };
  line_count: number;
  fta_score: number;
  assessment: string;
}

export interface TodoItem {
  file: string;
  line: number;
  text: string;
}

export interface Tsconfig {
  extends?: string;
  compilerOptions?: Record<string, unknown>;
  include?: string[];
  exclude?: string[];
  files?: string[];
  references?: { path: string }[];

  [key: string]: unknown;
}

export interface ProjectInfo {
  packageJson?: {
    name?: string;
    type?: string;
    version?: string;
    description?: string;
    main?: string;
    bin?: string;
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
  };
  tsconfigJson?: Tsconfig;
  otherNotes?: string;
  packageManager?: 'npm' | 'yarn' | 'pnpm';
  usesESLint?: boolean;
  usesWebpack?: boolean;
  usesVite?: boolean;
  usesBabel?: boolean;
  usesJest?: boolean;
  usesDocker?: boolean;
  usesGitHubActions?: boolean;
  usesTravis?: boolean;
  usesCircleCI?: boolean;
  usesJenkins?: boolean;
  styleText?: string;
  codeSnippets?: { file: string; code: string }[];
  todos?: TodoItem[];
  metrics?: FtaMetrics[];
  dependencyGraph?: Record<string, string[]>;
  unusedFiles?: string[];
}
