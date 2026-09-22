import { Controller, Get } from "@nestjs/common";
import { TagService } from "./tag.service.js";

@Controller("tags")
export class TagController {
  constructor(private readonly tagService: TagService){}

  @Get("getSum")
  getSum() {
    return this.tagService.getSum()
  }
}