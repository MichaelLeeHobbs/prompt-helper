// src/headers.ts

import * as fs from 'fs';
import * as path from 'path';

/*
  Explain: This module deals with the expected file headers. By isolating this logic,
  we can easily update or change the header rules later without touching the main script.
*/

export function hasCorrectHeader(absolutePath: string, relativePath: string): boolean {
    // Skip self by original logic:
    if (relativePath === 'promptHelper.js') return true;

    const expectedHeader = getExpectedHeader(relativePath);
    if (!expectedHeader) return true; // No need for other file types

    try {
        const data = fs.readFileSync(absolutePath, 'utf8');
        const firstLine = data.split('\n')[0].trim();
        return firstLine === expectedHeader;
    } catch (err) {
        console.error(`Error reading file: ${absolutePath}`, err);
        return false;
    }
}

export function addHeader(absolutePath: string, relativePath: string, log: (msg: string, err?: boolean) => void): void {
    const expectedHeader = getExpectedHeader(relativePath);
    if (!expectedHeader) return;

    try {
        const data = fs.readFileSync(absolutePath, 'utf8');
        const lines = data.split('\n');
        const firstLine = lines[0].trim();
        const isHeaderComment = firstLine.startsWith('//') || firstLine.startsWith('/*');

        if (isHeaderComment) {
            lines[0] = expectedHeader;
        } else {
            lines.unshift(expectedHeader);
        }

        const newData = lines.join('\n');
        fs.writeFileSync(absolutePath, newData, 'utf8');
        log(`Corrected or added header to: ${relativePath}`);
    } catch (err) {
        log(`Error writing to file: ${absolutePath}`, true);
    }
}

function getExpectedHeader(relativePath: string): string | null {
    const ext = path.extname(relativePath);
    if (['.ts', '.tsx', '.js', '.jsx'].includes(ext)) {
        return `// ${relativePath}`;
    } else if (ext === '.css') {
        return `/* ${relativePath} */`;
    }
    return null;
}
