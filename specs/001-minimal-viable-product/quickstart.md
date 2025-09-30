# Quickstart Guide: Movie Watch Party Platform MVP

**Date**: 2025-09-30  
**Feature**: 001-minimal-viable-product  
**Prerequisites**: Node.js 18+, Git, TMDB API key

## Development Setup

### 1. Environment Configuration

Create `.env.local` file in project root (DO NOT commit to Git):
```bash
# TMDB API Configuration
TMDB_API_KEY=your_tmdb_api_key_here
TMDB_BASE_URL=https://api.themoviedb.org/3
TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p

# Vercel KV Database (for production)
KV_REST_API_URL=your_vercel_kv_url
KV_REST_API_TOKEN=your_vercel_kv_token

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXTAUTH_SECRET=your_random_secret_for_development

# Development overrides
NODE_ENV=development
```

### 2. Project Installation

```bash
# Clone repository
git clone https://github.com/yourusername/watchify.git
cd watchify

# Install dependencies
npm install
# or
pnpm install

# Run development server
npm run dev
# or
pnpm dev
```

### 3. TMDB API Setup

1. Visit [TMDB](https://www.themoviedb.org/settings/api)
2. Create free account and request API key
3. Copy API key to `.env.local` file
4. Test API access: `curl -H "Authorization: Bearer YOUR_API_KEY" https://api.themoviedb.org/3/movie/550`

## User Journey Testing

### Core User Flow: Create and Share Watch Party

#### Step 1: Movie Discovery
1. **Navigate to home page**: `http://localhost:3000`
2. **Search for movies**: Enter "Fight Club" in search box
3. **Verify grid display**: Check poster, title, release date, rating displayed
4. **Test genre filter**: Select "Drama" genre, verify filtered results
5. **Performance check**: Search should complete within 2 seconds

**Expected Result**: Grid of movies with proper metadata display

#### Step 2: Movie Details
1. **Click movie from grid**: Select "Fight Club" from results
2. **Verify detail page**: Check synopsis, cast, and expanded movie info
3. **UI consistency**: Verify light/dark theme toggle works
4. **Responsive design**: Test on mobile viewport (375px width)

**Expected Result**: Detailed movie view with complete information

#### Step 3: Watch Party Scheduling
1. **Access scheduling interface**: Click "Schedule Watch Party" button
2. **Date selection**: Use calendar picker to select tomorrow's date
3. **Time selection**: Use dropdown to select 8:00 PM
4. **Timezone display**: Verify time shows in local timezone
5. **Create party**: Click "Schedule" button

**Expected Result**: Watch party created with unique landing page

#### Step 4: Watch Party Experience
1. **Countdown display**: Verify prominent timer shows time remaining
2. **Movie details**: Check all movie info displayed below countdown
3. **Copy link function**: Click "Copy Link" button
4. **Test shareable URL**: Open copied link in new tab/incognito window
5. **Timezone consistency**: Verify countdown shows same time in different browser

**Expected Result**: Synchronized countdown experience across devices

#### Step 5: Countdown Completion
1. **Wait for countdown**: Set a 2-minute test party for immediate testing
2. **Status transition**: Verify countdown reaches zero
3. **Message display**: Check "Start Watching" message appears
4. **UI consistency**: Verify movie details remain visible

**Expected Result**: Smooth transition from countdown to start message

## API Testing

### Manual API Verification

#### Test Movie Search
```bash
curl -X GET "http://localhost:3000/api/movies/search?q=action&page=1" \
  -H "Accept: application/json"
```

**Expected Response**: JSON array of movies with metadata

#### Test Movie Details
```bash
curl -X GET "http://localhost:3000/api/movies/550" \
  -H "Accept: application/json"
```

**Expected Response**: Detailed movie object with cast information

#### Test Watch Party Creation
```bash
curl -X POST "http://localhost:3000/api/watch-party/create" \
  -H "Content-Type: application/json" \
  -d '{
    "movieId": 550,
    "scheduledTime": "2025-10-01T20:00:00.000Z",
    "movie": {
      "id": 550,
      "title": "Fight Club",
      "overview": "A ticking-time-bomb insomniac...",
      "releaseDate": "1999-10-15",
      "posterPath": "/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
      "voteAverage": 8.433,
      "runtime": 139
    }
  }'
```

**Expected Response**: Created watch party with UUID and shareable URL

## Automated Testing

### Run Test Suite
```bash
# Unit tests
npm run test
# or
pnpm test

# End-to-end tests
npm run test:e2e
# or
pnpm test:e2e

# Test coverage
npm run test:coverage
# or
pnpm test:coverage
```

### Key Test Scenarios

#### Component Tests (Jest)
- [ ] MovieGrid renders with proper layout
- [ ] MovieCard displays all required information
- [ ] CountdownTimer calculates time correctly
- [ ] ThemeToggle switches between light/dark modes
- [ ] ShareButton copies URL to clipboard

#### E2E Tests (Cucumber)
- [ ] User can search and find movies
- [ ] User can filter movies by genre
- [ ] User can create watch party with valid date/time
- [ ] User can access shared watch party URL
- [ ] Countdown timer synchronizes across browsers

## Performance Validation

### Core Web Vitals Testing
1. **Lighthouse audit**: Run in Chrome DevTools
2. **First Contentful Paint**: Target < 1.5 seconds
3. **Largest Contentful Paint**: Target < 2.5 seconds
4. **Cumulative Layout Shift**: Target < 0.1

### API Performance Testing
```bash
# Test search response time
time curl "http://localhost:3000/api/movies/search?q=test"

# Load test watch party creation
for i in {1..10}; do
  curl -X POST "http://localhost:3000/api/watch-party/create" \
    -H "Content-Type: application/json" \
    -d '{"movieId":550,"scheduledTime":"2025-10-01T20:00:00.000Z","movie":{...}}' &
done
wait
```

## Error Scenario Testing

### Network Failure Simulation
1. **Disconnect internet**: Test offline behavior
2. **TMDB API down**: Verify error message display
3. **Invalid movie ID**: Test 404 error handling
4. **Rate limit exceeded**: Test 429 response handling

### Data Validation Testing
1. **Invalid date input**: Try past dates for watch party
2. **Malformed URL**: Test corrupted shareable links
3. **Large search queries**: Test input length limits
4. **Special characters**: Test search with emoji/unicode

## Browser Compatibility

### Desktop Testing
- [ ] Chrome 90+
- [ ] Firefox 88+
- [ ] Safari 14+
- [ ] Edge 90+

### Mobile Testing
- [ ] iOS Safari 14+
- [ ] Android Chrome 90+
- [ ] Responsive layout (320px - 1920px)

## Deployment Verification

### Vercel Deployment
1. **Environment variables**: Verify all secrets configured
2. **API routes**: Test production endpoints
3. **Static assets**: Check image optimization working
4. **Domain setup**: Verify custom domain (if applicable)

### Production Smoke Test
1. **Search functionality**: Basic movie search
2. **Watch party creation**: End-to-end flow
3. **Shareable URLs**: Cross-device testing
4. **Performance**: Production API response times

## Success Criteria

✅ **Functional Requirements Met**:
- Movie search with <2 second response time
- Genre filtering working
- Calendar-based scheduling interface
- Synchronized countdown timers
- Base64 encoded shareable URLs

✅ **Technical Requirements Met**:
- Next.js with TypeScript setup
- Tailwind CSS with light/dark themes
- ShadCN component library integration
- Jest and Cucumber testing frameworks
- Secure API key management

✅ **Constitutional Compliance**:
- Test-driven development workflow
- Atomic design component structure
- Clean architecture folder organization
- Storybook documentation for components
- Contract-first API design

---
*Quickstart complete - Ready for implementation*