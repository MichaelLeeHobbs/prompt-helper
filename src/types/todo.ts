// src/types/todo.ts

/**
 * Represents an individual TODO or FIXME comment found in code.
 */
export interface TodoItem {
  file: string;
  line: number;
  text: string;
}
