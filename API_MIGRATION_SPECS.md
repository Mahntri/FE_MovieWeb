# API Migration Specifications

This document outlines the API endpoints required to migrate the MovieWeb frontend from using the TMDB API directly to a custom backend.

## Base Configuration
- **Base URL**: `/api/v1` (Recommended)
- **Authentication**: If required, use Bearer Token in headers.
- **Data Format**: JSON

## Endpoints

### 1. Trending
#### Get Trending Movies
- **Endpoint**: `GET /trending/movie`
- **Query Params**:
  - `time_window`: 'day' | 'week' (default: 'week')
- **Response**:
  ```json
  {
    "page": 1,
    "results": [
      {
        "id": 123,
        "title": "Movie Title",
        "poster_path": "/path.jpg",
        "overview": "...",
        "vote_average": 8.5,
        "release_date": "2023-01-01"
      }
    ],
    "total_pages": 100,
    "total_results": 2000
  }
  ```

#### Get Trending TV Shows
- **Endpoint**: `GET /trending/tv`
- **Query Params**:
  - `time_window`: 'day' | 'week' (default: 'week')
  - `page`: number (default: 1)
- **Response**: Same structure as Trending Movies (with `name` instead of `title` for TV).

### 2. Top Rated
#### Get Top Rated Movies
- **Endpoint**: `GET /movie/top_rated`
- **Query Params**:
  - `page`: number (default: 1)
- **Response**: Standard List Response (page, results, total_pages).

#### Get Top Rated TV Shows
- **Endpoint**: `GET /tv/top_rated`
- **Query Params**:
  - `page`: number (default: 1)
- **Response**: Standard List Response.

### 3. Details
#### Get Item Detail
- **Endpoint**: `GET /:category/:id`
- **Params**:
  - `category`: 'movie' | 'tv'
  - `id`: number
- **Response**:
  ```json
  {
    "id": 123,
    "title": "Movie Title", // or name for TV
    "overview": "...",
    "genres": [{ "id": 1, "name": "Action" }],
    "poster_path": "/path.jpg",
    "backdrop_path": "/path.jpg",
    "vote_average": 8.5,
    "status": "Released",
    "runtime": 120,
    "release_date": "2023-01-01"
    // ...other details
  }
  ```

### 4. Resources & Metadata
#### Get Credits (Cast & Crew)
- **Endpoint**: `GET /:category/:id/credits`
- **Params**: `category`, `id`
- **Response**:
  ```json
  {
    "id": 123,
    "cast": [
      { "id": 1, "name": "Actor Name", "character": "Role", "profile_path": "/path.jpg" }
    ],
    "crew": [
      { "id": 2, "name": "Director Name", "job": "Director", "profile_path": "/path.jpg" }
    ]
  }
  ```

#### Get Videos (Trailers)
- **Endpoint**: `GET /:category/:id/videos`
- **Params**: `category`, `id`
- **Response**:
  ```json
  {
    "id": 123,
    "results": [
      { "id": "...", "key": "youtube_id", "name": "Trailer", "site": "YouTube", "type": "Trailer" }
    ]
  }
  ```

#### Get Similar Items
- **Endpoint**: `GET /:category/:id/similar`
- **Params**: `category`, `id`
- **Response**: Standard List Response.

#### Get Images
- **Endpoint**: `GET /:category/:id/images`
- **Params**: `category`, `id`
- **Response**:
  ```json
  {
    "id": 123,
    "backdrops": [{ "file_path": "/path.jpg", "width": 1920, "height": 1080 }],
    "posters": [{ "file_path": "/path.jpg", "width": 500, "height": 750 }]
  }
  ```

### 5. Search
#### Search Movies
- **Endpoint**: `GET /search/movie`
- **Query Params**:
  - `query`: string (required)
  - `page`: number
- **Response**: Standard List Response.

#### Search TV Shows
- **Endpoint**: `GET /search/tv`
- **Query Params**:
  - `query`: string (required)
  - `page`: number
- **Response**: Standard List Response.

### 6. Discovery & Genres
#### Get Genres
- **Endpoint**: `GET /genre/:category/list`
- **Params**: `category` ('movie' | 'tv')
- **Response**:
  ```json
  {
    "genres": [
      { "id": 28, "name": "Action" },
      { "id": 12, "name": "Adventure" }
    ]
  }
  ```

#### Discover Movies by Genre
- **Endpoint**: `GET /discover/movie`
- **Query Params**:
  - `with_genres`: string (comma separated IDs)
  - `page`: number
- **Response**: Standard List Response.

## Notes
- **Standard List Response**:
  ```json
  {
    "page": 1,
    "results": [...],
    "total_pages": 10,
    "total_results": 100
  }
  ```
- **Image Paths**: The frontend likely expects partial paths (e.g., `/abc.jpg`). The backend should either return full URLs or the frontend needs to maintain the base image URL configuration.
- **Error Handling**: Implement standard HTTP error codes (404 for not found, 500 for server error).
