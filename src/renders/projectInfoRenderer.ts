// src/renders/projectInfoRenderer.ts
import {ProjectInfo} from '../types';

/**
 * Renders collected project information including package.json, tsconfig, and tool usage.
 *
 * @param projectInfo - The project metadata to display.
 * @param log - A logging function to print output and optionally indicate errors.
 */
export function renderProjectInfo(projectInfo: ProjectInfo, log: (msg: string, err?: boolean) => void): void {
  // Package.json
  if (projectInfo.packageJson) {
    log('\n## Package.json info:');
    log(`### Type: ${projectInfo.packageJson.type || 'Not specified'}`);

    log('### Dependencies:');
    const deps = projectInfo.packageJson.dependencies || {};
    if (Object.keys(deps).length) {
      for (const [dep, ver] of Object.entries(deps)) {
        log(`  ${dep}: ${ver}`);
      }
    } else {
      log('  None');
    }

    log('### DevDependencies:');
    const devDeps = projectInfo.packageJson.devDependencies || {};
    if (Object.keys(devDeps).length) {
      for (const [dep, ver] of Object.entries(devDeps)) {
        log(`  ${dep}: ${ver}`);
      }
    } else {
      log('  None');
    }
  } else {
    log('\n## No package.json found.');
  }

  // tsconfig.json
  if (projectInfo.tsconfigJson) {
    log('\n## tsconfig.json and referenced configs found:');

    if (projectInfo.tsconfigJson.compilerOptions) {
      log('### CompilerOptions:');
      for (const [key, value] of Object.entries(projectInfo.tsconfigJson.compilerOptions)) {
        log(`  ${key}: ${JSON.stringify(value)}`);
      }
    }

    const keysToShow = ['include', 'exclude', 'files', 'references'] as const;
    for (const key of keysToShow) {
      const value = (projectInfo.tsconfigJson as any)[key];
      if (Array.isArray(value)) {
        log(`### ${key.charAt(0).toUpperCase() + key.slice(1)}:`);
        value.forEach(item => {
          log(`  ${typeof item === 'object' ? JSON.stringify(item) : item}`);
        });
      }
    }
  } else {
    log('\n## tsconfig.json not found.');
  }

  // Toolchain Summary
  log('\n## Project Info:');
  log(projectInfo.packageManager ? `- Package manager detected: ${projectInfo.packageManager}` : '- No package manager lock file detected.');

  log(projectInfo.usesESLint ? '- Project uses ESLint.' : '- Project does not use ESLint.');
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
