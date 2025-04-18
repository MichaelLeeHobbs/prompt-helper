// src/features/projectInfo/collectors/styleCollector.ts
import * as fs from 'fs';
import * as path from 'path';
import {ProjectInfo} from '../../../types';

/**
 * Reads a style markdown file either at a user‑provided path or
 * at default "promptHelper/style.md" under the project root.
 */
export function collectStyle(baseDir: string, projectInfo: ProjectInfo, stylePath?: string): void {
  const defaultPath = path.join(baseDir, 'promptHelper', 'style.md');
  const fullPath = stylePath ? path.resolve(stylePath) : defaultPath;

  console.log(`Collecting style from: ${fullPath}`);
  if (fs.existsSync(fullPath)) {
    try {
      projectInfo.styleText = fs.readFileSync(fullPath, 'utf8');
    } catch (err) {
      console.error(`Error reading style file at ${fullPath}:`, err);
    }
  }
}
