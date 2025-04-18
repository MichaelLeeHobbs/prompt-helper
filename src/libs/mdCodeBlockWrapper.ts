// src/libs/mdCodeBlockWrapper.ts
/**
 * Wraps a string in a fenced Markdown code block.
 *
 * @param code - The raw code content to wrap.
 * @param language - Optional language identifier for syntax highlighting.
 * @returns The code wrapped in a Markdown ``` block.
 */
export function mdCodeBlockWrapper(code: string, language = ''): string {
  return `\`\`\`${language}\n${code}\n\`\`\``;
}
