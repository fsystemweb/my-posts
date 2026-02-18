"use client";

import { useEffect, useRef, useState } from "react";
import { Post } from "@/types/post";
import PostCard from "./PostCard";

const PAGE_SIZE = 8;

interface PostFeedProps {
    posts: Post[];
}

export default function PostFeed({ posts }: PostFeedProps) {
    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
    const [isLoading, setIsLoading] = useState(false);
    const sentinelRef = useRef<HTMLDivElement>(null);

    const visiblePosts = posts.slice(0, visibleCount);
    const hasMore = visibleCount < posts.length;

    useEffect(() => {
        const sentinel = sentinelRef.current;
        if (!sentinel) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const entry = entries[0];
                if (entry.isIntersecting && hasMore && !isLoading) {
                    setIsLoading(true);
                    // Small delay for smooth UX
                    setTimeout(() => {
                        setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, posts.length));
                        setIsLoading(false);
                    }, 400);
                }
            },
            { rootMargin: "200px" }
        );

        observer.observe(sentinel);
        return () => observer.disconnect();
    }, [hasMore, isLoading, posts.length]);

    return (
        <div>
            <div className="mb-7 text-center">
                <h1 className="text-2xl font-bold text-dark tracking-tight">Posts</h1>
                <p className="text-[0.82rem] text-text-muted mt-1">{posts.length} posts total</p>
            </div>

            <div>
                {visiblePosts.map((post, index) => (
                    <PostCard key={index} post={post} index={index} />
                ))}
            </div>

            {/* Sentinel for IntersectionObserver */}
            <div ref={sentinelRef} className="h-px" />

            {isLoading && (
                <div className="flex justify-center items-center gap-2 p-8 text-text-muted text-sm">
                    <div className="w-5 h-5 border-2 border-border border-t-accent rounded-full animate-spin" />
                    <span>Loading more posts…</span>
                </div>
            )}

            {!hasMore && posts.length > 0 && (
                <div className="text-center p-8 text-text-muted text-[0.82rem]">
                    <span className="inline-block px-4 py-[0.4rem] bg-card border border-border rounded-full">You&apos;ve seen all {posts.length} posts 🎉</span>
                </div>
            )}
        </div>
    );
}
