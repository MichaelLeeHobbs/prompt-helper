// src/libs/padMiddle.ts
/**
 * Pads a string with the given character equally on both sides to reach the desired total length.
 *
 * If an odd number of padding characters is needed, the extra one goes on the right.
 *
 * @param str - The input string to center.
 * @param totalLength - The final length of the padded string.
 * @param padChar - The character used for padding (default is space).
 * @returns The centered and padded string.
 */
export function padMiddle(str: string, totalLength: number, padChar = ' '): string {
  if (str.length >= totalLength) {
    return str;
  }

  const totalPadding = totalLength - str.length;
  const leftPadding = Math.floor(totalPadding / 2);
  const rightPadding = totalPadding - leftPadding;

  return padChar.repeat(leftPadding) + str + padChar.repeat(rightPadding);
}
