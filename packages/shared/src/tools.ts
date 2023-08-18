export function useAssign(...rest: (object | undefined)[]) {
  return Object.assign({}, ...rest)
}

export function useEntries(obj: object | undefined | null) {
  return Object.entries(obj ?? {})
}

export function isEmptyObj(obj: object | undefined | null) {
  return JSON.stringify(obj) === '{}' || obj === undefined || obj === null
}
