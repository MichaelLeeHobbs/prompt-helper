// src/features/projectInfo/collectors/todoCollector.ts

import * as fs from 'fs';
import * as path from 'path';
import { ProjectInfo, TodoItem } from '../../../types';

const TODO_REGEX = /\/\/\s*(TODO|FIXME)\s*[:\-]?\s*(.*)$/;

function findCodeFiles(dir: string, results: string[] = []): string[] {
  for (const entry of fs.readdirSync(dir)) {
    const full = path.join(dir, entry);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      findCodeFiles(full, results);
    } else if (/\.(ts|tsx|js|jsx)$/.test(entry)) {
      results.push(full);
    }
  }
  return results;
}

export function collectTodos(baseDir: string, projectInfo: ProjectInfo): void {
  const todos: TodoItem[] = [];
  const files = findCodeFiles(baseDir);
  for (const file of files) {
    // Skip files in node_modules
    if (file.includes('node_modules')) {
      continue;
    }

    const rel = path.relative(baseDir, file).replace(/\\/g, '/');
    const lines = fs.readFileSync(file, 'utf8').split('\n');
    lines.forEach((line, idx) => {
      const m = TODO_REGEX.exec(line);
      if (m && m[2]) {
        todos.push({
          file: rel,
          line: idx + 1,
          text: m[2].trim(),
        });
      }
    });
  }
  projectInfo.todos = todos;
}
