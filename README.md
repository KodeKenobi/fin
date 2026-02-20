# Gym Crowding & Booking System

A modern cloud-native platform for gym capacity tracking and slot booking.

## Project Structure
- **/backend**: Fastify API with TypeScript, Mock Repository, and Unit Tests.
- **/mobile**: React Native (Expo) screen with state-driven UI components.
- **/infrastructure**: AWS CDK stack for cloud deployment.

## How to Run

### Backend
1. `cd backend`
2. `npm install`
3. `npm test` - Run unit tests for booking logic.
4. `npm run dev` - Start local development server.

### Mobile
1. `cd mobile`
2. `npm install`
3. (Note: Expo environment required for running on device/simulator).

## Architectural Decisions

### 1. High Concurrency Booking Logic
To handle high concurrency (e.g., Monday 6:00 PM rushes), the booking logic in `GymService` implements a check-and-set pattern.
- **Sensor + Booking Fusion**: The "Live Capacity" is calculated by combining real-time sensor data (`currentFullness`) with active slot bookings.
- **Available Slot Validation**: Bookings are only permitted if total active bookings < (Max Capacity - Current Sensor Count).
- **Scalability Note**: In production, I would use **Redis (ElastiCache)** to perform this check atomically using a Lua script or Redis Transactions (WATCH/MULTI/EXEC) to prevent race conditions across multiple Lambda instances.

### 2. Mobile UI States
The `BookingButton` and `CapacityIndicator` are designed to be "State-First":
- They handle `loading`, `success`, and `error` states gracefully using strict TypeScript types.
- The UI provides immediate visual feedback (e.g., color changes, loading spinners) to enhance the user experience during high-latency network calls.

### 3. Infrastructure as Code
The AWS CDK snippet uses `NodejsFunction` for high-performance bundling and `LambdaRestApi` for simple, scalable routing. This allows the backend to scale automatically with traffic spikes.

---

## Bonus: AWS ElastiCache Optimization
To optimize the `GET /capacity` endpoint for a global user base:
1. **Caching Layer**: Store the fused capacity data (Sensors + Bookings) in ElastiCache (Redis).
2. **TTL Strategy**: Use a short TTL (e.g., 5-10 seconds) for capacity data to ensure "real-time" accuracy while offloading the primary database.
3. **Global Replication**: Use **ElastiCache Global Datastore** to replicate the cache across multiple AWS regions. This ensures that a user in London and a user in New York both get "instant" capacity updates from a local cache with sub-millisecond latency.
4. **Invalidation**: Trigger cache invalidations or updates whenever a new `POST /book` request is successfully processed, ensuring consistency.

## Trade-offs & Improvements
- **Security**: For this case study, auth is omitted. In production, I'd integrate Cognito or JWT validation in the Fastify middleware.
- **Persistence**: Used a mock repository. Real implementation would use DynamoDB with TTLs for temporary slot bookings.
- **Real-time**: Added 30s polling in mobile. For a "premium" feel, I would use **AWS AppSync (GraphQL Subscriptions)** or WebSockets for instant push updates of gym capacity.
