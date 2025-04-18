# Project: prompt-helper

## Directory Structure:

```markdown
prompt-helper/
├── jest.config.ts
└── src/
├── collectors/
│ ├── codeCollector.ts (Depends on: src/types)
│ ├── dependenciesCollector.ts
│ ├── fileStructureCollector.ts (Depends on: src/types,
src/collectors/dependenciesCollector, src/modules/headers)
│ ├── graphCollector.ts (Depends on: src/types,
src/collectors/fileStructureCollector)
│ ├── metricsCollector.ts (Depends on: src/types)
│ ├── notesCollector.ts (Depends on: src/types)
│ ├── packageJsonCollector.ts (Depends on: src/types)
│ ├── projectInfoCollector.ts (Depends on: src/types,
src/collectors/packageJsonCollector, src/collectors/notesCollector,
src/collectors/tsconfigCollector, src/collectors/toolsCollector,
src/collectors/styleCollector, src/collectors/codeCollector,
src/collectors/todoCollector, src/collectors/metricsCollector,
src/collectors/graphCollector, src/collectors/unusedCollector)
│ ├── styleCollector.ts (Depends on: src/types)
│ ├── todoCollector.ts (Depends on: src/types)
│ ├── toolsCollector.ts (Depends on: src/types)
│ ├── tsconfigCollector.ts (Depends on: src/types)
│ └── unusedCollector.ts (Depends on: src/types)
├── index.ts (Depends on: src/options, src/logger, src/types,
src/collectors/projectInfoCollector, src/collectors/fileStructureCollector,
src/renders/fileTreeRender, src/renders/projectInfoRenderer,
src/renders/instructionsRender)
├── libs/
│ ├── mdCodeBlockWrapper.ts
│ └── padMiddle.ts
├── logger.ts
├── modules/
│ └── headers/
│ ├── index.ts
│ ├── style.ts
│ ├── validator.ts (Depends on: src/modules/headers/style)
│ └── writer.ts (Depends on: src/modules/headers/style)
├── options.ts
├── renders/
│ ├── fileTreeRender.ts (Depends on: src/types)
│ ├── instructionsRender.ts (Depends on: src/types, src/renders/metricsRender,
src/libs/mdCodeBlockWrapper)
│ ├── metricsRender.ts (Depends on: src/types, src/libs/padMiddle)
│ └── projectInfoRenderer.ts (Depends on: src/types)
└── types/
├── index.ts
├── metrics.ts
├── projectInfo.ts (Depends on: src/types/tsconfig, src/types/todo,
src/types/metrics, src/types/index)
├── todo.ts
└── tsconfig.ts
```

## Package.json info:

### Type: Not specified

### Dependencies:

- commander: ^13.1.0
- fta-cli: ^2.0.1
- jsonc-parser: ^3.3.1
- typescript: ^5.7.2

### DevDependencies:

- @eslint/js: ^9.17.0
- @types/jest: ^29.5.14
- @types/node: ^22.10.2
- eslint: ^9.17.0
- eslint-config-prettier: ^9.1.0
- eslint-plugin-prettier: ^5.2.1
- globals: ^15.13.0
- prettier: ^3.4.2
- ts-node: ^10.9.2
- typescript-eslint: ^8.18.1

## tsconfig.json and referenced configs found:

### CompilerOptions:

- target: "ES2020"
- module: "commonjs"
- typeRoots: ["./node_modules/@types","./src/types"]
- resolveJsonModule: true
- sourceMap: true
- outDir: "dist"
- esModuleInterop: true
- forceConsistentCasingInFileNames: true
- strict: true
- noImplicitAny: true
- strictNullChecks: true
- strictFunctionTypes: true
- strictBindCallApply: true
- strictPropertyInitialization: true
- strictBuiltinIteratorReturn: true
- noImplicitThis: true
- useUnknownInCatchVariables: true
- alwaysStrict: true
- noUnusedLocals: true
- noUnusedParameters: true
- exactOptionalPropertyTypes: true
- noImplicitReturns: true
- noFallthroughCasesInSwitch: true
- noUncheckedIndexedAccess: true
- noImplicitOverride: true
- noPropertyAccessFromIndexSignature: true
- allowUnusedLabels: true
- allowUnreachableCode: true
- skipLibCheck: true

