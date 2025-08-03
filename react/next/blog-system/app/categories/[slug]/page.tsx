import { createServerClient } from "@/lib/supabase/server"
import type { Post, Category } from "@/types"
import { BlogPostCard } from "@/components/blog-post-card"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { notFound } from "next/navigation"

export const revalidate = 60 // 每分钟重新验证页面

async function getCategoryBySlug(slug: string) {
  const supabase = createServerClient()

  const { data, error } = await supabase.from("categories").select("*").eq("slug", slug).single()

  if (error) {
    console.error("Error fetching category:", error)
    return null
  }

  return data as Category
}

async function getPostsByCategory(categoryId: string) {
  const supabase = createServerClient()

  // 获取分类关联
  const { data: postRelations, error } = await supabase
    .from("post_categories")
    .select("post_id")
    .eq("category_id", categoryId)

  if (error) {
    console.error("Error fetching post relations:", error)
    return []
  }

  if (!postRelations || postRelations.length === 0) {
    return []
  }

  // 获取文章
  const postIds = postRelations.map((relation) => relation.post_id)
  const { data: posts, error: postsError } = await supabase
    .from("posts")
    .select("*")
    .in("id", postIds)
    .eq("published", true)
    .eq("is_public", true)
    .order("created_at", { ascending: false })

  if (postsError) {
    console.error("Error fetching posts:", postsError)
    return []
  }

  // 获取作者信息
  const authorIds = [...new Set(posts.map((post) => post.author_id))]
  const { data: profiles, error: profilesError } = await supabase.from("user_profiles").select("*").in("id", authorIds)

  if (profilesError) {
    console.error("Error fetching user profiles:", profilesError)
    return posts as Post[]
  }

  // 合并文章和作者信息
  const postsWithAuthors = posts.map((post) => {
    const author = profiles?.find((profile) => profile.id === post.author_id)
    return {
      ...post,
      author: author || null,
    }
  })

  return postsWithAuthors as Post[]
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const category = await getCategoryBySlug(params.slug)

  if (!category) {
    notFound()
  }

  const posts = await getPostsByCategory(category.id)

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/categories" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        返回分类列表
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{category.name}</h1>
        {category.description && <p className="text-muted-foreground">{category.description}</p>}
      </div>

      {posts.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <BlogPostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">该分类下暂无公开文章</p>
          <Link href="/blog/create">
            <Button>创建文章</Button>
          </Link>
        </div>
      )}
    </div>
  )
}
