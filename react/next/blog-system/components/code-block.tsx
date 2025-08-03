"use client"

import { useEffect, useState } from "react"
import { Check, Copy, FileCode } from "lucide-react"
import hljs from "highlight.js"
import "highlight.js/styles/atom-one-dark.css"

interface CodeBlockProps {
  code: string
  language?: string
}

export function CodeBlock({ code, language }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)
  const [detectedLanguage, setDetectedLanguage] = useState<string | null>(null)
  const [highlightedCode, setHighlightedCode] = useState("")

  useEffect(() => {
    // 如果没有指定语言，尝试自动检测
    if (!language) {
      const result = hljs.highlightAuto(code)
      setDetectedLanguage(result.language || null)
      setHighlightedCode(result.value)
    } else {
      try {
        const result = hljs.highlight(code, { language })
        setHighlightedCode(result.value)
        setDetectedLanguage(language)
      } catch (error) {
        // 如果指定的语言无效，回退到自动检测
        const result = hljs.highlightAuto(code)
        setDetectedLanguage(result.language || null)
        setHighlightedCode(result.value)
      }
    }
  }, [code, language])

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  // 获取语言的显示名称
  const getLanguageDisplayName = (lang: string | null) => {
    if (!lang) return "纯文本"

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

  return (
    <div className="relative group my-6">
      <div className="absolute right-0 top-0 flex items-center space-x-1 px-3 py-2 text-xs text-gray-400">
        {detectedLanguage && (
          <div className="flex items-center mr-2">
            <FileCode className="h-3.5 w-3.5 mr-1" />
            <span>{getLanguageDisplayName(detectedLanguage)}</span>
          </div>
        )}
        <button
          onClick={copyToClipboard}
          className="p-1.5 rounded-md hover:bg-gray-700 transition-colors"
          aria-label="复制代码"
          title="复制代码"
        >
          {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
        </button>
      </div>
      <pre className="!mt-0 overflow-x-auto rounded-lg bg-gray-900 py-4 dark:bg-gray-950">
        <code
          className={`language-${detectedLanguage || "plaintext"}`}
          dangerouslySetInnerHTML={{ __html: highlightedCode }}
        />
      </pre>
    </div>
  )
}
