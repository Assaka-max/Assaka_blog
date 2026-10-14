import { Controller, Get, Param, Query } from "@nestjs/common";
import { PostService } from "./post.service.js";

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService){}

  @Get("getSum")
  getSum() {
    return this.postService.getSum()
  }

  @Get("archive")
  archive() {
    return this.postService.archive()
  }

  @Get(":slug")
  getPost(@Param("slug") slug: string) {
    return this.postService.getPost(slug)
  }

  @Get()
  getList(
    @Query("page") page: string,
    @Query("pageSize") pageSize: string,
  ) {
    const currentPage = Math.max(1, Number(page) || 1)
    const size = Math.min(50, Math.max(1, Number(pageSize) || 10))
    return this.postService.getList(currentPage, size)
  }
}