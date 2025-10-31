# Quickstart: Share Link Validation Implementation

## Overview
Quick implementation guide for adding HMAC signature validation to watch party share links. Follow these steps to implement secure link authentication in the correct order.

## Prerequisites
- Watchify development environment set up
- Access to modify environment variables
- Understanding of existing URL encoding system

## Phase 1: Environment Setup (5 minutes)

### 1. Generate Secret Key
```bash
# Generate a secure 32+ character secret key
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2. Add Environment Variable
Add to `.env.local`:
```bash
SHARE_LINK_SECRET=your_generated_secret_key_here
```

### 3. Update Environment Configuration
Add to `src/lib/env.ts`:
```typescript
export const env = {
  // ... existing variables
  SHARE_LINK_SECRET: process.env.SHARE_LINK_SECRET!,
} as const

// Add validation
if (!env.SHARE_LINK_SECRET || env.SHARE_LINK_SECRET.length < 32) {
  throw new Error('SHARE_LINK_SECRET must be at least 32 characters')
}
```

## Phase 2: Core Service Implementation (15 minutes)

### 1. Create Signature Service
Create `src/lib/signature.ts`:
```typescript
import { createHmac } from 'crypto';
import { env } from './env';
import { SignatureData } from '@/types/shareable-url';

export function generateSignature(data: SignatureData): string {
  // Implementation follows contract specification
}

export function validateSignature(data: SignatureData, signature: string): boolean {
  // Implementation follows contract specification
}
```

### 2. Create Tests First (TDD)
Create `tests/unit/signature.test.ts`:
```typescript
import { generateSignature, validateSignature } from '@/lib/signature';

describe('Signature Service', () => {
  it('should generate deterministic signatures', () => {
    // Test implementation
  });
  
  it('should validate generated signatures', () => {
    // Test implementation
  });
});
```

### 3. Run Tests (Should Fail)
```bash
npm test signature.test.ts
# Expected: All tests fail (no implementation yet)
```

## Phase 3: URL Encoder Enhancement (10 minutes)

### 1. Add Signature Support
Enhance `src/lib/url-encoder.ts`:
```typescript
import { generateSignature, validateSignature } from './signature';

export function generateWatchPartyURL(baseUrl: string, data: ShareableURLData): string {
  // 1. Encode data using existing logic
  // 2. Generate signature from data
  // 3. Append signature parameter
  // 4. Return signed URL
}

export function parseWatchPartyURL(url: string): { watchPartyId: string; data: ShareableURLData } {
  // 1. Extract signature parameter
  // 2. Validate signature before decoding
  // 3. Throw error if signature invalid
  // 4. Return parsed data if valid
}
```

### 2. Add Type Definitions
Add to `src/types/shareable-url.ts`:
```typescript
export interface SignatureData {
  watchPartyId: string;
  movieId: number;
  scheduledTime: string;
  movieTitle: string;
}

export const SignedURLSchema = z.object({
  data: z.string().min(1),
  sig: z.string().min(1)
});
```

## Phase 4: API Integration (10 minutes)

### 1. Enhance Watch Party Creation
Update `src/app/api/watch-party/create/route.ts`:
```typescript
import { generateWatchPartyURL } from '@/lib/url-encoder';

export async function POST(request: NextRequest) {
  // ... existing validation logic
  
  // Generate signed URL
  const shareUrl = generateWatchPartyURL(baseUrl, watchPartyData);
  
  return NextResponse.json({
    watchPartyId,
    shareUrl, // Now includes signature
    // ... other response fields
  });
}
```

### 2. Add Validation to Page Route
Update `src/app/watch-party/[id]/page.tsx`:
```typescript
import { parseWatchPartyURL } from '@/lib/url-encoder';

