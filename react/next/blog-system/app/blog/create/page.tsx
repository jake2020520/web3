"use client"

import React from "react"

import { useState } from "react"
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
import type { Category } from "@/types"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function CreateBlogPost() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [excerpt, setExcerpt] = useState("")
  const [published, setPublished] = useState(false)
  const [visibility, setVisibility] = useState<"private" | "public">("private")
  const [isLoading, setIsLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [loadingCategories, setLoadingCategories] = useState(true)

  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const supabase = getSupabaseClient()

  React.useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase.from("categories").select("*").order("name", { ascending: true })

        if (error) {
          throw error
        }

        setCategories(data as Category[])
      } catch (error: any) {
        toast({
          title: "获取分类失败",
          description: error.message || "发生了未知错误，请稍后再试",
          variant: "destructive",
        })
      } finally {
        setLoadingCategories(false)
      }
    }

    fetchCategories()
  }, [toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    console.log("Current user in create blog:", user)

    if (!user) {
      toast({
        title: "未登录",
        description: "请先登录后再创建文章",
        variant: "destructive",
      })
      router.push("/login")
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

    setIsLoading(true)

    try {
      // 确保我们有用户ID
      if (!user.id) {
        throw new Error("用户ID不存在")
      }

      // 生成唯一的 slug
      const slug =
        title
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^\w-]+/g, "")
          .replace(/--+/g, "-")
          .replace(/^-+/, "")
          .replace(/-+$/, "") +
        "-" +
        Date.now().toString().slice(-6)

      // 创建文章
      const { data, error } = await supabase
        .from("posts")
        .insert([
          {
            title,
            content,
            excerpt: excerpt || null,
            author_id: user.id,
            published,
            slug,
            is_public: visibility === "public",
          },
        ])
        .select()

      if (error) {
        throw error
      }

      const postId = data[0].id

      // 如果选择了分类，创建文章与分类的关联
      if (selectedCategories.length > 0) {
        const categoryRelations = selectedCategories.map((categoryId) => ({
          post_id: postId,
          category_id: categoryId,
        }))

        const { error: relationError } = await supabase.from("post_categories").insert(categoryRelations)

        if (relationError) {
          throw relationError
        }
      }

      toast({
        title: "文章创建成功",
        description: published ? "您的文章已发布" : "您的文章已保存为草稿",
      })

      // 重定向到新创建的文章页面或仪表板
      if (published) {
        router.push(`/blog/${data[0].slug}`)
      } else {
        router.push("/dashboard")
      }
    } catch (error: any) {
      toast({
        title: "创建失败",
        description: error.message || "发生了未知错误，请稍后再试",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
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

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>创建新文章</CardTitle>
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
                disabled={isLoading}
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
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">内容</Label>
              <RichTextEditor
                content={content}
                onChange={setContent}
                placeholder="开始编写文章内容..."
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label>分类</Label>
              {loadingCategories ? (
                <p className="text-sm text-muted-foreground">加载分类中...</p>
              ) : categories.length > 0 ? (
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((category) => (
                    <div key={category.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`category-${category.id}`}
                        checked={selectedCategories.includes(category.id)}
                        onCheckedChange={() => handleCategoryChange(category.id)}
                        disabled={isLoading}
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
                disabled={isLoading}
              />
              <Label htmlFor="published">立即发布</Label>
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
            <Link href="/">
              <Button variant="outline" disabled={isLoading}>
                取消
              </Button>
            </Link>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "保存中..." : published ? "发布文章" : "保存为草稿"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
