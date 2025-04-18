// src/headers.ts

import * as fs from 'fs';
import * as path from 'path';

/*
  Explain: This module deals with expected file headers, now also handling a shebang line.
  If a shebang is present (any line starting with "#!"), we expect the file header to appear on the second line.
*/

export function hasCorrectHeader(absolutePath: string, relativePath: string): boolean {
  const expectedHeader = getExpectedHeader(relativePath);
  if (!expectedHeader) {
    return true;
  }

  try {
    const data = fs.readFileSync(absolutePath, 'utf8');
    const lines = data.split('\n');
    const firstLine = lines[0]?.trim() ?? '';

    // Treat any "#!"-prefixed first line as a shebang
    if (firstLine.startsWith('#!')) {
      const secondLine = lines[1]?.trim() ?? '';
      return secondLine === expectedHeader;
    } else {
      return firstLine === expectedHeader;
    }
  } catch (err) {
    console.error(`Error reading file: ${absolutePath}`, err);
    return false;
  }
}

export function addHeader(absolutePath: string, relativePath: string, log: (msg: string, err?: boolean, error?: unknown) => void): void {
  const expectedHeader = getExpectedHeader(relativePath);
  if (!expectedHeader) {
    return;
  }

  try {
    const data = fs.readFileSync(absolutePath, 'utf8');
    let lines = data.split('\n');

    // Remove any existing occurrences of the exact header
    lines = lines.filter(line => line.trim() !== expectedHeader);

    const firstLine = lines[0]?.trim() ?? '';
    // If there's a shebang, insert header after it; otherwise at the top
    const insertIndex = firstLine.startsWith('#!') ? 1 : 0;

    lines.splice(insertIndex, 0, expectedHeader);

    fs.writeFileSync(absolutePath, lines.join('\n'), 'utf8');
  } catch (err) {
    log(`Error writing to file: ${absolutePath}`, true, err);
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
