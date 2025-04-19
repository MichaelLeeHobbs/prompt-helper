// src/collectors/metricsCollector.ts
import {runFta} from 'fta-cli';
import {FtaMetrics, ProjectInfo} from '../types';

/**
 * Collects code complexity metrics using `fta-cli` and stores them in the project info.
 *
 * @param baseDir - The root directory to analyze.
 * @param projectInfo - The project info object to populate with metric results.
 */
export function collectMetrics(baseDir: string, projectInfo: ProjectInfo): void {
  // `runFta` is a synchronous call that returns a JSON string of FtaMetrics[]
  const results: FtaMetrics[] = JSON.parse(runFta(baseDir, {json: true}));

  projectInfo.metrics = results.map(({file_name, ...rest}) => ({
    ...rest,
    file_name: file_name.replace(/\\/g, '/'), // Normalize path to POSIX-style
  }));
}
