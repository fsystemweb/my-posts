import { Post } from "@/types/post";

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
                            <span key={ti} className="post-hashtag">{tag}</span>
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
                className="post-url"
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
            <span key={`${keyPrefix}-hash-${match.index}`} className="post-hashtag">
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

    return (
        <article className="post-card" style={{ animationDelay: animDelay }}>
            {/* Card Header */}
            <div className="post-card-header">
                <div className="post-avatar">F</div>
                <div>
                    <div className="post-author">{post.author}</div>
                    <div className="post-meta">LinkedIn Post</div>
                </div>
            </div>

            {/* Context */}
            {post.context && (
                <div className="post-context">
                    {parseContext(post.context)}
                </div>
            )}

            {/* Images */}
            {post.images && post.images.length > 0 && (
                <div className="post-images">
                    {post.images.map((src, idx) => {
                        const isSmall = isSmallImage(src);
                        return (
                            <div
                                key={idx}
                                className={
                                    isSmall
                                        ? "post-image-small-wrapper"
                                        : `post-image-wrapper ${post.images.length === 1 ? "single" : ""}`
                                }
                            >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={src}
                                    alt={`Post image ${idx + 1}`}
                                    className={isSmall ? "post-image-small" : "post-image"}
                                    loading="lazy"
                                />
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Attachments */}
            {post.attachments && post.attachments.filter(url => !url.includes("lnkd.in") && !url.includes("linkedin.com")).length > 0 && (
                <div className="post-attachments">
                    <div className="post-attachments-label">Links</div>
                    {post.attachments.filter(url => !url.includes("lnkd.in") && !url.includes("linkedin.com")).map((url, idx) => (
                        <a
                            key={idx}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="post-attachment-link"
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                                <polyline points="15 3 21 3 21 9" />
                                <line x1="10" y1="14" x2="21" y2="3" />
                            </svg>
                            {getDomain(url)}
                        </a>
                    ))}
                </div>
            )}
        </article>
    );
}
