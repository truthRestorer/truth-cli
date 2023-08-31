export function cyan(s: string | number) {
  return `\x1B[36m${s}\x1B[39m`
}

export function bold(s: string | number) {
  return `\x1B[1m${s}\x1B[22m`
}

export function dim(s: string | number) {
  return `\x1B[2m${s}\x1B[22m`
}

export function green(s: string | number) {
  return `\x1B[32m${s}\x1B[39m`
}

export function red(s: string | number) {
  return `\x1B[31m${s}\x1B[39m`
}
