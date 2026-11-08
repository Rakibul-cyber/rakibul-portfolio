/**
 * Convert straight quotes in legacy strings to typographic ones at render time,
 * so data can stay byte-for-byte verbatim (preservation test) while visible copy
 * uses real apostrophes and quotation marks.
 */
export function smartQuotes(text: string): string {
  return text
    .replace(/(^|[\s([{—–-])"/g, '$1“') // opening double
    .replace(/"/g, '”') // closing double
    .replace(/(^|[\s([{—–-])'/g, '$1‘') // opening single
    .replace(/'/g, '’'); // apostrophe / closing single
}
