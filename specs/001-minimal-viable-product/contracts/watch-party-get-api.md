# API Contract: Watch Party Retrieval

**Endpoint**: `GET /api/watch-party/[id]`  
**Description**: Retrieve watch party details by ID or from encoded URL data  
**Authentication**: None required  

## Request Parameters

### Path Parameters
| Parameter | Type | Required | Description | Validation |
|-----------|------|----------|-------------|------------|
| `id` | string | Yes | Watch party UUID | Valid UUID v4 format |

### Query Parameters
| Parameter | Type | Required | Description | Validation |
|-----------|------|----------|-------------|------------|
| `data` | string | No | Base64 encoded party data | Valid base64 string |

### Example Requests
```http
# Direct ID access
GET /api/watch-party/550e8400-e29b-41d4-a716-446655440000
Accept: application/json

# Encoded data access (shareable URL)
GET /api/watch-party/decode?data=eyJpZCI6IjU1MGU4NDAwLWUyOWItNDFkNC1hNzE2LTQ0NjY1NTQ0MDAwMCIsIm1vdmllSWQiOjU1MH0%3D
Accept: application/json
```

## Response Format

### Success Response (200 OK)
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "movieId": 550,
  "movie": {
    "id": 550,
    "title": "Fight Club",
    "overview": "A ticking-time-bomb insomniac and a slippery soap salesman channel primal male aggression into a shocking new form of therapy.",
    "releaseDate": "1999-10-15",
    "posterPath": "/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
    "backdropPath": "/fCayJrkfRaCRCTh8GqN30f8oyQF.jpg",
    "voteAverage": 8.433,
    "voteCount": 27280,
    "runtime": 139,
    "genres": [
      {
        "id": 18,
        "name": "Drama"
      }
    ],
    "cast": [
      {
        "id": 819,
        "name": "Edward Norton",
        "character": "The Narrator"
      }
    ]
  },
  "scheduledTime": "2025-10-01T20:00:00.000Z",
  "createdAt": "2025-09-30T15:30:00.000Z",
  "status": "scheduled",
  "participants": 3,
  "shareableUrl": "https://watchify.vercel.app/party?data=eyJpZCI6IjU1MGU4NDAwLWUyOWItNDFkNC1hNzE2LTQ0NjY1NTQ0MDAwMCIsIm1vdmllSWQiOjU1MH0%3D",
  "timeRemaining": {
    "total": 86400000,
    "days": 1,
    "hours": 0,
    "minutes": 0,
    "seconds": 0
  },
  "localScheduledTime": "2025-10-01T16:00:00.000-04:00"
}
```

### Error Responses

#### 404 Not Found
```json
{
  "error": "Watch party not found",
  "message": "Watch party with ID 550e8400-e29b-41d4-a716-446655440000 does not exist or has expired",
  "code": "WATCH_PARTY_NOT_FOUND"
}
```

#### 400 Bad Request
```json
{
  "error": "Invalid watch party ID",
  "message": "Watch party ID must be a valid UUID",
  "code": "INVALID_WATCH_PARTY_ID"
}
```

#### 422 Unprocessable Entity
```json
{
  "error": "Invalid encoded data",
  "message": "Base64 encoded data is corrupted or invalid",
  "code": "INVALID_ENCODED_DATA"
}
```

#### 410 Gone
```json
{
  "error": "Watch party expired",
  "message": "This watch party has been completed and is no longer available",
  "code": "WATCH_PARTY_EXPIRED"
}
```

## Response Fields

### Core Fields
- `id`: Watch party UUID
- `movieId`: TMDB movie identifier
- `movie`: Complete embedded movie object
- `scheduledTime`: UTC timestamp for party start
- `createdAt`: UTC timestamp of party creation
- `status`: Current party status (scheduled/live/completed/cancelled)
- `participants`: Number of users who have accessed the party

### Computed Fields
- `shareableUrl`: Full URL with encoded data for sharing
- `timeRemaining`: Breakdown of time until party starts (if scheduled)
- `localScheduledTime`: Scheduled time in user's timezone (from Accept-Timezone header)

## Validation Rules

### Request Validation
- UUID must be valid v4 format
- Encoded data must be valid base64
- Decoded data must contain required fields

### Response Validation
- All timestamps in ISO format
- Time remaining calculated server-side
- Movie data validated against schema
- Status transitions follow business rules

## Business Rules
- Expired watch parties (>7 days old) return 410 Gone
- Cancelled watch parties return 410 Gone with cancellation reason
- Live/completed parties show actual status
- Participant count increments on each unique access

## Performance Requirements
- Response time: < 500ms for cached data
- Cache TTL: 5 minutes for active parties, 1 hour for completed
- Real-time status updates for live parties

## Timezone Handling
- All stored timestamps in UTC
- Client timezone detection via browser APIs
- Server respects `Accept-Timezone` header if provided
- Countdown calculations performed client-side

## Security Considerations
- No authentication required for MVP
- Rate limiting: 60 requests per minute per IP
- Encoded URLs contain minimal data to prevent abuse
- No sensitive information in shareable links

## Caching Strategy
- Active parties cached for 5 minutes
- Completed parties cached for 1 hour
- Movie data cached separately for 24 hours
- CDN caching for static movie posters

---
*Contract version: 1.0*  
*Last updated: 2025-09-30*