// src/features/projectInfo/collectors/codeCollector.ts

import * as fs from 'fs';
import * as path from 'path';
import {ProjectInfo} from '../../../types';

/**
 * Recursively finds files matching `name` under `dir`.
 */
function findFilesByName(dir: string, name: string, results: string[] = []): string[] {
  for (const entry of fs.readdirSync(dir)) {
    const full = path.join(dir, entry);
    let stat: fs.Stats;
    try {
      stat = fs.statSync(full);
    } catch {
      continue;
    }
    if (stat.isDirectory()) {
      findFilesByName(full, name, results);
    } else if (entry === name) {
      results.push(full);
    }
  }
  return results;
}

/**
 * Recursively collects all file paths under a directory.
 */
function findAllFiles(dir: string, results: string[] = []): string[] {
  for (const entry of fs.readdirSync(dir)) {
    const full = path.join(dir, entry);
    let stat: fs.Stats;
    try {
      stat = fs.statSync(full);
    } catch {
      continue;
    }
    if (stat.isDirectory()) {
      findAllFiles(full, results);
    } else {
      results.push(full);
    }
  }
  return results;
}

/**
 * Collects code snippets from user-specified paths or directories.
 */
export function collectCode(baseDir: string, projectInfo: ProjectInfo, codePaths: string[]): void {
  if (!codePaths.length) return;

  const snippets: { file: string; code: string }[] = [];
  for (const cp of codePaths) {
    let full: string | undefined;
    const candidate = path.isAbsolute(cp) ? cp : path.join(baseDir, cp);

    if (fs.existsSync(candidate)) {
      full = candidate;
    } else if (!cp.includes(path.sep)) {
      const matches = findFilesByName(baseDir, cp);
      if (matches.length === 1) {
        full = matches[0];
      } else if (!matches.length) {
        throw new Error(`Code file or directory "${cp}" not found.`);
      } else {
        throw new Error(`Ambiguous code path "${cp}" found in multiple locations.`);
      }
    } else {
      throw new Error(`Code path "${cp}" not found at path "${candidate}".`);
    }

    if (!full) continue;

    const stat = fs.statSync(full);
    const pathsToRead = stat.isDirectory() ? findAllFiles(full) : [full];

    for (const filePath of pathsToRead) {
      const rel = path.relative(baseDir, filePath).replace(/\\/g, '/');
      let code: string;
      try {
        code = fs.readFileSync(filePath, 'utf8');
      } catch (err) {
        throw new Error(`Error reading code file "${filePath}": ${err}`);
      }
      snippets.push({ file: rel, code });
    }
  }

  projectInfo.codeSnippets = snippets;
}
