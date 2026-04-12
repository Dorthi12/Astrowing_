# BotRush Frontend-Backend Integration Plan

## Executive Summary

The BotRush project has a well-structured Express.js backend with PostgreSQL and a React frontend built with Vite. Currently, the frontend and backend are **not connected**. This plan outlines the steps to fully integrate them.

---

## Current Architecture

### Backend (Node.js/Express)

- **Port**: 5000
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT-based (access token + httpOnly refresh cookie)
- **API Routes**:
  - `/api/auth` - Registration, login, token refresh, logout
  - `/api/planets` - Planet data and search
  - `/api/flights` - Flight search and details
  - `/api/bookings` - Booking creation, retrieval, cancellation (protected)
  - `/api/payments` - Payment processing (protected)
  - `/api/reviews` - Reviews management (protected)
  - `/api/users` - User profile and management (protected)

### Frontend (React + Vite)

- **Port**: 5173 (dev) / built static files (production)
- **State Management**: Context API (mostly unimplemented)
- **Routing**: React Router v6
- **UI**: Framer Motion + Tailwind CSS
- **Data**: Currently using mock JSON files

### Infrastructure

- CORS Configuration: Backend already supports CORS from `FRONTEND_URL` env var
- Error Handling: Backend has comprehensive error middleware
- Database: PostgreSQL connection via Prisma

---

## Integration Requirements

### Phase 1: Environment & Configuration ✅

**Objective**: Set up proper environment configuration and API communication layer

#### 1.1 Environment Variables

Create `.env.local` in frontend folder:

```
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_ENV=development
```

Create/Update `.env` in backend folder:

```
DATABASE_URL=postgresql://user:password@localhost:5432/botrush_db
JWT_SECRET=your_secret_key
JWT_REFRESH_SECRET=your_refresh_secret
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
STRIPE_SECRET_KEY=sk_test_xxx
```

#### 1.2 API Service Layer (Frontend)

Create `frontend/src/services/api.js`:

- Configure axios/fetch with base URL
- Add request/response interceptors
- Handle token refresh logic
- Error handling wrapper

Create `frontend/src/services/authService.js`:

- `register(email, password, firstName, lastName)`
- `login(email, password)`
- `logout()`
- `refreshToken()`

Create `frontend/src/services/bookingService.js`:

- `createBooking(flightId, passengers, seats)`
- `getMyBookings(limit, offset)`
- `getBooking(bookingId)`
- `cancelBooking(bookingId)`

Create `frontend/src/services/flightService.js`:

- `getAllFlights()`
- `searchFlights(departure, arrival, date)`
- `getFlightById(flightId)`

Create `frontend/src/services/planetService.js`:

- `getAllPlanets()`
- `searchPlanets(query)`
- `getPlanetById(planetId)`
- `getPlanetReviews(planetId)`

---

### Phase 2: State Management (Frontend) ✅

**Objective**: Implement Context APIs for authentication and user state

#### 2.1 UserContext

File: `frontend/src/context/UserContext.jsx`

- Manage authentication state (isAuthenticated, user, tokens)
- Handle login/logout/register
- Persist auth state to localStorage
- Provide auth check on app load

#### 2.2 BookingContext

File: `frontend/src/context/BookingContext.jsx`

- Manage user bookings list
- Track booking creation state (loading, error)
- Store current booking being edited
- Provide booking CRUD operations

#### 2.3 AppContext (Update)

File: `frontend/src/context/AppContext.jsx`

- Integrate with real planet data from backend
- Replace mock data with API calls
- Combine with user context

---

### Phase 3: Frontend Pages & Components ✅

**Objective**: Connect existing components to backend APIs

#### 3.1 Authentication Pages

- `AlienAuth.jsx` - Connect register/login to AuthService
- Handle JWT token storage securely
- Redirect to home on successful auth
- Show error messages from backend

#### 3.2 Booking Flow

- `Booking.jsx` - Fetch flights from backend
- `SeatSelector.jsx` - Get available seats from flight data
- `Confirmation.jsx` - Submit booking to backend
- Handle loading/error states

#### 3.3 Explore Pages

- `Explore.jsx` - Fetch all planets from `/api/planets`
- `Planet.jsx` - Fetch planet details + reviews
- `MapView.jsx` - Display real flight connections

#### 3.4 User Pages

- `Trips.jsx` - Show user's bookings from `/api/bookings`
- `FlightTracking.jsx` - Real-time booking status

---

### Phase 4: Backend Adjustments (Minor) ✅

**Objective**: Ensure backend is production-ready

#### 4.1 API Response Standardization

```javascript
{
  success: boolean,
  data: {},     // or array
  error?: string,
  statusCode: number
}
```

#### 4.2 Additional Endpoints Needed

- `GET /api/flights/search` - Already exists, test query params
- `POST /api/reviews` - Create review (protected)
- `GET /api/users/profile` - Get current user (protected)
- `PUT /api/users/profile` - Update profile (protected)

#### 4.3 Pagination Standards

Ensure all list endpoints support:

```
?limit=20&offset=0
```

---

### Phase 5: Testing & Validation ✅

**Objective**: Ensure seamless frontend-backend communication

#### 5.1 Manual Testing

- [ ] User registration flow
- [ ] User login/logout
- [ ] Token refresh on expiry
- [ ] Browse planets and flights
- [ ] Create booking
- [ ] View bookings list
- [ ] Cancel booking
- [ ] Add reviews

