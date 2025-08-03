import { createServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const error = searchParams.get("error")
  const errorDescription = searchParams.get("error_description")

  // 如果有错误，重定向到调试页面
  if (error) {
    return NextResponse.redirect(`${origin}/auth-debug?error=${error}&error_description=${errorDescription}`)
  }

  if (code) {
    const cookieStore = cookies()
    const supabase = createServerClient()

    try {
      const { error } = await supabase.auth.exchangeCodeForSession(code)

      if (error) {
        console.error("Error exchanging code for session:", error)
        return NextResponse.redirect(`${origin}/auth-debug?error=exchange_error&error_description=${error.message}`)
      }
    } catch (err: any) {
      console.error("Unexpected error during code exchange:", err)
      return NextResponse.redirect(`${origin}/auth-debug?error=unexpected_error&error_description=${err.message}`)
    }
  }

  // 成功登录后重定向到仪表板
  return NextResponse.redirect(`${origin}/dashboard`)
}
