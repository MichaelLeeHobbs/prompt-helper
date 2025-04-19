// src/collectors/fileStructureCollector.ts
import * as fs from 'fs';
import * as path from 'path';

import {FileNode} from '../types';
import {getLocalDependencies} from './dependenciesCollector';
import {addHeader, hasCorrectHeader} from '../modules/headers';
import {standardizeError} from '../libs/standardizeError';

const CHECK_EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.jsx', '.css']);
const ALLOWED_DIRECTORIES = new Set(['public', 'src']);

/**
 * Recursively collects file metadata and structure from the provided directory.
 *
 * @param dir - The current directory being scanned.
 * @param baseDir - The root directory used to calculate relative paths.
 * @returns An array of FileNode objects representing the structure and metadata.
 */
export function collectFileTree(dir: string, baseDir: string): FileNode[] {
  let items: string[];

  try {
    items = fs.readdirSync(dir);
  } catch (err: unknown) {
    const error = standardizeError(err);
    return [
      {
        name: path.basename(dir),
        path: path.relative(baseDir, dir).replace(/\\/g, '/'),
        isDirectory: false,
        error: error.message,
      },
    ];
  }

  return items.reduce<FileNode[]>((nodes, item) => {
    // Skip promptHelper folders at root
    if (dir === baseDir && item.startsWith('promptHelper')) {
      return nodes;
    }

    const absolutePath = path.join(dir, item);
    const relativePath = path.relative(baseDir, absolutePath).replace(/\\/g, '/');

    let stat: fs.Stats;
    try {
      stat = fs.statSync(absolutePath);
    } catch (err: unknown) {
      const error = standardizeError(err);
      nodes.push({
        name: item,
        path: relativePath,
        isDirectory: false,
        error: error.message,
      });
      return nodes;
    }

    if (stat.isDirectory()) {
      if (dir === baseDir && !ALLOWED_DIRECTORIES.has(item)) {
        return nodes;
      }

      nodes.push({
        name: item + '/',
        path: relativePath + '/',
        isDirectory: true,
        children: collectFileTree(absolutePath, baseDir),
      });
    } else {
      const ext = path.extname(item);
      if (!CHECK_EXTENSIONS.has(ext)) {
        return nodes;
      }

      const dependencies = getLocalDependencies(absolutePath, baseDir);
      const hasHeader = hasCorrectHeader(absolutePath, relativePath);

      if (!hasHeader) {
        addHeader(absolutePath, relativePath);
      }

      const fileNode: FileNode = {
        name: item,
        path: relativePath,
        isDirectory: false,
      };

      if (dependencies.length > 0) {
        fileNode.dependencies = dependencies;
      }
      if (!hasHeader) {
        fileNode.missingHeader = true;
      }

      nodes.push(fileNode);
    }

    return nodes;
  }, []);
}
