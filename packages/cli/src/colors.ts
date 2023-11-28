interface Colors {
  red: (s: string | number) => string
  green: (s: string | number) => string
  dim: (s: string | number) => string
  bold: (s: string | number) => string
  cyan: (s: string | number) => string
}

export default {
  red: (s) => `\x1B[31m${s}\x1B[39m`,
  green: (s) => `\x1B[32m${s}\x1B[39m`,
  dim: (s) => `\x1B[2m${s}\x1B[22m`,
  bold: (s) => `\x1B[1m${s}\x1B[22m`,
  cyan: (s) => `\x1B[36m${s}\x1B[39m`,
} as Colors
