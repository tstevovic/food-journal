import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable } from 'typeorm';
import { Meal } from './Meal';

@Entity('food_items')
export class FoodItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  calories?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  protein?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  carbs?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  fat?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  fiber?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  sugar?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  sodium?: number;

  @Column({ nullable: true })
  brand?: string;

  @Column({ nullable: true })
  barcode?: string;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;

  @ManyToMany(() => Meal, meal => meal.foodItems)
  meals: Meal[];
}
