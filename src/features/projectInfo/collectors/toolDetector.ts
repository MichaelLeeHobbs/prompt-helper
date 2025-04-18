// src/features/projectInfo/collectors/toolDetector.ts
// src/projectInfo/collectors/toolDetector.ts
import * as fs from 'fs';
import * as path from 'path';
import { ProjectInfo } from '../../../types';

export function detectTools(baseDir: string, projectInfo: ProjectInfo): void {
    // package manager
    if (fs.existsSync(path.join(baseDir, 'package-lock.json'))) {
        projectInfo.packageManager = 'npm';
    } else if (fs.existsSync(path.join(baseDir, 'yarn.lock'))) {
        projectInfo.packageManager = 'yarn';
    } else if (fs.existsSync(path.join(baseDir, 'pnpm-lock.yaml'))) {
        projectInfo.packageManager = 'pnpm';
    }

    // linters & builders
    const eslintFiles = ['.eslintrc.js', '.eslintrc.json', 'eslint.config.js', 'eslint.config.mjs'];
    projectInfo.usesESLint = eslintFiles.some(f => fs.existsSync(path.join(baseDir, f)));

    const webpackFiles = ['webpack.config.js', 'webpack.config.ts'];
    projectInfo.usesWebpack = webpackFiles.some(f => fs.existsSync(path.join(baseDir, f)));

    projectInfo.usesVite = fs.existsSync(path.join(baseDir, 'vite.config.js')) ||
        fs.existsSync(path.join(baseDir, 'vite.config.ts'));

    const babelFiles = ['.babelrc', 'babel.config.js'];
    projectInfo.usesBabel = babelFiles.some(f => fs.existsSync(path.join(baseDir, f)));

    const jestFiles = ['jest.config.js', 'jest.config.json', 'jest.config.ts'];
    projectInfo.usesJest = jestFiles.some(f => fs.existsSync(path.join(baseDir, f)));

    // Docker
    projectInfo.usesDocker = fs.readdirSync(baseDir)
        .some(name => name.toLowerCase().startsWith('dockerfile'));

    // CI
    projectInfo.usesGitHubActions = fs.existsSync(path.join(baseDir, '.github', 'workflows'));
    projectInfo.usesTravis = fs.existsSync(path.join(baseDir, '.travis.yml'));
    projectInfo.usesCircleCI = fs.existsSync(path.join(baseDir, '.circleci', 'config.yml'));
    projectInfo.usesJenkins = fs.existsSync(path.join(baseDir, 'Jenkinsfile'));
}
