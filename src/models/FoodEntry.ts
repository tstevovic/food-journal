import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';
import { Day } from './Day';
import { Meal } from './Meal';

@Entity('food_entries')
export class FoodEntry {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  quantity: number;

  @Column({ nullable: true })
  unit?: string;

  @Column({ type: 'timestamp with time zone' })
  entryTime: Date;

  @Column({ nullable: true })
  notes?: string;

  @ManyToOne(() => User, user => user.foodEntries, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Day, day => day.foodEntries, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'day_id' })
  day: Day;

  @ManyToOne(() => Meal, meal => meal.foodEntries, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'meal_id' })
  meal: Meal;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;
}
