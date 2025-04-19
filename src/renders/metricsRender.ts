// src/renders/metricsRender.ts

import {ProjectInfo} from '../types';
import {padMiddle} from '../libs/padMiddle';

/**
 * Builds the static portion of the metrics section, with variable-width headers.
 */
const metricsHeader = (longestAssessment: number, longestFileName: number): string => {
  const assessmentHeader = padMiddle('Assessment', longestAssessment + 2);
  const fileHeader = padMiddle('File Name', longestFileName + 2);

  const bands = [
    {label: '> 60', description: 'Needs Improvement - Difficult to maintain'},
    {label: '50 - 60', description: 'Could be better - Reasonably maintainable'},
    {label: '40 - 50', description: 'Good - Maintainable'},
    {label: '< 40', description: 'Very Good - Easy to maintain'},
  ];

    const bandRows = bands.map(({label, description}) => `|${padMiddle(label, 11)}| ${description.padEnd(41, ' ')} |`).join('\n');

    return `## FTA Complexity & Metrics:

| FTA Score |${padMiddle('Assessment', 43)}|
|-----------|-------------------------------------------|
${bandRows}

| Measure Name                   | Description                                                |
|--------------------------------|------------------------------------------------------------|
| Difficulty (D)                 | How hard it is to understand the code.                     |
| Effort (E)                     | How much logical work is required to write this code.      |
| Time required to program (T)   | How long it might take to write the code.                  |
| Bugs predicted (B)             | How buggy the code is likely to be.                        |
| Cyclomatic complexity (C)      | The number of linearly independent paths through the code. |
| Line count (L)                 | The number of lines of code in the file.                   |

|  D  |   E   |   T   |  B  |  C  |  L  | Score |${assessmentHeader}|${fileHeader}|
|-----|-------|-------|-----|-----|-----|-------|${'-'.repeat(longestAssessment + 2)}|${'-'.repeat(longestFileName + 2)}|`;
};

/**
 * Renders a markdown-formatted table of FTA complexity metrics.
 *
 * @param projectInfo - The full project analysis context.
 * @returns Markdown string or empty if no metrics are available.
 */
export function metricsRender(projectInfo: ProjectInfo): string {
  if (!projectInfo.metrics || projectInfo.metrics.length === 0) {
    return '';
  }

  const longestAssessment = projectInfo.metrics.reduce((max, {assessment}) => Math.max(max, assessment.length), 'Assessment'.length);

  const longestFileName = projectInfo.metrics.reduce((max, {file_name}) => Math.max(max, file_name.length), 'File Name'.length);

  const header = metricsHeader(longestAssessment, longestFileName);

  const rows = projectInfo.metrics
    .sort((a, b) => b.fta_score - a.fta_score)
    .map(({file_name, halstead, cyclo, line_count, fta_score, assessment}) => {
      const {difficulty, effort, time, bugs} = halstead;
      const r = (n: number, pad: number) => Math.round(n).toString().padStart(pad, ' ');
      const d = r(difficulty, 3);
      const e = r(effort, 5);
      const t = r(time, 5);
      const b = r(bugs, 3);
      const c = r(cyclo, 3);
      const lc = r(line_count, 3);
      const score = r(fta_score, 5);
      const a = padMiddle(assessment, longestAssessment);
      const fn = padMiddle(file_name, longestFileName);
      return `| ${d} | ${e} | ${t} | ${b} | ${c} | ${lc} | ${score} | ${a} | ${fn} |`;
    });

  return `${header}\n${rows.join('\n')}`;
}
