import { Injectable, NotFoundException } from "@nestjs/common";
import { Repository } from "typeorm";
import { Post } from "./post.entity.js";
import { InjectRepository } from "@nestjs/typeorm";
import { ArchiveYearDto } from "../dto/ArchiveYearDto.js";
import { PostDto } from "../dto/PostDto.js";

@Injectable()
export class PostService {

  constructor(
    @InjectRepository(Post)
    private readonly postRepo: Repository<Post>,
  ){}

  async getSum() {
    const sum = await this.postRepo.count({where: {status: 1}})
    return sum
  }

  async archive() {
    const posts: Post[] = await this.postRepo.find({
      where: {status: 1},
      order: {publishedAt: 'DESC'}
    })
    if (posts.length === 0) return []
    const yearMap = new Map<number, Post[]>()
    for (const post of posts) {
      const year = post.publishedAt?.getFullYear() ?? new Date().getFullYear()
      if (!yearMap.has(year)) yearMap.set(year, [])
      yearMap.get(year)!.push(post)
    }
    const archiveYears: ArchiveYearDto[] = Array.from(yearMap.entries())
      .map(([year, posts]) => ({
        year,
        posts: posts.map((post) => ({
          title: post.title,
          slug: post.slug,
          publishedAt: post.publishedAt,
        }))
      }))
    return archiveYears
  }

  async getPost(slug: string) {
    const post: PostDto | null = await this.postRepo.findOne({
      where: {slug, status: 1},
      relations: { tags: true },
    })
    if (!post) throw new NotFoundException('Post not found')
    return post
  }
}