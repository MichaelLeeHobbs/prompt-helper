// src/headers.ts

import * as fs from 'fs';
import * as path from 'path';

/*
  Explain: This module deals with expected file headers, now also handling a shebang line.
  If a shebang is present, we expect the file header to appear on the second line.
*/

const SHEBANG = '#!/usr/bin/env node';

export function hasCorrectHeader(absolutePath: string, relativePath: string): boolean {
    const expectedHeader = getExpectedHeader(relativePath);
    if (!expectedHeader) return true; // No need for other file types

    try {
        const data = fs.readFileSync(absolutePath, 'utf8');
        const lines = data.split('\n');
        const firstLine = lines[0]?.trim();

        // If the file starts with a shebang, the header is expected on the second line
        if (firstLine === SHEBANG) {
            const secondLine = lines[1]?.trim();
            return secondLine === expectedHeader;
        } else {
            // No shebang, header should be on the first line
            return firstLine === expectedHeader;
        }
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
        const firstLine = lines[0]?.trim();

        if (firstLine === SHEBANG) {
            // Shebang present, header should be on the second line
            const secondLine = lines[1]?.trim();
            const isHeaderComment = secondLine && (secondLine.startsWith('//') || secondLine.startsWith('/*'));

            if (isHeaderComment) {
                // Replace existing header
                lines[1] = expectedHeader;
            } else {
                // Insert the header after the shebang line
                lines.splice(1, 0, expectedHeader);
            }
        } else {
            // No shebang, header on the first line
            const isHeaderComment = firstLine && (firstLine.startsWith('//') || firstLine.startsWith('/*'));
            if (isHeaderComment) {
                lines[0] = expectedHeader;
            } else {
                lines.unshift(expectedHeader);
            }
        }

        const newData = lines.join('\n');
        fs.writeFileSync(absolutePath, newData, 'utf8');
    } catch (err) {
        log(`Error writing to file: ${absolutePath}`, true);
    }
}

function getExpectedHeader(relativePath: string): string | null {
    const ext = path.extname(relativePath);
    if (['.ts', '.tsx', '.js', '.jsx', '.mjs'].includes(ext)) {
        return `// ${relativePath}`;
    } else if (ext === '.css') {
        return `/* ${relativePath} */`;
    }
    return null;
}
