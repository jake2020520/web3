"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { getSupabaseClient } from "@/lib/supabase/client"
import type { Post } from "@/types"
import { formatDate } from "@/lib/utils"
import { Edit, Trash2, Eye, EyeOff, Globe, Lock } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function Dashboard() {
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const supabase = getSupabaseClient()

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    const fetchPosts = async () => {
      try {
        console.log("Fetching posts for user:", user.id)
        const { data, error } = await supabase
          .from("posts")
          .select("*")
          .eq("author_id", user.id)
          .order("created_at", { ascending: false })

        if (error) {
          throw error
        }

        console.log("Fetched posts:", data)
        setPosts(data as Post[])
      } catch (error: any) {
        console.error("Error fetching posts:", error)
        toast({
          title: "获取文章失败",
          description: error.message || "发生了未知错误，请稍后再试",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchPosts()
  }, [user, router, toast])

  const togglePublishStatus = async (post: Post) => {
    try {
      const { error } = await supabase.from("posts").update({ published: !post.published }).eq("id", post.id)

      if (error) {
        throw error
      }

      setPosts(posts.map((p) => (p.id === post.id ? { ...p, published: !p.published } : p)))

      toast({
        title: post.published ? "文章已设为草稿" : "文章已发布",
        description: post.published ? "文章已从公开列表中移除" : "文章现在可以被公开访问",
      })
    } catch (error: any) {
      toast({
        title: "操作失败",
        description: error.message || "发生了未知错误，请稍后再试",
        variant: "destructive",
      })
    }
  }

  const toggleVisibilityStatus = async (post: Post) => {
    try {
      const { error } = await supabase.from("posts").update({ is_public: !post.is_public }).eq("id", post.id)

      if (error) {
        throw error
      }

      setPosts(posts.map((p) => (p.id === post.id ? { ...p, is_public: !p.is_public } : p)))

      toast({
        title: post.is_public ? "文章已设为私有" : "文章已设为公开",
        description: post.is_public ? "文章现在只有登录用户可见" : "文章现在所有人可见",
      })
    } catch (error: any) {
      toast({
        title: "操作失败",
        description: error.message || "发生了未知错误，请稍后再试",
        variant: "destructive",
      })
    }
  }

  const deletePost = async (postId: string) => {
    try {
      const { error } = await supabase.from("posts").delete().eq("id", postId)

      if (error) {
        throw error
      }

      setPosts(posts.filter((p) => p.id !== postId))

      toast({
        title: "文章已删除",
        description: "文章已成功删除",
      })
    } catch (error: any) {
      toast({
        title: "删除失败",
        description: error.message || "发生了未知错误，请稍后再试",
        variant: "destructive",
      })
    }
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">我的文章</h1>
        <Link href="/blog/create">
          <Button>创建新文章</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>文章管理</CardTitle>
          <CardDescription>管理您的所有博客文章</CardDescription>
        </CardHeader>
        <CardContent>
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">您还没有创建任何文章</p>
              <Link href="/blog/create">
                <Button>创建第一篇文章</Button>
              </Link>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>标题</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>可见性</TableHead>
                  <TableHead>创建日期</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {posts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium">{post.title}</TableCell>
                    <TableCell>
                      {post.published ? (
                        <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                          已发布
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                          草稿
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      {post.is_public ? (
                        <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                          公开
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                          私有
                        </span>
                      )}
                    </TableCell>
                    <TableCell>{formatDate(post.created_at)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => togglePublishStatus(post)}
                          title={post.published ? "设为草稿" : "发布"}
                        >
                          {post.published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => toggleVisibilityStatus(post)}
                          title={post.is_public ? "设为私有" : "设为公开"}
                        >
                          {post.is_public ? <Globe className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                        </Button>
                        <Button variant="outline" size="icon" asChild>
                          <Link href={`/blog/edit/${post.id}`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="icon" className="text-red-500">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>确认删除</AlertDialogTitle>
                              <AlertDialogDescription>您确定要删除这篇文章吗？此操作无法撤销。</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>取消</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deletePost(post.id)}
                                className="bg-red-500 hover:bg-red-600"
                              >
                                删除
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
