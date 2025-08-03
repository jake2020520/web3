"use client"

import { useEffect, useRef } from "react"

interface ContentRendererProps {
  content: string
}

export function ContentRenderer({ content }: ContentRendererProps) {
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!contentRef.current) return

    // 查找所有代码块
    const preElements = contentRef.current.querySelectorAll("pre")

    preElements.forEach((preElement) => {
      const codeElement = preElement.querySelector("code")
      if (!codeElement) return

      // 获取代码内容和语言
      const code = codeElement.textContent || ""
      const classNames = codeElement.className.split(" ")
      let language: string | undefined

      // 尝试从类名中提取语言
      for (const className of classNames) {
        if (className.startsWith("language-")) {
          language = className.replace("language-", "")
          break
        }
      }

      // 创建新的代码块元素
      const codeBlockContainer = document.createElement("div")
      codeBlockContainer.className = "code-block-container"

      // 使用 React 渲染 CodeBlock 组件
      const tempDiv = document.createElement("div")
      tempDiv.innerHTML = `<div data-code="${encodeURIComponent(code)}" data-language="${language || ""}"></div>`

      // 替换原始的 pre 元素
      preElement.parentNode?.replaceChild(tempDiv.firstChild!, preElement)
    })

    // 查找所有标记为代码块的元素并渲染 CodeBlock 组件
    const codeBlockPlaceholders = contentRef.current.querySelectorAll("[data-code]")
    codeBlockPlaceholders.forEach((placeholder) => {
      const code = decodeURIComponent(placeholder.getAttribute("data-code") || "")
      const language = placeholder.getAttribute("data-language") || undefined

      // 创建 CodeBlock 组件的容器
      const codeBlockContainer = document.createElement("div")
      placeholder.parentNode?.replaceChild(codeBlockContainer, placeholder)

      // 渲染 CodeBlock 组件
      const codeBlock = document.createElement("div")
      codeBlock.className = "relative group my-6"
      codeBlock.innerHTML = `
        <div class="absolute right-0 top-0 flex items-center space-x-1 px-3 py-2 text-xs text-gray-400">
          ${language ? `<div class="flex items-center mr-2"><span>${language}</span></div>` : ""}
          <button class="p-1.5 rounded-md hover:bg-gray-700 transition-colors" aria-label="复制代码" title="复制代码">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="h-4 w-4"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
          </button>
        </div>
        <pre class="!mt-0 overflow-x-auto rounded-lg bg-gray-900 py-4 dark:bg-gray-950">
          <code class="language-${language || "plaintext"}">${code}</code>
        </pre>
      `

      // 添加复制功能
      const copyButton = codeBlock.querySelector("button")
      if (copyButton) {
        copyButton.addEventListener("click", async () => {
          try {
            await navigator.clipboard.writeText(code)
            copyButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="h-4 w-4 text-green-500"><path d="M20 6 9 17l-5-5"/></svg>`
            setTimeout(() => {
              copyButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="h-4 w-4"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`
            }, 2000)
          } catch (err) {
            console.error("Failed to copy text: ", err)
          }
        })
      }

      codeBlockContainer.appendChild(codeBlock)
    })
  }, [content])

  return (
    <div
      ref={contentRef}
      className="prose prose-lg max-w-none prose-pre:bg-gray-900 prose-pre:p-0 prose-pre:rounded-lg dark:prose-invert"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  )
}
