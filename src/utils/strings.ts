const snakeCaseRegex = /^[a-zd]+(_[a-zd]+)*$/;

/**
 * Tests whether the input value string is acceptable as custom property key.
 * The method validates against a slight modified version of snake case where
 * the value can contain a single lower case word
 * @param {string} value input to test
 * @return {boolean} whether string is valid or not
 */
export function isEventKeyFormatValid(value: string): boolean {
  return snakeCaseRegex.test(value);
}