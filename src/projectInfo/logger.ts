// src/projectInfo/logger.ts
import { ProjectInfo } from '../types';

export function logProjectInfo(
    projectInfo: ProjectInfo,
    log: (msg: string, err?: boolean) => void
): void {
    if (projectInfo.packageJson) {
        log('\n## Package.json info:');
        log(`### Type: ${projectInfo.packageJson.type || 'Not specified'}`);
        log('### Dependencies:');
        for (const [dep, ver] of Object.entries(projectInfo.packageJson.dependencies || {})) {
            log(`  ${dep}: ${ver}`);
        }
        if (!projectInfo.packageJson.dependencies) log('  None');

        log('### DevDependencies:');
        for (const [dep, ver] of Object.entries(projectInfo.packageJson.devDependencies || {})) {
            log(`  ${dep}: ${ver}`);
        }
        if (!projectInfo.packageJson.devDependencies) log('  None');
    } else {
        log('\n## No package.json found.');
    }

    if (projectInfo.tsconfigJson) {
        log('\n## tsconfig.json and referenced configs found:');
        // CompilerOptions
        if (projectInfo.tsconfigJson.compilerOptions) {
            log('### CompilerOptions:');
            for (const [opt, val] of Object.entries(projectInfo.tsconfigJson.compilerOptions)) {
                log(`  ${opt}: ${JSON.stringify(val)}`);
            }
        }
        // Includes / Excludes / Files / References
        for (const key of ['include', 'exclude', 'files', 'references'] as const) {
            const val = (projectInfo.tsconfigJson as any)[key];
            if (val) {
                log(`### ${key.charAt(0).toUpperCase() + key.slice(1)}:`);
                (Array.isArray(val) ? val : []).forEach((item: any) =>
                    log(`  ${typeof item === 'object' ? JSON.stringify(item) : item}`)
                );
            }
        }
    } else {
        log('\n## tsconfig.json not found.');
    }

    log('\n## Project Info:');
    log(projectInfo.packageManager
        ? `- Package manager detected: ${projectInfo.packageManager}`
        : '- No package manager lock file detected.'
    );
    log(projectInfo.usesESLint ? '- Project uses ESLint.' : '- Project does not use ESLint.');
    if (projectInfo.usesVite) log('- Project uses Vite.');
    if (projectInfo.usesWebpack) log('- Project uses Webpack.');
    if (projectInfo.usesBabel) log('- Project uses Babel.');
    if (projectInfo.usesJest) log('- Project uses Jest.');
    if (projectInfo.usesDocker) log('- Project uses Docker.');
    if (projectInfo.usesGitHubActions) log('- Project uses GitHub Actions.');
    if (projectInfo.usesTravis) log('- Project uses Travis CI.');
    if (projectInfo.usesCircleCI) log('- Project uses CircleCI.');
    if (projectInfo.usesJenkins) log('- Project uses Jenkins.');
}
