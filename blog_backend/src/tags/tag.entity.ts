import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity('tags')
export class Tag {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number

  @Column({ length: 50, unique: true })
  name: string

  @Column({ length: 50, unique: true })
  slug: string

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date
}