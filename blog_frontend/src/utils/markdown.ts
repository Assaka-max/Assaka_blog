import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js/lib/core'
import javascript from 'highlight.js/lib/languages/javascript'
import typescript from 'highlight.js/lib/languages/typescript'
import xml from 'highlight.js/lib/languages/xml'
import css from 'highlight.js/lib/languages/css'
import json from 'highlight.js/lib/languages/json'
import bash from 'highlight.js/lib/languages/bash'
import markdown from 'highlight.js/lib/languages/markdown'
import python from 'highlight.js/lib/languages/python'
import sql from 'highlight.js/lib/languages/sql'
import yaml from 'highlight.js/lib/languages/yaml'
import java from 'highlight.js/lib/languages/java'

hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('typescript', typescript)
hljs.registerLanguage('xml', xml)
hljs.registerLanguage('css', css)
hljs.registerLanguage('json', json)
hljs.registerLanguage('bash', bash)
hljs.registerLanguage('markdown', markdown)
hljs.registerLanguage('python', python)
hljs.registerLanguage('sql', sql)
hljs.registerLanguage('yaml', yaml)
hljs.registerLanguage('java', java)

export interface TocItem {
  id: string
  text: string
  level: number
}

export interface RenderedMarkdown {
  html: string
  toc: TocItem[]
}

interface RenderEnv {
  toc: TocItem[]
  used: Map<string, number>
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

const md = new MarkdownIt({
  html: false, // 禁止在 Markdown 里直接写 HTML 标签（防止 XSS 攻击）
  linkify: true, // 自动把纯文本里的网址转成可点击的链接
  breaks: true, // 把单个换行符 \n 转换成 <br>（适合博客写作习惯）
  highlight(code, lang) {
    if (lang && hljs.getLanguage(lang)) {
      return `<pre class="hljs"><code>${hljs.highlight(code, { language: lang }).value}</code></pre>`
    }
    return `<pre class="hljs"><code>${escapeHtml(code)}</code></pre>`
  },
})

function slugify(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\u4e00-\u9fa5-]/g, '')
    .replace(/^-+|-+$/g, '')
}

md.renderer.rules.heading_open = (tokens, idx, options, env, self) => {
  const token = tokens[idx]
  const level = Number(token!.tag.charAt(1))
  const renderEnv = env as unknown as RenderEnv

  if ((level === 2 || level === 3) && renderEnv?.toc) {

    // 提取标题文本
    const inline = tokens[idx + 1]
    const text = inline?.children?.map((child) => child.content).join('') ?? ''

    // 生成唯一标题 ID
    let id = slugify(text) || `heading-${idx}`
    const count = renderEnv.used.get(id) ?? 0
    renderEnv.used.set(id, count + 1)
    if (count > 0) id = `${id}-${count}`

    token!.attrSet('id', id)
    renderEnv.toc.push({ id, text, level })
  }

  return self.renderToken(tokens, idx, options)
}

// 渲染 Markdown 文本，生成 HTML 和目录
export function renderMarkdown(source: string): RenderedMarkdown {
  const toc: TocItem[] = []
  const used = new Map<string, number>()
  
  // toc 用于存储目录项, used 用于存储已使用的标题 ID, 避免重复生成
  const html = md.render(source, { toc, used })
  return { html, toc }
}
