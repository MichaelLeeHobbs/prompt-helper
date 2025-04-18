// src/projectInfo/index.ts
import { collectPackageJson } from './collectors/packageJsonCollector';
import { collectOtherNotes } from './collectors/notesCollector';
import { collectTsconfig } from './collectors/tsconfigCollector';
import { detectTools } from './collectors/toolDetector';
import { logProjectInfo } from './logger';
import { appendPromptInstructions } from './instructions';
import { ProjectInfo } from '../types';

/**
 * Gathers all pieces of project metadata.
 */
export function collectProjectInfo(baseDir: string, projectInfo: ProjectInfo): void {
    collectPackageJson(baseDir, projectInfo);
    collectOtherNotes(baseDir, projectInfo);
    collectTsconfig(baseDir, projectInfo);
    detectTools(baseDir, projectInfo);
}

/**
 * Expose logging & instructions so index.ts can just import from './projectInfo'
 */
export { logProjectInfo, appendPromptInstructions };
