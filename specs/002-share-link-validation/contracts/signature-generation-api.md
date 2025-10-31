# Signature Generation API Contract

## Endpoint
`POST /api/watch-party/create`

## Purpose
Enhanced watch party creation endpoint that generates signed share links with HMAC validation.

## Request Schema
```json
{
  "type": "object",
  "required": ["movieId", "scheduledTime", "movieTitle"],
  "properties": {
    "movieId": {
      "type": "integer",
      "minimum": 1,
      "description": "TMDB movie identifier"
    },
    "scheduledTime": {
      "type": "string",
      "format": "date-time",
      "description": "ISO 8601 datetime for watch party start"
    },
    "movieTitle": {
      "type": "string",
      "minLength": 1,
      "maxLength": 255,
      "description": "Movie title for display"
    },
    "moviePoster": {
      "type": ["string", "null"],
      "description": "TMDB poster path (optional)"
    }
  }
}
```

## Response Schema

### Success Response (201 Created)
```json
{
  "type": "object",
  "required": ["watchPartyId", "shareUrl", "scheduledTime"],
  "properties": {
    "watchPartyId": {
      "type": "string",
      "format": "uuid",
      "description": "Generated watch party identifier"
    },
    "shareUrl": {
      "type": "string",
      "format": "uri",
      "description": "Complete signed share URL with signature parameter"
    },
    "scheduledTime": {
      "type": "string",
      "format": "date-time",
      "description": "Confirmed watch party start time"
    },
    "movieTitle": {
      "type": "string",
      "description": "Movie title"
    }
  }
}
```

### Error Response (400 Bad Request)
```json
{
  "type": "object",
  "required": ["error", "code"],
  "properties": {
    "error": {
      "type": "string",
      "description": "Human-readable error message"
    },
    "code": {
      "type": "string",
      "enum": ["INVALID_REQUEST", "VALIDATION_ERROR", "SIGNATURE_GENERATION_FAILED"],
      "description": "Machine-readable error code"
    },
    "details": {
      "type": "object",
      "description": "Additional error context (optional)"
    }
  }
}
```

## Behavior Specification

### Input Validation
1. **MUST** validate all required fields are present
2. **MUST** validate `movieId` is positive integer
3. **MUST** validate `scheduledTime` is valid ISO 8601 datetime
4. **MUST** validate `movieTitle` is non-empty and under 255 characters
5. **MUST** validate `scheduledTime` is in the future (if business rule required)

### Signature Generation
1. **MUST** generate unique UUID for `watchPartyId`
2. **MUST** create HMAC SHA256 signature using all URL parameters
3. **MUST** encode signature using Base64URL format
4. **MUST** append signature as `sig` parameter to share URL

### URL Construction
1. **MUST** encode watch party data using existing URL encoder
2. **MUST** construct URL: `/watch-party/{watchPartyId}?data={encoded}&sig={signature}`
3. **MUST** validate final URL length is under 2048 characters
4. **MUST** ensure URL is properly formatted and accessible

### Security Requirements
1. **MUST** use server-side environment variable for HMAC secret
2. **MUST** include all security-relevant parameters in signature
3. **MUST** never expose HMAC secret in response or logs
4. **MUST** use cryptographically secure random UUID generation

## Example Request
```http
POST /api/watch-party/create
Content-Type: application/json

{
  "movieId": 550,
  "scheduledTime": "2025-11-01T20:00:00Z",
  "movieTitle": "Fight Club",
  "moviePoster": "/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg"
}
```

## Example Response
```http
HTTP/1.1 201 Created
Content-Type: application/json

{
  "watchPartyId": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "shareUrl": "https://watchify.app/watch-party/f47ac10b-58cc-4372-a567-0e02b2c3d479?data=eyJ3IjoiZjQ3YWMxMGItNThjYy00MzcyLWE1NjctMGUwMmIyYzNkNDc5IiwibSI6NTUwLCJzIjoiMjAyNS0xMS0wMVQyMDowMDowMFoiLCJ0IjoiRmlnaHQgQ2x1YiIsInAiOiIvcEI4Qk03cGRTcDZCNkloN1FaNERyUTNQbUpLLmpwZyJ9&sig=YWJjZGVmZ2hpams1NjAwOWZiMjNkNDc2Y2U4MTIzNDU2Nzg5MDEyMzQ1Njc4OTAx",
  "scheduledTime": "2025-11-01T20:00:00Z",
  "movieTitle": "Fight Club"
}
```

## Test Cases

### Valid Request Tests
1. **Basic Creation**: Valid movie data → 201 with signed URL
2. **With Poster**: Include poster path → 201 with poster in encoded data
3. **Without Poster**: Null poster → 201 with null poster in data
4. **Future Time**: Scheduled time in future → 201 with confirmed time

### Invalid Request Tests
1. **Missing Movie ID**: No movieId → 400 VALIDATION_ERROR
2. **Invalid Movie ID**: Non-integer or negative → 400 VALIDATION_ERROR
3. **Missing Scheduled Time**: No scheduledTime → 400 VALIDATION_ERROR
4. **Invalid Time Format**: Malformed datetime → 400 VALIDATION_ERROR
5. **Missing Movie Title**: No movieTitle → 400 VALIDATION_ERROR
6. **Empty Movie Title**: Empty string → 400 VALIDATION_ERROR
7. **Title Too Long**: >255 characters → 400 VALIDATION_ERROR

### Security Tests
1. **Signature Verification**: Generated URL has valid signature
2. **Parameter Completeness**: All parameters included in signature
3. **Secret Isolation**: No secret key in response or headers
4. **UUID Uniqueness**: Multiple requests generate unique IDs

### Performance Tests
1. **Response Time**: <200ms for signature generation
2. **URL Length**: Generated URL under 2048 characters
3. **Memory Usage**: No memory leaks in signature generation

## Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| INVALID_REQUEST | 400 | Malformed request body or headers |
| VALIDATION_ERROR | 400 | Request data fails validation rules |
| SIGNATURE_GENERATION_FAILED | 500 | Internal error during signature creation |
| MISSING_SECRET | 500 | Server configuration error (secret not set) |

## Dependencies
- HMAC signature service (`src/lib/signature.ts`)
- URL encoder service (`src/lib/url-encoder.ts`)
- Environment configuration (`src/lib/env.ts`)
- Validation schemas (`src/types/shareable-url.ts`)