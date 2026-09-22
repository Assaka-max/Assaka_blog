import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm'

@Entity('pages')
export class Page {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number

  @Column({ length: 255 })
  title: string

  @Column({ length: 255, unique: true })
  slug: string

  @Column({ type: 'longtext' })
  content: string

  @Column({ type: 'tinyint', default: 1 })
  status: number

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}