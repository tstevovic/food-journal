import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { FoodEntry } from './FoodEntry';

@Entity('days')
export class Day {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'date' })
  date: string;

  @Column({ nullable: true })
  notes?: string;

  @OneToMany(() => FoodEntry, foodEntry => foodEntry.day)
  foodEntries: FoodEntry[];

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;
}
