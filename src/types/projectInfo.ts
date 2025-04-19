// src/types/projectInfo.ts

import {Tsconfig} from './tsconfig';
import {TodoItem} from './todo';
import {FtaMetrics} from './metrics';
import {FileNode, Logger} from './index';

/**
 * Captures metadata and analysis results for a project.
 */
export interface ProjectInfo {
  baseDir: string;
  tree: FileNode[];
  logger: Logger;
  // Metadata
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
  styleText?: string;

  // Tooling & Environment
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

  // Analysis
  codeSnippets?: {file: string; code: string}[];
  todos?: TodoItem[];
  metrics?: FtaMetrics[];
  dependencyGraph?: Record<string, string[]>;
  unusedFiles?: string[];
}
