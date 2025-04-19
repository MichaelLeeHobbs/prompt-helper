// src/libs/standardizeError.ts
interface ExtendedError extends Error {
  code?: string | number;
  cause?: unknown;
}

export function standardizeError(err: unknown, prefix?: string): ExtendedError {
  // 1) Normalize to an Error instance
  let base: ExtendedError;
  if (err instanceof Error) {
    base = err as ExtendedError;
  } else if (typeof err === 'string') {
    base = new Error(err);
  } else if (err !== null && typeof err === 'object') {
    // Try to pull out a message property, else safe‑stringify
    let text: string;

    const maybeMsg = (err as {message: string | undefined}).message;
    if (typeof maybeMsg === 'string') {
      text = maybeMsg;
    } else {
      try {
        text = JSON.stringify(err);
      } catch {
        text = Object.prototype.toString.call(err);
      }
    }
    base = new Error(text) as ExtendedError;
  } else {
    base = new Error(String(err));
  }

  // 2) Build up the pieces of our new message
  const parts: string[] = [base.name];
  if (base.code != null) {
    parts.push(`[${base.code}]`);
  }
  if (base.cause != null) {
    parts.push(`cause: ${String(base.cause)}`);
  }
  if (base.message) {
    parts.push(`– ${base.message}`);
  }
  const coreMessage = parts.join(' ');

  // 3) Prepend optional prefix
  const fullMessage = prefix ? `${prefix} → ${coreMessage}` : coreMessage;

  // 4) Wrap (Node 16+) or mutate to preserve stack & metadata
  let result: ExtendedError;
  try {
    // This will set result.cause = base and keep base.stack under the hood
    // @ts-expect-error This should be correct, but TypeScript is not happy
    result = new Error(fullMessage, {cause: base}) as ExtendedError;
    if (base.code != null) {
      result.code = base.code;
    }
  } catch {
    // Fallback if the environment doesn’t support the second argument
    base.message = fullMessage;
    result = base;
  }

  return result;
}
