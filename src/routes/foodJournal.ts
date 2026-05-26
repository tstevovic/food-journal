import { Router } from 'express';
import { FoodJournalController } from '@/controllers/foodJournalController';
import { validateRequest } from '@/middleware/validation';
import { authenticateToken } from '@/middleware/auth';
import {
  createDaySchema,
  createFoodItemSchema,
  createMealSchema,
  createFoodEntrySchema,
  updateFoodEntrySchema,
  dateRangeSchema,
  paginationSchema
} from '@/types/validation';

const router = Router();
const foodJournalController = new FoodJournalController();

// Apply authentication to all food journal routes
router.use(authenticateToken);

// Day routes
router.post('/days', validateRequest(createDaySchema), foodJournalController.createDay);
router.get('/days', validateRequest(dateRangeSchema, 'query'), foodJournalController.getDays);
router.get('/days/:id', foodJournalController.getDay);

// FoodItem routes
router.post('/food-items', validateRequest(createFoodItemSchema), foodJournalController.createFoodItem);
router.get('/food-items', validateRequest(paginationSchema, 'query'), foodJournalController.getFoodItems);

// Meal routes
router.post('/meals', validateRequest(createMealSchema), foodJournalController.createMeal);
router.get('/meals', validateRequest(paginationSchema, 'query'), foodJournalController.getMeals);

// FoodEntry routes
router.post('/food-entries', validateRequest(createFoodEntrySchema), foodJournalController.createFoodEntry);
router.get('/days/:dayId/food-entries', foodJournalController.getFoodEntries);
router.put('/food-entries/:id', validateRequest(updateFoodEntrySchema), foodJournalController.updateFoodEntry);
router.delete('/food-entries/:id', foodJournalController.deleteFoodEntry);

export { router as foodJournalRoutes };
