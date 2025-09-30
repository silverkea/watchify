# API Contract: Genre Listing

**Endpoint**: `GET /api/genres`  
**Description**: Retrieve list of available movie genres from TMDB API with caching  
**Authentication**: None required  

## Request Parameters

### Query Parameters
| Parameter | Type | Required | Description | Validation |
|-----------|------|----------|-------------|------------|
| None | - | - | No parameters required | - |

### Example Request
```http
GET /api/genres
Accept: application/json
```

## Response Format

### Success Response (200 OK)
```json
{
  "genres": [
    {
      "id": 28,
      "name": "Action"
    },
    {
      "id": 12,
      "name": "Adventure"
    },
    {
      "id": 16,
      "name": "Animation"
    },
    {
      "id": 35,
      "name": "Comedy"
    },
    {
      "id": 80,
      "name": "Crime"
    },
    {
      "id": 99,
      "name": "Documentary"
    },
    {
      "id": 18,
      "name": "Drama"
    },
    {
      "id": 10751,
      "name": "Family"
    },
    {
      "id": 14,
      "name": "Fantasy"
    },
    {
      "id": 36,
      "name": "History"
    },
    {
      "id": 27,
      "name": "Horror"
    },
    {
      "id": 10402,
      "name": "Music"
    },
    {
      "id": 9648,
      "name": "Mystery"
    },
    {
      "id": 10749,
      "name": "Romance"
    },
    {
      "id": 878,
      "name": "Science Fiction"
    },
    {
      "id": 10770,
      "name": "TV Movie"
    },
    {
      "id": 53,
      "name": "Thriller"
    },
    {
      "id": 10752,
      "name": "War"
    },
    {
      "id": 37,
      "name": "Western"
    }
  ]
}
```

### Error Response (503 Service Unavailable)
```json
{
  "error": "External movie API unavailable",
  "message": "Unable to fetch genre data from TMDB. Please try again later.",
  "code": "EXTERNAL_API_ERROR"
}
```

### Error Response (500 Internal Server Error)
```json
{
  "error": "Internal server error",
  "message": "An unexpected error occurred while processing your request.",
  "code": "INTERNAL_ERROR"
}
```

## Response Schema

### Genre Object
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | number | Yes | TMDB genre ID |
| `name` | string | Yes | Human-readable genre name |

### Success Response Schema
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `genres` | Genre[] | Yes | Array of genre objects |

## Implementation Notes

- Genres are fetched from TMDB API `/genre/movie/list` endpoint
- Response should be cached for 24 hours to reduce API calls
- Genre IDs are standardized by TMDB and remain consistent
- Used for filtering movies in search results
- Should handle TMDB API rate limits gracefully

## Usage Example

```typescript
// Frontend usage in GenreFilter component
const response = await fetch('/api/genres');
const data = await response.json();
const genres = data.genres; // Array of {id, name} objects
```

## Related Endpoints

- `GET /api/movies/search?genre={id}` - Search movies by genre
- Genres are embedded in movie objects from other endpoints