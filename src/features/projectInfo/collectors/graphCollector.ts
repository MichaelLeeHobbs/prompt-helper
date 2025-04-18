// src/features/projectInfo/collectors/graphCollector.ts

import { ProjectInfo } from '../../../types';
import { collectFileTree } from '../../fileStructure/collector';

function flatten(nodes: any[], out: any[] = []): any[] {
  for (const n of nodes) {
    out.push(n);
    if (n.children) flatten(n.children, out);
  }
  return out;
}

export function collectGraph(baseDir: string, projectInfo: ProjectInfo): void {
  const tree = collectFileTree(baseDir, baseDir);
  const flat = flatten(tree);
  const graph: Record<string, string[]> = {};

  flat.forEach(node => {
    if (!node.isDirectory) {
      graph[node.path] = node.dependencies || [];
    }
  });

  projectInfo.dependencyGraph = graph;
}
