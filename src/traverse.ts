// src/traverse.ts

import * as fs from 'fs';
import * as path from 'path';
import {ProjectInfo} from './types';
import {getLocalDependencies} from './dependencies';
import {addHeader, hasCorrectHeader} from './headers';

/*
  Explain: This module focuses solely on walking directories, handling allowed directories,
  and applying header checks. By keeping it separate, we reduce complexity in the main file.
*/

const CHECK_EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.jsx', '.css']);
const ALLOWED_DIRECTORIES = new Set(['public', 'src']);

export function traverseDirectory(
    dir: string,
    baseDir: string,
    prefix: string,
    log: (msg: string, err?: boolean) => void,
    projectInfo: ProjectInfo
): void {
    let items: string[];
    try {
        items = fs.readdirSync(dir);
    } catch (err) {
        log(`Error reading directory: ${dir}`, true);
        return;
    }

    const totalItems = items.length;

    items.forEach((item, index) => {
        const absolutePath = path.join(dir, item);
        const relativePath = path.relative(baseDir, absolutePath).replace(/\\/g, '/');
        const isLast = index === totalItems - 1;
        const pointer = isLast ? '└── ' : '├── ';
        const newPrefix = prefix + (isLast ? '    ' : '│   ');

        let stats;
        try {
            stats = fs.statSync(absolutePath);
        } catch (err) {
            log(`Error accessing: ${absolutePath}`, true);
            return;
        }

        if (stats.isDirectory()) {
            if (dir === baseDir) {
                // Only traverse allowed directories at root
                if (ALLOWED_DIRECTORIES.has(item)) {
                    log(`${prefix}${pointer}${item}/`);
                    traverseDirectory(absolutePath, baseDir, newPrefix, log, projectInfo);
                }
            } else {
                // In subdirectories, traverse all directories
                log(`${prefix}${pointer}${item}/`);
                traverseDirectory(absolutePath, baseDir, newPrefix, log, projectInfo);
            }
        } else if (stats.isFile()) {
            if (dir === baseDir && (item === 'promptHelper.js' || item === 'promptHelper.txt')) {
                // Skip these files
                return;
            }

            const ext = path.extname(item);
            if (CHECK_EXTENSIONS.has(ext)) {
                if (!hasCorrectHeader(absolutePath, relativePath)) {
                    addHeader(absolutePath, relativePath, log);
                }

                log(`${prefix}${pointer}${item}`);

                // Collect and log dependencies
                const dependencies = getLocalDependencies(absolutePath, baseDir);
                if (dependencies.length > 0) {
                    log(`${newPrefix}    (Depends on: ${dependencies.join(', ')})`);
                }
            }
        }
    });
}
