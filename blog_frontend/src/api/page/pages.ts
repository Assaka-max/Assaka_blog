import { http } from "../http"

export interface Page {
  id: number
  title: string
  slug: string
  content: string
  status: number
  createdAt: string
  updatedAt: string
}

export async function getPage(slug: string) {
  return http.get<Page, Page>(`/pages/${slug}`)
}
