import { DataSource } from 'typeorm';
import { config } from './config';
import { User } from '@/models/User';
import { FoodItem } from '@/models/FoodItem';
import { Meal } from '@/models/Meal';
import { Day } from '@/models/Day';
import { FoodEntry } from '@/models/FoodEntry';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: config.database.host,
  port: config.database.port,
  username: config.database.username,
  password: config.database.password,
  database: config.database.name,
  synchronize: config.nodeEnv === 'development',
  logging: config.nodeEnv === 'development',
  entities: [User, FoodItem, Meal, Day, FoodEntry],
  migrations: ['src/migrations/*.ts'],
  subscribers: ['src/subscribers/*.ts'],
  timezone: 'UTC',
});
