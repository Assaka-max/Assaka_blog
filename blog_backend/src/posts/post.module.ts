import { Module } from "@nestjs/common";
import { PostService } from "./post.service.js";
import { PostController } from "./post.controller.js";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Post } from "./post.entity.js";

@Module({
  imports: [
    TypeOrmModule.forFeature([Post]),
  ],
  providers: [PostService],
  controllers: [PostController],
  exports: [PostService]
})
export class PostModule{}