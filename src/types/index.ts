// Movie-related types from TMDB API
export interface Movie {
  id: number;
  title: string;
  overview: string;
  releaseDate: string;
  posterPath: string | null;
  backdropPath: string | null;
  voteAverage: number;
  voteCount: number;
  genres: Genre[];
  runtime: number | null;
  cast: CastMember[];
  popularity: number;
}

export interface Genre {
  id: number;
  name: string;
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profilePath: string | null;
  order: number;
}

// Watch Party types (stateless - URL encoded)
export interface WatchParty {
  id: string;
  movieId: number;
  movie: Movie;
  scheduledTime: string;
  createdAt: string;
  status: WatchPartyStatus;
  participants: number;
  encodedData: string;
}

export enum WatchPartyStatus {
  SCHEDULED = 'scheduled',
  LIVE = 'live',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export interface ShareableURLData {
  watchPartyId: string;
  movieId: number;
  scheduledTime: string;
  movieTitle: string;
  moviePoster: string | null;
}

// API Response types
export interface MovieSearchResponse {
  page: number;
  results: Movie[];
  totalPages: number;
  totalResults: number;
}

export interface MovieDetailsResponse extends Movie {
  // Additional details from TMDB
  belongsToCollection?: {
    id: number;
    name: string;
    posterPath: string | null;
    backdropPath: string | null;
  };
  budget?: number;
  revenue?: number;
  status?: string;
  tagline?: string;
}

export interface GenresResponse {
  genres: Genre[];
}

// API Error types
export interface APIError {
  message: string;
  status?: number;
  code?: string;
}