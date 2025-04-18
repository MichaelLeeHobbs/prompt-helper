// src/features/projectInfo/instructions.ts
import { ProjectInfo } from '../../types';

export function appendPromptInstructions(
    log: (msg: string) => void,
    projectInfo: ProjectInfo
): void {
    log('\n----------\n');
    if (projectInfo.otherNotes) {
        log(projectInfo.otherNotes);
    } else {
        log('## Other Notes:\n(i.e., additional information, steps, etc. that may be helpful. Remove this section if not needed.)');
    }

    log(`
## Code:
\`\`\`
[Include code snippets or references]
\`\`\`

Instructions:
- Please give the full updated code for any files that were changed in a Markdown code block.
- If you need additional context, code, or information, please ask before proceeding.
- Provide a summary of any issues found.
- Suggest improvements with code examples if possible.
`);
}
