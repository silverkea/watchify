# Data Model: Movie Watch Party Platform MVP

**Date**: 2025-09-30  
**Feature**: 001-minimal-viable-product

## Core Entities

### Movie
Represents a film with metadata fetched from TMDB API.

```typescript
interface Movie {
  id: number;                    // TMDB movie ID
  title: string;                 // Movie title
  overview: string;              // Synopsis/description
  releaseDate: string;           // ISO date string (YYYY-MM-DD)
  posterPath: string | null;     // Relative path to poster image
  backdropPath: string | null;   // Relative path to backdrop image
  voteAverage: number;           // Star rating (0-10)
  voteCount: number;             // Number of votes
  genres: Genre[];               // Array of genre objects
  runtime: number | null;        // Duration in minutes
  cast: CastMember[];            // Main actors
  popularity: number;            // TMDB popularity score
}
```

**Validation Rules**:
- `id` must be positive integer
- `title` required, max 255 characters
- `overview` max 2000 characters
- `releaseDate` must be valid ISO date
- `voteAverage` range 0-10
- `posterPath` and `backdropPath` start with "/"

**State Transitions**: Immutable - fetched from external API

### Genre
Represents movie categories for filtering.

```typescript
interface Genre {
  id: number;        // TMDB genre ID
  name: string;      // Genre name (e.g., "Action", "Comedy")
}
```

**Validation Rules**:
- `id` must be positive integer
- `name` required, max 50 characters

### CastMember
Represents actors in a movie.

```typescript
interface CastMember {
  id: number;           // TMDB person ID
  name: string;         // Actor name
  character: string;    // Character name
  profilePath: string | null;  // Profile image path
  order: number;        // Billing order
}
```

**Validation Rules**:
- `id` must be positive integer
- `name` and `character` required, max 255 characters
- `order` must be non-negative

### WatchParty
Represents a scheduled viewing event with movie and timing details.

```typescript
interface WatchParty {
  id: string;              // UUID v4
  movieId: number;         // Reference to Movie.id
  movie: Movie;            // Embedded movie data for offline access
  scheduledTime: string;   // ISO timestamp in UTC
  createdAt: string;       // ISO timestamp in UTC
  status: WatchPartyStatus;
  participants: number;    // Count of joined users
  encodedData: string;     // Base64 encoded party data for URL sharing
}

enum WatchPartyStatus {
  SCHEDULED = 'scheduled',
  LIVE = 'live',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}
```

**Validation Rules**:
- `id` must be valid UUID v4
- `movieId` must reference existing movie
- `scheduledTime` must be future timestamp
- `participants` must be non-negative
- `encodedData` must be valid base64

**State Transitions**:
- `SCHEDULED` → `LIVE` (when countdown reaches zero)
- `LIVE` → `COMPLETED` (manual transition or after movie runtime)
- Any status → `CANCELLED` (user action)

### ShareableURL
Represents encoded watch party data for cross-platform sharing.

```typescript
interface ShareableURLData {
  watchPartyId: string;     // Reference to WatchParty.id
  movieId: number;          // Reference to Movie.id
  scheduledTime: string;    // ISO timestamp in UTC
  movieTitle: string;       // Cached for quick display
  moviePoster: string | null; // Cached poster path
}
```

**Validation Rules**:
- All fields required except `moviePoster`
- `watchPartyId` must be valid UUID
- `scheduledTime` must be valid ISO timestamp
- Encoded payload must not exceed 2048 characters (URL length limit)

## Data Relationships

```
Movie (1) ←→ (1) WatchParty
  ↓
Genre (N) ←→ (N) Movie
  ↓
CastMember (N) ←→ (1) Movie

WatchParty (1) ←→ (1) ShareableURLData
```

### Relationship Rules
- **Movie ↔ WatchParty**: One-to-one, embedded for performance
- **Movie ↔ Genre**: Many-to-many, genres embedded in movie object
- **Movie ↔ CastMember**: One-to-many, cast embedded in movie object
- **WatchParty ↔ ShareableURLData**: One-to-one, data derived from party

## Storage Strategy

### External API Data (TMDB)
- **Caching**: 24-hour TTL for movie details
- **Storage**: Vercel KV for frequently accessed movies
- **Fallback**: Error boundaries for API failures

### Watch Party Data (Vercel KV)
- **Primary Key**: UUID v4 for watch parties
- **TTL**: 7 days after completion
- **Backup**: Critical data encoded in shareable URLs

### Client-Side Data (localStorage)
- **Theme Preferences**: `{ theme: 'light' | 'dark' }`
- **Recent Searches**: Array of search terms (max 10)
- **TTL**: Persistent until user clears browser data

## Data Flow Patterns

### Movie Search Flow
1. User enters search query
2. Debounced API call to `/api/movies/search`
3. Server fetches from TMDB with caching
4. Response transformed to Movie interface
5. Client displays results in grid

### Watch Party Creation Flow
1. User selects movie and date/time
2. Client validates input data
3. POST to `/api/watch-party/create` with Movie + datetime
4. Server creates WatchParty with UUID
5. Server generates ShareableURLData
6. Client receives party ID and shareable URL

### Countdown Synchronization Flow
1. Client loads watch party data
2. Server provides UTC timestamp
3. Client calculates local time difference
4. JavaScript timer updates every second
5. Status transitions handled client-side

## Validation Schemas (Zod)

### Movie Validation
```typescript
const MovieSchema = z.object({
  id: z.number().positive(),
  title: z.string().min(1).max(255),
  overview: z.string().max(2000),
  releaseDate: z.string().datetime(),
  posterPath: z.string().nullable(),
  backdropPath: z.string().nullable(),
  voteAverage: z.number().min(0).max(10),
  voteCount: z.number().min(0),
  genres: z.array(GenreSchema),
  runtime: z.number().positive().nullable(),
  cast: z.array(CastMemberSchema),
  popularity: z.number().min(0)
});
```

### WatchParty Validation
```typescript
const WatchPartySchema = z.object({
  id: z.string().uuid(),
  movieId: z.number().positive(),
  movie: MovieSchema,
  scheduledTime: z.string().datetime().refine(
    (date) => new Date(date) > new Date(),
    "Scheduled time must be in the future"
  ),
  createdAt: z.string().datetime(),
  status: z.nativeEnum(WatchPartyStatus),
  participants: z.number().min(0),
  encodedData: z.string().base64()
});
```

## Performance Considerations

### Database Queries
- **Indexing**: UUID primary keys, movie ID secondary indexes
- **Pagination**: 20 items per page for movie search
- **Caching**: Redis-like caching for hot data

### Memory Usage
- **Client**: Limit movie cache to 50 items
- **Server**: Stream large responses, avoid loading all data
- **Images**: Lazy loading with placeholder fallbacks

### Network Optimization
- **Compression**: Gzip for API responses
- **Bundling**: Group related API calls
- **CDN**: Use TMDB's image CDN for posters

---
*Data model complete - Ready for contract generation*