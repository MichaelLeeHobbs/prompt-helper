# Prompt-Helper

Prompt-Helper is a command-line tool for **JavaScript** and **TypeScript**
projects designed to streamline the process of generating prompts based on your
project's files and configuration settings. It automatically scans your project
directory, extracts relevant metadata, and generates meaningful prompts to
assist in tasks like generating documentation, summaries, or code comments.

> ⚠️ **Limited support for non‑JS/TS files**: The tool’s import‑dependency
> analysis and header management rely on parsing `.js`/`.ts` modules. Other file
> types (e.g., `.py`, `.go`, `.java`) may be scanned but their dependencies will
> not be resolved, and `Depends on:` annotations will not appear.

## Features

- **File Header Management:** Automatically checks and adds file headers. ex:
  `// src/index.ts`. This is useful for ensuring AI understands the context of
  the code.
- **Project Analysis:** Collects information from `package.json`,
  `tsconfig.json`, and other common configuration files.
- **Local Dependency Tracking:** Analyzes imports and dependencies within your
  JS/TS project.
- **Directory Structure Visualization:** Prints a tree-like structure of your
  project.
- **Custom Code Snippets:** Include specific code files or entire directories
  via `--code` flags.
- **Style Injection:** Embed a `style.md` section to enforce code conventions.
- **TODO/FIXME Scanning:** Extract inline comments marked for follow-up.
- **Code Complexity Metrics:** Adds FTA-based stats like cyclomatic complexity,
  bugs, and effort.
- **Dependency Graph Output:** Include a `dependencyGraph` section and track
  unused files.
- **JSON Output:** Emit a machine-readable JSON alongside the markdown summary.
- **Customizable Logs:** Outputs logs to both console and file.

## Installation

Install globally or locally using your package manager of choice:

```bash
# npm
npm install -g prompt-helper
npm install prompt-helper

# yarn
yarn global add prompt-helper
yarn add prompt-helper

# pnpm
pnpm add -g prompt-helper
pnpm add prompt-helper
```

If installed locally, run with the runner for your package manager:

```bash
npx prompt-helper          # npm
yarn prompt-helper         # yarn
pnpm prompt-helper         # pnpm
```

## Commands

| Command                  | Description                                                                                                        |
|--------------------------|--------------------------------------------------------------------------------------------------------------------|
| `prompt-helper`          | Scan current directory and generate `promptHelper.md`.                                                             |
| `-d, --dir <path>`       | Specify a different base directory to scan (defaults to current directory).                                        |
| `-o, --out <file>`       | Specify output filename (defaults to `promptHelper.md`).                                                           |
| `-s, --style <style.md>` | Include a `style.md` file to inject a **## Style:** section.                                                       |
| `-c, --code <file/dir>`  | Include a specific code file or all files in a directory under a **## Code:** section. Can be used multiple times. |
| `-i, --ignore <pattern>` | Glob pattern of files/directories to exclude from `--code` snippets. Can be used multiple times.                   |
| `--todos`                | Scan codebase for `TODO:` and `FIXME:` comments.                                                                   |
| `--complexity`           | Analyze complexity metrics (Halstead, cyclomatic, bugs, time, effort).                                             |
| `--dependency-graph`     | Collect and output the full dependency graph and unused file list.                                                 |
| `--json`                 | Also write a `promptHelper.json` alongside the markdown summary.                                                   |
| `--help`                 | Display help and all available options.                                                                            |

## Example Usage

```bash
# Basic scan
prompt-helper

# Scan a different folder and output to custom.md
prompt-helper --dir ./my-app --out custom.md

# Inject style guide
prompt-helper --style ./promptHelper/style.md

# Include code snippets from src, but ignore test files and a specific utility
prompt-helper --code src/entry.ts --code src/utils/ --ignore "*.test.ts" --ignore "src/utils/old-util.js"

# Include TODO comments and complexity analysis
prompt-helper --todos --complexity

# Include full dependency graph and export as JSON
prompt-helper --dependency-graph --json
```

## Example Output

See [`example.md`](example.md) for a sample output.

---

## Changes

### v1.0.0

- Initial release with basic JS/TS scanning, header management, and dependency
  tracking.

### v2.0.0

- Major refactor of the codebase to improve maintainability and readability.
- Breaking change: `<root>/promptHelperNotes.md` is now
  `<root>/promptHelper/notes.md`.
- Added `--style` and `--code` support; refactored features into separate
  modules.
- Recursive directory support for `--code`; improved error handling for
  ambiguous paths.
- 🚀 Added support for:
    - `--todos` and `--complexity` metrics
    - `--dependency-graph` collection and unused file detection
    - `--json` output for machine-friendly workflows

### v2.1.0

- **Feature:** Added `--ignore <pattern>` CLI option to exclude files or glob
  patterns from the code snippets collected by `--code`. This allows for more
  fine-grained control over what code is included in the output.
- Dependency: Added `micromatch` for glob pattern matching.

---

## Planned Features

- Full test suite with coverage reporting.
- Expanded support for non‑JS/TS files (e.g., Python, Go).
- ~~Include/exclude globs for fine‑grained control.~~ (Partially addressed with
  `--ignore`. Further include patterns could be added.)
- Plugin system for custom metadata collectors.

---

## Development

1. Clone the repo:

    ```bash
    git clone https://github.com/yourusername/prompt-helper.git
    ```

2. Install dependencies:

    ```bash
    pnpm install
    ```

3. Build:

    ```bash
    pnpm run build
    ```

4. Run locally:

    ```bash
    pnpm start
    ```

---

## Contributing

Contributions are welcome! Please:

1. Fork the repo.
2. Create a branch for your feature or bugfix.
3. Send a pull request.

---

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for
details.

---

## Acknowledgments

- Inspired by common project analysis tools.
- Built with TypeScript, Node.js, and modern best practices.
- This was Vibecoded with ChatGPT.


