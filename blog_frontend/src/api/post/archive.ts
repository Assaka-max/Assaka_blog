import { http } from "../http"

export interface ArchivePost {
  title: string
  slug: string
  publishedAt: string | null
}

export interface ArchiveYear {
  year: number
  posts: ArchivePost[]
}

export async function getArchive() {
  return await http.get<ArchiveYear[], ArchiveYear[]>('/posts/archive')
}
