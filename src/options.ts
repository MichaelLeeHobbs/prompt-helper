// src/options.ts
import {Command} from 'commander';
import {getPackageVersion} from './libs/getPackageVersion';


/**
 * Shape of CLI options parsed from flags.
 */
export interface Options {
  dir: string;
  out: string;
  style?: string;
  code: string[];
  ignore: string[];
  todos?: boolean;
  complexity?: boolean;
  dependencyGraph?: boolean;
  json?: boolean;
}

function collectPathArray(value: string, previous: string[]): string[] {
  return previous.concat([value]);
}

/**
 * Parses command-line arguments using Commander and returns structured options.
 *
 * @returns CLI flags parsed into a structured options object.
 */
export function getOptions(): Options {
  const program = new Command();
  const projectVersion = getPackageVersion();

  program
    .name('prompt-helper')
    .description('Generate a promptHelper markdown summary of your project')
    .version(projectVersion)
    .option('-d, --dir <path>', 'base directory to scan', process.cwd())
    .option('-o, --out <file>', 'output markdown filename', 'promptHelper.md')
    .option('-s, --style <path>', 'path to style markdown file')
    .option('-c, --code <path>', 'path to code file or directory to include', collectPathArray, [])
    .option('-i, --ignore <pattern>', 'glob pattern of files/directories to ignore from --code', collectPathArray, [])
    .option('--todos', 'scan for TODO and FIXME comments')
    .option('--complexity', 'append complexity & metrics report')
    .option('--dependency-graph', 'include a JSON dependency graph')
    .option('--json', 'also emit a `.json` manifest alongside the markdown')
    .parse(process.argv);

  return program.opts<Options>();
}
