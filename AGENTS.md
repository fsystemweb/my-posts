# AGENTS.md

`my-posts` is a personal posts feed (Next.js App Router) that reads posts from a static JSON file and shows them with infinite scroll.

## Commands
- Install: `npm install`
- Dev server: `npm run dev` (http://localhost:3000)
- Build: `npm run build`
- Start production build: `npm start`
- Lint: `npm run lint`
- Tests: none yet

## Conventions
- Stack: Next.js 16.1.6, React 19.2.3, TypeScript, Tailwind CSS 4 (via `@tailwindcss/postcss`), ESLint 9 with `eslint-config-next`.
- `src/app/`: `layout.tsx`, `page.tsx` (server component that reads the JSON), `globals.css`.
- `src/components/`: `Header`, `PostCard`, `PostFeed` (client component, infinite scroll), `ImageModal`.
- `src/types/post.ts`: the `Post` type; keep it in sync with `public/my_posts.json`.
- `public/my_posts.json` holds the posts and `public/personal_data.json` holds the profile and social links used by the header.
- Package manager is npm (`package-lock.json`).

## Boundaries
- Always: run `npm run lint` and `npm run build` after changes.
- Ask first: adding a dependency, changing the post JSON shape.
- Never: commit secrets or read .env files.
