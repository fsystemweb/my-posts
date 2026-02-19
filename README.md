# my-posts

A personal posts feed built with **Next.js 16** (App Router, TypeScript). Loads posts from a static JSON file and displays them in a clean, responsive feed with infinite scrolling.

## Features

- 📜 **Infinite scroll** — loads 8 posts at a time via `IntersectionObserver`
- 🎨 **Rich text formatting** — preserves line breaks, styles hashtags as badges, and turns URLs into clickable links
- 🖼️ **Images** — lazy-loaded, with side-by-side layout for multi-image posts
- 🔗 **Attachments** — clickable link buttons grouped per post
- 📱 **Fully responsive** — mobile, tablet, and desktop layouts
- ⚡ **Remote data** — posts fetched from JSONBin.io API

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
└── personal_data.json   # Personal profile data
```

## Data Sources

### Posts Data
Posts are loaded from a remote JSON bin hosted on [JSONBin.io](https://jsonbin.io). The application requires a valid `BIN_ID`, `API_KEY` and `ACCESS_KEY` to access the data.

Each post follows the same shape as before:

```json
{
  "date": "2 months",
  "author": "Juan",
  "context": "Post text with\nnewlines and hashtag\n#tags",
  "images": ["https://..."],
  "attachments": ["https://..."]
}
```

### Configuration

Create a `.env.local` file in the root directory with your JSONBin.io credentials:

```bash
JSONBIN_BIN_ID=your_bin_id
JSONBIN_API_KEY=your_api_key
JSONBIN_ACCESS_KEY=your_access_key
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
