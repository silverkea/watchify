# HMAC Signature Service Contract

## Service
`SignatureService` (`src/lib/signature.ts`)

## Purpose
Core cryptographic service for generating and validating HMAC SHA256 signatures for watch party share links.

## Interface Definition

### Core Functions

#### `generateSignature(data: SignatureData): string`
Generates HMAC SHA256 signature for watch party parameters.

**Input Schema**:
```typescript
interface SignatureData {
  watchPartyId: string;
  movieId: number;
  scheduledTime: string;
  movieTitle: string;
}
```

**Output**: Base64URL-encoded HMAC SHA256 signature string

**Behavior**:
1. **MUST** normalize input data to consistent string format
2. **MUST** sort parameters alphabetically by key name
3. **MUST** compute HMAC SHA256 using configured secret key
4. **MUST** encode result using Base64URL format
5. **MUST** return deterministic result (same input = same output)

#### `validateSignature(data: SignatureData, signature: string): boolean`
Validates provided signature against computed signature.

**Parameters**:
- `data`: Same SignatureData structure as generation
- `signature`: Base64URL-encoded signature to validate

**Output**: Boolean validation result

**Behavior**:
1. **MUST** generate expected signature using same process as `generateSignature`
2. **MUST** perform constant-time comparison to prevent timing attacks
3. **MUST** return `true` only if signatures match exactly
4. **MUST** handle all error cases gracefully (return `false`)

#### `signShareLink(shareData: ShareableURLData): SignedShareLink`
High-level function to create signed share link from watch party data.

**Input**: Complete ShareableURLData object
**Output**: SignedShareLink with URL and signature

**Behavior**:
1. **MUST** extract signature parameters from share data
2. **MUST** generate signature using extracted parameters
3. **MUST** construct complete signed URL
4. **MUST** validate URL length constraints
5. **MUST** return complete signed link object

#### `verifyShareLink(url: string): ValidationResult`
High-level function to validate complete share link URL.

**Input**: Complete share link URL with signature parameter
**Output**: ValidationResult with success/failure and error details

**Behavior**:
1. **MUST** parse URL and extract parameters
2. **MUST** separate signature from other parameters
3. **MUST** validate signature against remaining parameters
4. **MUST** return detailed validation result

### Configuration Interface

#### `SignatureConfig`
```typescript
interface SignatureConfig {
  secret: string;           // HMAC secret key (32+ characters)
  algorithm: 'sha256';      // Hash algorithm (fixed)
  encoding: 'base64url';    // Output encoding format
}
```

#### `getConfig(): SignatureConfig`
Retrieves signature configuration from environment.

**Behavior**:
1. **MUST** load secret from `SHARE_LINK_SECRET` environment variable
2. **MUST** validate secret is at least 32 characters
3. **MUST** throw error if secret is missing or invalid
4. **MUST** return immutable configuration object

### Data Types

#### `SignatureData`
```typescript
interface SignatureData {
  watchPartyId: string;     // UUID format
  movieId: number;          // Positive integer
  scheduledTime: string;    // ISO 8601 datetime
  movieTitle: string;       // Non-empty string
}
```

#### `SignedShareLink`
```typescript
interface SignedShareLink {
  url: string;              // Complete signed URL
  data: ShareableURLData;   // Original data payload
  signature: string;        // Generated signature
  isValid: boolean;         // Validation status
}
```

#### `ValidationResult`
```typescript
interface ValidationResult {
  isValid: boolean;         // Overall validation result
  error?: string;           // Error message if validation failed
  errorCode?: string;       // Machine-readable error code
}
```

## Error Handling

### Error Codes
- `MISSING_SECRET`: Environment variable not configured
- `INVALID_SECRET`: Secret key too short or invalid format
- `INVALID_DATA`: Input data fails validation
- `ENCODING_ERROR`: Base64URL encoding/decoding failure
- `SIGNATURE_MISMATCH`: Computed signature doesn't match provided
- `URL_TOO_LONG`: Generated URL exceeds length constraints

### Error Behavior
1. **MUST** never throw exceptions for validation failures
2. **MUST** return `false` or error result objects for invalid input
3. **MUST** throw exceptions only for configuration errors
4. **MUST** not expose sensitive information in error messages

## Security Requirements

### Secret Key Management
1. **MUST** load secret from environment variable only
2. **MUST** never log or expose secret key
3. **MUST** validate secret key strength (minimum 32 characters)
4. **MUST** use secure comparison for signature validation

### Cryptographic Requirements
1. **MUST** use HMAC SHA256 algorithm
2. **MUST** use constant-time comparison for signatures
3. **MUST** include all security-relevant parameters in signature
4. **MUST** sort parameters deterministically for consistency

### Parameter Normalization
```typescript
function normalizeSignatureData(data: SignatureData): string {
  // Sort parameters alphabetically
  const params = {
    movieId: data.movieId.toString(),
    movieTitle: data.movieTitle,
    scheduledTime: data.scheduledTime,
    watchPartyId: data.watchPartyId
  };
  
  // Create URL-encoded parameter string
  return Object.keys(params)
    .sort()
    .map(key => `${key}=${encodeURIComponent(params[key])}`)
    .join('&');
}
```

## Test Cases

### Signature Generation Tests
1. **Basic Generation**: Valid data → deterministic signature
2. **Repeatability**: Same input → same signature every time
3. **Different Inputs**: Different data → different signatures
4. **Parameter Order**: Different input order → same signature (sorted)

### Signature Validation Tests
1. **Valid Round-trip**: Generated signature validates successfully
2. **Invalid Signature**: Wrong signature → validation fails
3. **Tampered Data**: Modified data → validation fails
4. **Empty/Null Values**: Invalid input → graceful failure

### Security Tests
1. **Timing Attack**: Constant-time comparison verification
2. **Secret Isolation**: No secret key leakage in any operation
3. **Error Information**: No sensitive data in error messages
4. **Brute Force**: Large number of validations → no performance degradation

### Configuration Tests
1. **Valid Secret**: 32+ character secret → successful configuration
2. **Invalid Secret**: Short secret → configuration error
3. **Missing Secret**: No environment variable → configuration error
4. **Secret Validation**: Only server-side access to secret

## Performance Requirements
- **Generation Time**: <5ms per signature
- **Validation Time**: <5ms per validation
- **Memory Usage**: <1KB per operation
- **CPU Usage**: Minimal impact on request processing

## Usage Examples

### Basic Usage
```typescript
// Generate signature
const data: SignatureData = {
  watchPartyId: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  movieId: 550,
  scheduledTime: '2025-11-01T20:00:00Z',
  movieTitle: 'Fight Club'
};

const signature = generateSignature(data);
// Returns: "YWJjZGVmZ2hpams1NjAwOWZiMjNkNDc2Y2U4MTIzNDU2Nzg5MDEyMzQ1Njc4OTAx"

// Validate signature
const isValid = validateSignature(data, signature);
// Returns: true
```

### High-level Usage
```typescript
// Create signed link
const shareData: ShareableURLData = { /* ... */ };
const signedLink = signShareLink(shareData);

// Verify link
const url = "https://watchify.app/watch-party/...?data=...&sig=...";
const result = verifyShareLink(url);
if (result.isValid) {
  // Allow access
} else {
  // Redirect to home page
}
```

## Dependencies
- Node.js `crypto` module (built-in)
- Environment configuration (`src/lib/env.ts`)
- Type definitions (`src/types/shareable-url.ts`)
- URL encoder utilities (`src/lib/url-encoder.ts`)