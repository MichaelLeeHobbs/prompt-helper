// src/collectors/codeCollector.ts

import * as fs from 'fs';
import * as path from 'path';
import {ProjectInfo} from '../types';

/**
 * Recursively finds files with the exact name under the given directory.
 *
 * @param dir - Directory to search within.
 * @param name - Filename to match.
 * @param results - Accumulator for results (used during recursion).
 * @returns An array of absolute file paths that match the given name.
 */
function findFilesByName(dir: string, name: string, results: string[] = []): string[] {
  for (const entry of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, entry);

    let stat: fs.Stats;
    try {
      stat = fs.statSync(fullPath);
    } catch {
      continue;
    }

    if (stat.isDirectory()) {
      findFilesByName(fullPath, name, results);
    } else if (entry === name) {
      results.push(fullPath);
    }
  }

  return results;
}

/**
 * Recursively collects all file paths under a directory.
 *
 * @param dir - Directory to search.
 * @param results - Accumulator for file paths.
 * @returns A flat list of all file paths found under the directory.
 */
function findAllFiles(dir: string, results: string[] = []): string[] {
  for (const entry of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, entry);

    let stat: fs.Stats;
    try {
      stat = fs.statSync(fullPath);
    } catch {
      continue;
    }

    if (stat.isDirectory()) {
      findAllFiles(fullPath, results);
    } else {
      results.push(fullPath);
    }
  }

  return results;
}

/**
 * Collects code snippets from user-specified file or directory paths.
 *
 * @param baseDir - Root directory used for resolving relative paths.
 * @param projectInfo - The project info object to populate with code snippets.
 * @param codePaths - A list of file or directory names/paths to collect code from.
 */
export function collectCode(baseDir: string, projectInfo: ProjectInfo, codePaths: string[]): void {
  if (codePaths.length === 0) {
    return;
  }

  const snippets: {file: string; code: string}[] = [];

  for (const cp of codePaths) {
    let resolvedPath: string | undefined;
    const candidate = path.isAbsolute(cp) ? cp : path.join(baseDir, cp);

    if (fs.existsSync(candidate)) {
      resolvedPath = candidate;
    } else if (!cp.includes(path.sep)) {
      const matches = findFilesByName(baseDir, cp);

      if (matches.length === 1) {
        resolvedPath = matches[0];
      } else if (matches.length === 0) {
        throw new Error(`Code file or directory "${cp}" not found.`);
      } else {
        throw new Error(`Ambiguous code path "${cp}" found in multiple locations.`);
      }
    } else {
      throw new Error(`Code path "${cp}" not found at resolved path "${candidate}".`);
    }

    if (!resolvedPath) {
      continue;
    }

    const stat = fs.statSync(resolvedPath);
    const filesToRead = stat.isDirectory() ? findAllFiles(resolvedPath) : [resolvedPath];

    for (const filePath of filesToRead) {
      const rel = path.relative(baseDir, filePath).replace(/\\/g, '/');

      let code: string;
      try {
        code = fs.readFileSync(filePath, 'utf8');
      } catch (err) {
        throw new Error(`Error reading code file "${filePath}": ${err}`);
      }

      snippets.push({file: rel, code});
    }
  }

  projectInfo.codeSnippets = snippets;
}
