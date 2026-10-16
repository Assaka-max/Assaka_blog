import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Tag } from "./tag.entity.js";
import { TagWithCountDto } from "../dto/TagWithCountDto.js";

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

  async getList() : Promise<TagWithCountDto[]> {
    const rows = await this.tagRepo
      .createQueryBuilder("tags")
      .leftJoin("post_tags", "pt", "pt.tag_id = tags.id")
      .leftJoin("posts", "p", "p.id = pt.post_id AND p.status = 1")
      .select("tags.id", "id")
      .addSelect("tags.name", "name")
      .addSelect("tags.slug", "slug")
      .addSelect("COUNT(p.id)", "count")
      .groupBy("tags.id")
      .addGroupBy("tags.name")
      .addGroupBy("tags.slug")
      .orderBy("count", "DESC")
      .getRawMany()

    return rows.map((row) => ({
      id: Number(row.id),
      name: row.name,
      slug: row.slug,
      count: Number(row.count),
    }))
  }
}