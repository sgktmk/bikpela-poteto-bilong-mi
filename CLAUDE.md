# Bikpela Poteto Bilong Mi - Development Guide

## Overview

Bikpela Poteto Bilong Mi is a Next.js-based personal blog with specialized music notation capabilities using ABCJS. The blog features interactive music rendering, playback, and MDX-based content management with Japanese localization.

## Claude Memories

- 常に日本語で会話する。

## Quick Start Commands

### Development

```bash
# Start development server
npm run dev
# or with live content reloading
npm start

# Build for production
npm run build

# Serve production build
npm run serve

# Analyze bundle size
npm run analyze
```

### Code Quality

```bash
# Lint and fix code issues
npm run lint

# Format code (via pre-commit hooks)
git add . && git commit -m "message"
```

### Testing

**Note: This project currently has no test suite configured.** Consider adding:

- Jest for unit testing
- Cypress or Playwright for E2E testing
- React Testing Library for component testing

## Architecture Overview

### Technology Stack

- **Framework**: Next.js 15.2.4 with React 19.1.0
- **Language**: JavaScript (no TypeScript)
- **Styling**: Tailwind CSS 3.0.23 with typography plugin
- **Content**: MDX with mdx-bundler for enhanced processing
- **Music Notation**: ABCJS 6.4.4 for sheet music rendering and playback
- **Theme**: next-themes for light/dark mode
- **Performance**: Preact in production builds for smaller bundle size

### Project Structure

```
bikpela-poteto-bilong-mi/
├── components/               # Reusable React components
│   ├── MusicPlayer.js       # Core music notation with playback
│   ├── MusicScore.js        # Visual-only music notation
│   ├── analytics/           # Analytics provider components
│   ├── comments/            # Comment system components
│   └── social-icons/        # SVG social media icons
├── data/                    # Content and configuration
│   ├── blog/               # Blog posts (organized by date hierarchy)
│   ├── authors/            # Author profile information
│   ├── siteMetadata.js     # Site-wide configuration
│   └── headerNavLinks.js   # Navigation configuration
├── layouts/                 # Page layout templates
│   ├── PostLayout.js       # Main blog post layout
│   ├── ListLayout.js       # Blog listing layout
│   └── AuthorLayout.js     # Author profile layout
├── lib/                     # Utility libraries
│   ├── mdx.js              # MDX processing and bundling
│   ├── tags.js             # Tag management utilities
│   └── utils/              # Helper functions
├── pages/                   # Next.js pages (file-based routing)
│   ├── api/                # API routes for newsletter services
│   ├── blog/               # Blog-related pages
│   └── _app.js             # Root application component
├── public/static/           # Static assets
│   ├── images/             # Blog images and media
│   └── favicons/           # Favicon assets
├── scripts/                 # Build and utility scripts
└── css/                     # Global styles and themes
```

## Key Architectural Patterns

### 1. Content Management Pattern

- **File-based**: Blog posts stored as MDX files in `/data/blog/` with date hierarchy
- **Frontmatter**: YAML metadata for posts (title, date, tags, etc.)
- **Dynamic Processing**: mdx-bundler processes MDX at build time with remark/rehype plugins

### 2. Music Integration Pattern

- **Component-based**: `MusicPlayer` and `MusicScore` components for ABC notation
- **Interactive Features**: Real-time highlighting during playback
- **Responsive Design**: Music notation adapts to screen size

### 3. Theme System

- **CSS Variables**: Tailwind dark mode classes
- **Context Provider**: next-themes manages theme state
- **Persistent**: Theme preference saved in localStorage

### 4. Layout System

- **Template-based**: Different layouts for posts, lists, and authors
- **Wrapper Pattern**: `LayoutWrapper` provides consistent page structure
- **MDX Integration**: Layouts specified in frontmatter and dynamically loaded

### 5. Performance Optimizations

- **Bundle Splitting**: Automatic code splitting with Next.js
- **Image Optimization**: Next.js Image component with proper loading
- **Production Swap**: React → Preact in production builds
- **Static Generation**: Most pages are statically generated

## Development Conventions

### Code Style

- **Prettier**: Configured with specific rules (single quotes, no semicolons)
- **ESLint**: Next.js configuration with accessibility checks
- **Formatting**: 2-space indentation, 100 character line limit

### File Naming

