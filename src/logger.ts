// src/logger.ts
// src/Logger.ts
import * as fs from 'fs';
import * as os from 'os';

/**
 * Creates a Logger that writes to both stdout/stderr and to a file.
 *
 * @param filePath - The file to write all log output to.
 * @returns A log function: `(msg: string, isError?: boolean, error?: unknown) => void`
 */
export function createLogger(filePath: string): (msg: string, isError?: boolean, error?: unknown) => void {
  const stream = fs.createWriteStream(filePath, {
    flags: 'w',
    encoding: 'utf8',
  });

  /**
   * Logs a message to console and writes it to the log file.
   *
   * @param message - The message to log.
   * @param isError - Whether this message is an error.
   * @param error - Optional error object to display in the console.
   */
  function log(message: string, isError = false, error?: unknown): void {
    const line = isError ? `ERROR: ${message}` : message;

    if (isError) {
      console.error(line);
      if (error) {
        console.error(error);
      }
    } else {
      console.log(message);
    }

    stream.write(`${line}${os.EOL}`);
  }

  return log;
}
