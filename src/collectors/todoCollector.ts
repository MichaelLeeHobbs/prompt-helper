// src/collectors/todoCollector.ts
import * as fs from 'fs';
import * as path from 'path';
import {ProjectInfo, TodoItem} from '../types';

// Matches lines like: "// TO DO: something" or "// FIX ME - details" - Leave spaces breaking words to avoid IDE linter trigger
const TODO_REGEX = /\/\/\s*(TODO|FIXME)\s*[:-]?\s*(.*)$/;

/**
 * Recursively finds code files with .ts/.tsx/.js/.jsx extensions.
 *
 * @param dir - Directory to search.
 * @param results - Accumulator array for matching file paths.
 * @returns Array of absolute file paths.
 */
function findCodeFiles(dir: string, results: string[] = []): string[] {
  for (const entry of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, entry);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      findCodeFiles(fullPath, results);
    } else if (/\.(ts|tsx|js|jsx)$/.test(entry)) {
      results.push(fullPath);
    }
  }

  return results;
}

/**
 * Collects TODO and FIXME comments from source files and adds them to project info.
 *
 * @param baseDir - Root directory to begin scanning from.
 * @param projectInfo - The project info object to populate with TODO items.
 */
export function collectTodos(baseDir: string, projectInfo: ProjectInfo): void {
  const todos: TodoItem[] = [];
  const files = findCodeFiles(baseDir);

  for (const file of files) {
    // Skip node_modules or vendor-style folders
    if (file.includes('node_modules')) {
      continue;
    }

    const relPath = path.relative(baseDir, file).replace(/\\/g, '/');
    const lines = fs.readFileSync(file, 'utf8').split('\n');

    lines.forEach((line, idx) => {
      const match = TODO_REGEX.exec(line);
      if (match) {
        todos.push({
          file: relPath,
          line: idx + 1,
          text: line.trim(),
        });
      }
    });
  }

  projectInfo.todos = todos;
}
