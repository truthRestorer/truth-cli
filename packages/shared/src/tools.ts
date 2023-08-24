export function isEmptyObj(obj: object | undefined | null) {
  return JSON.stringify(obj) === '{}' || obj === undefined || obj === null
}
