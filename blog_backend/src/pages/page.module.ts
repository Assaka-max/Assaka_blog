import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Page } from "./page.entity.js";
import { PageService } from "./page.service.js";
import { PageController } from "./page.controller.js";

@Module({
  imports: [
    TypeOrmModule.forFeature([Page]),
  ],
  providers: [PageService],
  controllers: [PageController],
  exports: [PageService],
})
export class PageModule {}
 