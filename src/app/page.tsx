
import Header from "@/components/Header";
import PostFeed from "@/components/PostFeed";
import { Post } from "@/types/post";

async function getPosts(): Promise<Post[]> {
  const binId = process.env.JSONBIN_BIN_ID;
  const apiKey = process.env.JSONBIN_API_KEY;
  const accessKey = process.env.JSONBIN_ACCESS_KEY;


  if (!binId || !apiKey || !accessKey) {
    throw new Error("Missing environment variables");
  }

  const res = await fetch(`https://api.jsonbin.io/v3/b/${binId}/latest`, {
    headers: {
      "X-Master-Key": apiKey,
      "X-Access-Key": accessKey,
    },
    cache: "no-store", // Ensure we always get the latest data
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch posts: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  return data.record as Post[];
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
