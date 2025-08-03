import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import type { Post } from "@/types"
import { formatDate } from "@/lib/utils"

interface BlogPostCardProps {
  post: Post
}

export function BlogPostCard({ post }: BlogPostCardProps) {
  const author = post.author?.display_name || post.author?.username || "未知作者"

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <div className="text-sm text-muted-foreground mb-1">
          {formatDate(post.created_at)} · {author}
        </div>
        <Link href={`/blog/${post.slug}`} className="hover:underline">
          <h3 className="text-xl font-bold">{post.title}</h3>
        </Link>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-muted-foreground">{post.excerpt || post.content.substring(0, 150) + "..."}</p>
      </CardContent>
      <CardFooter>
        <Link href={`/blog/${post.slug}`} className="w-full">
          <Button variant="outline" className="w-full">
            阅读全文
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
