import { createServerClient } from "@/lib/supabase/server"
import type { Category } from "@/types"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export const revalidate = 60 // 每分钟重新验证页面

async function getCategories() {
  const supabase = createServerClient()

  const { data, error } = await supabase.from("categories").select("*").order("name", { ascending: true })

  if (error) {
    console.error("Error fetching categories:", error)
    return []
  }

  return data as Category[]
}

export default async function CategoriesPage() {
  const categories = await getCategories()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">分类</h1>
        <Link href="/categories/manage">
          <Button>管理分类</Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <Link key={category.id} href={`/categories/${category.slug}`}>
            <div className="border rounded-lg p-6 hover:border-primary transition-colors">
              <h2 className="text-xl font-bold mb-2">{category.name}</h2>
              {category.description && <p className="text-muted-foreground">{category.description}</p>}
            </div>
          </Link>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">暂无分类</p>
          <Link href="/categories/manage">
            <Button>创建分类</Button>
          </Link>
        </div>
      )}
    </div>
  )
}
