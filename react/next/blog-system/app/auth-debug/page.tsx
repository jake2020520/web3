"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getSupabaseClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export default function AuthDebugPage() {
  const [authConfig, setAuthConfig] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()
  const supabase = getSupabaseClient()

  useEffect(() => {
    // 从 URL 中获取错误信息
    const hashParams = new URLSearchParams(window.location.hash.substring(1))
    const queryParams = new URLSearchParams(window.location.search)

    const errorFromHash = hashParams.get("error")
    const errorDescriptionFromHash = hashParams.get("error_description")
    const errorFromQuery = queryParams.get("error")
    const errorDescriptionFromQuery = queryParams.get("error_description")

    if (errorFromHash || errorFromQuery) {
      setError(`${errorFromHash || errorFromQuery}: ${errorDescriptionFromHash || errorDescriptionFromQuery}`)
    }

    // 获取当前的 URL 信息
    setAuthConfig({
      currentUrl: window.location.href,
      baseUrl: window.location.origin,
      redirectUrl: `${window.location.origin}/auth/callback`,
    })

    setLoading(false)
  }, [])

  const handleGitHubLogin = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          scopes: "read:user user:email",
        },
      })

      if (error) throw error

      // 登录成功，用户将被重定向
    } catch (error: any) {
      toast({
        title: "登录失败",
        description: error.message || "GitHub 登录过程中发生错误",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>认证调试</CardTitle>
          <CardDescription>诊断 GitHub 登录问题</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {loading ? (
            <p>加载中...</p>
          ) : (
            <>
              {error && (
                <div className="p-4 mb-4 bg-red-50 border border-red-200 rounded-md">
                  <h3 className="font-medium text-red-800">错误信息</h3>
                  <p className="mt-1 text-sm text-red-700">{error}</p>
                </div>
              )}

              <div className="space-y-4">
                <h3 className="font-medium">URL 信息</h3>
                <div className="p-4 bg-muted rounded-md overflow-x-auto">
                  <pre className="text-xs">{JSON.stringify(authConfig, null, 2)}</pre>
                </div>

                <h3 className="font-medium">配置检查清单</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    确保 GitHub OAuth 应用的 <strong>Authorization callback URL</strong> 设置为:{" "}
                    <code>{authConfig?.redirectUrl}</code>
                  </li>
                  <li>确保 Supabase 项目中的 GitHub OAuth 提供商配置正确</li>
                  <li>检查 GitHub OAuth 应用的 Client ID 和 Client Secret 是否正确配置在 Supabase 中</li>
                  <li>确保 GitHub 账户有权访问所需的范围（User Email 权限是必需的）</li>
                </ul>

                <div className="pt-4 space-y-4">
                  <Button onClick={handleGitHubLogin} className="w-full">
                    测试 GitHub 登录 (包含必要权限)
                  </Button>

                  <Link href="/login">
                    <Button variant="outline" className="w-full">
                      返回登录页
                    </Button>
                  </Link>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
