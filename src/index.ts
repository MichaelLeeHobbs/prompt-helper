#!/usr/bin/env node
// src/index.ts
import * as fs from 'fs';
import * as path from 'path';
import {createLogger} from './logger';
import {ProjectInfo} from './types';
import {appendPromptInstructions, collectProjectInfo, logProjectInfo} from './projectInfo';
import {traverseDirectory} from './traverse';

/*
  Explain: index.ts is the entry point where all other modules are orchestrated.
  It sets up the environment, creates the logger, gathers info, and runs the traversal logic.
*/

function main() {
    const baseDir = process.cwd();

    if (!fs.existsSync(baseDir) || !fs.statSync(baseDir).isDirectory()) {
        console.error('Error: The current working directory is not valid.');
        process.exit(1);
    }

    const logFilePath = path.join(baseDir, 'promptHelper.txt');
    const log = createLogger(logFilePath);

    const projectInfo: ProjectInfo = {};
    collectProjectInfo(baseDir, projectInfo);

    if (projectInfo.packageJson && projectInfo.packageJson.name) {
        log(`# Project: ${projectInfo.packageJson.name}`);
    } else {
        log('# Project Info:');
    }

    log('\n## Directory Structure:\n');
    log(`${path.basename(baseDir)}/`);
    traverseDirectory(baseDir, baseDir, '', log, projectInfo);
    logProjectInfo(projectInfo, log);
    appendPromptInstructions(log, projectInfo);
}

main();
