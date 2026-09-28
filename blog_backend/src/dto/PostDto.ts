import { TagDto } from "./TagDto.js"

export class PostDto {
  id: number
  title: string
  slug: string
  content: string
  status: number
  publishedAt: Date | null
  createdAt: Date
  updatedAt: Date
  tags: TagDto[]
}