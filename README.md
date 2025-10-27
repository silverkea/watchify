# Watchify

A modern movie watch party platform built with Next.js 14, TypeScript, and Tailwind CSS. Discover movies, create watch parties, and synchronize viewing experiences with friends.

## Features

- 🎬 **Movie Discovery**: Search and browse movies using The Movie Database (TMDB) API
- 🎉 **Watch Parties**: Create and share movie watch parties with custom scheduling
- ⏰ **Countdown Timer**: Real-time countdown to watch party start time
- 🌙 **Dark/Light Theme**: Toggle between dark and light themes with neon accent colors
- 📱 **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- ♿ **Accessibility**: WCAG 2.1 AA compliant with screen reader support
- 🚀 **Performance**: Optimized images, lazy loading, and efficient caching

## Tech Stack

- **Framework**: Next.js 14 with App Router and TypeScript
- **Styling**: Tailwind CSS with ShadCN/UI components
- **External API**: The Movie Database (TMDB) for movie information
- **Testing**: Jest (unit), Cucumber + Playwright (E2E), Storybook (component docs)

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- TMDB API key ([get one here](https://www.themoviedb.org/settings/api))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/silverkea/watchify.git
   cd watchify
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Fill in your environment variables:
   ```env
   # TMDB API Configuration
   TMDB_API_KEY=your_tmdb_api_key_here
   TMDB_BASE_URL=https://api.themoviedb.org/3

   # Next.js Configuration  
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Testing

### Unit Tests (Jest)

Run unit tests for utility functions and components:

```bash
# Run all unit tests
npm run test:unit

# Run with coverage
npm run test:unit:coverage

# Run in watch mode
npm run test:unit:watch
```

### E2E Tests (Playwright + Cucumber)

#### Initial Setup

Install Playwright browsers:

```bash
npx playwright install
```

#### Running E2E Tests

```bash
# Run all E2E tests
npm run test:e2e

# Run specific test suites
npm run test:e2e:performance    # Performance tests
npm run test:e2e:accessibility  # Accessibility tests  
npm run test:e2e:mobile        # Mobile responsiveness
npm run test:e2e:cross-browser # Cross-browser compatibility
npm run test:e2e:visual        # Visual regression tests

# Run with headed browser (see the browser)
npm run test:e2e -- --headed

# Run specific feature
npm run test:e2e -- --grep "movie search"

# Run on specific browser
npm run test:e2e -- --project=chromium
npm run test:e2e -- --project=firefox
npm run test:e2e -- --project=webkit
```

#### Cucumber BDD Tests

Feature files are located in `tests/features/` and use Gherkin syntax:

```bash
# Run Cucumber features
npm run test:cucumber

# Run specific feature
npm run test:cucumber -- --name "Movie Search"

# Generate Cucumber report
npm run test:cucumber:report
```

#### Debugging E2E Tests

1. **Debug Mode**: Run tests with debugger
   ```bash
   npm run test:e2e:debug
   ```

2. **Visual Debugging**: Use Playwright Inspector
   ```bash
   npx playwright test --debug
   ```

3. **Trace Viewer**: Analyze test execution
   ```bash
   npx playwright test --trace on
   npx playwright show-trace trace.zip
   ```

4. **Screenshots and Videos**: Available in `test-results/` after failed tests

5. **VS Code Extension**: Install "Playwright Test for VSCode" for integrated debugging

#### Playwright Configuration

The main configuration is in `playwright.config.ts`:

- **Browsers**: Chrome, Firefox, Safari (WebKit)
- **Viewports**: Desktop, tablet, mobile
- **Screenshots**: On failure
- **Videos**: On first retry
- **Retries**: 2 for CI, 0 for local development

### Visual Regression Testing

Generate baseline screenshots:

```bash
npm run test:visual:update
```

Compare against baselines:

```bash
npm run test:visual
```

### Accessibility Testing

Run accessibility audits with axe-core:

```bash
npm run test:a11y
```

## Component Development

### Storybook

View and develop components in isolation:

```bash
# Start Storybook
npm run storybook

# Build Storybook
npm run build-storybook
```

Navigate to [http://localhost:6006](http://localhost:6006)

### Component Architecture

Components follow atomic design principles:

```
src/components/
├── atoms/          # Basic building blocks (Button, Input, Badge)
├── molecules/      # Simple combinations (SearchBox, MovieCard)
├── organisms/      # Complex components (MovieGrid, Navigation)
└── templates/      # Page layouts
```

### Creating New Components

1. Create component file in appropriate directory
2. Add TypeScript interface for props
3. Write unit tests (`*.test.tsx`)
4. Create Storybook stories (`*.stories.tsx`)
5. Export from `index.ts`

## API Routes

### Movie Search
- `GET /api/movies/search?q=query` - Search movies
- `GET /api/movies/[id]` - Get movie details
- `GET /api/movies/popular` - Get popular movies
- `GET /api/genres` - Get movie genres

### Health Check
- `GET /api/health` - Application health status

## Performance

### Optimizations Implemented

- **Image Optimization**: Next.js Image with WebP/AVIF formats
- **Lazy Loading**: Intersection Observer for images and components
- **Code Splitting**: Automatic with Next.js App Router
- **Compression**: Gzip/Brotli enabled
- **Performance Budget**: <3s initial load, <2s search response

### Performance Monitoring

```bash
# Run performance tests
npm run test:performance

# Generate Lighthouse report
npm run audit:lighthouse

# Bundle analyzer
npm run analyze
```

## Build for Production

```bash
# Build for production
npm run build

# Start production server
npm start
```

## Troubleshooting

### Common Issues

1. **TMDB API Errors**
   - Verify API key is correct
   - Check rate limiting (40 requests per 10 seconds)
   - Ensure network connectivity

2. **Playwright Test Failures**
   - Update browsers: `npx playwright install`
   - Clear test cache: `npm run clean`
   - Check viewport sizes match expected layout

3. **TypeScript Errors**
   - Run type check: `npm run type-check`
   - Clear Next.js cache: `rm -rf .next/`

4. **Styling Issues**
   - Clear Next.js cache: `npm run clean`
   - Check dark/light theme CSS variables

### Debug Commands

```bash
# Check Next.js info
npx next info

# Analyze bundle
npm run analyze

# Check dependencies
npm audit

# Clear all caches
npm run clean
```

## Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

### Development Workflow

1. Write tests first (TDD approach)
2. Implement feature
3. Add Storybook stories
4. Update documentation
5. Run full test suite
6. Create PR with detailed description

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [The Movie Database (TMDB)](https://www.themoviedb.org/) for movie data
- [ShadCN/UI](https://ui.shadcn.com/) for component primitives
- [Playwright](https://playwright.dev/) for E2E testing framework
