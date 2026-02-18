import { readFile } from "fs/promises";
import path from "path";
import Header from "@/components/Header";
import PostFeed from "@/components/PostFeed";
import { Post } from "@/types/post";

async function getPosts(): Promise<Post[]> {
  const filePath = path.join(process.cwd(), "public", "facundo_posts.json");
  const raw = await readFile(filePath, "utf-8");
  return JSON.parse(raw) as Post[];
}

export default async function HomePage() {
  const posts = await getPosts();

  return (
    <>
      <Header />
      <main className="main">
        <PostFeed posts={posts} />
      </main>
    </>
  );
}
