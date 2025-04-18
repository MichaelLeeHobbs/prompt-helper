// src/features/projectInfo/collectors/notesCollector.ts
// src/projectInfo/collectors/notesCollector.ts
import * as fs from 'fs';
import * as path from 'path';
import {ProjectInfo} from '../../../types';

export function collectOtherNotes(baseDir: string, projectInfo: ProjectInfo): void {
  const notesPath = path.join(baseDir, 'promptHelper', 'notes.md');
  if (fs.existsSync(notesPath)) {
    projectInfo.otherNotes = fs.readFileSync(notesPath, 'utf8');
  }
}
