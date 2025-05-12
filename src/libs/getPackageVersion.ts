// src/libs/getPackageVersion.ts
import * as fs from 'fs';
import * as path from 'path';

/**
 * Reads the version from the project's package.json file.
 * This function assumes that the compiled JavaScript file (e.g., getPackageVersion.js)
 * will be located in a subdirectory relative to the project root (like `dist/libs/`),
 * such that `../../package.json` from `__dirname` correctly points to the
 * project root's `package.json`.
 *
 * @returns {string} The project version string (e.g., "1.2.3") as defined in
 * `package.json`, or the string "unknown" if the version cannot be
 * determined or an error occurs during file access or parsing.
 */
export function getPackageVersion(): string {
  try {
    // Path resolution explanation:
    // If this file (getPackageVersion.ts) is in `src/libs/`, and compiled to `dist/libs/getPackageVersion.js`:
    // `__dirname` (inside the compiled `dist/libs/getPackageVersion.js`) will be `project_root/dist/libs`.
    // `path.resolve(__dirname, '../../package.json')` then correctly resolves to `project_root/package.json`.
    const packageJsonPath = path.resolve(__dirname, '../../package.json');

    if (fs.existsSync(packageJsonPath)) {
      const packageJsonContent = fs.readFileSync(packageJsonPath, 'utf8');
      const packageJson = JSON.parse(packageJsonContent);
      return packageJson.version || 'unknown';
    } else {
      // This case might occur if the path resolution is incorrect or package.json is genuinely missing.
      console.warn(`Warning: package.json not found at expected path: ${packageJsonPath}`);
    }
  } catch (error) {
    // Log as a warning because the CLI might still be functional for other tasks
    // even if its own version cannot be determined for the --version flag.
    console.warn('Warning: Error reading package.json for version:', error);
  }
  return 'unknown'; // Fallback version
}
