// src/modules/traverse/collector.ts

import * as fs from 'fs';
import * as path from 'path';
import { FileNode } from '../../types';
import { getLocalDependencies } from '../dependencies';
import { hasCorrectHeader } from '../headers';

const CHECK_EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.jsx', '.css']);
const ALLOWED_DIRECTORIES = new Set(['public', 'src']);

/**
 * Recursively builds a tree of FileNode objects under `dir`.
 */
export function collectFileTree(dir: string, baseDir: string): FileNode[] {
  let items: string[];
  try {
    items = fs.readdirSync(dir);
  } catch (err: any) {
    return [
      {
        name: path.basename(dir),
        path: path.relative(baseDir, dir).replace(/\\/g, '/'),
        isDirectory: false,
        error: err.message,
      },
    ];
  }

  return items.reduce<FileNode[]>((nodes, item) => {
    if (dir === baseDir && item.startsWith('promptHelper')) {
      return nodes;
    }

    const absolute = path.join(dir, item);
    const relPath = path.relative(baseDir, absolute).replace(/\\/g, '/');

    let stat: fs.Stats;
    try {
      stat = fs.statSync(absolute);
    } catch (err: any) {
      nodes.push({
        name: item,
        path: relPath,
        isDirectory: false,
        error: err.message,
      });
      return nodes;
    }

    if (stat.isDirectory()) {
      if (dir === baseDir && !ALLOWED_DIRECTORIES.has(item)) {
        return nodes;
      }
      nodes.push({
        name: item + '/',
        path: relPath + '/',
        isDirectory: true,
        children: collectFileTree(absolute, baseDir),
      });
    } else {
      const ext = path.extname(item);
      if (!CHECK_EXTENSIONS.has(ext)) {
        return nodes;
      }

      const dependencies = getLocalDependencies(absolute, baseDir);
      const correct = hasCorrectHeader(absolute, relPath);

      // start with the mandatory props
      const fileNode: FileNode = {
        name: item,
        path: relPath,
        isDirectory: false,
      };

      // only attach dependencies if non-empty
      if (dependencies.length > 0) {
        fileNode.dependencies = dependencies;
      }

      // missingHeader is an optional boolean, so include it if true
      if (!correct) {
        fileNode.missingHeader = true;
      }

      nodes.push(fileNode);
    }

    return nodes;
  }, []);
}
