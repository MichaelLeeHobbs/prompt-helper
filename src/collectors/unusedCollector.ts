// src/collectors/unusedCollector.ts
import {ProjectInfo} from '../types';

/**
 * Identifies files in the project that have no inbound dependencies,
 * excluding known entry points and resolving extension-less and index-based imports.
 *
 * @param projectInfo - The project info object containing the dependency graph.
 */
export function collectUnused(projectInfo: ProjectInfo): void {
  const graph = projectInfo.dependencyGraph || {};
  const inboundCount: Record<string, number> = {};

  const files = Object.keys(graph);

  // 1. Initialize all file inbound counts to 0
  for (const file of files) {
    inboundCount[file] = 0;
  }

  // 2. Create a lookup table to resolve extension-less and folder imports
  const lookup: Record<string, string> = {};
  for (const file of files) {
    const noExt = file.replace(/\.(ts|tsx|js|jsx)$/, '');
    lookup[noExt] = file;

    // Handle folder imports that resolve to index files
    if (noExt.endsWith('/index')) {
      const dirKey = noExt.slice(0, -'/index'.length);
      lookup[dirKey] = file;
    }
  }

  // 3. Tally inbound references using direct or resolved dependency names
  for (const deps of Object.values(graph)) {
    for (const dep of deps) {
      if (inboundCount[dep] !== undefined) {
        inboundCount[dep]++;
      } else {
        const resolved = lookup[dep];
        if (resolved && inboundCount[resolved] !== undefined) {
          inboundCount[resolved]++;
        }
      }
    }
  }

  // 4. Seed known entry points (e.g., main app entry) so they're not marked unused
  const seeds = new Set<string>(['src/projectInfoCollector.ts', projectInfo.packageJson?.main || ''].map(p => p.replace(/\\/g, '/')));

  for (const seed of seeds) {
    if (inboundCount[seed] !== undefined) {
      inboundCount[seed]++;
    } else {
      const baseKey = seed.replace(/\.(ts|js)x?$/, '');
      const resolved = lookup[baseKey];
      if (resolved && inboundCount[resolved] !== undefined) {
        inboundCount[resolved]++;
      }
    }
  }

  // 5. Mark files with no inbound references (excluding config files) as unused
  const isConfigFile = (f: string): boolean => /\.(config|settings)\.[jt]sx?$/.test(f);

  projectInfo.unusedFiles = files.filter(file => inboundCount[file] === 0 && !isConfigFile(file));
}
