const puppeteer = require('puppeteer');
const fs = require('fs-extra');
const path = require('path');
require('dotenv').config();

// Configuration
const PROFILE_URL = process.env.PROFILE_URL;
const DAYS_BACK = parseInt(process.env.DAYS_BACK || '7', 10);
const OUTPUT_FILE = process.env.OUTPUT_FILE || 'posts.json';

function parseRelativeDate(dateStr) {
    if (!dateStr) return 9999;
    const cleanStr = dateStr.toLowerCase().replace(/edited|•/g, '').trim();

    // Regex for: 5m, 2h, 3d, 1w, 4mo, 1y, 5 meses, 1 año
    // Matches number and unit
    const parts = cleanStr.match(/(\d+)\s*([a-zñ]+)/);

    if (!parts) return 0; // "now" or unexpected

    const val = parseInt(parts[1], 10);
    const unit = parts[2];

    // Seconds/Minutes/Hours -> 0 days
    if (['s', 'seg', 'm', 'min', 'h', 'hr', 'hora'].some(u => unit.startsWith(u) && !unit.includes('mes') && !unit.includes('mo'))) return 0;

    // Days
    if (unit.startsWith('d') || unit.includes('day') || unit.includes('día')) return val;

    // Weeks
    if (unit.startsWith('w') || unit.includes('week') || unit.includes('sem')) return val * 7;

    // Months
    if (unit.includes('mo') || unit.includes('mes')) return val * 30;

    // Years
    if (unit.startsWith('y') || unit.includes('año') || unit.includes('year')) return val * 365;

    return 9999;
}

