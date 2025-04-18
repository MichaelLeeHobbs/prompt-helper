# Prompt-Helper

Prompt-Helper is a command-line tool for **JavaScript** and **TypeScript** projects designed to streamline the process of generating prompts based on your project's files and configuration settings. It automatically scans your project directory, extracts relevant metadata, and generates meaningful prompts to assist in tasks like generating documentation, summaries, or code comments.

## Features

- **File Header Management:** Automatically checks and adds file headers.
- **Project Analysis:** Collects information from `package.json`, `tsconfig.json`, and other common configuration files.
- **Local Dependency Tracking:** Analyzes imports and dependencies within your project.
- **Directory Structure Visualization:** Prints a tree-like structure of your project.
- **Customizable Logs:** Outputs logs to both console and file.

## Installation

### Using [npm](https://www.npmjs.com/)

To install globally:

```bash
npm install -g prompt-helper
```

To install locally:

```bash
npm install prompt-helper
```

If installed locally, run using:

```bash
npx prompt-helper
```

### Using [Yarn](https://yarnpkg.com/)

To install globally:

```bash
yarn global add prompt-helper
```

To install locally:

```bash
yarn add prompt-helper
```

If installed locally, run using:

```bash
yarn prompt-helper
```

### Using [pnpm](https://pnpm.io)

To install globally:

```bash
pnpm add -g prompt-helper
```

To install locally:

```bash
pnpm add prompt-helper
```

If installed locally, run using:

```bash
pnpm prompt-helper
```

## Usage

Run the tool from your project root:

```bash
prompt-helper
```

If installed locally, use:

```bash
npx prompt-helper
```

### Options

- No additional arguments are required; the tool automatically scans the current directory.

## Example Output

```markdown
# Project: prompt-helper

## Directory Structure:

prompt-helper/
├── jest.config.ts
└── src/
    ├── features/
    │   ├── fileStructure/
    │   │   ├── collector.ts (Depends on: src/types, src/modules/dependencies, src/modules/headers)
    │   │   ├── index.ts (Depends on: src/features/fileStructure/collector, src/features/fileStructure/renderer)
    │   │   └── renderer.ts (Depends on: src/types)
    │   └── projectInfo/
    │       ├── collectors/
    │       │   ├── codeCollector.ts (Depends on: src/types)
    │       │   ├── notesCollector.ts (Depends on: src/types)
    │       │   ├── packageJsonCollector.ts (Depends on: src/types)
    │       │   ├── styleCollector.ts (Depends on: src/types)
    │       │   ├── toolDetector.ts (Depends on: src/types)
    │       │   └── tsconfigCollector.ts (Depends on: src/modules/tsconfig, src/types)
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

## tsconfig.json and referenced configs found:
### CompilerOptions:
  target: "ES2020"
  module: "commonjs"
  resolveJsonModule: true
  ...and so on

## Project Info:
- Package manager detected: pnpm
- Project uses ESLint.
- Project uses Jest.

---

## Style: (<root>/promptHelper/style.md)
### 1. Line Length

- **Maximum**: 160 characters per line.
- If a statement (including imports, function signatures, etc.) would exceed 160 chars, you may break it onto multiple lines—otherwise keep it on one line.

---

### 2. Function Signatures & Calls

- **Single‑line** signatures unless the entire declaration exceeds 160 chars.
- **No extra indentation** for parameters on new lines—if you must wrap, align subsequent lines under the opening `(`.

**Bad (always multi‑line):**
...and so on

---

## Code:

### src/features/fileStructure/collector.ts
...code files in Markdown code blocks...

---


## Instructions:
- Please give the full updated code for any files that were changed in a Markdown code block.
- If you need additional context, code, or information, please ask before proceeding.
- Provide a summary of any issues found.
- Suggest improvements with code examples if possible.


```

## Planned Features
- Test with full coverage.
- Add support for more file types and configurations.
- Add support including/excluding specific files, directories, or configurations.
- I am sure there are a lot of other common tools that I am not aware of, so I would like to hear from you about what you would like to see in this tool.

## Development

1. Clone the repository:

    ```bash
    git clone https://github.com/yourusername/prompt-helper.git
    ```

2. Install dependencies:

    ```bash
    pnpm install
    ```

3. Build the project:

    ```bash
    pnpm run build
    ```

4. Run locally:

    ```bash
    pnpm start
    ```

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Inspired by common project management tools.
- Built with TypeScript, Node.js, and modern best practices.
- ChatGPT for the idea and initial implementation.
