import { AppDataSource } from '@/config/database';
import { FoodEntry } from '@/models/FoodEntry';
import { Day } from '@/models/Day';
import { Meal } from '@/models/Meal';
import { FoodItem } from '@/models/FoodItem';
import { logger } from '@/utils/logger';
import { i18n } from '@/utils/i18n';
import { createError } from '@/middleware/errorHandler';
import { CreateFoodEntryInput, UpdateFoodEntryInput, CreateDayInput, CreateMealInput, CreateFoodItemInput } from '@/types/validation';

export class FoodJournalService {
  private foodEntryRepository = AppDataSource.getRepository(FoodEntry);
  private dayRepository = AppDataSource.getRepository(Day);
  private mealRepository = AppDataSource.getRepository(Meal);
  private foodItemRepository = AppDataSource.getRepository(FoodItem);

  // Day operations
  async createDay(userId: string, dayData: CreateDayInput): Promise<Day> {
    try {
      // Check if day already exists for this user and date
      const existingDay = await this.dayRepository.findOne({
        where: { date: dayData.date },
        relations: ['foodEntries']
      });

      if (existingDay) {
        return existingDay;
      }

      const day = this.dayRepository.create(dayData);
      const savedDay = await this.dayRepository.save(day);

      logger.info('Day created successfully', { userId, date: dayData.date });
      return savedDay;
    } catch (error) {
      logger.error('Create day error', { error, userId, date: dayData.date });
      throw createError(i18n.t('server.internal_error'), 500, 'CREATE_DAY_ERROR');
    }
  }

  async getDayById(userId: string, dayId: string): Promise<Day | null> {
    try {
      const day = await this.dayRepository.findOne({
        where: { id: dayId },
        relations: ['foodEntries', 'foodEntries.meal', 'foodEntries.foodItems']
      });

      if (!day) {
        throw createError(i18n.t('day.not_found'), 404, 'DAY_NOT_FOUND');
      }

      return day;
    } catch (error) {
      logger.error('Get day by ID error', { error, userId, dayId });
      throw error;
    }
  }

  async getDaysByDateRange(userId: string, startDate: string, endDate: string): Promise<Day[]> {
    try {
      const days = await this.dayRepository
        .createQueryBuilder('day')
        .leftJoinAndSelect('day.foodEntries', 'foodEntry')
        .leftJoinAndSelect('foodEntry.meal', 'meal')
        .leftJoinAndSelect('foodEntry.foodItems', 'foodItems')
        .where('day.date >= :startDate AND day.date <= :endDate', { startDate, endDate })
        .orderBy('day.date', 'ASC')
        .getMany();

      return days;
    } catch (error) {
      logger.error('Get days by date range error', { error, userId, startDate, endDate });
      throw createError(i18n.t('server.internal_error'), 500, 'GET_DAYS_ERROR');
    }
  }

  // FoodItem operations
  async createFoodItem(userId: string, foodItemData: CreateFoodItemInput): Promise<FoodItem> {
    try {
      const foodItem = this.foodItemRepository.create(foodItemData);
      const savedFoodItem = await this.foodItemRepository.save(foodItem);

      logger.info('Food item created successfully', { userId, foodItemId: savedFoodItem.id });
      return savedFoodItem;
    } catch (error) {
      logger.error('Create food item error', { error, userId, name: foodItemData.name });
      throw createError(i18n.t('server.internal_error'), 500, 'CREATE_FOOD_ITEM_ERROR');
    }
  }

  async getFoodItems(userId: string): Promise<FoodItem[]> {
    try {
      const foodItems = await this.foodItemRepository.find({
        order: { name: 'ASC' }
      });

      return foodItems;
    } catch (error) {
      logger.error('Get food items error', { error, userId });
      throw createError(i18n.t('server.internal_error'), 500, 'GET_FOOD_ITEMS_ERROR');
    }
  }

