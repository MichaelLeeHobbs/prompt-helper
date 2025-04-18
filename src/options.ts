// src/options.ts
import {Command} from 'commander';

/**
 * Shape of CLI options parsed from flags.
 */
export interface Options {
  dir: string;
  out: string;
  style?: string;
  code: string[];
  todos?: boolean;
  complexity?: boolean;
  dependencyGraph?: boolean;
  json?: boolean;
}

function collectCodePath(value: string, previous: string[]): string[] {
  return previous.concat([value]);
}

/**
 * Parses command-line arguments using Commander and returns structured options.
 *
 * @returns CLI flags parsed into a structured options object.
 */
export function getOptions(): Options {
  const program = new Command();

  program
    .name('prompt-helper')
    .description('Generate a promptHelper markdown summary of your project')
    .version('1.0.0')
    .option('-d, --dir <path>', 'base directory to scan', process.cwd())
    .option('-o, --out <file>', 'output markdown filename', 'promptHelper.md')
    .option('-s, --style <path>', 'path to style markdown file')
    .option('-c, --code <path>', 'path to code file to include', collectCodePath, [])
    .option('--todos', 'scan for TODO and FIXME comments')
    .option('--complexity', 'append complexity & metrics report')
    .option('--dependency-graph', 'include a JSON dependency graph')
    .option('--json', 'also emit a `.json` manifest alongside the markdown')
    .parse(process.argv);

  return program.opts<Options>();
}
