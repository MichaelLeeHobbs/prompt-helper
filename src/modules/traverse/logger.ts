// src/modules/traverse/logger.ts
import { FileNode } from '../../types';

/**
 * Logs a tree of FileNodes using the same prefix style as before.
 */
export function logFileTree(
    nodes: FileNode[],
    log: (msg: string, err?: boolean, error?: unknown) => void,
    prefix = ''
): void {
    nodes.forEach((node, idx) => {
        const isLast = idx === nodes.length - 1;
        const pointer = isLast ? '└── ' : '├── ';
        const line = `${prefix}${pointer}${node.name}`;

        if (node.error) {
            log(`${line} [Error: ${node.error}]`, true);
            return;
        }

        if (node.missingHeader) {
            // Optionally add header here
            log(`${line} [Header missing]`, true);
        } else {
            log(line);
        }

        if (node.dependencies) {
            log(`${prefix}    (Depends on: ${node.dependencies.join(', ')})`);
        }

        if (node.children) {
            const nextPrefix = prefix + (isLast ? '    ' : '│   ');
            logFileTree(node.children, log, nextPrefix);
        }
    });
}
