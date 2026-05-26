
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
  let posts: Post[] | null = null;
  let hasFetchError = false;

  try {
    posts = await getPosts();
  } catch (error) {
    hasFetchError = true;
    console.error("Failed to load posts", error);
  }

  return (
    <>
      <Header />
      <main className="max-w-[620px] mx-auto pt-8 px-4 pb-16 sm:px-6 md:max-w-[720px] md:pt-7 md:px-6">
        {hasFetchError || !posts ? (
          <div className="min-h-[54vh] flex flex-col items-center justify-center gap-5 rounded-3xl border border-white/10 bg-[#111111]/80 px-6 py-12 text-center shadow-inner shadow-black/20">
            <div className="text-3xl font-bold tracking-tight text-white sm:text-4xl animate-pulse">
              We are writing new posts, come back later
            </div>
            <p className="max-w-lg text-sm text-text-muted sm:text-base">
              The ink is still drying on the next stories. We&apos;ll have fresh content ready soon.
            </p>
            <div className="flex items-center justify-center gap-3">
              <span className="h-3 w-3 rounded-full bg-accent animate-bounce" />
              <span
                className="h-3 w-3 rounded-full bg-accent/80 animate-bounce"
                style={{ animationDelay: "0.15s" }}
              />
              <span
                className="h-3 w-3 rounded-full bg-accent/60 animate-bounce"
                style={{ animationDelay: "0.3s" }}
              />
            </div>
          </div>
        ) : (
          <PostFeed posts={posts} />
        )}
      </main>
    </>
  );
}
