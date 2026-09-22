import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Tag } from "./tag.entity.js";

@Injectable()
export class TagService {

  constructor(
    @InjectRepository(Tag)
    private readonly tagRepo: Repository<Tag>
  ){}

  async getSum() {
    const sum = await this.tagRepo.count()
    return sum
  }
}