// src/types/index.ts
// src/types/projectInfoCollector.ts
export {ProjectInfo} from './projectInfo';
export {Tsconfig} from './tsconfig';
export {TodoItem} from './todo';
export {FtaMetrics} from './metrics';

export interface FileNode {
  name: string;
  path: string;
  isDirectory: boolean;
  children?: FileNode[];
  dependencies?: string[];
  missingHeader?: boolean;
  error?: string;
}

export type Logger = (msg: string, isError?: boolean, error?: unknown) => void;
