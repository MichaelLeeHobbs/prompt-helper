// src/features/projectInfo/index.ts

import { ProjectInfo } from '../../types';
import { collectPackageJson } from './collectors/packageJsonCollector';
import { collectOtherNotes } from './collectors/notesCollector';
import { collectTsconfig } from './collectors/tsconfigCollector';
import { detectTools } from './collectors/toolDetector';
import { collectStyle } from './collectors/styleCollector';
import { collectCode } from './collectors/codeCollector';
import { collectTodos } from './collectors/todoCollector';
import { collectMetrics } from './collectors/metricsCollector';
import { collectGraph } from './collectors/graphCollector';
import { collectUnused } from './collectors/unusedCollector';
import { renderProjectInfo } from './renderer';
import { appendPromptInstructions } from './instructions';

export interface CollectProjectInfoOptions {
  baseDir: string;
  projectInfo: ProjectInfo;
  stylePath: string | undefined;
  codePaths: string[] | undefined;
  scanTodos: boolean | undefined;
  scanMetrics: boolean | undefined;
  graphDeps: boolean | undefined;
}

/**
 * Gathers all project metadata
 */
export function collectProjectInfo({
                                     baseDir,
                                     projectInfo,
                                     stylePath,
                                     codePaths = [],
                                     scanTodos = false,
                                     scanMetrics = false,
                                     graphDeps = false,
                                   }: CollectProjectInfoOptions): void {
  collectPackageJson(baseDir, projectInfo);
  collectOtherNotes(baseDir, projectInfo);
  collectTsconfig(baseDir, projectInfo);
  detectTools(baseDir, projectInfo);
  collectStyle(baseDir, projectInfo, stylePath);
  collectCode(baseDir, projectInfo, codePaths);

  if (scanTodos) {
    collectTodos(baseDir, projectInfo);
  }
  if (scanMetrics) {
    collectMetrics(baseDir, projectInfo);
  }
  if (graphDeps) {
    collectGraph(baseDir, projectInfo);
    collectUnused(projectInfo); // relies on graph
  }
}

export { renderProjectInfo as logProjectInfo, appendPromptInstructions };
