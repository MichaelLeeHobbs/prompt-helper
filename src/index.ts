#!/usr/bin/env node
// src/index.ts

import * as fs from 'fs';
import * as path from 'path';
import { Command } from 'commander';
import { createLogger } from './logger';
import { ProjectInfo } from './types';
import { appendPromptInstructions, collectProjectInfo, logProjectInfo } from './features/projectInfo';
import { traverseDirectory } from './features/fileStructure';

const program = new Command();
program
  .name('prompt-helper')
  .description('Generate a promptHelper markdown summary of your project')
  .version('1.0.0')
  .option('-d, --dir <path>', 'base directory to scan', process.cwd())
  .option('-o, --out <file>', 'output markdown filename', 'promptHelper.md')
  .parse(process.argv);

const options = program.opts<{ dir: string; out: string }>();
const baseDir = path.resolve(options.dir);
const logFilePath = path.join(baseDir, options.out);

function main() {
  if (!fs.existsSync(baseDir) || !fs.statSync(baseDir).isDirectory()) {
    console.error(`Error: "${baseDir}" is not a valid directory.`);
    process.exit(1);
  }

  const log = createLogger(logFilePath);
  const projectInfo: ProjectInfo = {};

  // Collect and render project info
  collectProjectInfo(baseDir, projectInfo);

  log(projectInfo.packageJson?.name ? `# Project: ${projectInfo.packageJson.name}` : '# Project Info:');

  // File tree
  log('\n## Directory Structure:\n');
  log(`${path.basename(baseDir)}/`);
  traverseDirectory(baseDir, log);

  // Metadata & instructions
  logProjectInfo(projectInfo, log);
  appendPromptInstructions(log, projectInfo);
}

main();
