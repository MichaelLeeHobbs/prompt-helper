// src/modules/tsconfig.ts
// src/tsconfig.ts

import * as fs from 'fs';
import * as path from 'path';
import { Tsconfig } from '../types';

/*
  Explain: We separate tsconfig handling into its own file to keep the logic for
  reading, merging, and resolving tsconfigs isolated. This allows easier testing
  and maintenance if tsconfig logic evolves.
*/

export function collectTsconfigInfo(tsconfigPath: string, visitedConfigs = new Set<string>()): Tsconfig {
  if (visitedConfigs.has(tsconfigPath)) {
    // Avoid circular references
    return {};
  }
  visitedConfigs.add(tsconfigPath);

  let tsconfig: Tsconfig;
  try {
    const tsconfigData = fs.readFileSync(tsconfigPath, 'utf8');
    tsconfig = JSON.parse(tsconfigData);
  } catch (err) {
    console.error(`Error reading or parsing ${tsconfigPath}:`, err);
    return {};
  }

  let mergedConfig: Tsconfig = { ...tsconfig };

  // If extends is used, merge parent tsconfig
  if (tsconfig.extends) {
    const parentPath = path.resolve(path.dirname(tsconfigPath), tsconfig.extends);
    const parentConfig = collectTsconfigInfo(parentPath, visitedConfigs);
    mergedConfig = mergeTsconfigs(parentConfig, mergedConfig);
  }

  // If references are used, recursively collect referenced tsconfigs
  if (tsconfig.references && Array.isArray(tsconfig.references)) {
    for (const ref of tsconfig.references) {
      const refPath = path.resolve(path.dirname(tsconfigPath), ref.path, 'tsconfig.json');
      const refConfig = collectTsconfigInfo(refPath, visitedConfigs);
      mergedConfig = mergeTsconfigs(mergedConfig, refConfig);
    }
  }

  return mergedConfig;
}

export function mergeTsconfigs(baseConfig: Tsconfig, overrideConfig: Tsconfig): Tsconfig {
  // Deep merge the two configs. This can be customized for conflict handling.
  return {
    ...baseConfig,
    ...overrideConfig,
    compilerOptions: {
      ...baseConfig.compilerOptions,
      ...overrideConfig.compilerOptions,
    },
    include: uniqueArray(baseConfig.include || [], overrideConfig.include || []),
    exclude: uniqueArray(baseConfig.exclude || [], overrideConfig.exclude || []),
    files: uniqueArray(baseConfig.files || [], overrideConfig.files || []),
  };
}

function uniqueArray(...arrays: string[][]): string[] {
  return Array.from(new Set(arrays.flat()));
}
