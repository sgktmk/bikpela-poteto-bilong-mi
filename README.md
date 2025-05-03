# Bikpela Poteto Bilong Mi

A personal blog built with Next.js featuring specialized music notation capabilities using ABCJS.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https://github.com/sgktmk/bikpela-poteto-bilong-mi)

## Project Overview

Bikpela Poteto Bilong Mi is a personal blog that enables users to read posts on various topics and interact with embedded music notation. The unique feature of this blog is its integration of the ABCJS library, allowing for dynamic rendering and playback of sheet music directly in the browser.

### Key Features

- Interactive music notation rendering and playback
- MDX-based blog posts with frontmatter metadata
- Tag-based content organization
- Light and dark theme support
- Responsive design for all devices
- Multiple author support
- SEO optimization with sitemaps and RSS feeds

## Technical Stack

- **Framework**: [Next.js](https://nextjs.org/) v15.2.4
- **Language**: JavaScript/React v19.1.0
- **CSS/UI**: [Tailwind CSS](https://tailwindcss.com/) v3.0.23
- **Music Notation**: [ABCJS](https://www.abcjs.net/) v6.3.0
- **Content**: MDX with [mdx-bundler](https://github.com/kentcdodds/mdx-bundler) v9.1.0
- **Styling**: [@tailwindcss/typography](https://github.com/tailwindlabs/tailwindcss-typography), [@tailwindcss/forms](https://github.com/tailwindlabs/tailwindcss-forms)
- **Syntax Highlighting**: [rehype-prism-plus](https://github.com/timlrx/rehype-prism-plus)
- **Math Typesetting**: [KaTeX](https://katex.org/) via rehype-katex
- **Font**: [Inter](https://fonts.google.com/specimen/Inter) via @fontsource/inter

## Folder Structure

```
bikpela-poteto-bilong-mi/
├── components/           # Reusable React components
│   ├── MusicPlayer.js    # Core component for music notation rendering and playback
│   ├── MusicScore.js     # Component for visual-only music rendering
│   └── ...
├── data/                 # Content and configuration
│   ├── blog/             # Blog posts organized by date
│   ├── authors/          # Author profile information
│   └── siteMetadata.js   # Site-wide configuration
├── layouts/              # Layout templates for different content types
│   ├── PostLayout.js     # Layout for blog posts
│   └── AuthorLayout.js   # Layout for author profile pages
├── pages/                # Next.js pages
│   ├── index.js          # Blog homepage
│   └── ...
├── public/               # Static assets
│   └── static/
│       ├── images/       # Images used in blog posts
│       └── favicons/     # Favicon assets
└── scripts/              # Utility scripts
```

## Environment Setup

### Prerequisites

- [Node.js](https://nodejs.org/) 14.x or later
- npm, yarn, or [pnpm](https://pnpm.io/)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/sgktmk/bikpela-poteto-bilong-mi.git
   cd bikpela-poteto-bilong-mi
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   # or
   pnpm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## Available Scripts

- `npm start` - Start the development server with live content reloading
- `npm run dev` - Start the development server
- `npm run build` - Build the application for production and generate sitemap
- `npm run serve` - Serve the production build locally
- `npm run analyze` - Analyze the bundle size
- `npm run lint` - Lint and fix code issues

## Environment Variables

Create a `.env` file in the root directory based on `.env.example`:

```
# Required for Giscus comments
NEXT_PUBLIC_GISCUS_REPO=
NEXT_PUBLIC_GISCUS_REPOSITORY_ID=
NEXT_PUBLIC_GISCUS_CATEGORY=
NEXT_PUBLIC_GISCUS_CATEGORY_ID=

# Optional - for newsletter functionality
MAILCHIMP_API_KEY=
MAILCHIMP_API_SERVER=
MAILCHIMP_AUDIENCE_ID=
```

## Build and Deployment

### Vercel (Recommended)

The easiest way to deploy the blog is using [Vercel](https://vercel.com):

1. Click the "Deploy with Vercel" button at the top of this README
2. Configure your environment variables
3. Deploy!

### Manual Deployment

1. Build the application:
   ```bash
   npm run build
   # or
   yarn build
   # or
   pnpm build
   ```

2. Start the production server:
   ```bash
   npm run serve
   # or
   yarn serve
   # or
   pnpm serve
   ```

## Testing & CI

This project uses GitHub Actions for continuous integration. The workflow checks:

- Code linting
- Build process

## FAQ / Troubleshooting

### How do I add a new blog post?

1. Create a new markdown file in the `data/blog/` directory
2. Add frontmatter with title, date, tags, etc.
3. Write your content in markdown/MDX format
4. For music notation, use the `<MusicPlayer>` component with ABC notation:

```jsx
<MusicPlayer abcNotation={`
X:1
T:Example Song
M:4/4
L:1/8
K:C
CDEF GABc|
`} />
```

### How do I customize the site metadata?

Edit the `data/siteMetadata.js` file to update site title, description, author information, and other configuration options.

### How do I add a new author?

Create a new markdown file in the `data/authors/` directory with the author's information.

### How do I enable comments?

Configure the Giscus settings in `data/siteMetadata.js` and set the required environment variables.