export default function WatchPartyPage({ params }: WatchPartyPageProps) {
  // Early validation during SSR
  try {
    const url = constructFullURL(params.id, searchParams);
    const { watchPartyId, data } = parseWatchPartyURL(url);
    // Continue with existing logic
  } catch (error) {
    // Signature validation failed - redirect
    redirect('/');
  }
}
```

## Phase 5: Testing & Validation (10 minutes)

### 1. Create Contract Tests
Create `tests/contract/signature-validation.test.ts`:
```typescript
describe('Signature Validation Contract', () => {
  it('should generate valid signed URLs', async () => {
    // Test API endpoint returns signed URLs
  });
  
  it('should validate authentic signatures', () => {
    // Test page accepts valid signatures
  });
  
  it('should reject tampered URLs', () => {
    // Test page rejects invalid signatures
  });
});
```

### 2. Run Full Test Suite
```bash
npm test
# Expected: All tests pass
```

### 3. Integration Test
```bash
# Start development server
npm run dev

# Test URL generation
curl -X POST http://localhost:3000/api/watch-party/create \
  -H "Content-Type: application/json" \
  -d '{"movieId": 550, "scheduledTime": "2025-11-01T20:00:00Z", "movieTitle": "Fight Club"}'

# Test URL validation (use generated URL from above)
curl -I http://localhost:3000/watch-party/[generated-id]?data=[data]&sig=[signature]
# Expected: 200 OK for valid signature, 302 redirect for invalid
```

## Phase 6: Manual Testing (5 minutes)

### 1. Create Watch Party
1. Navigate to home page
2. Search for a movie
3. Create watch party
4. Verify generated share URL includes `&sig=` parameter

### 2. Test Valid Link
1. Copy generated share URL
2. Open in new browser/incognito window
3. Verify watch party page loads correctly

### 3. Test Invalid Link
1. Copy generated share URL
2. Modify any parameter (data or sig)
3. Open modified URL
4. Verify redirect to home page (no error message)

## Verification Checklist

### ✅ Environment Setup
- [ ] Secret key generated and configured
- [ ] Environment validation added
- [ ] No secret key in version control

### ✅ Core Implementation
- [ ] Signature service follows contract
- [ ] All unit tests pass
- [ ] URL encoder enhanced with signature support

### ✅ Integration
- [ ] API creates signed URLs
- [ ] Page validates signatures during SSR
- [ ] Invalid signatures redirect silently

### ✅ Security Validation
- [ ] Secret key never exposed to client
- [ ] Signature covers all relevant parameters
- [ ] Timing attacks prevented (constant-time comparison)

### ✅ Functionality Test
- [ ] Valid URLs load watch party pages
- [ ] Invalid URLs redirect to home page
- [ ] No error messages displayed for security failures

## Common Issues & Solutions

### Issue: Tests Failing
**Solution**: Ensure test environment has `SHARE_LINK_SECRET` set
```bash
# In test setup
process.env.SHARE_LINK_SECRET = 'test_secret_key_at_least_32_characters_long'
```

### Issue: URLs Too Long
**Solution**: Check signature is Base64URL encoded (not Base64)
```typescript
// Correct encoding
signature.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
```

### Issue: Signature Mismatch
**Solution**: Verify parameter sorting and encoding consistency
```typescript
// Parameters must be sorted alphabetically
const params = Object.keys(data).sort()
```

### Issue: Client-Side Errors
**Solution**: Ensure validation happens server-side only
```typescript
// In page component - validate during SSR, not client-side
if (typeof window === 'undefined') {
  // Server-side validation only
}
```

## Performance Notes
- Signature generation: ~1ms per URL
- Signature validation: ~1ms per request
- URL size increase: ~44 characters
- No impact on existing caching behavior

## Security Notes
- Secret key must be 32+ characters
- Never log signature values
- Use constant-time comparison
- Silent failures for better security

## Next Steps
After successful implementation:
1. Monitor signature validation in logs
2. Consider adding signature expiration (future enhancement)
3. Set up alerts for validation failures
4. Document operational procedures for key rotation

## Support
- Contract specifications: `specs/002-share-link-validation/contracts/`
- Data model: `specs/002-share-link-validation/data-model.md`
- Research notes: `specs/002-share-link-validation/research.md`