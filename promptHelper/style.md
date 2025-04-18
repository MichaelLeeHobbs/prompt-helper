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
