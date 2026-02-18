import { Post } from "@/types/post";
import { useState } from "react";
import ImageModal from "./ImageModal";
import { ExternalLink } from "lucide-react";

interface PostCardProps {
    post: Post;
    index: number;
}

// Parse context text into structured segments for rendering
function parseContext(text: string): React.ReactNode[] {
    const lines = text.split("\n");
    const nodes: React.ReactNode[] = [];
    let i = 0;

    while (i < lines.length) {
        const line = lines[i];

        // Handle "hashtag\n#tag" pattern — consume both lines, add hashtag badge + br
        if (line.trim() === "hashtag" && i + 1 < lines.length) {
            const nextLine = lines[i + 1].trim();
            if (nextLine.startsWith("#")) {
                const tags = nextLine.split(/\s+/).filter((t) => t.startsWith("#"));
                nodes.push(
                    <span key={`ht-${i}`} style={{ display: "inline-flex", flexWrap: "wrap", gap: "0.4rem", marginRight: "0.2rem" }}>
                        {tags.map((tag, ti) => (
                            <span key={ti} className="inline-block text-accent-dark font-semibold text-[0.85em] no-underline transition-colors duration-200 hover:text-accent hover:underline">{tag}</span>
                        ))}
                    </span>
                );
                // Only add a line break if the next-next line is not another hashtag group
                const afterNext = lines[i + 2]?.trim();
                if (afterNext !== "hashtag" && afterNext !== undefined) {
                    nodes.push(<br key={`ht-br-${i}`} />);
                } else {
                    nodes.push(" ");
                }
                i += 2;
                continue;
            }
        }

        // Empty line → blank line (double br for visual paragraph spacing)
        if (line.trim() === "") {
            nodes.push(<br key={`br-${i}`} />);
            i++;
            continue;
        }

        // Non-empty line → render inline content then a line break
        nodes.push(
            <span key={`line-${i}`}>
                {parseInline(line)}
            </span>
        );
        // Add <br> after every non-empty line (the \n in the source)
        if (i < lines.length - 1) {
            nodes.push(<br key={`lbr-${i}`} />);
        }
        i++;
    }

    return nodes;
}

function parseInline(text: string): React.ReactNode[] {
    // Match URLs and inline hashtags
    const urlRegex = /https?:\/\/[^\s]+/g;
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = urlRegex.exec(text)) !== null) {
        if (match.index > lastIndex) {
            const before = text.slice(lastIndex, match.index);
            parts.push(...parseHashtags(before, `pre-${match.index}`));
        }
        const url = match[0].replace(/[.,;:!?)\]'"]+$/, ""); // strip trailing punctuation
        parts.push(
            <a
                key={`url-${match.index}`}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-dark font-medium text-[0.85em] break-all no-underline border-b border-transparent transition-all duration-200 hover:text-accent hover:border-accent"
            >
                {url}
            </a>
        );
        lastIndex = match.index + url.length;
    }

    if (lastIndex < text.length) {
        parts.push(...parseHashtags(text.slice(lastIndex), `tail-${lastIndex}`));
    }

    return parts;
}

function parseHashtags(text: string, keyPrefix: string): React.ReactNode[] {
    const hashRegex = /#\w+/g;
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = hashRegex.exec(text)) !== null) {
        if (match.index > lastIndex) {
            parts.push(text.slice(lastIndex, match.index));
        }
        parts.push(
            <span key={`${keyPrefix}-hash-${match.index}`} className="inline-block text-accent-dark font-semibold text-[0.85em] no-underline transition-colors duration-200 hover:text-accent hover:underline">
                {match[0]}
            </span>
        );
        lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
        parts.push(text.slice(lastIndex));
    }

    return parts.length > 0 ? parts : [text];
}

/** Detect whether a LinkedIn image URL is a small thumbnail */
function isSmallImage(url: string): boolean {
    return (
        /shrink_160/.test(url) ||
        /shrink_20/.test(url) ||
        /company-logo_100_100/.test(url) ||
        /ugc-proxy-shrink_160/.test(url)
    );
}

function getDomain(url: string): string {
    try {
        const u = new URL(url);
        return u.hostname.replace("www.", "");
    } catch {
        return url.length > 40 ? url.slice(0, 40) + "…" : url;
    }
}

export default function PostCard({ post, index }: PostCardProps) {
    const animDelay = `${(index % 8) * 0.05}s`;
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    return (
        <>
            {selectedImage && (
                <ImageModal
                    src={selectedImage}
                    alt="Enlarged view"
                    onClose={() => setSelectedImage(null)}
                />
            )}
            <article className="bg-card rounded shadow-md border border-border mb-5 overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#492828]/15 animate-[cardIn_0.35s_ease_both]" style={{ animationDelay: animDelay }}>
                {/* Card Header */}
                <div className="flex items-center gap-3 p-4 pb-3">
                    <div className="w-[42px] h-[42px] rounded-full bg-gradient-to-br from-accent to-accent-dark flex items-center justify-center font-bold text-base text-white shrink-0">F</div>
                    <div>
                        <div className="font-semibold text-[0.95rem] text-dark">{post.author}</div>
                        <div className="text-xs text-text-muted mt-[1px]">LinkedIn Post</div>
                    </div>
                </div>

                {/* Context */}
                {post.context && (
                    <div className="px-5 pb-4 text-[0.9rem] text-text leading-[1.7]">
                        {parseContext(post.context)}
                    </div>
                )}

                {/* Images */}
                {post.images && post.images.length > 0 && (
                    <div className="px-5 pb-4 flex gap-2 flex-wrap">
                        {post.images.map((src, idx) => {
                            const isSmall = isSmallImage(src);
                            return (
                                <div
                                    key={idx}
                                    className={
                                        isSmall
                                            ? "flex-none w-[190px] h-[190px] rounded-sm overflow-hidden bg-[#f0f0f0] border border-border group"
                                            : `flex-1 min-w-[120px] max-w-full rounded-sm overflow-hidden bg-[#ddd] aspect-video group ${post.images.length === 1 ? "flex-none w-full" : ""}`
                                    }
                                    onClick={() => !isSmall && setSelectedImage(src)}
                                    style={!isSmall ? { cursor: "zoom-in" } : undefined}
                                >
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={src}
                                        alt={`Post image ${idx + 1}`}
                                        className={isSmall ? "w-full h-full object-contain p-1 bg-white transition-transform duration-300 group-hover:scale-105" : "w-full h-full object-cover block transition-transform duration-300 group-hover:scale-[1.02]"}
                                        loading="lazy"
                                    />
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Attachments */}
                {post.attachments && post.attachments.filter(url => !url.includes("lnkd.in") && !url.includes("linkedin.com")).length > 0 && (
                    <div className="px-5 pb-4 pt-3 border-t border-border flex flex-col gap-[0.45rem]">
                        <div className="text-[0.72rem] font-semibold uppercase tracking-wider text-text-muted mb-[0.15rem]">Links</div>
                        {post.attachments.filter(url => !url.includes("lnkd.in") && !url.includes("linkedin.com")).map((url, idx) => (
                            <a
                                key={idx}
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-3 py-2 bg-accent/10 border border-accent/20 rounded-sm no-underline text-accent-dark text-sm font-medium break-all transition-all duration-200 hover:bg-accent/20 hover:border-accent hover:translate-x-0.5"
                            >
                                <ExternalLink className="w-[13px] h-[13px] shrink-0 opacity-70" />
                                {getDomain(url)}
                            </a>
                        ))}
                    </div>
                )}
            </article>
        </>
    );
}
