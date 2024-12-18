// src/logger.ts
import * as fs from 'fs';

export function createLogger(filePath: string) {
    const stream = fs.createWriteStream(filePath, {flags: 'w', encoding: 'utf8'});

    // Explain: The logger provides a unified way to output messages both to console and to a file.
    function log(message: string, isError = false) {
        if (isError) {
            console.error(message);
            stream.write(`ERROR: ${message}\n`);
        } else {
            console.log(message);
            stream.write(`${message}\n`);
        }
    }

    return log;
}
