import { PostCardDto } from "./PostCardDto.js"

export class PostListDto {
  list: PostCardDto[]
  total: number
  page: number
  pageSize: number
}