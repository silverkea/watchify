# Signature Validation Contract

## Endpoint
`GET /watch-party/[id]` (Next.js page route)

## Purpose
Server-side signature validation during watch party page rendering to ensure link authenticity.

## Request Parameters

### Path Parameters
- `id`: Watch party UUID (from URL path)

### Query Parameters
```json
{
  "type": "object",
  "required": ["data", "sig"],
  "properties": {
    "data": {
      "type": "string",
      "description": "Base64URL encoded watch party data"
    },
    "sig": {
      "type": "string",
      "description": "Base64URL encoded HMAC SHA256 signature"
    }
  }
}
```

## Response Behavior

### Valid Signature (200 OK)
- **Action**: Render watch party page with decoded data
- **Content**: Full watch party page HTML
- **Headers**: Standard Next.js page headers

### Invalid Signature (302 Redirect)
- **Action**: Silent redirect to home page
- **Location**: `/` (home page)
- **Headers**: `Location: /`
- **Body**: Empty (redirect response)

### Missing Parameters (302 Redirect)
- **Action**: Silent redirect to home page
- **Location**: `/` (home page)
- **Reason**: Missing `data` or `sig` parameters

## Validation Process

### Step 1: Parameter Extraction
1. **MUST** extract `data` parameter from query string
2. **MUST** extract `sig` parameter from query string
3. **MUST** validate both parameters are present and non-empty
4. **IF** missing parameters → redirect to home page

### Step 2: Data Decoding
1. **MUST** decode `data` parameter using existing URL decoder
2. **MUST** validate decoded data structure matches schema
3. **MUST** extract signature parameters for validation
4. **IF** decoding fails → redirect to home page

### Step 3: Signature Verification
1. **MUST** compute HMAC signature using decoded parameters
2. **MUST** perform constant-time comparison with provided signature
3. **MUST** validate signature format is Base64URL
4. **IF** signature invalid → redirect to home page

### Step 4: Access Decision
1. **IF** signature valid → render page with watch party data
2. **IF** signature invalid → silent redirect to home page
3. **MUST** not display error messages for security failures

## Security Requirements

### Signature Validation Rules
1. **MUST** include all URL parameters except `sig` in calculation
2. **MUST** sort parameters alphabetically for consistency
3. **MUST** use same HMAC secret as generation endpoint
4. **MUST** perform constant-time signature comparison

### Parameter Inclusion
```typescript
// Parameters included in signature validation
const signatureParams = {
  watchPartyId: string,  // From decoded data
  movieId: number,       // From decoded data
  scheduledTime: string, // From decoded data
  movieTitle: string     // From decoded data
  // Excludes: moviePoster, sig
};
```

### Error Handling
1. **MUST** never expose signature validation errors to user
2. **MUST** redirect silently for all validation failures
3. **MUST** log security events for monitoring (optional)
4. **MUST** not include sensitive data in logs

## Example Valid Request
```http
GET /watch-party/f47ac10b-58cc-4372-a567-0e02b2c3d479?data=eyJ3IjoiZjQ3YWMxMGItNThjYy00MzcyLWE1NjctMGUwMmIyYzNkNDc5IiwibSI6NTUwLCJzIjoiMjAyNS0xMS0wMVQyMDowMDowMFoiLCJ0IjoiRmlnaHQgQ2x1YiJ9&sig=YWJjZGVmZ2hpams1NjAwOWZiMjNkNDc2Y2U4MTIzNDU2Nzg5MDEyMzQ1Njc4OTAx
Host: watchify.app
```

## Example Valid Response
```http
HTTP/1.1 200 OK
Content-Type: text/html; charset=utf-8

<!DOCTYPE html>
<html>
  <!-- Watch party page HTML content -->
</html>
```

## Example Invalid Request
```http
GET /watch-party/f47ac10b-58cc-4372-a567-0e02b2c3d479?data=eyJ3IjoiZjQ3YWMxMGItNThjYy00MzcyLWE1NjctMGUwMmIyYzNkNDc5IiwibSI6NTUwLCJzIjoiMjAyNS0xMS0wMVQyMDowMDowMFoiLCJ0IjoiRmlnaHQgQ2x1YiJ9&sig=invalid_signature
Host: watchify.app
```

## Example Invalid Response
```http
HTTP/1.1 302 Found
Location: /
```

## Test Cases

### Valid Signature Tests
1. **Complete Valid URL**: All parameters valid → 200 with page content
2. **Round-trip Validation**: Generated URL validates successfully
3. **Special Characters**: Movie titles with special chars → valid signature
4. **Unicode Support**: Non-ASCII movie titles → valid signature

### Invalid Signature Tests
1. **Tampered Data**: Modified `data` parameter → 302 redirect
2. **Tampered Signature**: Modified `sig` parameter → 302 redirect
3. **Wrong Secret**: Signature from different secret → 302 redirect
4. **Parameter Injection**: Additional URL parameters → 302 redirect

### Missing Parameter Tests
1. **Missing Data**: No `data` parameter → 302 redirect
2. **Missing Signature**: No `sig` parameter → 302 redirect
3. **Empty Parameters**: Empty string values → 302 redirect
4. **Malformed URL**: Invalid query string → 302 redirect

### Decoding Error Tests
1. **Invalid Base64**: Malformed `data` encoding → 302 redirect
2. **Invalid JSON**: Corrupted data structure → 302 redirect
3. **Schema Mismatch**: Missing required fields → 302 redirect
4. **Type Errors**: Wrong data types → 302 redirect

### Security Tests
1. **Timing Attack**: Constant-time signature comparison
2. **Error Information**: No error details in redirect response
3. **Log Analysis**: No sensitive data in server logs
4. **Secret Isolation**: No secret key exposure in any response

## Performance Requirements
- **Validation Time**: <50ms for signature verification
- **Memory Usage**: <1MB additional memory per request
- **CPU Usage**: <10ms CPU time for HMAC computation
- **Cache Friendly**: Validation doesn't break HTTP caching

## Implementation Notes

### Validation Order
1. Parameter presence check (fast fail)
2. Data decoding (moderate cost)
3. Signature verification (crypto operation)
4. Page rendering or redirect

### Error Logging
```typescript
// Example logging (implementation detail)
logger.security('signature_validation_failed', {
  timestamp: new Date(),
  watchPartyId: id,
  hasData: !!data,
  hasSignature: !!sig,
  // DO NOT LOG: actual signature values or secret
});
```

### Performance Optimization
- Early exit on missing parameters
- Reuse decoded data for page rendering
- Cache signature validation results (if applicable)
- Minimize memory allocations during validation

## Dependencies
- HMAC signature service (`src/lib/signature.ts`)
- URL decoder service (`src/lib/url-encoder.ts`)
- Environment configuration (`src/lib/env.ts`)
- Next.js page routing and SSR