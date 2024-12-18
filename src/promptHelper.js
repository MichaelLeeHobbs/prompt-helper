// src/promptHelper.js

import * as fs from 'fs';
import * as path from 'path';
import * as ts from 'typescript'; // For TypeScript and JavaScript dependency parsing

// Define the file extensions to check
const CHECK_EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.jsx', '.css']);

// Define the directories to include during traversal
const ALLOWED_DIRECTORIES = new Set(['public', 'src']);

/**
 * Recursively collects tsconfig information, including references.
 * @param {string} tsconfigPath - The path to the tsconfig.json file.
 * @param {Set<string>} visitedConfigs - A set to keep track of visited tsconfig paths to avoid circular references.
 * @returns {object} - The merged tsconfig information.
 */
function collectTsconfigInfo(tsconfigPath, visitedConfigs = new Set()) {
    if (visitedConfigs.has(tsconfigPath)) {
        // Avoid circular references
        return {};
    }
    visitedConfigs.add(tsconfigPath);

    let tsconfig;
    try {
        const tsconfigData = fs.readFileSync(tsconfigPath, 'utf8');
        tsconfig = JSON.parse(tsconfigData);
    } catch (err) {
        console.error(`Error reading or parsing ${tsconfigPath}:`, err);
        return {};
    }

    let mergedConfig = {...tsconfig};

    // If extends is used, merge parent tsconfig
    if (tsconfig.extends) {
        const parentPath = path.resolve(path.dirname(tsconfigPath), tsconfig.extends);
        const parentConfig = collectTsconfigInfo(parentPath, visitedConfigs);
        mergedConfig = mergeTsconfigs(parentConfig, mergedConfig);
    }

    // If references are used, recursively collect referenced tsconfigs
    if (tsconfig.references && Array.isArray(tsconfig.references)) {
        for (const ref of tsconfig.references) {
            const refPath = path.resolve(path.dirname(tsconfigPath), ref.path, 'tsconfig.json');
            const refConfig = collectTsconfigInfo(refPath, visitedConfigs);
            mergedConfig = mergeTsconfigs(mergedConfig, refConfig);
        }
    }

    return mergedConfig;
}

/**
 * Merges two tsconfig objects.
 * @param {object} baseConfig - The base tsconfig object.
 * @param {object} overrideConfig - The tsconfig object to merge into the base.
 * @returns {object} - The merged tsconfig object.
 */
function mergeTsconfigs(baseConfig, overrideConfig) {
    // Deep merge the two configs
    // This can be customized to handle conflicts as per your requirements
    return {
        ...baseConfig,
        ...overrideConfig,
        compilerOptions: {
            ...baseConfig.compilerOptions,
            ...overrideConfig.compilerOptions,
        },
        include: Array.from(new Set([...(baseConfig.include || []), ...(overrideConfig.include || [])])),
        exclude: Array.from(new Set([...(baseConfig.exclude || []), ...(overrideConfig.exclude || [])])),
        files: Array.from(new Set([...(baseConfig.files || []), ...(overrideConfig.files || [])])),
    };
}

/**
 * Extracts local dependencies from a file using TypeScript.
 * @param {string} filePath - The absolute path to the file.
 * @param {string} baseDir - The base directory to resolve local dependencies.
 * @returns {string[]} - A list of relative paths to local dependencies.
 */
function getLocalDependencies(filePath, baseDir) {
    const dependencies = [];
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const sourceFile = ts.createSourceFile(filePath, fileContent, ts.ScriptTarget.Latest, true);

    ts.forEachChild(sourceFile, (node) => {
        if (
            ts.isImportDeclaration(node) &&
            node.moduleSpecifier &&
            ts.isStringLiteral(node.moduleSpecifier)
        ) {
            const importPath = node.moduleSpecifier.text;
            if (!importPath.startsWith('.')) return; // Skip library imports

            const resolvedPath = path.resolve(path.dirname(filePath), importPath);
            const relativePath = path.relative(baseDir, resolvedPath);
            dependencies.push(relativePath.replace(/\\/g, '/'));
        }
    });

    return dependencies;
}

/**
 * Determines the expected header comment based on file extension.
 * @param {string} relativePath - The relative path of the file.
 * @returns {string|null} - The expected header comment.
 */
function getExpectedHeader(relativePath) {
    const ext = path.extname(relativePath);
    if (['.ts', '.tsx', '.js', '.jsx'].includes(ext)) {
        return `// ${relativePath}`;
    } else if (ext === '.css') {
        return `/* ${relativePath} */`;
    }
    return null;
}

