// export function throttle (fn, wait = 50) {
//   let previous = 0
//   return function (...args) {
//     let now = +new Date()
//     if (now - previous > wait) {
//       previous = now
//       fn.apply(this, args)
//     }
//   }
// }

export function throttle (fn, wait = 50, immediate = false) {
  let timer
  return function (...args) {
    if (!timer) {
      immediate && fn.apply(this.args)

      timer = setTimeout(() => {
        fn.apply(this, args)
        timer = null
      }, wait);
    }
  }
}