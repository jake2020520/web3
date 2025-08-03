"use client"

import { useState, useEffect } from "react"
import { CommentItem } from "@/components/comment-item"
import { CommentForm } from "@/components/comment-form"
import { getSupabaseClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"
import type { Comment } from "@/types"
import { Separator } from "@/components/ui/separator"

interface CommentsSectionProps {
  postId: string
}

export function CommentsSection({ postId }: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const supabase = getSupabaseClient()

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const { data, error } = await supabase
          .from("comments")
          .select(`
            *,
            user_profiles(id, username, display_name, avatar_url)
          `)
          .eq("post_id", postId)
          .order("created_at", { ascending: false })

        if (error) {
          throw error
        }

        // 转换数据结构以匹配我们的类型
        const formattedComments = data.map((comment) => ({
          ...comment,
          user: comment.user_profiles,
        }))

        setComments(formattedComments)
      } catch (error: any) {
        toast({
          title: "获取评论失败",
          description: error.message || "发生了未知错误，请稍后再试",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchComments()
  }, [postId, toast])

  const handleCommentAdded = (newComment: Comment) => {
    setComments([newComment, ...comments])
  }

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-6">评论</h2>

      <CommentForm postId={postId} onCommentAdded={handleCommentAdded} />

      <Separator className="my-6" />

      {isLoading ? (
        <div className="text-center py-8">
          <p>加载评论中...</p>
        </div>
      ) : comments.length > 0 ? (
        <div className="space-y-1">
          {comments.map((comment) => (
            <div key={comment.id}>
              <CommentItem comment={comment} />
              <Separator />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-muted-foreground">暂无评论，成为第一个评论的人吧！</p>
        </div>
      )}
    </div>
  )
}
