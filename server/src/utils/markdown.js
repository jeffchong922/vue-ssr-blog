import marked from 'marked'
import hljs from 'highlight.js/lib/core'

import javascript from 'highlight.js/lib/languages/javascript'
import html from 'highlight.js/lib/languages/htmlbars'
import json from 'highlight.js/lib/languages/json'

// 添加语言支持
const hljsSupportedLang = {
  javascript,
  html,
  json
}

for (const langKey in hljsSupportedLang) {
  if (hljsSupportedLang.hasOwnProperty(langKey)) {
    const lang = hljsSupportedLang[langKey];
    hljs.registerLanguage(`${langKey}`, lang)
  }
}

marked.use({
  renderer: {
    heading: (text, level, raw, slugger) => {
      const id = slugger.slug(text)
      return `
        <h${level} id="${id}">
          <a href="${'#' + id}" title="${text}">${text}</a>
        </h${level}>
      `
    },
    codespan: (code) => `<code class="inline-code">${code}</code>`,
    link: (href, title, text) => `<a href="${href}" target="_blank" rel="noopener" title="${title || text}" class="inline-link">${text}</a>`
  }
})

marked.use({
  gfm: true,
  langPrefix: 'lang-',
  highlight: (code, lang) => {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(lang, code).value
      } catch (e) {}
    }
    return code
  }
})

function getHtmlContent (markdownText) {
  if (!markdownText) return ''
  return marked(markdownText)
}

function getHtmlTopic (oNode) {
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

export {
  getHtmlContent,
  getHtmlTopic
}