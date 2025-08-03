"use client"

import { useEffect, useRef } from "react"

interface EnhancedContentProps {
  content: string
}

export function EnhancedContent({ content }: EnhancedContentProps) {
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!contentRef.current) return

    // 查找所有代码块
    const preElements = contentRef.current.querySelectorAll("pre")

    preElements.forEach((preElement) => {
      // 添加相对定位以便放置复制按钮
      preElement.style.position = "relative"
      preElement.classList.add("code-block")

      const codeElement = preElement.querySelector("code")
      if (!codeElement) return

      // 获取语言
      let language = ""
      for (const className of codeElement.classList) {
        if (className.startsWith("language-")) {
          language = className.replace("language-", "")
          break
        }
      }

      // 创建语言标签
      if (language) {
        const languageTag = document.createElement("div")
        languageTag.className = "absolute top-0 left-0 px-3 py-1 text-xs text-gray-400 bg-gray-800 rounded-br"
        languageTag.textContent = getLanguageDisplayName(language)
        preElement.appendChild(languageTag)
      }

      // 创建复制按钮容器
      const buttonContainer = document.createElement("div")
      buttonContainer.className = "absolute top-0 right-0"

      // 创建复制按钮
      const copyButton = document.createElement("button")
      copyButton.className = "p-2 text-xs text-gray-400 hover:text-white bg-gray-800 rounded-bl flex items-center"
      copyButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="h-4 w-4">
          <rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect>
          <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
        </svg>
        <span class="ml-1">复制</span>
      `
      copyButton.title = "复制代码"

      // 添加复制功能
      copyButton.addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText(codeElement.textContent || "")

          // 更改按钮状态为已复制
          copyButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="h-4 w-4 text-green-500">
              <path d="M20 6 9 17l-5-5"></path>
            </svg>
            <span class="ml-1 text-green-500">已复制</span>
          `

          // 2秒后恢复原始状态
          setTimeout(() => {
            copyButton.innerHTML = `
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="h-4 w-4">
                <rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect>
                <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
              </svg>
              <span class="ml-1">复制</span>
            `
          }, 2000)
        } catch (err) {
          console.error("Failed to copy text: ", err)
        }
      })

      buttonContainer.appendChild(copyButton)
      preElement.appendChild(buttonContainer)
    })

    // 添加语法高亮的CSS
    addSyntaxHighlightingStyles()
  }, [content])

  // 获取语言的显示名称
  function getLanguageDisplayName(lang: string): string {
    const languageMap: Record<string, string> = {
      js: "JavaScript",
      ts: "TypeScript",
      jsx: "React JSX",
      tsx: "React TSX",
      html: "HTML",
      css: "CSS",
      scss: "SCSS",
      json: "JSON",
      xml: "XML",
      md: "Markdown",
      sql: "SQL",
      bash: "Bash",
      sh: "Shell",
      py: "Python",
      java: "Java",
      c: "C",
      cpp: "C++",
      cs: "C#",
      go: "Go",
      rust: "Rust",
      swift: "Swift",
      kotlin: "Kotlin",
      php: "PHP",
      ruby: "Ruby",
      plaintext: "纯文本",
    }

    return languageMap[lang] || lang.charAt(0).toUpperCase() + lang.slice(1)
  }

  // 添加语法高亮的CSS
  function addSyntaxHighlightingStyles() {
    // 检查是否已经添加了样式
    if (document.getElementById("syntax-highlighting-styles")) return

    const style = document.createElement("style")
    style.id = "syntax-highlighting-styles"
    style.textContent = `
      /* 基本代码样式 */
      pre code {
        color: #d4d4d4;
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
      }

      /* 关键字 */
      .hljs-keyword, .hljs-selector-tag, .hljs-built_in, .hljs-name, .hljs-tag {
        color: #569cd6;
      }

      /* 字符串 */
      .hljs-string, .hljs-title, .hljs-section, .hljs-attribute, .hljs-literal, .hljs-template-tag, .hljs-template-variable, .hljs-type, .hljs-addition {
        color: #ce9178;
      }

      /* 注释 */
      .hljs-comment, .hljs-quote, .hljs-deletion {
        color: #6a9955;
      }

      /* 数字 */
      .hljs-number, .hljs-regexp, .hljs-literal, .hljs-bullet, .hljs-link {
        color: #b5cea8;
      }

      /* 变量 */
      .hljs-variable, .hljs-template-variable, .hljs-attr, .hljs-selector-attr, .hljs-selector-class, .hljs-selector-id {
        color: #9cdcfe;
      }

      /* 函数 */
      .hljs-function, .hljs-subst {
        color: #dcdcaa;
      }

      /* 操作符 */
      .hljs-operator, .hljs-entity, .hljs-url {
        color: #d4d4d4;
      }

      /* 标点符号 */
      .hljs-punctuation {
        color: #d4d4d4;
      }
    `
    document.head.appendChild(style)
  }

  return (
    <div
      ref={contentRef}
      className="prose prose-lg max-w-none dark:prose-invert"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  )
}
