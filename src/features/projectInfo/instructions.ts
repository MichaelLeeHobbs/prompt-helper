// src/features/projectInfo/instructions.ts

import { ProjectInfo } from '../../types';

const SECTION = '\n---\n';

const metericsHeader = `
## FTA Complexity & Metrics:
|-----------|-------------------------------------------|
| FTA Score | Assessment                                |
|-----------|-------------------------------------------|
| > 60      | Needs Improvement - Difficult to maintain |
| 50 - 60   | Could be better - Reasonably maintainable |
| 40 - 50   | Good - Maintainable                       |
| < 40      | Very Good - Easy to maintain              |
|-----------|-------------------------------------------|

|-----------------------------------|------------------------------------------------------------|
| Measure Name                      | Description                                                |
|-----------------------------------|------------------------------------------------------------|
| Difficulty (D)                    | How hard it is to understand the code.                     |
| Effort (E)                        | How much logical work is required to write this code.      |
| Time required to program (T)      | How long it might take to write the code.                  |
| Bugs predicted (B)                | How buggy the code is likely to be.                        |
| Cyclomatic complexity (C)         | The number of linearly independent paths through the code. |
| Line count (L)                    | The number of lines of code in the file.                   |
|-----------------------------------|------------------------------------------------------------|
`;

export function appendPromptInstructions(log: (msg: string) => void, projectInfo: ProjectInfo): void {
  log(SECTION);

  // Style
  log('## Style:');
  if (projectInfo.styleText) log(projectInfo.styleText);
  log('');

  // Notes
  log('## Other Notes:');
  log(projectInfo.otherNotes || '- (none)');

  // TO DO / FIX ME - keep the words separated with spaces to avoid triggering the IDE or linter
  if (projectInfo.todos) {
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
    log('```json');
    log(JSON.stringify(projectInfo.dependencyGraph, null, 2));
    log('```');
  }

  // Unused files
  if (projectInfo.unusedFiles) {
    log(SECTION);
    log('## Unused Files:');
    projectInfo.unusedFiles.forEach(f => log(`- ${f}`));
  }

  // Metrics (Complexity)
  if (projectInfo.metrics) {
    log(SECTION);
    log(metericsHeader);
    projectInfo.metrics
      .sort(a => a.fta_score)
      .forEach(m => {
        log(
          `- ${m.file_name}: D=${Math.round(m.halstead.difficulty)}, E=${Math.round(m.halstead.effort)} T=${Math.round(m.halstead.time)} B=${Math.round(m.halstead.bugs)} C=${m.cyclo}, L=${m.line_count}, Score=${Math.round(m.fta_score)}, Assessment=${m.assessment}`
        );
      });
  }

  // Code snippets
  log(SECTION);
  log('## Code:');
  if (projectInfo.codeSnippets?.length) {
    projectInfo.codeSnippets.forEach(snip => {
      log(`\n### ${snip.file}`);
      log('```');
      log(snip.code);
      log('```');
    });
  } else {
    log('```');
    log('[Include code snippets or references via `--code` flag]');
    log('```');
  }

  // Instructions
  log(SECTION);
  log('## Instructions:');
  log('- Please give the full updated code for any files that were changed in a Markdown code block.');
  log('- If you need additional context, code, or information, please ask before proceeding.');
  log('- Provide a summary of any issues found.');
  log('- Suggest improvements with code examples if possible.');
}
