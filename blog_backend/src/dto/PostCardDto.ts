import { TagDto } from "./TagDto.js"

export class PostCardDto {
  id: number
  title: string
  slug: string
  summary: string | null
  updatedAt: Date
  tags: TagDto[]
}