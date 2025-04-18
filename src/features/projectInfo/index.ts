// src/features/projectInfo/index.ts

import {ProjectInfo} from '../../types';
import {collectPackageJson} from './collectors/packageJsonCollector';
import {collectOtherNotes} from './collectors/notesCollector';
import {collectTsconfig} from './collectors/tsconfigCollector';
import {detectTools} from './collectors/toolDetector';
import {collectStyle} from './collectors/styleCollector';
import {collectCode} from './collectors/codeCollector';
import {renderProjectInfo} from './renderer';
import {appendPromptInstructions} from './instructions';

/**
 * Gathers all project metadata, including optional style & code.
 */
export function collectProjectInfo(baseDir: string, projectInfo: ProjectInfo, stylePath?: string, codePaths: string[] = []): void {
  collectPackageJson(baseDir, projectInfo);
  collectOtherNotes(baseDir, projectInfo);
  collectTsconfig(baseDir, projectInfo);
  detectTools(baseDir, projectInfo);
  collectStyle(baseDir, projectInfo, stylePath);
  collectCode(baseDir, projectInfo, codePaths);
}

export { renderProjectInfo as logProjectInfo, appendPromptInstructions };
