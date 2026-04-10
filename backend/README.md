# Cybertron Webforge - Backend

Production-grade backend for an alien travel platform built with Node.js, Express, and PostgreSQL.

## Features

- User authentication with JWT (access tokens + refresh token cookies)
- Planet discovery and search
- Flight search and booking system
- Seat selection interface
- Payment processing with Stripe
- User profiles and reviews
- Production-ready error handling
- Comprehensive test coverage

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT with bcrypt
- **Validation**: Joi
- **Payment**: Stripe
- **Testing**: Jest + Supertest
- **Other**: CORS, Cookie Parser

## Project Structure

```
src/
├── config/          # Database, constants, environment
├── controllers/     # Request handlers
├── models/         # Database queries and logic
├── routes/         # API route definitions
├── services/       # Business logic layer
├── middleware/     # Auth, error handling
├── utils/          # Validators, token helpers
├── database/       # Migrations and schema
├── app.js          # Express app setup
└── server.js       # Entry point

tests/
├── services/       # Service layer tests
├── models/         # Model tests
└── setup.js        # Test configuration
```

## Installation

Clone the repository and install dependencies:

```bash
npm install
```

## Environment Setup

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Update with your actual credentials:

- PostgreSQL connection URL
- JWT secrets
- Stripe API keys
- Frontend URL for CORS

## Database Setup

Run migrations to create tables:

```bash
npm run migrate
```

## Running the Server

Development mode with auto-reload:

```bash
npm run dev
```

Production mode:

```bash
npm start
```

Server runs on port 5000 by default.

## Running Tests

Execute all tests with coverage:

```bash
npm test
```

Watch mode for development:

```bash
npm run test:watch
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Login with credentials
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout user

### Planets

- `GET /api/planets` - List all planets
- `GET /api/planets/:planetId` - Get planet details
- `GET /api/planets/search?q=name` - Search planets
- `GET /api/planets/:planetId/reviews` - Get planet reviews

### Flights

- `GET /api/flights` - List all flights
- `GET /api/flights/search` - Search flights by route and date
- `GET /api/flights/:flightId` - Get flight details

### Bookings

- `POST /api/bookings` - Create booking (authenticated)
- `GET /api/bookings` - Get user bookings (authenticated)
- `GET /api/bookings/:bookingId` - Get booking details (authenticated)
- `DELETE /api/bookings/:bookingId` - Cancel booking (authenticated)

### Reviews

- `POST /api/reviews/:planetId` - Create review (authenticated)
- `GET /api/reviews` - Get user reviews (authenticated)
- `DELETE /api/reviews/:reviewId` - Delete review (authenticated)

### Payments

- `POST /api/payments` - Process payment (authenticated)
- `GET /api/payments/:paymentId` - Get payment status (authenticated)
- `POST /api/payments/:paymentId/refund` - Refund payment (authenticated)

### Users

- `GET /api/users/profile` - Get user profile (authenticated)
- `PUT /api/users/profile` - Update user profile (authenticated)

## Authentication

The API uses JWT for authentication:

1. Access tokens are returned in JSON response on login/register
2. Refresh tokens are stored in HTTP-only cookies
3. Include access token in Authorization header: `Authorization: Bearer <token>`
4. Refresh tokens automatically via `/api/auth/refresh` endpoint

## Database Schema

Key tables:

- **users** - User accounts and authentication
- **planets** - Alien planets with descriptions
- **flights** - Flights between planets
- **bookings** - User flight reservations
- **booking_seats** - Individual seat assignments
- **reviews** - Planet reviews and ratings
- **payments** - Payment records and status

## Error Handling

Standard error response format:

```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": []
}
```

## Performance Optimizations

- Database connection pooling
- Indexed queries on commonly searched fields
- Pagination support for list endpoints
- Efficient seat management with bulk operations

## Deployment

For production deployment:

1. Set `NODE_ENV=production`
2. Update JWT secrets and Stripe keys
3. Configure database for production load
4. Use environment-specific CORS origins
5. Enable HTTPS for all connections
6. Set secure cookie flags

## Security Notes

- Passwords are hashed with bcrypt (10 rounds)
- JWT secrets should be strong and unique
- Refresh tokens are httpOnly to prevent XSS
- CORS is configured to frontend URL only
- Rate limiting recommended for production
- SQL injection prevention via parameterized queries

## License

MIT
