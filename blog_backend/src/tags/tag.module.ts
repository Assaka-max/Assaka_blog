import { Module } from "@nestjs/common";
import { TagService } from "./tag.service.js";
import { TagController } from "./tag.controller.js";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Tag } from "./tag.entity.js";

@Module({
  imports: [
    TypeOrmModule.forFeature([Tag]),
  ],
  providers: [TagService],
  controllers: [TagController],
  exports: [TagService]
})
export class TagModule{}