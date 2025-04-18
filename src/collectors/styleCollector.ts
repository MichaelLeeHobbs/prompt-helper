// src/collectors/styleCollector.ts
import * as fs from 'fs';
import * as path from 'path';
import {ProjectInfo} from '../types';

/**
 * Reads a style guide markdown file from either a user-specified path or
 * a default location: `promptHelper/style.md` relative to the project root.
 *
 * @param baseDir - The root directory of the project.
 * @param projectInfo - The project info object to populate with the style guide text.
 * @param stylePath - Optional absolute or relative path to a specific style file.
 */
export function collectStyle(baseDir: string, projectInfo: ProjectInfo, stylePath?: string): void {
  const defaultPath = path.join(baseDir, 'promptHelper', 'style.md');
  const fullPath = stylePath ? path.resolve(stylePath) : defaultPath;

  if (fs.existsSync(fullPath)) {
    try {
      projectInfo.styleText = fs.readFileSync(fullPath, 'utf8');
    } catch (err) {
      console.error(`Failed to read style markdown from: ${fullPath}`, err);
    }
  }
}
