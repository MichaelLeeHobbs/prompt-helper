// src/features/projectInfo/index.ts
import { ProjectInfo } from '../../types';
import { collectPackageJson } from './collectors/packageJsonCollector';
import { collectOtherNotes } from './collectors/notesCollector';
import { collectTsconfig } from './collectors/tsconfigCollector';
import { detectTools } from './collectors/toolDetector';
import { renderProjectInfo } from './renderer';
import { appendPromptInstructions } from './instructions';

export function collectProjectInfo(baseDir: string, projectInfo: ProjectInfo): void {
  collectPackageJson(baseDir, projectInfo);
  collectOtherNotes(baseDir, projectInfo);
  collectTsconfig(baseDir, projectInfo);
  detectTools(baseDir, projectInfo);
}

export { renderProjectInfo as logProjectInfo, appendPromptInstructions };
