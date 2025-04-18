// src/features/projectInfo/collectors/metricsCollector.ts

import {runFta} from 'fta-cli';
import {FtaMetrics, ProjectInfo} from '../../../types';

/**
 * Collects complexity & metrics using fta-cli.
 */
export function collectMetrics(baseDir: string, projectInfo: ProjectInfo): void {
  // runFta is synchronous and returns an array of FtaMetrics

  const results: FtaMetrics[] = JSON.parse(runFta(baseDir, { json: true }));

  projectInfo.metrics = results.map(m => ({
    ...m,
    // ensure file paths are normalized
    file_name: m.file_name.replace(/\\/g, '/'),
  }));
}
