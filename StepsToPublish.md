# How to Publish to NPM

Follow these steps to publish your package to [npm](https://www.npmjs.com/):

## Prerequisites

1. **NPM Account:** Ensure you have an npm account. If not, create one at [npmjs.com](https://www.npmjs.com/).
2. **Authenticated:** Login to npm from the command line:

   ```bash
   pnpm login
   ```

## Steps to Publish

1. **Check the Project Structure:** Ensure your project includes:
    - `package.json` with correct metadata (name, version, main entry file, bin field if applicable).
    - Source files (e.g., `src/` and `dist/` folders).
    - `files` field in `package.json` to avoid publishing unnecessary files.

2. **Run Lint and Tests:** Ensure everything works:

   ```bash
   pnpm run lint
   pnpm run test
   ```

3. **Build the Project:**

   ```bash
   pnpm run build
   ```

4. **Version Update:**

   ```bash
   pnpm version [patch | minor | major]
   ```

   Example:

   ```bash
   pnpm version patch
   ```

5. **Publish the Package:**

   ```bash
   pnpm publish
   ```

   Use the `--access public` flag if it’s the first time publishing a scoped package:

   ```bash
   pnpm publish --access public
   ```

6. **Verify the Publish:**

   Check the npm registry:

   ```bash
   pnpm view prompt-helper
   ```

## Post-Publish Checklist

- Verify that the version was updated in `package.json`.
- Install the package locally or globally to test:

  ```bash
  npm install -g prompt-helper
  ```

- Create a Git tag and push changes:
  ```bash
  git tag vX.Y.Z
  ```

- Push the changes and tags:
  ```bash
  git add .
  git commit -m "Release version x.y.z"
  git push origin main --tags
  ```

---

**Congratulations!** 🎉 Your package is now live on npm.

For more information, refer to the [npm documentation](https://docs.npmjs.com/).

