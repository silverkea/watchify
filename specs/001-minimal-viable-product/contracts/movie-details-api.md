# API Contract: Movie Details

**Endpoint**: `GET /api/movies/[id]`  
**Description**: Get detailed information for a specific movie  
**Authentication**: None required  

## Request Parameters

### Path Parameters
| Parameter | Type | Required | Description | Validation |
|-----------|------|----------|-------------|------------|
| `id` | number | Yes | TMDB movie ID | Positive integer |

### Example Request
```http
GET /api/movies/550
Accept: application/json
```

## Response Format

### Success Response (200 OK)
```json
{
  "id": 550,
  "title": "Fight Club",
  "overview": "A ticking-time-bomb insomniac and a slippery soap salesman channel primal male aggression into a shocking new form of therapy.",
  "releaseDate": "1999-10-15",
  "posterPath": "/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
  "backdropPath": "/fCayJrkfRaCRCTh8GqN30f8oyQF.jpg",
  "voteAverage": 8.433,
  "voteCount": 27280,
  "genres": [
    {
      "id": 18,
      "name": "Drama"
    },
    {
      "id": 53,
      "name": "Thriller"
    }
  ],
  "runtime": 139,
  "cast": [
    {
      "id": 819,
      "name": "Edward Norton",
      "character": "The Narrator",
      "profilePath": "/5XBzD5WuTyVQZeS4VI25z2moMeY.jpg",
      "order": 0
    },
    {
      "id": 287,
      "name": "Brad Pitt",
      "character": "Tyler Durden",
      "profilePath": "/cckcYc2v0yh1tc9QjRelptcOBko.jpg",
      "order": 1
    }
  ],
  "popularity": 61.416
}
```

### Error Responses

#### 404 Not Found
```json
{
  "error": "Movie not found",
  "message": "Movie with ID 999999 does not exist",
  "code": "MOVIE_NOT_FOUND"
}
```

#### 400 Bad Request
```json
{
  "error": "Invalid movie ID",
  "message": "Movie ID must be a positive integer",
  "code": "INVALID_MOVIE_ID"
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
- Movie ID must be positive integer
- No additional query parameters accepted

### Response Validation
- All required fields must be present
- Cast array limited to top 10 actors
- Genre array contains valid TMDB genres
- All paths are relative to TMDB base URLs

## Performance Requirements
- Response time: < 1 second (cached) / < 3 seconds (fresh)
- Cache TTL: 24 hours for movie details
- Cast information limited to prevent large payloads

## Caching Strategy
- Primary cache: Vercel KV with movie ID as key
- Cache warming: Popular movies pre-cached
- Cache invalidation: Manual or after TMDB updates

## Error Handling
- Return cached data during TMDB outages
- Graceful fallback for missing cast/crew data
- Client retry logic for transient failures

---
*Contract version: 1.0*  
*Last updated: 2025-09-30*