### TSConfig Include:

- src

## Project Info:

- Package manager detected: pnpm
- Project uses ESLint.
- Project uses Jest.

---

## Style:

> projectRoot/promptHelper/style.md

1. Line Length - **Maximum** 160 characters per line.
2. Function Signatures & Calls
    - **Single‑line** signatures unless the entire declaration exceeds 160
      chars.
    - **No extra indentation** for parameters on new lines—if you must wrap,
      align subsequent lines under the opening `(`.
3. Imports - Use **single‑line** for named imports when the entire import fits
   under 160 chars.
4. If/Else - Don't use single-line `if` statements. Always use braces `{}` even
   for single-line blocks.
5. Chaining & Method Calls - **short sequences**, keep on one line. For **long
   chains** (>80 chars), put each method on its own line.
6. Consistency & Organization
    - **Alphabetize** named exports within a single line or multiline block.
    - Keep **related code** together: e.g. collectors vs. renderers in separate
      folders, but within each folder maintain grouping by feature.
    - **Avoid trailing commas** in single‑line constructs.
7. Avoid Deeply Nested `? :` Statements
8. Named Parameters for Clarity
    - For functions with 3+ arguments, prefer an object‑destructuring signature:
      ```ts
      interface ConfigureOptions {
        host: string;
        port: number;
        secure?: boolean;
      }    
      function configure(options: ConfigureOptions) { /* … */}
      ```  
    - Simple helpers (1–2 args) can still use positional parameters.
9. Explicit Type Declarations
    - **Always** annotate return types on exported functions, even if inferred.
    - Define interfaces or `type` aliases in `types.ts` rather than inline
      unions/objects.
10. Prefer Named Exports **Avoid** `export default`; use named exports so
    imports stay consistent and refactoring‑safe.
11. Async/Await & Error Handling
    - Use `async/await` over `.then()` chains.
    - Wrap await calls in `try/catch` and either handle or rethrow errors—never
      swallow exceptions.
12. String Literals
    - Use single quotes (`'…'`).
        - Only use backticks (`` `…` ``) when you need interpolation or
          multiline.
13. Immutability by Default
14. JSDoc for Public APIs - Add `/** … */` comments on all exported
    functions/types with `@param` and `@returns`.
15. Testing Conventions
    - Co‑locate tests next to implementation (`foo.ts` ↔ `foo.spec.ts`).
    - Mock I/O (fs, network) to keep units fast and deterministic.

---

## Other Notes:

> projectRoot/promptHelper/notes.md
> Additional notes for the prompt helper about the project you want the AI to
> know.


---

## FTA Complexity & Metrics:

| FTA Score | Assessment                                |
|-----------|-------------------------------------------|
| > 60      | Needs Improvement - Difficult to maintain |
| 50 - 60   | Could be better - Reasonably maintainable |
| 40 - 50   | Good - Maintainable                       |
| < 40      | Very Good - Easy to maintain              |

| Measure Name                 | Description                                                |
|------------------------------|------------------------------------------------------------|
| Difficulty (D)               | How hard it is to understand the code.                     |
| Effort (E)                   | How much logical work is required to write this code.      |
| Time required to program (T) | How long it might take to write the code.                  |
| Bugs predicted (B)           | How buggy the code is likely to be.                        |
| Cyclomatic complexity (C)    | The number of linearly independent paths through the code. |
| Line count (L)               | The number of lines of code in the file.                   |

