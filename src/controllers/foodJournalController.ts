import { Response } from 'express';
import { FoodJournalService } from '@/services/foodJournalService';
import { logger } from '@/utils/logger';
import { i18n } from '@/utils/i18n';
import { AuthenticatedRequest } from '@/middleware/auth';

export class FoodJournalController {
  private foodJournalService = new FoodJournalService();

  // Day controllers
  async createDay(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        return res.status(401).json({
          error: i18n.t('auth.user_not_found'),
          code: 'USER_NOT_FOUND'
        });
      }

      const day = await this.foodJournalService.createDay(req.user.userId, req.body);

      res.status(201).json({
        message: i18n.t('day.created'),
        data: { day }
      });
    } catch (error: any) {
      logger.error('Create day controller error', { error });
      res.status(error.statusCode || 500).json({
        error: error.message,
        code: error.code || 'CREATE_DAY_ERROR'
      });
    }
  }

  async getDay(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        return res.status(401).json({
          error: i18n.t('auth.user_not_found'),
          code: 'USER_NOT_FOUND'
        });
      }

      const day = await this.foodJournalService.getDayById(req.user.userId, req.params.id);

      res.json({
        data: { day }
      });
    } catch (error: any) {
      logger.error('Get day controller error', { error });
      res.status(error.statusCode || 500).json({
        error: error.message,
        code: error.code || 'GET_DAY_ERROR'
      });
    }
  }

  async getDays(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        return res.status(401).json({
          error: i18n.t('auth.user_not_found'),
          code: 'USER_NOT_FOUND'
        });
      }

      const { startDate, endDate } = req.query as any;
      const days = await this.foodJournalService.getDaysByDateRange(
        req.user.userId,
        startDate,
        endDate
      );

      res.json({
        data: { days }
      });
    } catch (error: any) {
      logger.error('Get days controller error', { error });
      res.status(error.statusCode || 500).json({
        error: error.message,
        code: error.code || 'GET_DAYS_ERROR'
      });
    }
  }

  // FoodItem controllers
  async createFoodItem(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        return res.status(401).json({
          error: i18n.t('auth.user_not_found'),
          code: 'USER_NOT_FOUND'
        });
      }

      const foodItem = await this.foodJournalService.createFoodItem(req.user.userId, req.body);

      res.status(201).json({
        message: i18n.t('food_item.created'),
        data: { foodItem }
      });
    } catch (error: any) {
      logger.error('Create food item controller error', { error });
      res.status(error.statusCode || 500).json({
        error: error.message,
        code: error.code || 'CREATE_FOOD_ITEM_ERROR'
      });
    }
  }

  async getFoodItems(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        return res.status(401).json({
          error: i18n.t('auth.user_not_found'),
          code: 'USER_NOT_FOUND'
        });
      }

      const foodItems = await this.foodJournalService.getFoodItems(req.user.userId);

      res.json({
        data: { foodItems }
      });
    } catch (error: any) {
      logger.error('Get food items controller error', { error });
      res.status(error.statusCode || 500).json({
        error: error.message,
        code: error.code || 'GET_FOOD_ITEMS_ERROR'
      });
    }
  }

  // Meal controllers
  async createMeal(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        return res.status(401).json({
          error: i18n.t('auth.user_not_found'),
          code: 'USER_NOT_FOUND'
        });
      }

      const meal = await this.foodJournalService.createMeal(req.user.userId, req.body);

      res.status(201).json({
        message: i18n.t('meal.created'),
        data: { meal }
      });
    } catch (error: any) {
      logger.error('Create meal controller error', { error });
      res.status(error.statusCode || 500).json({
        error: error.message,
        code: error.code || 'CREATE_MEAL_ERROR'
      });
    }
  }

  async getMeals(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        return res.status(401).json({
          error: i18n.t('auth.user_not_found'),
          code: 'USER_NOT_FOUND'
        });
      }

      const meals = await this.foodJournalService.getMeals(req.user.userId);

      res.json({
        data: { meals }
      });
    } catch (error: any) {
      logger.error('Get meals controller error', { error });
      res.status(error.statusCode || 500).json({
        error: error.message,
        code: error.code || 'GET_MEALS_ERROR'
      });
    }
  }

  // FoodEntry controllers
  async createFoodEntry(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        return res.status(401).json({
          error: i18n.t('auth.user_not_found'),
          code: 'USER_NOT_FOUND'
        });
      }

      const foodEntry = await this.foodJournalService.createFoodEntry(req.user.userId, req.body);

      res.status(201).json({
        message: i18n.t('food_entry.created'),
        data: { foodEntry }
      });
    } catch (error: any) {
      logger.error('Create food entry controller error', { error });
      res.status(error.statusCode || 500).json({
        error: error.message,
        code: error.code || 'CREATE_FOOD_ENTRY_ERROR'
      });
    }
  }

  async getFoodEntries(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        return res.status(401).json({
          error: i18n.t('auth.user_not_found'),
          code: 'USER_NOT_FOUND'
        });
      }

      const entries = await this.foodJournalService.getFoodEntriesByDay(req.user.userId, req.params.dayId);

      res.json({
        data: { entries }
      });
    } catch (error: any) {
      logger.error('Get food entries controller error', { error });
      res.status(error.statusCode || 500).json({
        error: error.message,
        code: error.code || 'GET_FOOD_ENTRIES_ERROR'
      });
    }
  }

  async updateFoodEntry(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        return res.status(401).json({
          error: i18n.t('auth.user_not_found'),
          code: 'USER_NOT_FOUND'
        });
      }

      const foodEntry = await this.foodJournalService.updateFoodEntry(
        req.user.userId,
        req.params.id,
        req.body
      );

      res.json({
        message: i18n.t('food_entry.updated'),
        data: { foodEntry }
      });
    } catch (error: any) {
      logger.error('Update food entry controller error', { error });
      res.status(error.statusCode || 500).json({
        error: error.message,
        code: error.code || 'UPDATE_FOOD_ENTRY_ERROR'
      });
    }
  }

  async deleteFoodEntry(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        return res.status(401).json({
          error: i18n.t('auth.user_not_found'),
          code: 'USER_NOT_FOUND'
        });
      }

      await this.foodJournalService.deleteFoodEntry(req.user.userId, req.params.id);

      res.json({
        message: i18n.t('food_entry.deleted')
      });
    } catch (error: any) {
      logger.error('Delete food entry controller error', { error });
      res.status(error.statusCode || 500).json({
        error: error.message,
        code: error.code || 'DELETE_FOOD_ENTRY_ERROR'
      });
    }
  }
}
