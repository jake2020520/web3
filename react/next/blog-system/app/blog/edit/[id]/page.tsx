"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { getSupabaseClient } from "@/lib/supabase/client"
import { Checkbox } from "@/components/ui/checkbox"
import { RichTextEditor } from "@/components/rich-text-editor"
import type { Post, Category } from "@/types"
import { notFound } from "next/navigation"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function EditBlogPost({ params }: { params: { id: string } }) {
  const [post, setPost] = useState<Post | null>(null)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [excerpt, setExcerpt] = useState("")
  const [published, setPublished] = useState(false)
  const [visibility, setVisibility] = useState<"private" | "public">("private")
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])

  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const supabase = getSupabaseClient()

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    const fetchPost = async () => {
      try {
        // 获取文章
        const { data: postData, error: postError } = await supabase
          .from("posts")
          .select("*")
          .eq("id", params.id)
          .single()

        if (postError) {
          throw postError
        }

        if (postData.author_id !== user.id) {
          toast({
            title: "无权限",
            description: "您没有权限编辑此文章",
            variant: "destructive",
          })
          router.push("/dashboard")
          return
        }

        setPost(postData as Post)
        setTitle(postData.title)
        setContent(postData.content)
        setExcerpt(postData.excerpt || "")
        setPublished(postData.published)
        setVisibility(postData.is_public ? "public" : "private")

        // 获取分类
        const { data: categoriesData, error: categoriesError } = await supabase
          .from("categories")
          .select("*")
          .order("name", { ascending: true })

        if (categoriesError) {
          throw categoriesError
        }

        setCategories(categoriesData as Category[])

        // 获取文章的分类
        const { data: postCategoriesData, error: postCategoriesError } = await supabase
          .from("post_categories")
          .select("category_id")
          .eq("post_id", params.id)

        if (postCategoriesError) {
          throw postCategoriesError
        }

        setSelectedCategories(postCategoriesData.map((pc) => pc.category_id))
      } catch (error: any) {
        toast({
          title: "获取文章失败",
          description: error.message || "发生了未知错误，请稍后再试",
          variant: "destructive",
        })
        router.push("/dashboard")
      } finally {
        setIsLoading(false)
      }
    }

    fetchPost()
  }, [params.id, user, router, toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user || !post) {
      return
    }

    if (!title.trim() || !content.trim()) {
      toast({
        title: "表单不完整",
        description: "请填写标题和内容",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // 更新文章
      const { error: updateError } = await supabase
        .from("posts")
        .update({
          title,
          content,
          excerpt: excerpt || null,
          published,
          is_public: visibility === "public",
        })
        .eq("id", post.id)

      if (updateError) {
        throw updateError
      }

      // 删除现有的分类关联
      const { error: deleteError } = await supabase.from("post_categories").delete().eq("post_id", post.id)

      if (deleteError) {
        throw deleteError
      }

      // 如果选择了分类，创建新的分类关联
      if (selectedCategories.length > 0) {
        const categoryRelations = selectedCategories.map((categoryId) => ({
          post_id: post.id,
          category_id: categoryId,
        }))

        const { error: insertError } = await supabase.from("post_categories").insert(categoryRelations)

        if (insertError) {
          throw insertError
        }
      }

      toast({
        title: "文章已更新",
        description: "您的文章已成功更新",
      })

      // 重定向到文章页面或仪表板
      if (published) {
        router.push(`/blog/${post.slug}`)
      } else {
        router.push("/dashboard")
      }
    } catch (error: any) {
      toast({
        title: "更新失败",
        description: error.message || "发生了未知错误，请稍后再试",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategories((prev) => {
      if (prev.includes(categoryId)) {
        return prev.filter((id) => id !== categoryId)
      } else {
        return [...prev, categoryId]
      }
    })
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p>加载中...</p>
        </div>
      </div>
    )
  }

  if (!post) {
    return notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>编辑文章</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">标题</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="输入文章标题"
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="excerpt">摘要 (可选)</Label>
              <Textarea
                id="excerpt"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="输入文章摘要..."
                rows={3}
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">内容</Label>
              <RichTextEditor
                content={content}
                onChange={setContent}
                placeholder="开始编写文章内容..."
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label>分类</Label>
              {categories.length > 0 ? (
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((category) => (
                    <div key={category.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`category-${category.id}`}
                        checked={selectedCategories.includes(category.id)}
                        onCheckedChange={() => handleCategoryChange(category.id)}
                        disabled={isSubmitting}
                      />
                      <Label htmlFor={`category-${category.id}`} className="cursor-pointer">
                        {category.name}
                      </Label>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">暂无分类</p>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="published"
                checked={published}
                onCheckedChange={(checked) => setPublished(checked as boolean)}
                disabled={isSubmitting}
              />
              <Label htmlFor="published">发布</Label>
            </div>

            <div className="space-y-2">
              <Label>可见性</Label>
              <RadioGroup value={visibility} onValueChange={(value) => setVisibility(value as "private" | "public")}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="private" id="private" />
                  <Label htmlFor="private">私有 - 仅登录用户可见</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="public" id="public" />
                  <Label htmlFor="public">公开 - 所有人可见</Label>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Link href="/dashboard">
              <Button variant="outline" disabled={isSubmitting}>
                取消
              </Button>
            </Link>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "保存中..." : "保存更改"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
