# my-posts

A personal posts feed built with **Next.js 16** (App Router, TypeScript). Loads posts from a static JSON file and displays them in a clean, responsive feed with infinite scrolling.

## Features

- 📜 **Infinite scroll** — loads 8 posts at a time via `IntersectionObserver`
- 🎨 **Rich text formatting** — preserves line breaks, styles hashtags as badges, and turns URLs into clickable links
- 🖼️ **Images** — lazy-loaded, with side-by-side layout for multi-image posts
- 🔗 **Attachments** — clickable link buttons grouped per post
- 📱 **Fully responsive** — mobile, tablet, and desktop layouts
- ⚡ **Static data** — no backend, posts served from `public/my_posts.json`

## Tech Stack

- [Next.js 16](https://nextjs.org) — App Router, Server Components
- TypeScript
- Tailwind

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/
│   ├── layout.tsx       # Root layout + metadata
│   ├── page.tsx         # Server component — reads JSON, renders feed
│   └── globals.css      # Design system & styles
├── components/
│   ├── Header.tsx       # Sticky header with social links (reads from personal_data.json)
│   ├── PostCard.tsx     # Post card with context parsing
│   └── PostFeed.tsx     # Infinite scroll feed (client component)
└── types/
    └── post.ts          # Post type definition
public/
├── my_posts.json        # Static posts data
└── personal_data.json   # Personal profile data
```

## Data Sources

### Posts Data
Posts are loaded from `public/my_posts.json`. Each post follows this shape:

```json
{
  "date": "2 months",
  "author": "Juan",
  "context": "Post text with\nnewlines and hashtag\n#tags",
  "images": ["https://..."],
  "attachments": ["https://..."]
}
```

### Personal Data
Profile information (name, role, links) is loaded from `public/personal_data.json`. This allows for easy updates to personal details without changing code.

```json
{
  "initial": "J",
  "name": "Juan",
  "role": "Product Guy",
  "github": "https://...",
  "portfolio": "https://...",
  "linkedin": "https://..."
}
```

## LinkedIn Scraper

This project includes a standalone **LinkedIn Post Scraper** to help you collect your own content.

- Located in the [`scraper/`](./scraper) directory.
- Features:
    - Scrapes recent activity from your profile.
    - Filters out reposts, comments, and likes.
    - Saves data as timestamped JSON files.
    - Supports connecting to a local browser to bypass authentication issues.

👉 **[Read the Scraper Documentation](./scraper/README.md)** for setup and usage instructions.
