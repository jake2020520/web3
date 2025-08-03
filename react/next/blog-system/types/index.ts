export interface Post {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string | null
  author_id: string
  published: boolean
  is_public: boolean
  created_at: string
  updated_at: string
  author?: User
  categories?: Category[]
}

export interface User {
  id: string
  email?: string
  username?: string
  display_name?: string
  avatar_url?: string
  bio?: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
}

export interface Comment {
  id: string
  post_id: string
  user_id: string
  content: string
  created_at: string
  updated_at: string
  user?: User
}
