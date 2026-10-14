import { Injectable, NotFoundException } from "@nestjs/common";
import { Repository } from "typeorm";
import { Post } from "./post.entity.js";
import { InjectRepository } from "@nestjs/typeorm";
import { ArchiveYearDto } from "../dto/ArchiveYearDto.js";
import { PostDto } from "../dto/PostDto.js";
import { PostCardDto } from "../dto/PostCardDto.js";

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

  async getList(page: number, pageSize: number) {
    const total = await this.postRepo.count({where: {status: 1}})
    const posts = await this.postRepo.find({
      select: {
        id: true,
        title: true,
        slug: true,
        summary: true,
        updatedAt: true,
        tags: {id: true, name: true, slug: true},
      },
      where: {status: 1},
      relations: { tags: true },
      order: {updatedAt: 'DESC'},
      skip: (page - 1) * pageSize,
      take: pageSize,
    })

    const list: PostCardDto[] = posts.map((post) => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      summary: post.summary,
      updatedAt: post.updatedAt,
      tags: post.tags.map((tag) => ({
        id: tag.id,
        name: tag.name,
        slug: tag.slug,
      })),
    }))
    return {list, total, page, pageSize}
  }
}