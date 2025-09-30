# API Contract: Movie Search

**Endpoint**: `GET /api/movies/search`  
**Description**: Search for movies using TMDB API with caching  
**Authentication**: None required  

## Request Parameters

### Query Parameters
| Parameter | Type | Required | Description | Validation |
|-----------|------|----------|-------------|------------|
| `q` | string | Yes | Search query | Min 1 char, max 100 chars |
| `page` | number | No | Page number (default: 1) | Min 1, max 1000 |
| `genre` | number | No | Genre ID filter | Valid TMDB genre ID |

### Example Request
```http
GET /api/movies/search?q=action%20movies&page=1&genre=28
Accept: application/json
```

## Response Format

### Success Response (200 OK)
```json
{
  "results": [
    {
      "id": 550,
      "title": "Fight Club",
      "overview": "A ticking-time-bomb insomniac...",
      "releaseDate": "1999-10-15",
      "posterPath": "/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
      "backdropPath": "/fCayJrkfRaCRCTh8GqN30f8oyQF.jpg",
      "voteAverage": 8.433,
      "voteCount": 27280,
      "genres": [
        {
          "id": 18,
          "name": "Drama"
        }
      ],
      "runtime": 139,
      "popularity": 61.416
    }
  ],
  "page": 1,
  "totalPages": 42,
  "totalResults": 832
}
```

### Error Responses

#### 400 Bad Request
```json
{
  "error": "Invalid search query",
  "message": "Search query must be between 1 and 100 characters",
  "code": "INVALID_QUERY"
}
```

#### 429 Too Many Requests
```json
{
  "error": "Rate limit exceeded",
  "message": "Too many requests to external API",
  "code": "RATE_LIMIT_EXCEEDED",
  "retryAfter": 60
}
```

#### 503 Service Unavailable
```json
{
  "error": "External API unavailable",
  "message": "Movie database service is temporarily unavailable",
  "code": "EXTERNAL_API_DOWN"
}
```

## Validation Rules

### Request Validation
- Search query (`q`) must be URL-encoded
- Page number must be positive integer
- Genre ID must exist in TMDB genre list

### Response Validation
- All movie objects must include required fields
- Poster and backdrop paths are relative to TMDB image base URL
- Vote average is decimal between 0-10
- Release date is ISO format (YYYY-MM-DD)

## Performance Requirements
- Response time: < 2 seconds
- Cache TTL: 1 hour for search results
- Rate limiting: 10 requests per second per IP

## Error Handling
- Graceful degradation when TMDB API is down
- Client-side error boundaries for failed requests
- Retry logic with exponential backoff

## Security Considerations
- API key stored server-side only
- Input sanitization for search queries
- CORS headers for browser requests

---
*Contract version: 1.0*  
*Last updated: 2025-09-30*