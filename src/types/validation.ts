import { z } from 'zod';

// User validation schemas
export const createUserSchema = z.object({
  email: z.string().email('validation.invalid_email'),
  password: z.string().min(8, 'validation.invalid_password'),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});

export const loginUserSchema = z.object({
  email: z.string().email('validation.invalid_email'),
  password: z.string().min(1, 'validation.required_field'),
});

export const updateUserSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
}).partial();

// FoodItem validation schemas
export const createFoodItemSchema = z.object({
  name: z.string().min(1, 'validation.required_field'),
  calories: z.number().positive().optional(),
  protein: z.number().min(0).optional(),
  carbs: z.number().min(0).optional(),
  fat: z.number().min(0).optional(),
  fiber: z.number().min(0).optional(),
  sugar: z.number().min(0).optional(),
  sodium: z.number().min(0).optional(),
  brand: z.string().optional(),
  barcode: z.string().optional(),
});

export const updateFoodItemSchema = createFoodItemSchema.partial();

// Meal validation schemas
export const createMealSchema = z.object({
  name: z.string().min(1, 'validation.required_field'),
  description: z.string().optional(),
  foodItems: z.array(z.object({
    id: z.string().uuid(),
    quantity: z.number().positive(),
    unit: z.string().optional(),
  })).min(1, 'validation.required_field'),
});

export const updateMealSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  foodItems: z.array(z.object({
    id: z.string().uuid(),
    quantity: z.number().positive(),
    unit: z.string().optional(),
  })).optional(),
}).partial();

// Day validation schemas
export const createDaySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'validation.invalid_date'),
  notes: z.string().optional(),
});

export const updateDaySchema = z.object({
  notes: z.string().optional(),
}).partial();

// FoodEntry validation schemas
export const createFoodEntrySchema = z.object({
  dayId: z.string().uuid(),
  mealId: z.string().uuid(),
  quantity: z.number().positive(),
  unit: z.string().optional(),
  entryTime: z.string().datetime(),
  notes: z.string().optional(),
});

export const updateFoodEntrySchema = z.object({
  quantity: z.number().positive().optional(),
  unit: z.string().optional(),
  entryTime: z.string().datetime().optional(),
  notes: z.string().optional(),
}).partial();

// Query parameter schemas
export const dateRangeSchema = z.object({
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'validation.invalid_date').optional(),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'validation.invalid_date').optional(),
});

export const paginationSchema = z.object({
  page: z.string().transform(Number).pipe(z.number().positive().default(1)).optional(),
  limit: z.string().transform(Number).pipe(z.number().positive().max(100).default(20)).optional(),
});

// Type exports
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type LoginUserInput = z.infer<typeof loginUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type CreateFoodItemInput = z.infer<typeof createFoodItemSchema>;
export type UpdateFoodItemInput = z.infer<typeof updateFoodItemSchema>;
export type CreateMealInput = z.infer<typeof createMealSchema>;
export type UpdateMealInput = z.infer<typeof updateMealSchema>;
export type CreateDayInput = z.infer<typeof createDaySchema>;
export type UpdateDayInput = z.infer<typeof updateDaySchema>;
export type CreateFoodEntryInput = z.infer<typeof createFoodEntrySchema>;
export type UpdateFoodEntryInput = z.infer<typeof updateFoodEntrySchema>;
export type DateRangeQuery = z.infer<typeof dateRangeSchema>;
export type PaginationQuery = z.infer<typeof paginationSchema>;
