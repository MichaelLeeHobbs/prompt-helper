#!/usr/bin/env node
// src/index.ts

import * as fs from 'fs';
import * as path from 'path';
import { Command } from 'commander';
import { createLogger } from './logger';
import { ProjectInfo } from './types';
import { collectProjectInfo, logProjectInfo, appendPromptInstructions } from './features/projectInfo';
import { traverseDirectory } from './features/fileStructure';

const program = new Command();
program
    .name('prompt-helper')
    .description('Generate a promptHelper markdown summary of your project')
    .version('1.0.0')
    .option('-d, --dir <path>', 'base directory to scan', process.cwd())
    .option('-o, --out <file>', 'output markdown filename', 'promptHelper.md')
    .option('-s, --style <path>', 'path to style markdown file')
    .option('-c, --code <path>', 'path to code file to include', (value, previous) => previous.concat([value]), [] as string[])
    .parse(process.argv);

interface Options { dir: string; out: string; style?: string; code: string[]; }
const options = program.opts<Options>();
const baseDir = path.resolve(options.dir);
const logFilePath = path.join(baseDir, options.out);

function main() {
  if (!fs.existsSync(baseDir) || !fs.statSync(baseDir).isDirectory()) {
    console.error(`Error: "${baseDir}" is not a valid directory.`);
    process.exit(1);
  }

  const log = createLogger(logFilePath);
  const projectInfo: ProjectInfo = {};

  collectProjectInfo(baseDir, projectInfo, options.style, options.code);

  log(projectInfo.packageJson?.name
      ? `# Project: ${projectInfo.packageJson.name}`
      : '# Project Info:');

  log('\n## Directory Structure:\n');
  log(`${path.basename(baseDir)}/`);
  traverseDirectory(baseDir, log);

  logProjectInfo(projectInfo, log);
  appendPromptInstructions(log, projectInfo);
}

main();
