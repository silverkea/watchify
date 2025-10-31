# Data Model: Share Link Validation

## Overview
Data structures and schemas for HMAC signature validation of watch party share links.

## Core Entities

### SignatureData
```typescript
interface SignatureData {
  // Parameters included in signature calculation
  watchPartyId: string;      // UUID of the watch party
  movieId: number;           // TMDB movie identifier
  scheduledTime: string;     // ISO 8601 datetime string
  movieTitle: string;        // Movie title for display
}
```

**Validation Rules**:
- `watchPartyId`: Must be valid UUID format
- `movieId`: Must be positive integer
- `scheduledTime`: Must be valid ISO 8601 datetime
- `movieTitle`: Must be non-empty string, max 255 characters

### SignatureResult
```typescript
interface SignatureResult {
  signature: string;         // Base64URL-encoded HMAC SHA256
  isValid: boolean;          // Validation result
  error?: string;           // Error message if validation failed
}
```

### SignedShareLink
```typescript
interface SignedShareLink {
  url: string;              // Complete signed URL
  data: ShareableURLData;   // Original data payload
  signature: string;        // Generated signature
  expiresAt?: Date;        // Optional expiration (future enhancement)
}
```

## Enhanced Schemas

### SignatureRequestSchema
```typescript
export const SignatureRequestSchema = z.object({
  watchPartyId: z.string().uuid(),
  movieId: z.number().int().positive(),
  scheduledTime: z.string().datetime(),
  movieTitle: z.string().min(1).max(255),
  moviePoster: z.string().nullable().optional()
});

export type SignatureRequest = z.infer<typeof SignatureRequestSchema>;
```

### SignedURLSchema
```typescript
export const SignedURLSchema = z.object({
  data: z.string().min(1), // Base64URL encoded data
  sig: z.string().min(1)   // Base64URL encoded signature
});

export type SignedURLParams = z.infer<typeof SignedURLSchema>;
```

### SignatureConfigSchema
```typescript
export const SignatureConfigSchema = z.object({
  secret: z.string().min(32), // HMAC secret key
  algorithm: z.literal('sha256'),
  encoding: z.literal('base64url')
});

export type SignatureConfig = z.infer<typeof SignatureConfigSchema>;
```

## State Transitions

### Link Generation Flow
```
ShareableURLData → SignatureData → HMAC → SignedShareLink
     ↓                ↓             ↓           ↓
  [validate]    [normalize]   [compute]   [construct URL]
```

### Link Validation Flow
```
URL Parameters → Extract Signature → Validate → Access Decision
      ↓               ↓                ↓           ↓
  [parse URL]   [separate sig]   [verify HMAC]  [allow/deny]
```

## Relationships

### Signature to ShareableURLData
- **One-to-One**: Each ShareableURLData has exactly one valid signature
- **Immutable**: Changing any data parameter invalidates the signature
- **Deterministic**: Same data always produces same signature

### SignatureData to URL Parameters
- **Subset**: SignatureData contains only parameters needed for signature
- **Normalized**: Parameters sorted alphabetically for consistent hashing
- **Encoded**: All values converted to strings for hash input

## Validation Rules

### Signature Validation
1. **Extract**: Parse signature from URL parameters
2. **Normalize**: Sort remaining parameters alphabetically
3. **Compute**: Generate HMAC using normalized parameters
4. **Compare**: Constant-time comparison of signatures
5. **Decide**: Grant/deny access based on match

### Parameter Inclusion Logic
```typescript
function getSignatureParameters(data: ShareableURLData): SignatureData {
  return {
    watchPartyId: data.watchPartyId,
    movieId: data.movieId.toString(),
    scheduledTime: data.scheduledTime,
    movieTitle: data.movieTitle
    // Excludes: moviePoster (not security-critical)
  };
}
```

### Normalization Rules
1. **Sort**: Parameters by key name alphabetically
2. **Format**: `key=value` pairs separated by `&`
3. **Encoding**: URL encoding applied to values
4. **Consistency**: Same input always produces same string

## Error States

### Signature Generation Errors
- `MISSING_SECRET`: Environment variable not configured
- `INVALID_DATA`: Input data fails validation
- `ENCODING_ERROR`: Base64URL encoding failure

### Signature Validation Errors
- `MISSING_SIGNATURE`: No signature parameter in URL
- `INVALID_FORMAT`: Malformed signature format
- `SIGNATURE_MISMATCH`: Computed signature doesn't match provided
- `PARAMETER_MISSING`: Required parameter missing from URL

## Security Properties

### Integrity Protection
- Any modification to URL parameters invalidates signature
- Signature covers all security-relevant parameters
- Cryptographically secure HMAC prevents forgery

### Authentication Verification
- Only server with secret key can generate valid signatures
- Signature proves link was created by authentic application
- No way to forge signatures without secret key

### Non-Repudiation
- Signature proves link origin (application with secret key)
- Timestamp in scheduledTime provides temporal context
- Audit trail possible through signature verification logs

## Performance Characteristics

### Memory Usage
- **SignatureData**: ~100 bytes per instance
- **Signature**: 44 bytes (Base64URL SHA256)
- **Total Overhead**: <150 bytes per signed link

### Computation Complexity
- **Generation**: O(1) - constant time HMAC computation
- **Validation**: O(1) - constant time comparison
- **Parameter Sorting**: O(n log n) where n is small (~4-6 parameters)

### Network Impact
- **URL Size Increase**: +44 characters for signature parameter
- **Additional Parameters**: +1 query parameter per URL
- **Total Impact**: <5% increase in typical URL length