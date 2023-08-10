export function debounce(fn: () => void) {
  let timer: NodeJS.Timeout | null = null
  // 原始函数的参数args
  return function () {
    if (timer)
      clearTimeout(timer)
    timer = setTimeout(() => {
      fn()
    }, 200)
  }
}
