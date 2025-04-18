// src/headers.ts

import * as fs from 'fs';
import * as path from 'path';

/*
  Explain: This module deals with expected file headers, now also handling any shebang line.
  If the first line starts with "#!", we treat it as a shebang and insert the header after it.
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

    // If there's a shebang, header should be on the second line
    if (firstLine.startsWith('#!')) {
      const secondLine = lines[1]?.trim() ?? '';
      return secondLine === expectedHeader;
    }

    // Otherwise, header should be on the first line
    return firstLine === expectedHeader;
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
    // If the first line is a shebang, insert header after it; otherwise at the very top
    const insertIndex = firstLine.startsWith('#!') ? 1 : 0;

    lines.splice(insertIndex, 0, expectedHeader);

    fs.writeFileSync(absolutePath, lines.join('\n'), 'utf8');
  } catch (err) {
    log(`Error writing to file: ${absolutePath}`, true, err);
  }
}

function getExpectedHeader(relativePath: string): string | null {
  const basename = path.basename(relativePath);
  const ext = path.extname(relativePath).toLowerCase();

  // Special filenames without extensions
  if (basename === 'Dockerfile' || basename === 'Makefile' || basename === 'CMakeLists.txt') {
    return `# ${relativePath}`;
  }

  // Map extensions to comment styles [prefix, suffix]
  const styleMap: Record<string, [string, string]> = {
    // JavaScript / TypeScript
    '.ts': ['// ', ''],
    '.tsx': ['// ', ''],
    '.js': ['// ', ''],
    '.jsx': ['// ', ''],
    '.mjs': ['// ', ''],
    // Compiled / Statically‑typed
    '.go': ['// ', ''],
    '.java': ['// ', ''],
    '.cs': ['// ', ''],
    '.cpp': ['// ', ''],
    '.cc': ['// ', ''],
    '.cxx': ['// ', ''],
    '.c': ['// ', ''],
    // JSON with comments
    '.jsonc': ['// ', ''],
    // Shell & script files
    '.sh': ['# ', ''],
    '.bash': ['# ', ''],
    '.zsh': ['# ', ''],
    '.py': ['# ', ''],
    '.rb': ['# ', ''],
    '.pl': ['# ', ''],
    '.tcl': ['# ', ''],
    '.ps1': ['# ', ''],
    // Windows batch
    '.bat': ['REM ', ''],
    '.cmd': ['REM ', ''],
    // Stylesheets
    '.css': ['/* ', ' */'],
    '.scss': ['/* ', ' */'],
    '.sass': ['/* ', ' */'],
    '.less': ['/* ', ' */'],
    // Markup & docs
    '.html': ['<!-- ', ' -->'],
    '.htm': ['<!-- ', ' -->'],
    '.xml': ['<!-- ', ' -->'],
    '.md': ['<!-- ', ' -->'],
    // Config formats
    '.yaml': ['# ', ''],
    '.yml': ['# ', ''],
    '.toml': ['# ', ''],
    '.ini': ['; ', ''],
  };

  const style = styleMap[ext];
  if (!style) {
    return null;
  }

  const [prefix, suffix] = style;
  return `${prefix}${relativePath}${suffix}`;
}