- **Components**: PascalCase (e.g., `MusicPlayer.js`)
- **Utilities**: camelCase (e.g., `formatDate.js`)
- **Pages**: Next.js conventions (lowercase, kebab-case for multi-word)
- **Blog Posts**: Date-hierarchical structure (`YYYY/MM/DD/title.mdx`)

### Component Patterns

- **Functional Components**: All components use hooks
- **Props Destructuring**: Consistent parameter destructuring
- **Default Exports**: All components use default exports
- **Absolute Imports**: Uses `@/` prefix for imports (configured in jsconfig.json)

### Content Patterns

- **Japanese Content**: Primary language is Japanese
- **ABC Notation**: Music content uses standardized ABC notation format
- **Tag System**: Content organized with hierarchical tagging
- **SEO Optimization**: Proper meta tags and structured data

## Configuration Files

### Core Configuration

- `next.config.js`: Next.js configuration with security headers and Preact swap
- `tailwind.config.js`: Custom theme with typography plugin and dark mode
- `jsconfig.json`: Path mapping for absolute imports
- `prettier.config.js`: Code formatting rules

### Content Configuration

- `data/siteMetadata.js`: Site-wide settings, social links, analytics
- `data/headerNavLinks.js`: Navigation menu structure

### Build Configuration

- `package.json`: Scripts and dependencies
- `postcss.config.js`: PostCSS configuration for Tailwind

## Environment Variables

Required environment variables (create `.env.local`):

```bash
# Giscus Comments (Optional)
NEXT_PUBLIC_GISCUS_REPO=
NEXT_PUBLIC_GISCUS_REPOSITORY_ID=
NEXT_PUBLIC_GISCUS_CATEGORY=
NEXT_PUBLIC_GISCUS_CATEGORY_ID=

# Newsletter Services (Optional)
MAILCHIMP_API_KEY=
MAILCHIMP_API_SERVER=
MAILCHIMP_AUDIENCE_ID=
```

## Content Creation

### Adding Blog Posts

1. Create MDX file in `/data/blog/YYYY/MM/DD/title.mdx`
2. Add frontmatter:

```yaml
---
title: Post Title
date: 2024-01-01T00:00:00.000Z
tags: [tag1, tag2]
draft: false
description: Brief description
---
```

3. Use components in content:

```jsx
import MusicPlayer from '@/components/MusicPlayer'
;<MusicPlayer
  abcNotation={`
X:1
T:Song Title
M:4/4
L:1/8
K:C
CDEF GABc|
`}
/>
```

### Music Notation Features

- **ABC Notation**: Standard format for sheet music
- **Interactive Playback**: Built-in audio controls
- **Visual Highlighting**: Notes highlight during playback
- **Responsive**: Adapts to screen size
- **Swing Support**: `%%MIDI swing` directive supported

## Deployment

### Vercel (Recommended)

- Push to GitHub triggers automatic deployment
- Environment variables configured in Vercel dashboard
- Preview deployments for pull requests

### Manual Deployment

```bash
npm run build
npm run serve
```

## Monitoring and Analytics

### Supported Analytics

- Google Analytics (configured: G-3WXVLJSN9Y)
- Plausible, Simple Analytics, Umami, PostHog (configurable)

### Performance Monitoring

- Next.js built-in Web Vitals
- Bundle analyzer available with `npm run analyze`

## Security

### Security Headers

Configured in `next.config.js`:

- Content Security Policy
- HTTPS enforcement
- Frame protection
- XSS protection

### Content Security

- Input sanitization in MDX processing
- Safe image loading
- Restricted frame sources

## Limitations and Considerations

### Current Limitations

- No test suite configured
- No TypeScript (JavaScript only)
- Limited CI/CD (no automated testing)
- No database (file-based content only)

### Performance Considerations

- Large music notation files may impact loading
- Image optimization requires proper sizing
- Bundle size monitoring recommended

### Accessibility

- Screen reader support implemented
- Keyboard navigation available
- Color contrast compliance (light/dark themes)

## Recommended Improvements

1. **Add Testing**: Jest + React Testing Library + Cypress
2. **TypeScript Migration**: Gradual migration for better type safety
3. **CI/CD Pipeline**: Automated testing and deployment
4. **Content Management**: Consider headless CMS for non-technical users
5. **Performance**: Implement service worker for offline support
6. **Monitoring**: Add error tracking (Sentry) and performance monitoring

```

```

- 作業の区切りのよいところでコミットを作成する。
