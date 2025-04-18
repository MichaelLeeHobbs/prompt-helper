### 1. Line Length

- **Maximum**: 160 characters per line.
- If a statement (including imports, function signatures, etc.) would exceed 160 chars, you may break it onto multiple lines—otherwise keep it on one line.

---

### 2. Function Signatures & Calls

- **Single‑line** signatures unless the entire declaration exceeds 160 chars.
- **No extra indentation** for parameters on new lines—if you must wrap, align subsequent lines under the opening `(`.

**Bad (always multi‑line):**
```ts
export function appendPromptInstructions(
  log: (msg: string) => void,
  projectInfo: ProjectInfo
): void {
  // …
}
```

**Good (single‑line):**
```ts
export function appendPromptInstructions(log: (msg: string) => void, projectInfo: ProjectInfo): void {
  // …
}
```

**Good (wrapped because >160 chars):**
```ts
export function veryLongFunctionNameWithLotsOfTypeParams<T1, T2, T3, T4>(
  arg1: SomeComplexTypeWithALotOfNestedGenericsAndUnionTypes<AnotherType>,
  arg2: string
): Promise<ReturnTypeWithALongNameAndLotsOfDetails> {
  // …
}
```

---

### 3. Imports

- **Group and sort** imports by type (node_modules → local modules).
- Use **single‑line** for named imports when the entire import fits under 160 chars.

**Bad (multiline without need):**
```ts
import {
  appendPromptInstructions,
  collectProjectInfo,
  logProjectInfo
} from './features/projectInfo';
```

**Good (single‑line):**
```ts
import { appendPromptInstructions, collectProjectInfo, logProjectInfo } from './features/projectInfo';
```

**Good (wrapped because >160 chars):**
```ts
import {
  VeryLongExporterNameOne,
  VeryLongExporterNameTwo,
  AnotherExtremelyLongExporterNameThree
} from '../../../../some/deeply/nested/path/with/a/long/name';
```

---

### 4. Object & Array Literals

- **Short literals** on one line if they stay under 160 chars.
- **Else** break each property/item onto its own line, aligned.

```ts
// Single-line (short)
const optsA = { foo: true, bar: false };

// Multi-line (long)
const optsB = {
  firstOption: true,
  secondOption: false,
  thirdOption: someVeryLongExpressionThatWouldOverflowTheLineLengthLimit,
};
```

---

### 5. Chaining & Method Calls

- For **short sequences**, keep on one line.
- For **long chains** (>160 chars), put each method on its own line, indented one level:

```ts
// Short chain
const resultA = arr.map(x => x.id).filter(Boolean).join(',');

// Long chain
const resultB = arr
  .map(x => transformVeryLongExpression(x.someProperty))
  .filter(transformed => predicateFunction(transformed))
  .join(',');
```

---

### 6. Comments

- **Inline comments** (`// …`) should stay on the same line as code when brief.
- **Block comments** (`/* … */`) for longer explanations, placed above the relevant code.
- Maximum 100 chars per comment line.

---

### 7. Consistency & Organization

- **Alphabetize** named exports within a single line or multiline block.
- Keep **related code** together: e.g. collectors vs. renderers in separate folders, but within each folder maintain grouping by feature.
- **Avoid trailing commas** in single‑line constructs.

### 8. Avoid Deeply Nested `? :` Statements

- **Do not chain** ternary operators more than one level deep.
- If you find yourself writing `cond1 ? (cond2 ? valA : valB) : valC`, refactor to a clear `if/else` or a helper function.
- **Example (bad):**
  ```ts
  const status = isAdmin
    ? (isActive ? 'active-admin' : 'inactive-admin')
    : (isActive ? 'active-user'  : 'inactive-user');
  ```  
- **Refactor (good):**
  ```ts
  let status: string;
  if (isAdmin) {
    status = isActive ? 'active-admin' : 'inactive-admin';
  } else {
    status = isActive ? 'active-user'  : 'inactive-user';
  }
  ```  
- For more than two branches, consider a `switch` or a lookup object instead.

Here are some additional sections you might add:

---

### 9. Named Parameters for Clarity
- For functions with 3+ arguments, prefer an object‑destructuring signature:
  ```ts
  function configure(options: { host: string; port: number; secure?: boolean }) { /* … */}
  ```  
- Simple helpers (1–2 args) can still use positional parameters.

---

### 10. Explicit Type Declarations
- **Always** annotate return types on exported functions, even if inferred.
- Define interfaces or `type` aliases in `types.ts` rather than inline unions/objects.

---

### 11. Naming Conventions
- **Interfaces & Types**: `PascalCase` (e.g. `FileNode`).
- **Variables & Functions**: `camelCase` (e.g. `collectFileTree`).
- **Constants**: `UPPER_SNAKE_CASE` (e.g. `CHECK_EXTENSIONS`).

---

### 12. Prefer Named Exports
- **Avoid** `export default`; use named exports so imports stay consistent and refactoring‑safe.

---

### 13. Async/Await & Error Handling
- Use `async/await` over `.then()` chains.
- Wrap await calls in `try/catch` and either handle or rethrow errors—never swallow exceptions.

---

### 14. Safe Property Access
- Leverage optional chaining (`?.`) and nullish coalescing (`??`) instead of verbose checks.

---

### 15. Strict Equality
- **Always** use `===` / `!==`, never `==` / `!=`.

---

### 16. String Literals
- Use single quotes (`'…'`).
- Only use backticks (`` `…` ``) when you need interpolation or multiline.

---

### 17. Immutability by Default
- Declare variables with `const` unless you need to reassign (`let`).
- Avoid `var`.

---

### 18. JSDoc for Public APIs
- Add `/** … */` comments on all exported functions/types with `@param` and `@returns`.

---

### 19. Testing Conventions
- Co‑locate tests next to implementation (`foo.ts` ↔ `foo.spec.ts`).
- Mock I/O (fs, network) to keep units fast and deterministic.
