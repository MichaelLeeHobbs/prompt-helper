// src/projectInfo.ts

import * as fs from 'fs';
import * as path from 'path';
import { ProjectInfo } from './types';
import { collectTsconfigInfo } from './tsconfig';

/*
  Explain: Gathering project info is a distinct concern—extracting details from package.json, lock files,
  and config files. By isolating this logic, we maintain clarity and separability.
*/

export function collectProjectInfo(baseDir: string, projectInfo: ProjectInfo): void {
    const packageJsonPath = path.join(baseDir, 'package.json');
    if (fs.existsSync(packageJsonPath)) {
        try {
            const packageJsonData = fs.readFileSync(packageJsonPath, 'utf8');
            projectInfo.packageJson = JSON.parse(packageJsonData);
        } catch (err) {
            console.error('Error reading or parsing package.json:', err);
        }
    }

    const promptHelperOtherNotesPath = path.join(baseDir, 'promptHelperOtherNotes.md');
    if (fs.existsSync(promptHelperOtherNotesPath)) {
        projectInfo.otherNotes = fs.readFileSync(promptHelperOtherNotesPath, 'utf8');
    }

    // tsconfig.json info
    const tsconfigPath = path.join(baseDir, 'tsconfig.json');
    if (fs.existsSync(tsconfigPath)) {
        projectInfo.tsconfigJson = collectTsconfigInfo(tsconfigPath);
    } else {
        console.error('tsconfig.json not found.');
    }

    // Detect package manager
    if (fs.existsSync(path.join(baseDir, 'package-lock.json'))) {
        projectInfo.packageManager = 'npm';
    } else if (fs.existsSync(path.join(baseDir, 'yarn.lock'))) {
        projectInfo.packageManager = 'yarn';
    } else if (fs.existsSync(path.join(baseDir, 'pnpm-lock.yaml'))) {
        projectInfo.packageManager = 'pnpm';
    }

    // ESLint
    const eslintConfigs = ['.eslintrc.js', '.eslintrc.json', '.eslintrc', 'eslint.config.js'];
    projectInfo.usesESLint = eslintConfigs.some(cfg => fs.existsSync(path.join(baseDir, cfg)));

    // Webpack
    projectInfo.usesWebpack = fs.existsSync(path.join(baseDir, 'webpack.config.js'));

    // Vite
    projectInfo.usesVite = fs.existsSync(path.join(baseDir, 'vite.config.js')) || fs.existsSync(path.join(baseDir, 'vite.config.ts'));

    // Babel
    projectInfo.usesBabel = fs.existsSync(path.join(baseDir, 'babel.config.js')) || fs.existsSync(path.join(baseDir, '.babelrc'));

    // Jest
    projectInfo.usesJest = fs.existsSync(path.join(baseDir, 'jest.config.js'));

    // Docker
    projectInfo.usesDocker = fs.existsSync(path.join(baseDir, 'Dockerfile'));
}


export function logProjectInfo(projectInfo: ProjectInfo, log: (msg: string, err?: boolean) => void): void {
    if (projectInfo.packageJson) {
        log('\n## Package.json info:');
        log(`### Type: ${projectInfo.packageJson.type || 'Not specified'}`);
        log('### Dependencies:');
        if (projectInfo.packageJson.dependencies) {
            for (const [dep, version] of Object.entries(projectInfo.packageJson.dependencies)) {
                log(`  ${dep}: ${version}`);
            }
        } else {
            log('  None');
        }
        log('### DevDependencies:');
        if (projectInfo.packageJson.devDependencies) {
            for (const [dep, version] of Object.entries(projectInfo.packageJson.devDependencies)) {
                log(`  ${dep}: ${version}`);
            }
        } else {
            log('  None');
        }
    } else {
        log('\n## No package.json found.');
    }

    // tsconfig info
    if (projectInfo.tsconfigJson) {
        log('\n## tsconfig.json and referenced configs found.');
        if (projectInfo.tsconfigJson.compilerOptions) {
            log('### CompilerOptions:');
            for (const [option, value] of Object.entries(projectInfo.tsconfigJson.compilerOptions)) {
                log(`  ${option}: ${JSON.stringify(value)}`);
            }
        }
        if (projectInfo.tsconfigJson.include) {
            log('### Include:');
            for (const pattern of projectInfo.tsconfigJson.include) {
                log(`  ${pattern}`);
            }
        }
        if (projectInfo.tsconfigJson.exclude) {
            log('### Exclude:');
            for (const pattern of projectInfo.tsconfigJson.exclude) {
                log(`  ${pattern}`);
            }
        }
        if (projectInfo.tsconfigJson.files) {
            log('### Files:');
            for (const file of projectInfo.tsconfigJson.files) {
                log(`  ${file}`);
            }
        }
        if (projectInfo.tsconfigJson.references) {
            log('### References:');
            for (const ref of projectInfo.tsconfigJson.references) {
                log(`- Path: ${ref.path}`);
            }
        }
    } else {
        log('\n## tsconfig.json not found.');
    }

    log('\n## Project Info:');

    if (projectInfo.packageManager) {
        log(`- Package manager detected: ${projectInfo.packageManager}`);
    } else {
        log('- No package manager lock file detected.');
    }

    if (projectInfo.usesESLint) {
        log('- Project uses ESLint.');
    } else {
        log('- Project does not use ESLint.');
    }

    if (projectInfo.usesVite) {
        log('- Project uses Vite.');
    }
    if (projectInfo.usesWebpack) {
        log('- Project uses Webpack.');
    }
    if (projectInfo.usesBabel) {
        log('- Project uses Babel.');
    }
    if (projectInfo.usesJest) {
        log('- Project uses Jest.');
    }
    if (projectInfo.usesDocker) {
        log('- Project uses Docker.');
    }
}

export function appendPromptInstructions(log: (msg: string) => void, projectInfo: ProjectInfo): void {
    log(`\n----------\n`);
    if (projectInfo.otherNotes) {
        log(projectInfo.otherNotes);
    } else {
        log(`## Other Notes:\n(i.e., additional information, steps, etc. that may be helpful. Remove this section if not needed.)`);
    }

    log(`\n
## Code:
[Include code snippets or references]

Instructions:
- Provide a summary of any issues found.
- Suggest improvements with code examples if possible.

`);
}
