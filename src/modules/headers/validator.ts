// src/modules/headers/validator.ts
import * as fs from 'fs';
import {getExpectedHeader} from './style';

/**
 * Checks whether a file contains the expected header as its first (or second) line.
 * Accounts for a shebang (`#!`) line when present.
 *
 * @param absolutePath - The absolute path to the file.
 * @param relativePath - The relative path from the project root (used to generate the expected header).
 * @returns `true` if the header matches expectations or is not required; otherwise `false`.
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
    if (firstLine.startsWith('#!')) {
      const secondLine = lines[1]?.trim() ?? '';
      return secondLine === expectedHeader;
    }

    return firstLine === expectedHeader;
  } catch (err) {
    console.error(`Error reading file to check header: ${absolutePath}`, err);
    return false;
  }
}
