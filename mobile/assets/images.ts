/** Canonical logo in the repo — survives Metro cache clears. */
export const LOGO_SOURCE = require('./brand-logo.png')

export const LOGO_ASPECT = 510 / 274

export function logoHeightForWidth(width: number) {
  return Math.round(width / LOGO_ASPECT)
}
