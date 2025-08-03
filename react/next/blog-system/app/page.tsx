import { BlogPostCard } from "@/components/blog-post-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { createServerClient } from "@/lib/supabase/server"
import type { Post } from "@/types"

export const revalidate = 60 // 每分钟重新验证页面

async function getPosts() {
  const supabase = createServerClient()

  // 首先获取已发布且公开的文章
  const { data: posts, error } = await supabase
    .from("posts")
    .select("*")
    .eq("published", true)
    .eq("is_public", true)
    .order("created_at", { ascending: false })
    .limit(6)

  if (error) {
    console.error("Error fetching posts:", error)
    return []
  }

  // 如果没有文章，直接返回空数组
  if (!posts || posts.length === 0) {
    return []
  }

  // 获取所有作者的用户资料
  const authorIds = [...new Set(posts.map((post) => post.author_id))]
  const { data: profiles, error: profilesError } = await supabase.from("user_profiles").select("*").in("id", authorIds)

  if (profilesError) {
    console.error("Error fetching user profiles:", profilesError)
    // 即使获取用户资料失败，我们仍然返回文章
    return posts as Post[]
  }

  // 将用户资料与文章关联
  const postsWithAuthors = posts.map((post) => {
    const author = profiles?.find((profile) => profile.id === post.author_id)
    return {
      ...post,
      author: author || null,
    }
  })

  return postsWithAuthors as Post[]
}

export default async function Home() {
  const posts = await getPosts()

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="mb-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">我的博客</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">分享关于 Web 开发、设计和技术的见解和教程</p>
        </div>

        <div className="flex justify-center mb-8">
          <Link href="/blog/create">
            <Button size="lg">创建新文章</Button>
          </Link>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6">最新文章</h2>
        {posts.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <BlogPostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">还没有发布的公开文章</p>
            <Link href="/blog/create">
              <Button>创建第一篇文章</Button>
            </Link>
          </div>
        )}
      </section>
    </div>
  )
}
