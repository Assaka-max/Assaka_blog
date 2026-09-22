import { Controller, Get } from "@nestjs/common";
import { PostService } from "./post.service.js";

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService){}

  @Get("getSum")
  getSum() {
    return this.postService.getSum()
  }
}