| D  | E     | T    | B | C  | L  | Score | Assessment | File Name                                |
|----|-------|------|---|----|----|-------|------------|------------------------------------------|
| 20 | 37744 | 2097 | 1 | 3  | 43 | 49    | OK         | src/renders/metricsRender.ts             |
| 24 | 21005 | 1167 | 0 | 3  | 51 | 48    | OK         | src/modules/headers/style.ts             |
| 22 | 36137 | 2008 | 1 | 12 | 75 | 47    | OK         | src/collectors/fileStructureCollector.ts |
| 26 | 42165 | 2343 | 1 | 19 | 77 | 46    | OK         | src/collectors/codeCollector.ts          |
| 21 | 31099 | 1728 | 1 | 7  | 57 | 46    | OK         | src/collectors/tsconfigCollector.ts      |
| 21 | 37638 | 2091 | 1 | 22 | 66 | 45    | OK         | src/renders/projectInfoRenderer.ts       |
| 12 | 14933 | 830  | 0 | 5  | 45 | 45    | OK         | src/index.ts                             |
| 9  | 4976  | 276  | 0 | 4  | 46 | 44    | OK         | src/collectors/projectInfoCollector.ts   |
| 16 | 20550 | 1142 | 0 | 8  | 51 | 43    | OK         | src/renders/instructionsRender.ts        |
| 11 | 9489  | 527  | 0 | 7  | 38 | 41    | OK         | src/collectors/todoCollector.ts          |
| 22 | 25900 | 1439 | 0 | 16 | 44 | 41    | OK         | src/collectors/unusedCollector.ts        |
| 14 | 22817 | 1268 | 1 | 5  | 26 | 40    | OK         | src/collectors/toolsCollector.ts         |
| 20 | 18090 | 1005 | 0 | 6  | 29 | 39    | OK         | src/renders/fileTreeRender.ts            |
| 12 | 5204  | 289  | 0 | 4  | 21 | 37    | OK         | src/modules/headers/validator.ts         |
| 12 | 4859  | 270  | 0 | 4  | 21 | 37    | OK         | src/logger.ts                            |
| 14 | 7693  | 427  | 0 | 4  | 18 | 36    | OK         | src/modules/headers/writer.ts            |
| 9  | 5559  | 309  | 0 | 5  | 20 | 36    | OK         | src/collectors/dependenciesCollector.ts  |
| 7  | 1992  | 111  | 0 | 3  | 15 | 36    | OK         | src/collectors/packageJsonCollector.ts   |
| 11 | 4068  | 226  | 0 | 6  | 22 | 35    | OK         | src/collectors/graphCollector.ts         |
| 10 | 3069  | 171  | 0 | 4  | 14 | 33    | OK         | src/collectors/styleCollector.ts         |
| 5  | 3223  | 179  | 0 | 1  | 31 | 12    | OK         | src/options.ts                           |
| 1  | 357   | 20   | 0 | 1  | 38 | 12    | OK         | src/types/projectInfo.ts                 |
| 8  | 1922  | 107  | 0 | 1  | 9  | 10    | OK         | src/collectors/metricsCollector.ts       |
| 11 | 2484  | 138  | 0 | 2  | 9  | 10    | OK         | src/libs/padMiddle.ts                    |
| 6  | 1044  | 58   | 0 | 2  | 9  | 10    | OK         | src/collectors/notesCollector.ts         |
| 0  | 0     | 0    | 0 | 1  | 20 | 9     | OK         | src/types/metrics.ts                     |
| 0  | 0     | 0    | 0 | 1  | 14 | 9     | OK         | src/types/index.ts                       |
| 2  | 163   | 9    | 0 | 1  | 8  | 8     | OK         | jest.config.ts                           |
| 0  | 0     | 0    | 0 | 1  | 9  | 7     | OK         | src/types/tsconfig.ts                    |

---

## Code:

```
[Include code snippets or references via `--code` flag]
```

---

## Instructions:

- Please give the full updated code for any files that were changed in a
  Markdown code block.
- If you need additional context, code, or information, please ask before
  proceeding.
- Provide a summary of any issues found.
- Suggest improvements with code examples if possible.
