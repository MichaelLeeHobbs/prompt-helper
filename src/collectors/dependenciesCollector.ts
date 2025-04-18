// src/collectors/dependenciesCollector.ts
import * as fs from 'fs';
import * as path from 'path';
import * as ts from 'typescript';

/**
 * Extracts local (relative) import dependencies from a TypeScript or JavaScript file.
 *
 * Uses the TypeScript compiler API to parse and analyze the file's import declarations.
 * External modules (not starting with `.`) are excluded.
 *
 * @param filePath - The full path to the file to analyze.
 * @param baseDir - The base directory for resolving relative import paths.
 * @returns An array of relative import paths used in the file (normalized to POSIX-style).
 */
export function getLocalDependencies(filePath: string, baseDir: string): string[] {
  const dependencies: string[] = [];

  const fileContent = fs.readFileSync(filePath, 'utf8');
  const sourceFile = ts.createSourceFile(filePath, fileContent, ts.ScriptTarget.Latest, true);

  ts.forEachChild(sourceFile, node => {
    if (ts.isImportDeclaration(node) && node.moduleSpecifier && ts.isStringLiteral(node.moduleSpecifier)) {
      const importPath = node.moduleSpecifier.text;

      // Ignore external libraries (non-relative imports)
      if (!importPath.startsWith('.')) {
        return;
      }

      const resolvedPath = path.resolve(path.dirname(filePath), importPath);
      const relativePath = path.relative(baseDir, resolvedPath).replace(/\\/g, '/');

      dependencies.push(relativePath);
    }
  });

  return dependencies;
}
