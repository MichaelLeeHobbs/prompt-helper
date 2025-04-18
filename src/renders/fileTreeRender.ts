// src/renders/fileTreeRender.ts
import { FileNode, ProjectInfo } from '../types';
import path from 'path';

function renderFileTreeHelper(nodes: FileNode[], log: (message: string, isError?: boolean) => void, prefix: string): void {
  nodes.forEach((node, idx) => {
    const isLast = idx === nodes.length - 1;
    const pointer = isLast ? '└── ' : '├── ';
    let line = `${prefix}${pointer}${node.name}`;

    if (node.dependencies?.length) {
      line += ` (Depends on: ${node.dependencies.join(', ')})`;
    }

    if (node.error) {
      log(`${line} [Error: ${node.error}]`, true);
      return;
    }

    log(line);

    if (node.children?.length) {
      const nextPrefix = prefix + (isLast ? '    ' : '│   ');
      renderFileTreeHelper(node.children, log, nextPrefix);
    }
  });
}

/**
 * Recursively logs a visual representation of the file tree structure.
 *
 * @param projectInfo - The project information containing the file tree and logger.
 */
export function fileTreeRender(projectInfo: ProjectInfo): void {
  const { tree: nodes, logger: log } = projectInfo;
  log('\n## Directory Structure:\n');
  log('```markdown');
  log(`${path.basename(projectInfo.baseDir)}/`);
  renderFileTreeHelper(nodes, log, '');
  log('```');
}
