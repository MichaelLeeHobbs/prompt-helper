#!/usr/bin/env node
// src/index.ts

import * as fs from 'fs';
import * as path from 'path';

import {getOptions} from './options';
import {createLogger} from './logger';
import {ProjectInfo} from './types';
import {collectProjectInfo} from './collectors/projectInfoCollector';
import {collectFileTree} from './collectors/fileStructureCollector';
import {fileTreeRender} from './renders/fileTreeRender';
import {renderProjectInfo} from './renders/projectInfoRenderer';
import {appendPromptInstructions} from './renders/instructionsRender';

const options = getOptions();
const baseDir = path.resolve(options.dir);
const logFilePath = path.join(baseDir, options.out);

/**
 * Main execution entry point.
 * - Validates the target directory.
 * - Initializes logging and file tree collection.
 * - Collects project metadata.
 * - Renders output to markdown and optionally JSON.
 */
function main(): void {
  if (!fs.existsSync(baseDir) || !fs.statSync(baseDir).isDirectory()) {
    console.error(`Error: "${baseDir}" is not a valid directory.`);
    process.exit(1);
  }

  const log = createLogger(logFilePath);
  const projectInfo: ProjectInfo = {
    baseDir,
    logger: log,
    tree: collectFileTree(baseDir, baseDir),
  };

  collectProjectInfo({
    baseDir,
    projectInfo,
    stylePath: options.style,
    codePaths: options.code,
    ignorePatterns: options.ignore, // Pass ignore options
    scanTodos: options.todos,
    scanMetrics: options.complexity,
    graphDeps: options.dependencyGraph,
  });

  // Markdown Output
  log(projectInfo.packageJson?.name ? `# Project: ${projectInfo.packageJson.name}` : '# Project Info:');

  fileTreeRender(projectInfo);
  renderProjectInfo(projectInfo, log);
  appendPromptInstructions(log, projectInfo);

  // Optional JSON manifest
  if (options.json) {
    const outJson = path.join(baseDir, options.out.replace(/\.md$/, '.json'));
    fs.writeFileSync(outJson, JSON.stringify(projectInfo, null, 2), 'utf8');
    console.log(`JSON manifest written to: ${outJson}`);
  }
}

main();