async function scrapeLinkedIn() {
    console.log(`Starting scraper for ${PROFILE_URL}`);
    console.log(`Max age: ${DAYS_BACK} days`);

    const browserWsEndpoint = process.env.BROWSER_WS_ENDPOINT;
    const remoteDebuggingPort = process.env.REMOTE_DEBUGGING_PORT;

    let browser;
    if (browserWsEndpoint) {
        console.log(`Connecting to browser at ${browserWsEndpoint}...`);
        browser = await puppeteer.connect({ browserWSEndpoint: browserWsEndpoint });
    } else if (remoteDebuggingPort) {
        console.log(`Connecting to browser on port ${remoteDebuggingPort}...`);
        try {
            const resp = await fetch(`http://127.0.0.1:${remoteDebuggingPort}/json/version`);
            const data = await resp.json();
            browser = await puppeteer.connect({ browserWSEndpoint: data.webSocketDebuggerUrl });
        } catch (e) {
            console.log(`Could not connect to port ${remoteDebuggingPort}. Launching new browser instead.`);
            browser = await puppeteer.launch({
                headless: false,
                defaultViewport: { width: 1280, height: 800 },
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            });
        }
    } else {
        console.log('Launching new browser...');
        browser = await puppeteer.launch({
            headless: false,
            defaultViewport: { width: 1280, height: 800 },
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
    }

    const page = await browser.newPage();

    // Only set User-Agent if launching a NEW browser. 
    // If connecting to existing, respect the user's session and UA.
    if (!browserWsEndpoint && !remoteDebuggingPort) {
        await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    }

    try {
        await page.goto(PROFILE_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });

        // Check if we were redirected to login or home feed
        const currentUrl = page.url();
        if (currentUrl.includes('linkedin.com/feed')) {
            console.warn('Warning: Redirected to LinkedIn Home Feed. Attempting to navigate to profile again or scrape feed if that is intended...');
            // LinkedIn might redirect to feed if profile is not found or auth glitch. 
            // We can refuse to scrape if it's not the profile, to avoid junk data.
            // But let's try to proceed if we see the user wants to scrape "recent-activity".
            // If we are at /feed/, we are NOT at /recent-activity/.
            console.warn(`Current URL: ${currentUrl}`);
        } else if (currentUrl.includes('login') || currentUrl.includes('authwall')) {
            throw new Error('Redirected to Login. Please log in manually in the browser tab and restart script.');
        }

        // Wait for feed - using a generic container selector handling dynamic names if possible
        // LinkedIn uses 'feed-shared-update-v2' widely, but it changes.
        try {
            await page.waitForSelector('.feed-shared-update-v2, .occludable-update', { timeout: 15000 });
        } catch (e) {
            console.log('Timeout waiting for selector. Saving debug HTML...');
            await fs.writeFile('debug_error.html', await page.content());
            throw new Error('Could not find posts. Check debug_error.html. You might need to log in.');
        }

        const scrapedPosts = [];
        let previousHeight = 0;
        let noNewContentCount = 0;

        // Scroll limit safety
        let scrollAttempts = 0;
        const MAX_SCROLLS = 20;

        while (scrollAttempts < MAX_SCROLLS) {
            scrollAttempts++;
            console.log(`Scrolling... (${scrollAttempts}/${MAX_SCROLLS})`);

            // Expand "See more"
            try {
                const seeMoreButtons = await page.$$('.feed-shared-inline-show-more-text__see-more-less-toggle');
                for (const btn of seeMoreButtons) {
                    if (await btn.isVisible()) {
                        await btn.click().catch(() => { });
                        await new Promise(r => setTimeout(r, 100));
                    }
                }
            } catch (e) { /* ignore */ }

            const newPosts = await page.evaluate(() => {
                const posts = [];
                // Query all update cards
                const cards = document.querySelectorAll('.feed-shared-update-v2');

                cards.forEach(card => {
                    // 1. FILTER REPOSTS, COMMENTS, LIKES
                    // Look for header like "Name reposted this", "Name commented on this"
                    const headerText = card.querySelector('.update-components-header span, .feed-shared-text-view')?.innerText || '';
                    const headerLower = headerText.toLowerCase();
                    if (headerLower.includes('reposted') || headerLower.includes('republicado') ||
                        headerLower.includes('commented') || headerLower.includes('comentó') ||
                        headerLower.includes('liked') || headerLower.includes('gustó') ||
                        headerLower.includes('celebrated') || headerLower.includes('celebró')) {
                        return; // Skip non-authored posts (reposts, comments, likes)
                    }

                    // 2. EXTRACT DATA

                    // Author
                    // Try multiple selectors for the author name
                    let author = 'Unknown';
                    const authorSelectors = [
                        '.update-components-actor__name span[dir="ltr"]',
                        '.update-components-actor__name span[aria-hidden="true"]',
                        '.update-components-actor__name',
                        '.update-components-actor__title span[dir="ltr"]',
                        '.feed-shared-actor__name',
                        '.feed-shared-actor__title'
                    ];

                    for (const sel of authorSelectors) {
                        const el = card.querySelector(sel);
                        if (el) {
                            author = el.innerText.trim();
                            // Clean up duplicates (e.g. "Name\nName") caused by hidden accessible text
                            if (author.includes('\n')) {
                                author = author.split('\n')[0].trim();
                            }
                            if (author) break;
                        }
                    }

                    // Fallback: Try to get it from the aria-label of the profile image link
                    if (author === 'Unknown') {
                        const imgLink = card.querySelector('a.update-components-actor__image');
                        if (imgLink) {
                            const ariaLabel = imgLink.getAttribute('aria-label'); // often "View Profile of Name"
                            if (ariaLabel) {
                                author = ariaLabel.replace('View profile of', '').replace('Ver el perfil de', '').trim();
                            }
                        }
                    }

                    // Date
                    const dateEl = card.querySelector('.update-components-actor__sub-description span[aria-hidden="true"]');
                    const date = dateEl ? dateEl.innerText.trim().split('•')[0].trim() : '';

                    // Context (Text)
                    const textEl = card.querySelector('.update-components-text span span, .feed-shared-update-v2__description .break-words');
                    const context = textEl ? textEl.innerText.trim() : '';

                    // Images
                    // High-res images usually in 'img' tags within 'update-components-image'
                    const imgs = Array.from(card.querySelectorAll('.update-components-image__image, .feed-shared-image__image'))
                        .map(img => img.src)
                        .filter(src => src);

                    // Attachments (External Links)
                    // Articles or external links often have specific classes
                    const attachments = Array.from(card.querySelectorAll('a.app-aware-link:not(.update-components-actor__image):not(.update-components-actor__meta-link)'))
                        .map(a => a.href)
                        .filter(href => href && !href.includes('linkedin.com/in/') && !href.includes('/hashtag/'));

                    // Unique ID (URN)
                    const urn = card.getAttribute('data-urn') || context.substring(0, 30);

                    posts.push({
                        urn,
                        author,
                        date,
                        context, // Will clean up newlines later
                        images: imgs,
                        attachments: [...new Set(attachments)]
                    });
                });
                return posts;
            });

            // Add new posts
            for (const p of newPosts) {
                if (!scrapedPosts.some(existing => existing.urn === p.urn)) {
                    scrapedPosts.push(p);
                }
            }

            // Scroll
            previousHeight = await page.evaluate('document.body.scrollHeight');
            await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
            await new Promise(r => setTimeout(r, 2000));

            const newHeight = await page.evaluate('document.body.scrollHeight');
            if (newHeight === previousHeight) {
                noNewContentCount++;
                if (noNewContentCount > 2) break;
            } else {
                noNewContentCount = 0;
            }
        }

        console.log(`Total candidates found: ${scrapedPosts.length}`);

        // Process and Save
        // Per user request: Create a NEW file every time with datetime in name
        const now = new Date();
        const timestamp = now.toISOString().replace(/T/, '_').replace(/\..+/, '').replace(/:/g, '-');
        const outputFilename = `posts_${timestamp}.json`;

        const finalPosts = [];

        for (const p of scrapedPosts) {
            // Date Filter
            const daysOld = parseRelativeDate(p.date);
            if (daysOld > DAYS_BACK) {
                console.log(`Skipping old post: ${p.date} (${daysOld} days)`);
                continue;
            }

            // Internal Deduplication (within this run)
            const isDuplicate = finalPosts.some(e => e.context === p.context && e.date === p.date);

            if (!isDuplicate) {
                finalPosts.push({
                    date: p.date, // "5 meses"
                    author: p.author,
                    context: p.context,
                    images: p.images,
                    attachments: p.attachments
                });
            }
        }

        console.log(`Posts processed: ${finalPosts.length}`);

        if (finalPosts.length > 0) {
            const outputPath = path.resolve(__dirname, outputFilename);
            await fs.writeJson(outputPath, finalPosts, { spaces: 2 });
            console.log(`Successfully saved ${finalPosts.length} posts to ${outputFilename}`);
        } else {
            console.log('No posts matched the criteria.');
        }

    } catch (error) {
        console.error('Fatal Error:', error);
    } finally {
        if (!process.env.BROWSER_WS_ENDPOINT && !process.env.REMOTE_DEBUGGING_PORT) {
            await browser.close();
        } else {
            console.log('Done. Leaving browser open since we connected remotely.');
            // Optionally close just the page: await page.close();
        }
    }
}

scrapeLinkedIn();
