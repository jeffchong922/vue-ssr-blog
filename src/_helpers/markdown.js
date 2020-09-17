import marked from 'marked'

marked.use({
  gfm: true,
  renderer: {
    heading: (text, level, raw, slugger) => {
      const id = slugger.slug(text)
      return `
        <h${level} id="${id}">
          <a href="${'#' + id}" title="${text}">${text}</a>
        </h${level}>
      `
    },
    link: (href, title, text) => `<a href="${href}" target="_blank" rel="noopener" title="${title || text}" class="inline-link">${text}</a>`
  }
})

export function getHtmlContent (markdownText) {
  if (!markdownText) return ''
  return marked(markdownText)
}

export function getHtmlTopic (oNode) {
  if (!oNode) {
    return []
  }
  const topic = []

  for (let i = 0; i < oNode.children.length; i++) {
    const el = oNode.children[i];
    if (/^H(1|2|3|4|5|6)$/.test(el.tagName)) {
      const level = el.tagName.slice(1)
      const title = el.innerText
      const href = el.id

      topic.push({
        level,
        title,
        href
      })
    }
  }

  return topic
}

// function makeMarkdown({ markdownTool }) {
//   return Object.freeze({
//     getHtmlContent
//   })

//   function getHtmlContent (markdownText) {
//     if (!markdownText) return ''
//     return markdownTool.translate(markdownText)
//   }
// }