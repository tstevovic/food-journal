# Food Journal Backend

A NodeJS TypeScript backend application for tracking food journal entries with REST API, JWT authentication, and PostgreSQL database.

## Features

- **Authentication**: JWT-based user authentication
- **Food Journal**: Track daily food entries
- **Meal Management**: Create and manage reusable meals
- **Food Items**: Database of food items with nutritional information
- **Day Tracking**: Organize entries by date
- **Validation**: Strong validation using Zod schemas
- **Internationalization**: Multi-language support ready
- **Logging**: Configurable logging system
- **Error Handling**: Comprehensive error handling
- **Type Safety**: Full TypeScript support

## Architecture

- **MVC Pattern**: Clean separation of concerns
- **TypeORM**: Database ORM with PostgreSQL
- **Express**: REST API framework
- **JWT**: Token-based authentication
- **Zod**: Runtime validation
- **UTC Timezone**: All timestamps in UTC

## Project Structure

```
src/
├── config/          # Configuration files
├── controllers/     # Request handlers
├── middleware/      # Express middleware
├── models/          # Database entities
├── routes/          # API routes
├── services/        # Business logic
├── types/           # TypeScript types and validation
├── utils/           # Utility functions
└── locales/         # Internationalization files
```

## Installation

1. Copy environment variables:
   ```bash
   cp .env.example .env
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up your PostgreSQL database and update `.env` with your credentials.

4. Build the project:
   ```bash
   npm run build
   ```

5. Start the server:
   ```bash
   npm start
   ```

For development:
```bash
npm run dev
```

## Environment Variables

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=food_journal_user
DB_PASSWORD=your_password_here
DB_DATABASE=food_journal_db

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=3000
NODE_ENV=development

# Logging Configuration
LOG_LEVEL=info
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)

### Food Journal
- `POST /api/food-journal/days` - Create a day
- `GET /api/food-journal/days` - Get days with optional date range
- `GET /api/food-journal/days/:id` - Get specific day
- `POST /api/food-journal/food-items` - Create food item
- `GET /api/food-journal/food-items` - Get food items
- `POST /api/food-journal/meals` - Create meal
- `GET /api/food-journal/meals` - Get meals
- `POST /api/food-journal/food-entries` - Create food entry
- `GET /api/food-journal/days/:dayId/food-entries` - Get food entries for a day
- `PUT /api/food-journal/food-entries/:id` - Update food entry
- `DELETE /api/food-journal/food-entries/:id` - Delete food entry

### Health Check
- `GET /api/health` - Health check endpoint

## Data Model

### User
- id (UUID)
- email (unique)
- password (hashed)
- firstName (optional)
- lastName (optional)
- timestamps

### FoodItem
- id (UUID)
- name
- calories, protein, carbs, fat, fiber, sugar, sodium (optional)
- brand, barcode (optional)
- timestamps

### Meal
- id (UUID)
- name
- description (optional)
- foodItems (many-to-many relationship)
- timestamps

### Day
- id (UUID)
- date (YYYY-MM-DD)
- notes (optional)
- timestamps

### FoodEntry
- id (UUID)
- quantity
- unit (optional)
- entryTime (timestamp)
- notes (optional)
- user (many-to-one)
- day (many-to-one)
- meal (many-to-one)
- timestamps

## Development

### Scripts
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run dev` - Start development server with hot reload
- `npm test` - Run tests
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues

### Database
The application uses TypeORM with PostgreSQL. In development, the database schema is synchronized automatically. In production, use migrations.

### Validation
All API requests are validated using Zod schemas with internationalized error messages.

### Logging
Configurable logging system that outputs to console. Can be extended to use other logging providers.

## Future Enhancements

- Ingredients and recipes
- Meal planning
- Nutritional analysis
- Image upload for food items
- Social features
- Mobile app API
- Advanced search and filtering
- Export functionality
- Integration with nutrition APIs

## License

ISC
