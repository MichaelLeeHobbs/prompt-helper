// src/collectors/packageJsonCollector.ts
import * as fs from 'fs';
import * as path from 'path';
import {ProjectInfo} from '../types';

/**
 * Loads and parses the project's `package.json` file into the project info object.
 *
 * @param baseDir - The root directory of the project.
 * @param projectInfo - The project info object to populate with the parsed package.json.
 */
export function collectPackageJson(baseDir: string, projectInfo: ProjectInfo): void {
  const packageJsonPath = path.join(baseDir, 'package.json');

  if (!fs.existsSync(packageJsonPath)) {
    return;
  }

  try {
    const raw = fs.readFileSync(packageJsonPath, 'utf8');
    projectInfo.packageJson = JSON.parse(raw);
  } catch (err) {
    console.error('Error reading package.json:', err);
  }
}
