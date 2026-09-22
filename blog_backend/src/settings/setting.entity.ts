import { Entity, PrimaryColumn, Column, UpdateDateColumn } from 'typeorm'

@Entity('settings')
export class Setting {
  @PrimaryColumn({ length: 64 })
  key: string

  @Column({ type: 'text', nullable: true })
  value: string | null

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}