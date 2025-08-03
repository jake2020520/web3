"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/hooks/use-toast"
import { getSupabaseClient } from "@/lib/supabase/client"
import type { Comment } from "@/types"

interface CommentFormProps {
  postId: string
  onCommentAdded: (comment: Comment) => void
}

export function CommentForm({ postId, onCommentAdded }: CommentFormProps) {
  const [content, setContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { user } = useAuth()
  const { toast } = useToast()
  const supabase = getSupabaseClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast({
        title: "请先登录",
        description: "您需要登录后才能发表评论",
        variant: "destructive",
      })
      return
    }

    if (!content.trim()) {
      toast({
        title: "评论不能为空",
        description: "请输入评论内容",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const { data, error } = await supabase
        .from("comments")
        .insert([
          {
            post_id: postId,
            user_id: user.id,
            content: content.trim(),
          },
        ])
        .select(`
          *,
          user_profiles(id, username, display_name, avatar_url)
        `)
        .single()

      if (error) {
        throw error
      }

      // 转换数据结构以匹配我们的类型
      const newComment: Comment = {
        ...data,
        user: data.user_profiles,
      }

      toast({
        title: "评论已发布",
        description: "您的评论已成功发布",
      })

      setContent("")
      onCommentAdded(newComment)
    } catch (error: any) {
      toast({
        title: "评论发布失败",
        description: error.message || "发生了未知错误，请稍后再试",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        placeholder={user ? "写下您的评论..." : "请先登录后再评论"}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        disabled={!user || isSubmitting}
        className="min-h-[100px]"
      />
      <div className="flex justify-end">
        <Button type="submit" disabled={!user || isSubmitting}>
          {isSubmitting ? "发布中..." : "发布评论"}
        </Button>
      </div>
    </form>
  )
}
