// src/modules/headers/style.ts
import path from 'path';

/**
 * Returns the expected comment-style file header for a given relative file path,
 * based on its extension or known filename.
 *
 * @param relativePath - The relative file path from project root.
 * @returns A header string (with comment syntax), or null if not applicable.
 */
export function getExpectedHeader(relativePath: string): string | null {
  const basename = path.basename(relativePath);
  const ext = path.extname(relativePath).toLowerCase();

  // Special filenames without extensions
  if (['Dockerfile', 'Makefile', 'CMakeLists.txt'].includes(basename)) {
    return `# ${relativePath}`;
  }

  // Map extensions to comment styles: [prefix, suffix]
  const styleMap: Record<string, [string, string]> = {
    // JavaScript / TypeScript
    '.ts': ['// ', ''],
    '.tsx': ['// ', ''],
    '.js': ['// ', ''],
    '.jsx': ['// ', ''],
    '.mjs': ['// ', ''],

    // Compiled languages
    '.go': ['// ', ''],
    '.java': ['// ', ''],
    '.cs': ['// ', ''],
    '.cpp': ['// ', ''],
    '.cc': ['// ', ''],
    '.cxx': ['// ', ''],
    '.c': ['// ', ''],

    // JSON with comments
    '.jsonc': ['// ', ''],

    // Shell & scripting languages
    '.sh': ['# ', ''],
    '.bash': ['# ', ''],
    '.zsh': ['# ', ''],
    '.py': ['# ', ''],
    '.rb': ['# ', ''],
    '.pl': ['# ', ''],
    '.tcl': ['# ', ''],
    '.ps1': ['# ', ''],

    // Windows batch
    '.bat': ['REM ', ''],
    '.cmd': ['REM ', ''],

    // Stylesheets
    '.css': ['/* ', ' */'],
    '.scss': ['/* ', ' */'],
    '.sass': ['/* ', ' */'],
    '.less': ['/* ', ' */'],

    // Markup & documentation
    '.html': ['<!-- ', ' -->'],
    '.htm': ['<!-- ', ' -->'],
    '.xml': ['<!-- ', ' -->'],
    '.md': ['<!-- ', ' -->'],

    // Config files
    '.yaml': ['# ', ''],
    '.yml': ['# ', ''],
    '.toml': ['# ', ''],
    '.ini': ['; ', ''],
  };

  const style = styleMap[ext];
  if (!style) {
    return null;
  }

  const [prefix, suffix] = style;
  return `${prefix}${relativePath}${suffix}`;
}
