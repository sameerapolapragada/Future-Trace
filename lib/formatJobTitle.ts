/** Capitalize the first letter of each word (preserves existing casing on other letters). */
export function toTitleCase(str: string): string {
  return str ? str.replace(/\b\w/g, (char) => char.toUpperCase()) : ''
}

/** Capitalize the first letter of each word in a job title. */
export function formatJobTitle(value: string): string {
  const trimmed = value.trim()
  if (!trimmed) return trimmed

  return trimmed
    .split(/\s+/)
    .map((word) =>
      word
        .split('-')
        .map((part) => (part ? part.charAt(0).toUpperCase() + part.slice(1).toLowerCase() : part))
        .join('-')
    )
    .join(' ')
}
