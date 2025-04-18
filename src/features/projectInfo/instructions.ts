// src/features/projectInfo/instructions.ts
import {ProjectInfo} from '../../types';

const codeBlock = (code: string = '[Include code snippets or references]') => `
## Code:
\`\`\`
${code}
\`\`\`
`

const instructions =  `
## Instructions:
- Please give the full updated code for any files that were changed in a Markdown code block.
- If you need additional context, code, or information, please ask before proceeding.
- Provide a summary of any issues found.
- Suggest improvements with code examples if possible.
`

export function appendPromptInstructions(log: (msg: string) => void, projectInfo: ProjectInfo): void {
    log('\n----------\n');

    log('## Other Notes: (<root>/promptHelper/notes.md)');
    if (projectInfo.otherNotes) {
        log(projectInfo.otherNotes);
    } else {
        log('- (i.e., additional information, steps, etc. that may be helpful. Remove this section if not needed.)');
    }

    log(''); // Add a blank line for better readability

    // Style section
    log('## Style: (<root>/promptHelper/style.md)');
    if (projectInfo.styleText) {
        log(projectInfo.styleText);
    }

    log(''); // Add a blank line for better readability
    log(codeBlock(/* TODO: add support for code collection */));
    log(''); // Add a blank line for better readability
    log(instructions);
}
