# Prompt-Helper

Prompt-Helper is a command-line tool designed to streamline the process of generating prompts based on your project's files and configuration settings. It automatically scans your project directory, extracts relevant metadata, and generates meaningful prompts to assist in tasks like generating documentation, summaries, or code comments.

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

```plaintext
# Project: prompt-helper

## Directory Structure:

prompt-helper/
├── jest.config.ts
├── src/
│   ├── dependencies.ts
│   ├── headers.ts
│   ├── index.ts
│   │       (Depends on: src/logger, src/types, src/projectInfo, src/traverse)
│   ├── logger.ts
│   ├── projectInfo.ts
│   │       (Depends on: src/types, src/tsconfig)
│   ├── traverse.ts
│   │       (Depends on: src/types, src/dependencies, src/headers)
│   ├── tsconfig.ts
│   │       (Depends on: src/types)
│   └── types.ts

## Package.json info:
### Type: Not specified
### Dependencies:
  typescript: ^5.7.2
### DevDependencies:
  @eslint/js: ^9.17.0
  @types/jest: ^29.5.14
  @types/node: ^22.10.2
  eslint: ^9.17.0
  eslint-config-prettier: ^9.1.0
  eslint-plugin-prettier: ^5.2.1
  globals: ^15.13.0
  prettier: ^3.4.2
  typescript-eslint: ^8.18.1

## tsconfig.json and referenced configs found.

## Project Info:
- Package manager detected: pnpm
- Project uses ESLint.
- Project uses Jest.

----------

## Other Notes
- This is an example of a markdown file that can be used to provide additional information.
```

## Planned Features
- Test with full coverage.
- Add support for more file types and configurations.
- Add support including/excluding specific files, directories, or configurations.

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
