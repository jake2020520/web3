import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatDate } from "@/lib/utils"
import type { Comment } from "@/types"

interface CommentItemProps {
  comment: Comment
}

export function CommentItem({ comment }: CommentItemProps) {
  const username = comment.user?.display_name || comment.user?.username || "未知用户"
  const avatarUrl = comment.user?.avatar_url || "/placeholder.svg?height=40&width=40"
  const initial = username.charAt(0).toUpperCase()

  return (
    <div className="flex gap-4 py-4">
      <Avatar className="h-10 w-10">
        <AvatarImage src={avatarUrl || "/placeholder.svg"} alt={username} />
        <AvatarFallback>{initial}</AvatarFallback>
      </Avatar>
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <div className="font-medium">{username}</div>
          <div className="text-xs text-muted-foreground">{formatDate(comment.created_at)}</div>
        </div>
        <p className="text-sm text-foreground">{comment.content}</p>
      </div>
    </div>
  )
}
