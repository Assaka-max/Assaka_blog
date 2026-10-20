import { InjectRepository } from "@nestjs/typeorm";
import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { Page } from "./page.entity.js";
import { PageDto } from "../dto/PageDto.js";

@Injectable()
export class PageService {
  constructor(
    @InjectRepository(Page)
    private readonly pageRepo: Repository<Page>,
  ){}

  async getPage(slug: string) {
    const page: PageDto = await this.pageRepo.findOne({ where: { slug } })
      .then((page) => page as PageDto)

    return page
  }
}