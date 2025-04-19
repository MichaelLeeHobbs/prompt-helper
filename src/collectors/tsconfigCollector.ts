// src/collectors/tsconfigCollector.ts
import * as fs from 'fs';
import * as path from 'path';
import {ProjectInfo, Tsconfig} from '../types';
import {parse as parseJson} from 'jsonc-parser';

/**
 * Loads and recursively resolves a `tsconfig.json` file including:
 * - `extends` inheritance
 * - `references` for composite projects
 * - Comment-stripped parsing using `jsonc-parser`
 *
 * @param tsconfigPath - The absolute path to the tsconfig file.
 * @param visitedConfigs - Set of already visited configs to prevent circular merges.
 * @returns A merged `Tsconfig` object.
 */
function collectTsconfigInfo(tsconfigPath: string, visitedConfigs = new Set<string>()): Tsconfig {
  if (visitedConfigs.has(tsconfigPath)) {
    // Prevent circular references from breaking recursion
    return {};
  }
  visitedConfigs.add(tsconfigPath);

  let tsconfig: Tsconfig;
  try {
    const tsconfigData = fs.readFileSync(tsconfigPath, 'utf8');
    tsconfig = parseJson(tsconfigData) as Tsconfig;
  } catch (err) {
    console.error(`Error reading or parsing ${tsconfigPath}:`, err);
    return {};
  }

  let mergedConfig: Tsconfig = {...tsconfig};

  // Handle "extends"
  if (tsconfig.extends) {
    const parentPath = path.resolve(path.dirname(tsconfigPath), tsconfig.extends);
    const parentConfig = collectTsconfigInfo(parentPath, visitedConfigs);
    mergedConfig = mergeTsconfigs(parentConfig, mergedConfig);
  }

  // Handle project "references"
  if (Array.isArray(tsconfig.references)) {
    for (const ref of tsconfig.references) {
      const refPath = path.resolve(path.dirname(tsconfigPath), ref.path, 'tsconfig.json');
      const refConfig = collectTsconfigInfo(refPath, visitedConfigs);
      mergedConfig = mergeTsconfigs(mergedConfig, refConfig);
    }
  }

  return mergedConfig;
}

/**
 * Merges two tsconfig objects, preferring values from the `overrideConfig`.
 *
 * @param baseConfig - The base (inherited) config.
 * @param overrideConfig - The overriding config.
 * @returns The merged configuration.
 */
function mergeTsconfigs(baseConfig: Tsconfig, overrideConfig: Tsconfig): Tsconfig {
  return {
    ...baseConfig,
    ...overrideConfig,
    compilerOptions: {
      ...baseConfig.compilerOptions,
      ...overrideConfig.compilerOptions,
    },
    include: uniqueArray(baseConfig.include, overrideConfig.include),
    exclude: uniqueArray(baseConfig.exclude, overrideConfig.exclude),
    files: uniqueArray(baseConfig.files, overrideConfig.files),
  };
}

/**
 * Merges multiple arrays of strings and removes duplicates.
 *
 * @param arrays - Any number of string arrays.
 * @returns A deduplicated array of all entries.
 */
function uniqueArray(...arrays: (string[] | undefined)[]): string[] {
  const filtered = arrays.flat().filter((arr): arr is string => !!arr);
  return Array.from(new Set(filtered));
}

/**
 * Collects TypeScript configuration from `tsconfig.json` if it exists.
 *
 * @param baseDir - The root directory of the project.
 * @param projectInfo - The project info object to populate with tsconfig data.
 */
export function collectTsconfig(baseDir: string, projectInfo: ProjectInfo): void {
  const tsconfigPath = path.join(baseDir, 'tsconfig.json');

  if (fs.existsSync(tsconfigPath)) {
    projectInfo.tsconfigJson = collectTsconfigInfo(tsconfigPath);
  } else {
    console.error('Could not find tsconfig.json at project root.');
  }
}
