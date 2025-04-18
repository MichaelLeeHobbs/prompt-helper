// src/collectors/graphCollector.ts
import {FileNode, ProjectInfo} from '../types';
import {collectFileTree} from './fileStructureCollector';

/**
 * Flattens a nested array of FileNode objects into a single-level array.
 *
 * @param nodes - The tree of FileNode objects.
 * @param out - Accumulator for flattened nodes.
 * @returns A flat list of all file and directory nodes.
 */
function flatten(nodes: FileNode[], out: FileNode[] = []): FileNode[] {
  for (const node of nodes) {
    out.push(node);
    if (node.children) {
      flatten(node.children, out);
    }
  }
  return out;
}

/**
 * Collects a file-level dependency graph and attaches it to the project info object.
 *
 * @param baseDir - The root directory of the project.
 * @param projectInfo - The project info object to populate with the dependency graph.
 */
export function collectGraph(baseDir: string, projectInfo: ProjectInfo): void {
  const tree = collectFileTree(baseDir, baseDir);
  const flatNodes = flatten(tree);
  const graph: Record<string, string[]> = {};

  for (const node of flatNodes) {
    if (!node.isDirectory) {
      graph[node.path] = node.dependencies || [];
    }
  }

  projectInfo.dependencyGraph = graph;
}
