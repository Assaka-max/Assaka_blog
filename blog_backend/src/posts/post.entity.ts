import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Tag } from "../tags/tag.entity.js";

@Entity('posts')
export class Post {

  @PrimaryGeneratedColumn({type: 'bigint', unsigned: true})
  id: number

  @Column({length: 255})
  title: string

  @Column({ length: 255, unique: true })
  slug: string

  @Column({ type: 'varchar', length: 500, nullable: true })
  summary: string | null

  @Column({ type: 'longtext' })
  content: string

  @Column({ type: 'tinyint', default: 1 })
  status: number

  @Column({ name: 'view_count', type: 'int', unsigned: true, default: 0 })
  viewCount: number

  @Column({ name: 'published_at', type: 'datetime', nullable: true })
  publishedAt: Date | null

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date

  @ManyToMany(() => Tag)
  @JoinTable({
    name: 'post_tags',
    joinColumn: { name: 'post_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'tag_id', referencedColumnName: 'id' },
  })
  tags: Tag[]
}