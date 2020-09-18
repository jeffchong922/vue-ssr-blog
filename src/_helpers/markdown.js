import marked from 'marked'
import hlJs from 'highlight.js/lib/core'

import 'highlight.js/styles/atom-one-dark.css'

import javascript from 'highlight.js/lib/languages/javascript'
import xml from 'highlight.js/lib/languages/xml'

hlJs.registerLanguage('javascript', javascript)
hlJs.registerAliases([
  'javascript',
  'js',
  'JavaScript',
  'JS',
  'jsx',
  'jsm'
], {
  languageName: 'javascript'
})

hlJs.registerLanguage('xml', xml)


marked.use({
  gfm: true,
  langPrefix: 'hljs lang-',
  highlight: (code, lang) => {
    if (lang && hlJs.getLanguage(lang)) {
      try {
        return hlJs.highlight(lang, code).value
      } catch (e) {
        return code
      }
    }
    return code
  },
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