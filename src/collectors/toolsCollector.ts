// src/collectors/toolsCollector.ts
import * as fs from 'fs';
import * as path from 'path';
import {ProjectInfo} from '../types';

/**
 * Detects commonly used tools and configurations in the project based on known file names.
 *
 * @param baseDir - The root directory of the project.
 * @param projectInfo - The project info object to populate with tool usage flags.
 */
export function collectTools(baseDir: string, projectInfo: ProjectInfo): void {
  // Package manager detection
  if (fs.existsSync(path.join(baseDir, 'package-lock.json'))) {
    projectInfo.packageManager = 'npm';
  } else if (fs.existsSync(path.join(baseDir, 'yarn.lock'))) {
    projectInfo.packageManager = 'yarn';
  } else if (fs.existsSync(path.join(baseDir, 'pnpm-lock.yaml'))) {
    projectInfo.packageManager = 'pnpm';
  }

  // Linters
  const eslintFiles = ['.eslintrc.js', '.eslintrc.json', 'eslint.config.js', 'eslint.config.mjs'];
  projectInfo.usesESLint = eslintFiles.some(f => fs.existsSync(path.join(baseDir, f)));

  const babelFiles = ['.babelrc', 'babel.config.js'];
  projectInfo.usesBabel = babelFiles.some(f => fs.existsSync(path.join(baseDir, f)));

  // Builders
  const webpackFiles = ['webpack.config.js', 'webpack.config.ts'];
  projectInfo.usesWebpack = webpackFiles.some(f => fs.existsSync(path.join(baseDir, f)));

  projectInfo.usesVite = fs.existsSync(path.join(baseDir, 'vite.config.js')) || fs.existsSync(path.join(baseDir, 'vite.config.ts'));

  // Testing
  const jestFiles = ['jest.config.js', 'jest.config.json', 'jest.config.ts'];
  projectInfo.usesJest = jestFiles.some(f => fs.existsSync(path.join(baseDir, f)));

  // Docker
  projectInfo.usesDocker = fs.readdirSync(baseDir).some(name => name.toLowerCase().startsWith('dockerfile'));

  // CI tools
  projectInfo.usesGitHubActions = fs.existsSync(path.join(baseDir, '.github', 'workflows'));
  projectInfo.usesTravis = fs.existsSync(path.join(baseDir, '.travis.yml'));
  projectInfo.usesCircleCI = fs.existsSync(path.join(baseDir, '.circleci', 'config.yml'));
  projectInfo.usesJenkins = fs.existsSync(path.join(baseDir, 'Jenkinsfile'));
}
