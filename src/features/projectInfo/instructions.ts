// src/features/projectInfo/instructions.ts
import {ProjectInfo} from '../../types';

const generateCodeFile = (file: string, code: string = '[Include code snippets or references]') => `
### ${file}
\`\`\`
${code}
\`\`\``

const instructions =  `
## Instructions:
- Please give the full updated code for any files that were changed in a Markdown code block.
- If you need additional context, code, or information, please ask before proceeding.
- Provide a summary of any issues found.
- Suggest improvements with code examples if possible.
`

const SECTION_SEPARATOR = '\n---\n';
const SINGLE_LINE_BREAK = ''; // The logger will add a line break after each log message


export function appendPromptInstructions(log: (msg: string) => void, projectInfo: ProjectInfo): void {
    log(SECTION_SEPARATOR);

    // Style section
    log('## Style: (<root>/promptHelper/style.md)');
    if (projectInfo.styleText) {
        log(projectInfo.styleText);
    }
    log(SINGLE_LINE_BREAK); // Add a blank line for better readability

    // Notes section
    log('## Other Notes: (<root>/promptHelper/notes.md)');
    log(projectInfo.otherNotes || '- (i.e., additional information, steps, etc. that may be helpful. Remove this section if not needed.)');

    log(SECTION_SEPARATOR);

    // Code section
    log('## Code:');
    if (projectInfo.codeSnippets?.length) {
        for (const { file, code } of projectInfo.codeSnippets) {
            log('');
            log(generateCodeFile(file, code));
        }
    } else {
        log(generateCodeFile('example.ext', '[Include code snippets or references. Use the --code path/file.ext option to include code snippets. This flag can be called multiple times for multiple files.]'));
    }

    log(SECTION_SEPARATOR);

    // Instructions section
    log(instructions);
}