  // Meal operations
  async createMeal(userId: string, mealData: CreateMealInput): Promise<Meal> {
    try {
      // Load food items
      const foodItems = await this.foodItemRepository.findByIds(
        mealData.foodItems.map(item => item.id)
      );

      if (foodItems.length !== mealData.foodItems.length) {
        throw createError(i18n.t('food_item.not_found'), 404, 'FOOD_ITEM_NOT_FOUND');
      }

      const meal = this.mealRepository.create({
        name: mealData.name,
        description: mealData.description,
        foodItems
      });

      const savedMeal = await this.mealRepository.save(meal);

      logger.info('Meal created successfully', { userId, mealId: savedMeal.id });
      return savedMeal;
    } catch (error) {
      logger.error('Create meal error', { error, userId, name: mealData.name });
      throw error;
    }
  }

  async getMeals(userId: string): Promise<Meal[]> {
    try {
      const meals = await this.mealRepository.find({
        relations: ['foodItems'],
        order: { name: 'ASC' }
      });

      return meals;
    } catch (error) {
      logger.error('Get meals error', { error, userId });
      throw createError(i18n.t('server.internal_error'), 500, 'GET_MEALS_ERROR');
    }
  }

  // FoodEntry operations
  async createFoodEntry(userId: string, entryData: CreateFoodEntryInput): Promise<FoodEntry> {
    try {
      // Verify day exists
      const day = await this.dayRepository.findOne({ where: { id: entryData.dayId } });
      if (!day) {
        throw createError(i18n.t('day.not_found'), 404, 'DAY_NOT_FOUND');
      }

      // Verify meal exists
      const meal = await this.mealRepository.findOne({ 
        where: { id: entryData.mealId },
        relations: ['foodItems']
      });
      if (!meal) {
        throw createError(i18n.t('meal.not_found'), 404, 'MEAL_NOT_FOUND');
      }

      const foodEntry = this.foodEntryRepository.create({
        ...entryData,
        entryTime: new Date(entryData.entryTime),
        day,
        meal
      });

      const savedEntry = await this.foodEntryRepository.save(foodEntry);

      logger.info('Food entry created successfully', { userId, entryId: savedEntry.id });
      return savedEntry;
    } catch (error) {
      logger.error('Create food entry error', { error, userId });
      throw error;
    }
  }

  async getFoodEntriesByDay(userId: string, dayId: string): Promise<FoodEntry[]> {
    try {
      const entries = await this.foodEntryRepository.find({
        where: { day: { id: dayId } },
        relations: ['meal', 'meal.foodItems'],
        order: { entryTime: 'ASC' }
      });

      return entries;
    } catch (error) {
      logger.error('Get food entries by day error', { error, userId, dayId });
      throw createError(i18n.t('server.internal_error'), 500, 'GET_FOOD_ENTRIES_ERROR');
    }
  }

  async updateFoodEntry(userId: string, entryId: string, updateData: UpdateFoodEntryInput): Promise<FoodEntry> {
    try {
      const entry = await this.foodEntryRepository.findOne({
        where: { id: entryId },
        relations: ['day', 'meal']
      });

      if (!entry) {
        throw createError(i18n.t('food_entry.not_found'), 404, 'FOOD_ENTRY_NOT_FOUND');
      }

      if (updateData.entryTime) {
        updateData.entryTime = new Date(updateData.entryTime) as any;
      }

      Object.assign(entry, updateData);
      const updatedEntry = await this.foodEntryRepository.save(entry);

      logger.info('Food entry updated successfully', { userId, entryId });
      return updatedEntry;
    } catch (error) {
      logger.error('Update food entry error', { error, userId, entryId });
      throw error;
    }
  }

  async deleteFoodEntry(userId: string, entryId: string): Promise<void> {
    try {
      const entry = await this.foodEntryRepository.findOne({ where: { id: entryId } });

      if (!entry) {
        throw createError(i18n.t('food_entry.not_found'), 404, 'FOOD_ENTRY_NOT_FOUND');
      }

      await this.foodEntryRepository.remove(entry);

      logger.info('Food entry deleted successfully', { userId, entryId });
    } catch (error) {
      logger.error('Delete food entry error', { error, userId, entryId });
      throw error;
    }
  }
}
