# Now Playing Movies API Contract

**Endpoint**: `GET /api/movies/now-playing`  
**Purpose**: Retrieve movies currently playing in theaters  
**Created**: 2025-10-02  
**Version**: 1.0  

## Overview
This API provides access to movies currently playing in theaters. This serves as the default content for the home page when no search query is active, replacing the previous hardcoded "Marvel" search behavior.

## Request Format

### Query Parameters
| Parameter | Type | Required | Description | Default | Validation |
|-----------|------|----------|-------------|---------|------------|
| `page` | integer | No | Page number for pagination | 1 | Must be 1-1000 |

### Request Examples
```bash
# Get first page of now playing movies
GET /api/movies/now-playing

# Get second page of now playing movies  
GET /api/movies/now-playing?page=2
```

## Response Format

### Success Response (200 OK)
```json
{
  "page": 1,
  "results": [
    {
      "id": 12345,
      "title": "Movie Title",
      "overview": "Movie description",
      "releaseDate": "2025-01-15",
      "posterPath": "/path/to/poster.jpg",
      "backdropPath": "/path/to/backdrop.jpg", 
      "voteAverage": 7.5,
      "voteCount": 1234,
      "genres": [
        {
          "id": 28,
          "name": "Action"
        }
      ],
      "runtime": 120,
      "cast": [
        {
          "id": 67890,
          "name": "Actor Name",
          "character": "Character Name",
          "profilePath": "/path/to/profile.jpg",
          "order": 0
        }
      ],
      "popularity": 98.5
    }
  ],
  "totalPages": 45,
  "totalResults": 892
}
```

### Error Responses

#### 400 Bad Request - Invalid Page
```json
{
  "error": "Invalid page number",
  "message": "Page must be between 1 and 1000",
  "code": "INVALID_PAGE"
}
```

#### 429 Too Many Requests - Rate Limit
```json
{
  "error": "Rate limit exceeded", 
  "message": "Too many requests. Please try again later.",
  "code": "RATE_LIMIT_EXCEEDED",
  "retryAfter": 60
}
```

#### 503 Service Unavailable - External API Down
```json
{
  "error": "Service unavailable",
  "message": "External movie database is temporarily unavailable. Please try again later.",
  "code": "EXTERNAL_API_DOWN"
}
```

#### 500 Internal Server Error - Generic Error
```json
{
  "error": "Internal server error",
  "message": "An unexpected error occurred while fetching now playing movies",
  "code": "INTERNAL_ERROR"
}
```

## Caching Strategy
- **Client Cache**: 30 minutes (more frequent updates than search due to current nature)
- **Server Cache**: 30 minutes with cache key based on page number
- **Cache Headers**: `Cache-Control: public, max-age=1800`

## Rate Limiting
- Inherits TMDB API rate limits
- Error handling with retry-after headers when applicable

## Data Source
- **Primary**: TMDB `/movie/now_playing` endpoint
- **Fallback**: Error response when TMDB unavailable
- **Enrichment**: Cast and genre data fetched from additional TMDB endpoints

## Usage Patterns
- **Home Page Default**: Primary use case for homepage content when no search active
- **Load More**: Supports pagination for browsing more now playing movies
- **Fresh Content**: More dynamic than search results, updated regularly

## Implementation Notes
- Uses same movie transformation logic as search API for consistency
- Includes same cast limiting (5 main cast members) as other endpoints
- Maintains identical error handling patterns with other movie APIs
- Supports same pagination model as search API

## Testing Scenarios
1. **Valid Request**: Verify successful response with properly formatted movie data
2. **Pagination**: Test page parameter validation and sequential page loading  
3. **Rate Limiting**: Verify proper error response when rate limit exceeded
4. **External API Down**: Test graceful failure when TMDB unavailable
5. **Invalid Page**: Test error handling for out-of-range page numbers
6. **Cache Behavior**: Verify caching headers and cache key uniqueness
7. **Data Consistency**: Ensure movie format matches search API response structure