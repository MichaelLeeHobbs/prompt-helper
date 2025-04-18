// src/collectors/notesCollector.ts
import * as fs from 'fs';
import * as path from 'path';
import {ProjectInfo} from '../types';

/**
 * Collects markdown notes from the default `promptHelper/notes.md` location, if available.
 *
 * @param baseDir - The root directory of the project.
 * @param projectInfo - The project info object to populate with the notes.
 */
export function collectOtherNotes(baseDir: string, projectInfo: ProjectInfo): void {
  const notesPath = path.join(baseDir, 'promptHelper', 'notes.md');

  if (fs.existsSync(notesPath)) {
    projectInfo.otherNotes = fs.readFileSync(notesPath, 'utf8');
  }
}
