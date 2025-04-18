// src/collectors/projectInfoCollector.ts
import {ProjectInfo} from '../types';

import {collectPackageJson} from './packageJsonCollector';
import {collectOtherNotes} from './notesCollector';
import {collectTsconfig} from './tsconfigCollector';
import {collectTools} from './toolsCollector';
import {collectStyle} from './styleCollector';
import {collectCode} from './codeCollector';
import {collectTodos} from './todoCollector';
import {collectMetrics} from './metricsCollector';
import {collectGraph} from './graphCollector';
import {collectUnused} from './unusedCollector';

/**
 * Options for controlling project metadata collection.
 */
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
 * Aggregates project metadata and analysis results from various collectors.
 *
 * @param options - Configuration for collection process including base directory and feature flags.
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
  collectTools(baseDir, projectInfo);
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
    collectUnused(projectInfo); // Requires dependency graph
  }
}
