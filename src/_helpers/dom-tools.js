export function getHtmlClientHeight () {
  return window.document.documentElement.clientHeight
}

export function getElementById (id) {
  return window.document.getElementById(id)
}

export function getBoundingClientRectById (id) {
  const oNode = getElementById(id)
  if (!oNode) {
    throw new Error(`id为: ${id} 的元素未找到`)
  }
  return oNode.getBoundingClientRect()
}

/* http://gizma.com/easing/ */
const easeFuncObj = {
  ease (t, b, c, d) {
    t /= d/2
    if (t < 1) return c/2*t*t + b
    t--
    return -c/2 * (t*(t-2) - 1) + b
  }
}

export function smoothScrollForWindow (targetPosition, duration) {
  const { ease } = easeFuncObj

  const distance = targetPosition
  const startPosition = window.pageYOffset
  const windowXOffset = window.pageXOffset
  
  let startTime = null
  function animation (currentTime) {
    if (startTime === null) startTime = currentTime
    let timeElapsed = currentTime - startTime,
      run = ease(timeElapsed, startPosition, distance, duration)

    window.scrollTo(windowXOffset, run)
    if (timeElapsed < duration) requestAnimationFrame(animation)
  }

  window.requestAnimationFrame(animation)
}