#### 5.2 Error Scenarios

- [ ] Invalid credentials
- [ ] Expired token
- [ ] Network errors
- [ ] Server errors (5xx)
- [ ] Validation errors (4xx)

#### 5.3 Network Debugging

- Use browser DevTools Network tab
- Monitor API calls and responses
- Check cookies for refresh token

---

### Phase 6: Production Deployment ✅

**Objective**: Deploy both frontend and backend

#### 6.1 Backend Deployment

- Use environment variables for sensitive data
- Set `NODE_ENV=production`
- Use reverse proxy (Nginx/Apache)
- SSL certificates for HTTPS
- Database backups strategy

#### 6.2 Frontend Deployment

- Run `npm run build` to create dist folder
- Set `VITE_API_BASE_URL` to production backend URL
- Serve static files from web server
- Enable gzip compression

#### 6.3 Continuous Integration

- Set up GitHub Actions for testing
- Auto-deploy on main branch push
- Environment-specific configs

---

## Detailed Implementation Steps

### Step 1: Create API Service Layer

```
frontend/src/services/
├── api.js                 # Axios instance + interceptors
├── authService.js        # Auth endpoints
├── bookingService.js     # Booking endpoints
├── flightService.js      # Flight endpoints
├── planetService.js      # Planet endpoints
└── paymentService.js     # Payment endpoints
```

**Key Features**:

- Centralized API base URL
- Automatic token injection in headers
- Token refresh handling
- Global error interceptor
- Request/response logging in dev mode

### Step 2: Implement Auth Context

UserContext features:

- Auto-login on app load (check localStorage)
- Token storage in localStorage (access) + httpOnly cookie (refresh)
- Global loading/error states
- Protect routes based on auth status

### Step 3: Update Existing Pages

Replace mock data with API calls:

- Remove hardcoded JSON data
- Add loading spinners during fetch
- Display error messages
- Handle edge cases (no data, network errors)

### Step 4: Create API Documentation

Document all endpoints:

```
POST /api/auth/register
├── Body: { email, password, firstName, lastName }
├── Response: { user, tokens: { accessToken } }
└── Status: 201 Created

POST /api/auth/login
├── Body: { email, password }
├── Response: { user, tokens: { accessToken } }
├── Cookies: refreshToken (httpOnly)
└── Status: 200 OK
```

---

## File Structure After Integration

```
frontend/
├── src/
│   ├── services/                    # API communication layer
│   │   ├── api.js                  # Axios setup
│   │   ├── authService.js
│   │   ├── bookingService.js
│   │   ├── flightService.js
│   │   ├── planetService.js
│   │   └── paymentService.js
│   ├── context/                     # State management (UPDATED)
│   │   ├── AppContext.jsx          # With real data
│   │   ├── UserContext.jsx         # Auth + user state
│   │   └── BookingContext.jsx      # Booking state
│   ├── pages/                       # Connected to backend
│   ├── components/
│   └── hooks/
├── .env.local                       # NEW
└── package.json
```

---

## Security Considerations

### Frontend

1. **Token Storage**:
   - Access token → localStorage (XSS vulnerable but necessary)
   - Refresh token → httpOnly cookie (CSRF vulnerable but secure against XSS)
2. **CORS**: Backend already configured, only allow trusted origins

3. **HTTPS**: Use HTTPS in production (set `secure: true` for cookies)

4. **Input Validation**: Validate all user input before sending to backend

### Backend

1. ✅ Already has JWT validation
2. ✅ Already has bcrypt password hashing
3. ✅ CORS properly configured
4. ✅ HTTP-only cookies for refresh tokens
5. Consider: Rate limiting, input sanitization, HTTPS enforcement

---

## API Communication Flow

```
User Action
    ↓
Frontend Component
    ↓
Context dispatch (if needed)
    ↓
ApiService (with auth headers + interceptors)
    ↓
Backend API
    ↓
Database Query
    ↓
Response with data/error
    ↓
Context update
    ↓
Component re-render
    ↓
UI Update
```

---

## Timeline Estimate

- **Phase 1**: 2-3 hours (env setup, API service layer)
- **Phase 2**: 3-4 hours (Context implementation)
- **Phase 3**: 4-6 hours (Connect pages to APIs)
- **Phase 4**: 1-2 hours (Backend adjustments)
- **Phase 5**: 2-3 hours (Testing)
- **Phase 6**: 2-4 hours (Deployment setup)

**Total**: 14-22 hours for full integration

---

## Success Criteria

✅ User can register and login  
✅ Authentication tokens persist and refresh automatically  
✅ User can browse planets and flights from database  
✅ User can create and view bookings  
✅ User can logout (tokens cleared)  
✅ All API errors handled gracefully with user messages  
✅ Frontend and backend communicate seamlessly  
✅ Code is production-ready with proper error handling

---

## Next Steps

1. Create the integration plan checklist
2. Set up environment variables
3. Create API service layer with axios
4. Implement UserContext for authentication
5. Connect AlienAuth page to backend auth APIs
6. Test auth flow end-to-end
7. Then proceed with data pages (Booking, Explore, etc.)

---

## References

- Backend API routes: `backend/src/routes/`
- Backend controllers: `backend/src/controllers/`
- Database schema: `backend/prisma/schema.prisma`
- Frontend structure: `frontend/src/`
