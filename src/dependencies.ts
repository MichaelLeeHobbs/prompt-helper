// src/dependencies.ts

import * as fs from 'fs';
import * as path from 'path';
import * as ts from 'typescript';

/*
  Explain: We isolate dependency extraction logic so that if we change how we parse or handle dependencies,
  we only modify this file. Currently, we use TypeScript's compiler API to parse imports.
*/

export function getLocalDependencies(filePath: string, baseDir: string): string[] {
  const dependencies: string[] = [];
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const sourceFile = ts.createSourceFile(filePath, fileContent, ts.ScriptTarget.Latest, true);

  ts.forEachChild(sourceFile, node => {
    if (ts.isImportDeclaration(node) && node.moduleSpecifier && ts.isStringLiteral(node.moduleSpecifier)) {
      const importPath = node.moduleSpecifier.text;
      if (!importPath.startsWith('.')) {
        return;
      } // Skip library imports
      const resolvedPath = path.resolve(path.dirname(filePath), importPath);
      const relativePath = path.relative(baseDir, resolvedPath).replace(/\\/g, '/');
      dependencies.push(relativePath);
    }
  });

  return dependencies;
}
