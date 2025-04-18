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

| Command                                | Description                                                                 |
|----------------------------------------|-----------------------------------------------------------------------------|
| `prompt-helper`                        | Scan current directory and generate `promptHelper.md`.                      |
| `prompt-helper -d, --dir <path>`       | Specify a different base directory to scan (defaults to current directory). |
| `prompt-helper -o, --out <file>`       | Specify output filename (defaults to `promptHelper.md`).                    |
| `prompt-helper -s, --style <style.md>` | Include a `style.md` file to inject a **## Style:** section.                |
| `prompt-helper -c, --code <file        | dir>`                                                                       | Include a specific code file or all files in a directory under a **## Code:** section.               |
| `prompt-helper --help`                 | Display help and all available options.                                     |

## Example Usage

```bash
# Basic scan
prompt-helper

# Scan a different folder and output to custom.md
prompt-helper --dir ./my-app --out custom.md

# Inject style guide
prompt-helper --style ./promptHelper/style.md

# Include two code snippets
prompt-helper --code src/index.ts --code src/utils/
```

## Example Output

```markdown
# Project: prompt-helper

## Directory Structure:

prompt-helper/
├── jest.config.ts
└── src/
├── features/
│ ├── fileStructure/
│ └── projectInfo/
...and so on

## Package.json info:

### Type: Not specified

### Dependencies:

commander: ^13.1.0
jsonc-parser: ^3.3.1
typescript: ^5.7.2

### DevDependencies:

@eslint/js: ^9.17.0
@types/jest: ^29.5.14
...and so on

## Style:

...style.md content...

## Code:

### src/index.ts

   ```ts
   // code here
   \```

### src/utils/helper.ts
   ```ts
   // code here
   \```

---

## Instructions:
- Please give the full updated code for any files that were changed in a Markdown code block.
- If you need additional context, code, or information, please ask before proceeding.
- Provide a summary of any issues found.
- Suggest improvements with code examples if possible.
```

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

## Planned Features

- Full test suite with coverage reporting.
- Expanded support for non‑JS/TS files (e.g., Python, Go).
- Include/exclude globs for fine‑grained control.
- Plugin system for custom metadata collectors.

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

## Contributing

Contributions are welcome! Please:

1. Fork the repo.
2. Create a branch for your feature or bugfix.
3. Send a pull request.

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for
details.

## Acknowledgments

- Inspired by common project analysis tools.
- Built with TypeScript, Node.js, and modern best practices.
- Thanks to ChatGPT for initial design and guidance.

