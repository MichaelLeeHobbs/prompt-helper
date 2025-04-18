// src/modules/traverse/index.ts
import { collectFileTree } from './collector';
import { logFileTree } from './logger';

export function traverseDirectory(
    baseDir: string,
    log: (msg: string, err?: boolean, error?: unknown) => void
): void {
    const tree = collectFileTree(baseDir, baseDir);
    logFileTree(tree, log);
}
