# my-posts

A personal posts feed built with **Next.js 16** (App Router, TypeScript). Loads posts from a static JSON file and displays them in a clean, responsive feed with infinite scrolling.

## Features

- 📜 **Infinite scroll** — loads 8 posts at a time via `IntersectionObserver`
- 🎨 **Rich text formatting** — preserves line breaks, styles hashtags as badges, and turns URLs into clickable links
- 🖼️ **Images** — lazy-loaded, with side-by-side layout for multi-image posts
- 🔗 **Attachments** — clickable link buttons grouped per post
- 📱 **Fully responsive** — mobile, tablet, and desktop layouts
- ⚡ **Local data** — posts read from `public/my_posts.json`

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
├── my_posts.json        # Posts data
└── personal_data.json   # Personal profile data
```

## Data Sources

### Posts Data
Posts are loaded from `public/my_posts.json`, an array of posts in this shape:

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
