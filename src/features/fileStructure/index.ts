// src/features/fileStructure/index.ts
import { collectFileTree } from './collector';
import { renderFileTree } from './renderer';

export function traverseDirectory(
    baseDir: string,
    log: (msg: string, err?: boolean, error?: unknown) => void
): void {
    const tree = collectFileTree(baseDir, baseDir);
    renderFileTree(tree, log);
}
