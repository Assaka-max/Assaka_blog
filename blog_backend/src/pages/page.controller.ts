import { Controller, Get, Param } from "@nestjs/common";
import { PageService } from "./page.service.js";

@Controller('pages')
export class PageController {
  constructor(private readonly pageService: PageService){}

  @Get(":slug")
  getPage(@Param("slug") slug: string) {
    return this.pageService.getPage(slug)
  }
}