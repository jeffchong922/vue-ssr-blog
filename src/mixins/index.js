function getTitle (vm) {
  const { title } = vm.$options
  if (title) {
    return typeof title === 'function'
      ? title.call(vm)
      : title
  }
}

const serverTitleMixin = {
  created () {
    const title = getTitle(this)
    if (title) {
      this.$ssrContext.title = `${title} | Jeff\`s Blog`
    }
  }
}

const clientTitleMixin = {
  mounted () {
    const title = getTitle(this)
    if (title) {
      document.title = `${title} | Jeff\`s Blog`
    }
  }
}

const titleMixin = process.env.VUE_ENV === 'server'
  ? serverTitleMixin
  : clientTitleMixin

export {
  titleMixin
}