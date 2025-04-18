// src/features/projectInfo/collectors/unusedCollector.ts

import {ProjectInfo} from '../../../types';

/**
 * Identifies files with zero inbound dependencies (excluding seeded entries),
 * resolving extension-less and index imports.
 */
export function collectUnused(projectInfo: ProjectInfo): void {
  const graph = projectInfo.dependencyGraph || {};
  const inboundCount: Record<string, number> = {};

  // 1) Initialize inbound count for each file
  const files = Object.keys(graph);
  for (const f of files) {
    inboundCount[f] = 0;
  }

  // 2) Build lookup: base (no ext) and index-less paths -> actual files
  const lookup: Record<string, string> = {};
  for (const f of files) {
    const noExt = f.replace(/\.(?:ts|tsx|js|jsx)$/, '');
    lookup[noExt] = f;
    // support folder imports pointing to index files
    if (noExt.endsWith('/index')) {
      const dirKey = noExt.slice(0, -'/index'.length);
      lookup[dirKey] = f;
    }
  }

  // 3) Count inbound edges, resolving extension-less and index imports
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

  // 4) Seed entry points so they aren't marked unused
  const seeds = new Set<string>(['src/index.ts', projectInfo.packageJson?.main || ''].map(p => p.replace(/\\/g, '/')));

  for (const seed of seeds) {
    if (inboundCount[seed] !== undefined) {
      inboundCount[seed]++;
    } else {
      const resolved = lookup[seed.replace(/\.(?:ts|js)x?$/, '')];
      if (resolved && inboundCount[resolved] !== undefined) {
        inboundCount[resolved]++;
      }
    }
  }

  // 5) Filter out config files and those with inboundCount > 0
  const isConfig = (f: string) => /\.(?:config|settings)\.[jt]sx?$/.test(f);
  projectInfo.unusedFiles = files.filter(f => inboundCount[f] === 0 && !isConfig(f));
}
