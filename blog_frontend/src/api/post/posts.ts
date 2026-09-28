import { http } from "../http";

export interface PostTag {
  id: number
  name: string
  slug: string
}

export interface Post {
  id: number
  title: string
  slug: string
  content: string
  status: number
  publishedAt: string | null
  createdAt: string
  updatedAt: string
  tags: PostTag[]
}

export async function getPostsSum() {
  return http.get<number, number>("/posts/getSum")
}

export function getPost(slug: string) {
  return http.get<Post, Post>(`/posts/${slug}`)
}