/**
 * Checks if a file starts with the expected header comment.
 * @param {string} absolutePath - The absolute path to the file.
 * @param {string} relativePath - The relative path from the base directory.
 * @returns {boolean} - True if the header is correct, false otherwise.
 */
function hasCorrectHeader(absolutePath, relativePath) {
    // Skip self
    if (relativePath === 'promptHelper.js') {
        return true;
    }
    const expectedHeader = getExpectedHeader(relativePath);
    if (!expectedHeader) return true; // No need to check other file types

    try {
        const data = fs.readFileSync(absolutePath, 'utf8');
        const firstLine = data.split('\n')[0].trim();
        return firstLine === expectedHeader;
    } catch (err) {
        console.error(`Error reading file: ${absolutePath}`, err);
        return false;
    }
}

/**
 * Adds or corrects the expected header comment in a file.
 * @param {string} absolutePath - The absolute path to the file.
 * @param {string} relativePath - The relative path from the base directory.
 * @param {function} log - The logging function.
 */
function addHeader(absolutePath, relativePath, log) {
    const expectedHeader = getExpectedHeader(relativePath);
    if (!expectedHeader) return;

    try {
        const data = fs.readFileSync(absolutePath, 'utf8');
        const lines = data.split('\n');

        // Identify if the first line is a header comment
        const firstLine = lines[0].trim();
        const isHeaderComment = firstLine.startsWith('//') || firstLine.startsWith('/*');

        if (isHeaderComment) {
            // Replace the incorrect header comment with the correct one
            lines[0] = expectedHeader;
        } else {
            // Prepend the correct header if no header comment exists
            lines.unshift(expectedHeader);
        }

        const newData = lines.join('\n');
        fs.writeFileSync(absolutePath, newData, 'utf8');
        log(`Corrected or added header to: ${relativePath}`);
    } catch (err) {
        log(`Error writing to file: ${absolutePath}`, true);
    }
}


/**
 * Recursively traverses the directory, prints the structure, and lists dependencies.
 * Only traverses directories specified in ALLOWED_DIRECTORIES.
 * @param {string} dir - The current directory path.
 * @param {string} baseDir - The base directory path for relative paths.
 * @param {string} prefix - The prefix for tree-like formatting.
 * @param {function} log - The logging function.
 * @param {object} projectInfo - The object storing project information.
 */
function traverseDirectory(dir, baseDir, prefix = '', log, projectInfo) {
    let items;
    try {
        items = fs.readdirSync(dir);
    } catch (err) {
        log(`Error reading directory: ${dir}`, true);
        return;
    }
    const totalItems = items.length;

    items.forEach((item, index) => {
        const absolutePath = path.join(dir, item);
        const relativePath = path.relative(baseDir, absolutePath).replace(/\\/g, '/');
        const isLast = index === totalItems - 1;
        const pointer = isLast ? '└── ' : '├── ';
        const newPrefix = prefix + (isLast ? '    ' : '│   ');

        let stats;
        try {
            stats = fs.statSync(absolutePath);
        } catch (err) {
            log(`Error accessing: ${absolutePath}`, true);
            return;
        }

        if (stats.isDirectory()) {
            if (dir === baseDir) {
                if (ALLOWED_DIRECTORIES.has(item)) {
                    log(`${prefix}${pointer}${item}/`);
                    traverseDirectory(absolutePath, baseDir, newPrefix, log, projectInfo);
                }
            } else {
                // In subdirectories, traverse all directories
                log(`${prefix}${pointer}${item}/`);
                traverseDirectory(absolutePath, baseDir, newPrefix, log, projectInfo);
            }
        } else if (stats.isFile()) {
            if (dir === baseDir && (item === 'promptHelper.js' || item === 'promptHelper.txt')) {
                // Skip these files
                return;
            }

            const ext = path.extname(item);
            if (CHECK_EXTENSIONS.has(ext)) {
                if (!hasCorrectHeader(absolutePath, relativePath)) {
                    addHeader(absolutePath, relativePath, log);
                }

                log(`${prefix}${pointer}${item}`);

                // Collect and log dependencies
                const dependencies = getLocalDependencies(absolutePath, baseDir);
                if (dependencies.length > 0) {
                    log(`${newPrefix}    (Depends on: ${dependencies.join(', ')})`);
                }
            }
        }
    });
}

/**
 * Creates a logger that writes to both console and a write stream.
 * @param {string} filePath - The path to the log file.
 * @returns {function} - The logging function.
 */
