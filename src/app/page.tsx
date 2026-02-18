import { readFile } from "fs/promises";
import path from "path";
import Header from "@/components/Header";
import PostFeed from "@/components/PostFeed";
import { Post } from "@/types/post";

async function getPosts(): Promise<Post[]> {
  const filePath = path.join(process.cwd(), "public", "my_posts.json");
  const raw = await readFile(filePath, "utf-8");
  return JSON.parse(raw) as Post[];
}

export default async function HomePage() {
  const posts = await getPosts();

  return (
    <>
      <Header />
      <main className="max-w-[620px] mx-auto pt-8 px-4 pb-16 sm:px-6 md:max-w-[720px] md:pt-7 md:px-6">
        <PostFeed posts={posts} />
      </main>
    </>
  );
}
