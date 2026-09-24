import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { Post } from "./post.entity.js";
import { InjectRepository } from "@nestjs/typeorm";

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
}