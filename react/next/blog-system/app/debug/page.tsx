"use client"

import { useAuth } from "@/components/auth-provider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function DebugPage() {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>用户状态调试</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">加载状态:</h3>
              <pre className="bg-muted p-2 rounded-md mt-1">{loading ? "加载中..." : "加载完成"}</pre>
            </div>

            <div>
              <h3 className="font-medium">用户状态:</h3>
              <pre className="bg-muted p-2 rounded-md mt-1 overflow-auto max-h-[300px]">
                {user ? JSON.stringify(user, null, 2) : "未登录"}
              </pre>
            </div>

            <div className="flex gap-4">
              {user ? (
                <Button onClick={() => signOut()}>退出登录</Button>
              ) : (
                <Button onClick={() => router.push("/login")}>去登录</Button>
              )}
              <Button variant="outline" onClick={() => router.push("/")}>
                返回首页
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
