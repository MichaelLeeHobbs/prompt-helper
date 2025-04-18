// src/features/projectInfo/collectors/tsconfigCollector.ts
// src/projectInfo/collectors/tsconfigCollector.ts
import * as fs from 'fs';
import * as path from 'path';
import { collectTsconfigInfo } from '../../../modules/tsconfig';
import { ProjectInfo } from '../../../types';

export function collectTsconfig(baseDir: string, projectInfo: ProjectInfo): void {
    const tsconfigPath = path.join(baseDir, 'tsconfig.json');
    if (fs.existsSync(tsconfigPath)) {
        projectInfo.tsconfigJson = collectTsconfigInfo(tsconfigPath);
    } else {
        console.error('tsconfig.json not found.');
    }
}
