// src/renders/instructionsRender.ts
import {ProjectInfo} from '../types';
import {metricsRender} from './metricsRender';
import {mdCodeBlockWrapper} from '../libs/mdCodeBlockWrapper';

const SECTION = '\n---\n';

/**
 * Appends project metadata summaries and developer instructions to the provided Logger.
 *
 * @param log - A Logger function used to output structured information.
 * @param projectInfo - The project metadata to render into instructions.
 */
export function appendPromptInstructions(log: (msg: string) => void, projectInfo: ProjectInfo): void {
  log(SECTION);

  // Style
  log('## Style:');
  if (projectInfo.styleText) {
    log(projectInfo.styleText);
  }
  log(SECTION);

  // Notes
  log('## Other Notes:');
  log(projectInfo.otherNotes || '- (none)');

  // TO DO / FIX ME - keep separated to avoid IDE lint triggers
  if (projectInfo.todos?.length) {
    log(SECTION);
    log('## TODOs & FIXMEs:');
    projectInfo.todos.forEach(item => {
      log(`- ${item.file}:${item.line} → ${item.text}`);
    });
  }

  // Dependency Graph
  if (projectInfo.dependencyGraph) {
    log(SECTION);
    log('## Dependency Graph (JSON):');
    log(mdCodeBlockWrapper(JSON.stringify(projectInfo.dependencyGraph, null, 2), 'json'));
  }

  // Unused files
  if (projectInfo.unusedFiles?.length) {
    log(SECTION);
    log('## Unused Files:');
    projectInfo.unusedFiles.forEach(f => log(`- ${f}`));
  }

  // Metrics (Complexity)
  if (projectInfo.metrics?.length) {
    log(SECTION);
    log(metricsRender(projectInfo));
  }

  // Code Snippets
  log(SECTION);
  log('## Code:');
  if (projectInfo.codeSnippets?.length) {
    projectInfo.codeSnippets.forEach(snip => {
      log(`\n### ${snip.file}`);
      log(mdCodeBlockWrapper(snip.code));
    });
  } else {
    log(mdCodeBlockWrapper('[Include code snippets or references via `--code` flag]'));
  }

  // Prompt Instructions
  log(SECTION);
  log('## Instructions:');
  log('- Please give the full updated code for any files that were changed in a Markdown code block.');
  log('- If you need additional context, code, or information, please ask before proceeding.');
  log('- Provide a summary of any issues found.');
  log('- Suggest improvements with code examples if possible.');
}
