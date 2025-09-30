# API Contract: Watch Party Creation

**Endpoint**: `POST /api/watch-party/create`  
**Description**: Create a new watch party for a specific movie and time  
**Authentication**: None required for MVP  

## Request Parameters

### Request Body
```json
{
  "movieId": 550,
  "scheduledTime": "2025-10-01T20:00:00.000Z",
  "movie": {
    "id": 550,
    "title": "Fight Club",
    "overview": "A ticking-time-bomb insomniac...",
    "releaseDate": "1999-10-15",
    "posterPath": "/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
    "voteAverage": 8.433,
    "runtime": 139
  }
}
```

### Field Validation
| Field | Type | Required | Description | Validation |
|-------|------|----------|-------------|------------|
| `movieId` | number | Yes | TMDB movie ID | Positive integer |
| `scheduledTime` | string | Yes | ISO timestamp in UTC | Future date/time |
| `movie` | object | Yes | Embedded movie data | Valid Movie schema |

## Response Format

### Success Response (201 Created)
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "movieId": 550,
  "movie": {
    "id": 550,
    "title": "Fight Club",
    "overview": "A ticking-time-bomb insomniac...",
    "releaseDate": "1999-10-15",
    "posterPath": "/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
    "voteAverage": 8.433,
    "runtime": 139
  },
  "scheduledTime": "2025-10-01T20:00:00.000Z",
  "createdAt": "2025-09-30T15:30:00.000Z",
  "status": "scheduled",
  "participants": 1,
  "shareableUrl": "https://watchify.vercel.app/party?data=eyJpZCI6IjU1MGU4NDAwLWUyOWItNDFkNC1hNzE2LTQ0NjY1NTQ0MDAwMCIsIm1vdmllSWQiOjU1MCwic2NoZWR1bGVkVGltZSI6IjIwMjUtMTAtMDFUMjA6MDA6MDAuMDAwWiJ9",
  "encodedData": "eyJpZCI6IjU1MGU4NDAwLWUyOWItNDFkNC1hNzE2LTQ0NjY1NTQ0MDAwMCIsIm1vdmllSWQiOjU1MCwic2NoZWR1bGVkVGltZSI6IjIwMjUtMTAtMDFUMjA6MDA6MDAuMDAwWiJ9"
}
```

### Error Responses

#### 400 Bad Request
```json
{
  "error": "Invalid input data",
  "message": "Scheduled time must be in the future",
  "code": "INVALID_SCHEDULED_TIME",
  "field": "scheduledTime"
}
```

#### 422 Unprocessable Entity
```json
{
  "error": "Validation failed",
  "message": "Movie data validation failed",
  "code": "INVALID_MOVIE_DATA",
  "details": [
    {
      "field": "movie.title",
      "message": "Title is required"
    }
  ]
}
```

#### 500 Internal Server Error
```json
{
  "error": "Failed to create watch party",
  "message": "Database operation failed",
  "code": "DATABASE_ERROR"
}
```

## Validation Rules

### Request Validation
- `movieId` must be positive integer
- `scheduledTime` must be valid ISO timestamp
- `scheduledTime` must be at least 5 minutes in the future
- `movie` object must contain all required fields
- Request body size limited to 10KB

### Response Validation
- Watch party ID is UUID v4 format
- `shareableUrl` contains valid base64 encoded data
- `encodedData` can be decoded back to original party data
- All timestamps in UTC format

## Business Rules
- Watch parties automatically expire 7 days after scheduled time
- Maximum 100 watch parties can be created per IP per day
- Scheduled time cannot be more than 30 days in the future
- Movie data is embedded to ensure availability during viewing

## Performance Requirements
- Response time: < 500ms
- Concurrent creation limit: 50 per second
- Storage efficiency: Use compression for large movie objects

## Security Considerations
- Input sanitization for all text fields
- Rate limiting per IP address
- UUID generation uses cryptographically secure random
- No sensitive data in shareable URLs

## Encoding Format
The `encodedData` contains base64 encoded JSON with minimal party information:

```typescript
interface ShareableURLData {
  id: string;              // Watch party UUID
  movieId: number;         // TMDB movie ID
  scheduledTime: string;   // ISO timestamp
  movieTitle: string;      // For quick display
  moviePoster: string;     // Poster path
}
```

---
*Contract version: 1.0*  
*Last updated: 2025-09-30*