function createLogger(filePath) {
    const stream = fs.createWriteStream(filePath, {flags: 'w', encoding: 'utf8'});

    /**
     * Logs a message to both console and the file.
     * @param {string} message - The message to log.
     * @param {boolean} [isError=false] - Whether the message is an error.
     */
    function log(message, isError = false) {
        if (isError) {
            console.error(message);
            stream.write(`ERROR: ${message}\n`);
        } else {
            console.log(message);
            stream.write(`${message}\n`);
        }
    }

    return log;
}

/**
 * Collects project information such as package manager, dependencies, and configurations.
 * @param {string} baseDir - The base directory of the project.
 * @param {object} projectInfo - The object to store collected information.
 */
function collectProjectInfo(baseDir, projectInfo) {
    // Check for package.json
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

    // Collect tsconfig.json info
    const tsconfigPath = path.join(baseDir, 'tsconfig.json');
    if (fs.existsSync(tsconfigPath)) {
        projectInfo.tsconfigJson = collectTsconfigInfo(tsconfigPath);
    } else {
        console.error('tsconfig.json not found.');
    }

    // Check for lock files to determine package manager
    if (fs.existsSync(path.join(baseDir, 'package-lock.json'))) {
        projectInfo.packageManager = 'npm';
    } else if (fs.existsSync(path.join(baseDir, 'yarn.lock'))) {
        projectInfo.packageManager = 'yarn';
    } else if (fs.existsSync(path.join(baseDir, 'pnpm-lock.yaml'))) {
        projectInfo.packageManager = 'pnpm';
    }

    // Check for ESLint configuration
    const eslintConfigs = ['.eslintrc.js', '.eslintrc.json', '.eslintrc', 'eslint.config.js'];
    for (const config of eslintConfigs) {
        if (fs.existsSync(path.join(baseDir, config))) {
            projectInfo.usesESLint = true;
            break;
        }
    }

    // Check for Webpack
    if (fs.existsSync(path.join(baseDir, 'webpack.config.js'))) {
        projectInfo.usesWebpack = true;
    }

    // Check for vite.config.js or vite.config.ts
    if (fs.existsSync(path.join(baseDir, 'vite.config.js')) || fs.existsSync(path.join(baseDir, 'vite.config.ts'))) {
        projectInfo.usesVite = true;
    }

    // Check for Babel
    if (fs.existsSync(path.join(baseDir, 'babel.config.js')) || fs.existsSync(path.join(baseDir, '.babelrc'))) {
        projectInfo.usesBabel = true;
    }

    // Check for testing frameworks
    if (fs.existsSync(path.join(baseDir, 'jest.config.js'))) {
        projectInfo.usesJest = true;
    }

    // Check for Dockerfile
    if (fs.existsSync(path.join(baseDir, 'Dockerfile'))) {
        projectInfo.usesDocker = true;
    }
}

/**
 * Logs the collected project information.
 * @param {object} projectInfo - The collected project information.
 * @param {function} log - The logging function.
 */
function logProjectInfo(projectInfo, log) {
    // Log package.json info
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

    // Log tsconfig.json info
    if (projectInfo.tsconfigJson) {
        log('\n## tsconfig.json and referenced configs found.');
        // Log compilerOptions, include, exclude, files, references
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

    // Log package manager
    if (projectInfo.packageManager) {
        log(`- Package manager detected: ${projectInfo.packageManager}`);
    } else {
        log('- No package manager lock file detected.');
    }

    // Log if project uses ESLint
    if (projectInfo.usesESLint) {
        log('- Project uses ESLint.');
    } else {
        log('- Project does not use ESLint.');
    }

    // Log if project uses Vite
    if (projectInfo.usesVite) {
        log('- Project uses Vite (vite.config.js or vite.config.ts found).');
    }

    // Log other tools
    if (projectInfo.usesWebpack) {
        log('- Project uses Webpack (webpack.config.js found).');
    }
    if (projectInfo.usesBabel) {
        log('- Project uses Babel (babel.config.js or .babelrc found).');
    }
    if (projectInfo.usesJest) {
        log('- Project uses Jest (jest.config.js found).');
    }
    if (projectInfo.usesDocker) {
        log('- Project uses Docker (Dockerfile found).');
    }
}

function appendPromptInstructions(log, projectInfo) {
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

/**
 * Entry point of the script.
 */
function main() {
    const baseDir = process.cwd();

    if (!fs.existsSync(baseDir) || !fs.statSync(baseDir).isDirectory()) {
        console.error('Error: The current working directory is not valid.');
        process.exit(1);
    }

    const logFilePath = path.join(baseDir, 'promptHelper.txt');
    const log = createLogger(logFilePath);

    const projectInfo = {};
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
