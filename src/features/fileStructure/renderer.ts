// src/features/fileStructure/renderer.ts
import { FileNode } from '../../types';

export function renderFileTree(nodes: FileNode[], log: (msg: string, err?: boolean, error?: unknown) => void, prefix = ''): void {
  nodes.forEach((node, idx) => {
    const isLast = idx === nodes.length - 1;
    const pointer = isLast ? '└── ' : '├── ';
    let line = `${prefix}${pointer}${node.name}`;

    if (node.dependencies) {
      line += ` (Depends on: ${node.dependencies.join(', ')})`;
    }

    if (node.error) {
      log(`${line} [Error: ${node.error}]`, true);
      return;
    }

    log(line);

    if (node.children) {
      const nextPrefix = prefix + (isLast ? '    ' : '│   ');
      renderFileTree(node.children, log, nextPrefix);
    }
  });
}
