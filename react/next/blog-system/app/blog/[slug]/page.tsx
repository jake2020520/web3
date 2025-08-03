import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { createServerClient } from "@/lib/supabase/server"
import type { Post } from "@/types"
import { formatDate } from "@/lib/utils"
import { notFound } from "next/navigation"
import { CommentsSection } from "@/components/comments-section"
import { EnhancedContent } from "@/components/enhanced-content"

export const revalidate = 60 // 每分钟重新验证页面

async function getPostBySlug(slug: string) {
  const supabase = createServerClient()

  // 首先获取文章
  const { data: post, error } = await supabase.from("posts").select("*").eq("slug", slug).eq("published", true).single()

  if (error) {
    console.error("Error fetching post:", error)
    return null
  }

  // 获取作者信息
  const { data: author, error: authorError } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("id", post.author_id)
    .single()

  if (authorError) {
    console.error("Error fetching author:", authorError)
    // 即使获取作者失败，我们仍然返回文章
    return post as Post
  }

  // 合并文章和作者信息
  return {
    ...post,
    author,
  } as Post
}

async function getCurrentUser() {
  const supabase = createServerClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()
  return session?.user || null
}

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug)
  const currentUser = await getCurrentUser()

  if (!post) {
    notFound()
  }

  // 如果文章不是公开的，并且用户未登录，则显示 404
  if (!post.is_public && !currentUser) {
    notFound()
  }

  const author = post.author?.display_name || post.author?.username || "未知作者"

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        返回首页
      </Link>

      <article className="max-w-3xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
          <div className="text-muted-foreground">
            {formatDate(post.created_at)} · {author}
            {!post.is_public && (
              <span className="ml-2 inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                私有文章
              </span>
            )}
          </div>
        </header>

        <EnhancedContent content={post.content} />

        <CommentsSection postId={post.id} />
      </article>
    </div>
  )
}
