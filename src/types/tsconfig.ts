// src/types/tsconfig.ts
/**
 * Represents a tsconfig.json structure, with support for `extends`, `references`, etc.
 */
export interface Tsconfig {
  extends?: string;
  compilerOptions?: Record<string, unknown>;
  include?: string[];
  exclude?: string[];
  files?: string[];
  references?: {path: string}[];

  [key: string]: unknown;
}
