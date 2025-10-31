# Research: Share Link Validation with HMAC Signature

## Overview
Research findings for implementing HMAC SHA256 signature validation on watch party share links to prevent tampering and ensure authenticity.

## Technology Decisions

### HMAC Implementation
**Decision**: Use Node.js built-in `crypto` module with `crypto.createHmac('sha256', secret)`  
**Rationale**: 
- Built into Node.js runtime (no additional dependencies)
- Industry standard for message authentication
- Fast performance for URL validation use case
- Well-tested and security-audited implementation

**Alternatives Considered**:
- External crypto libraries (unnecessary overhead)
- JWT tokens (overkill for simple signature validation)
- Custom hash functions (security risk)

### Secret Key Management
**Decision**: Server-side environment variable with 32+ character random string  
**Rationale**:
- Aligns with existing `env.ts` pattern in codebase
- Never exposed to client-side code
- Simple to deploy and rotate on Vercel
- Follows security best practices for symmetric keys

**Alternatives Considered**:
- External key management services (unnecessary complexity for MVP)
- Configuration files (security risk)
- Database storage (performance overhead)

### Signature Parameter Strategy
**Decision**: Include all URL parameters except signature itself in sorted order  
**Rationale**:
- Prevents parameter tampering attacks
- Deterministic signing (same input = same signature)
- Covers all security-relevant data
- Simple to implement and verify

**Parameters Included**: `watchPartyId`, `movieId`, `scheduledTime`, `movieTitle`  
**Parameters Excluded**: `moviePoster` (can change without security impact), `sig` (self-referential)

### URL Structure Enhancement
**Decision**: Append signature as `&sig=<base64url-signature>` parameter  
**Rationale**:
- Maintains backward compatibility during development
- Clear separation from existing encoded data
- Standard URL parameter format
- Easy to extract and validate

**URL Format**: `/watch-party/[id]?data=<encoded>&sig=<signature>`

### Validation Timing
**Decision**: Server-side validation during Next.js page rendering (SSR)  
**Rationale**:
- Secret key stays on server
- No client-side crypto dependencies
- Immediate redirect for invalid links
- Leverages existing SSR architecture

**Implementation Point**: In `watch-party/[id]/page.tsx` before decoding data

## Security Considerations

### Attack Vectors Addressed
1. **Link Tampering**: Signature validation prevents parameter modification
2. **Link Forgery**: HMAC requires secret key to generate valid signatures  
3. **Replay Attacks**: Each unique parameter set has unique signature
4. **Parameter Injection**: All parameters included in signature calculation

### Performance Impact
- **Signature Generation**: ~1ms (during link creation)
- **Signature Validation**: ~1ms (during page load)
- **URL Size Increase**: ~44 characters for base64url-encoded SHA256 hash
- **Memory Usage**: Negligible (stateless validation)

### Error Handling Strategy
**Decision**: Silent redirect to home page for all signature failures  
**Rationale**:
- Prevents information leakage to attackers
- Clean user experience (no confusing error messages)
- Aligns with security best practices
- Matches existing error handling patterns

## Integration Points

### Existing Code Enhancement
1. **`src/lib/env.ts`**: Add `SHARE_LINK_SECRET` validation
2. **`src/lib/url-encoder.ts`**: Enhance with signature generation/validation
3. **`src/app/watch-party/[id]/page.tsx`**: Add validation before data decoding
4. **`src/types/shareable-url.ts`**: Add signature-related schemas

### New Components Required
1. **`src/lib/signature.ts`**: HMAC signature service
2. **Contract tests**: Signature validation scenarios
3. **Unit tests**: HMAC function validation

### Backwards Compatibility
**Decision**: No compatibility required (app not live yet)  
**Rationale**: Simplifies implementation, allows immediate enforcement

## Implementation Approach

### Phase 1: Core Service
1. Create signature service with HMAC functions
2. Add environment variable configuration
3. Create comprehensive unit tests

### Phase 2: Integration
1. Enhance URL encoder with signature support
2. Update watch party page with validation
3. Add contract tests for signature scenarios

### Phase 3: Validation
1. Test signature generation/validation round-trip
2. Verify error handling for invalid signatures
3. Performance testing for signature operations

## Success Criteria
- All share links include valid HMAC signatures
- Invalid signatures result in silent redirect to home page
- No performance degradation in link generation/validation
- 100% test coverage for signature functions
- Zero client-side exposure of secret key

## Dependencies
- Node.js `crypto` module (already available)
- Existing Zod validation patterns
- Current URL encoding infrastructure
- Next.js SSR capabilities

## Risks & Mitigations
- **Secret key exposure**: Environment variable approach with server-side only access
- **Performance impact**: Measured overhead is negligible (<1ms)
- **URL length limits**: Signature adds 44 chars, well within 2048 char limit
- **Breaking changes**: No compatibility issues since app not live

## Configuration Requirements
```bash
# Environment variable to add
SHARE_LINK_SECRET=<32+ character random string>
```

## Testing Strategy
- Unit tests for HMAC generation/validation functions
- Contract tests for signature API behavior
- Integration tests for end-to-end signature flow
- Security tests for tampering attempts
- Performance tests for signature overhead