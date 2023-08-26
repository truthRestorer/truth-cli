export function isEmptyObj(obj: object | undefined | null) {
  return !obj || Object.keys(obj).length === 0
}
