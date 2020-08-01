import { Bus, BusEvent } from "../api/Bus"

export const controlOverlayMix = {
  deactivated () {
    this.closeOverlay()
  },
  beforeDestroy () {
    this.closeOverlay()
  },
  methods: {
    openOverlay () {
      Bus.$emit(BusEvent.OPEN_OVERLAY)
    },
    closeOverlay () {
      Bus.$emit(BusEvent.CLOSE_OVERLAY)
    }
  }
}

export const showSnackbarMix = {
  methods: {
    showSnackbar (color, message, timeout = 3000) {
      Bus.$emit(BusEvent.SNACKBAR, {
        color,
        message,
        timeout
      })
    }
  }
}

/**
 * 引入该混入还需引入showSnackbarMix
 */
export const tryCatchFuncMix = {
  mixins: [ showSnackbarMix ],
  methods: {
    async tryCatchFunc (fn, ...args) {
      let result = undefined
      try {
        result = await fn(...args)
        /* 填补无数据返回但成功的情况 */
        result = result || 1
      } catch (error) {
        this.showSnackbar('error', error.message, 10000)
      }
      return result
    }
  }
}