import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { FoodItem } from './FoodItem';
import { FoodEntry } from './FoodEntry';

@Entity('meals')
export class Meal {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description?: string;

  @ManyToMany(() => FoodItem, foodItem => foodItem.meals, { cascade: true })
  @JoinTable({
    name: 'meal_food_items',
    joinColumn: { name: 'meal_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'food_item_id', referencedColumnName: 'id' }
  })
  foodItems: FoodItem[];

  @OneToMany(() => FoodEntry, foodEntry => foodEntry.meal)
  foodEntries: FoodEntry[];

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;
}
