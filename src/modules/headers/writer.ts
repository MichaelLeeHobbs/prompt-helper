// src/modules/headers/writer.ts
import * as fs from 'fs';
import {getExpectedHeader} from './style';

/**
 * Inserts the expected file header into a source file if it's missing.
 * Handles shebang lines by inserting after them when present.
 *
 * @param absolutePath - The full file system path to the target file.
 * @param relativePath - The relative path from the project root (used to generate the expected header).
 */
export function addHeader(absolutePath: string, relativePath: string): void {
  const expectedHeader = getExpectedHeader(relativePath);
  if (!expectedHeader) {
    return;
  }

  try {
    const data = fs.readFileSync(absolutePath, 'utf8');

    // Remove any existing exact match of the header
    let lines = data.split('\n').filter(line => line.trim() !== expectedHeader);

    const firstLine = lines[0]?.trim() ?? '';
    const insertIndex = firstLine.startsWith('#!') ? 1 : 0;

    lines.splice(insertIndex, 0, expectedHeader);

    fs.writeFileSync(absolutePath, lines.join('\n'), 'utf8');
  } catch (err) {
    console.error(`Error inserting header into file: ${absolutePath}`, true, err);
  }
}
