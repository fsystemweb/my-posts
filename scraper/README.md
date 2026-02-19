# LinkedIn Post Scraper

A standalone tool to scrape your own LinkedIn posts, filtering out reposts and saving them to a JSON file.

## Disclaimer

**IMPORTANT: This tool is for educational and personal archival purposes only.**

The authors and contributors of this software are **not responsible** for any consequences that may arise from its use, including but not limited to account suspension, restriction, or banning by LinkedIn.

The implications of using automated tools to access LinkedIn are not fully known and may violate their Terms of Service. This script is intended solely as a workaround to collect your own personal content locally and for free. **Use at your own risk.**

## Setup

1.  **Install dependencies**:
    ```bash
    cd scraper
    npm install
    ```

2.  **Configuration**:
    - Copy `.env.example` to `.env`.
    - Edit `.env` and set your `PROFILE_URL`.
      - Recommended URL format: `https://www.linkedin.com/in/YOUR_PROFILE/recent-activity/all/`
    - Set `DAYS_BACK` (default: 7).

## Usage

Run the scraper:

```bash
node index.js
```

The script will:
1.  Launch a browser (visible mode).
2.  Navigate to your profile's activity page.
3.  Scroll down to load posts from the last N days.
4.  Filter out reposts.
5.  Save new posts to to a timestamped JSON file (e.g., `posts_2024-02-19_10-00-00.json`).

## Authentication & Local Browser

LinkedIn strictly blocks automated scrapers. The most reliable way to scrape is to connect to your **already logged-in Chrome browser**.

### How to run with Local Browser

1.  **Close all Chrome instances**.
2.  **Launch Chrome with remote debugging enabled**:
    - **Linux**:
      ```bash
      google-chrome --remote-debugging-port=9222 --user-data-dir=remote-profile
      ```
    - **Mac**:
      ```bash
      /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9222 --user-data-dir=remote-profile
      ```
    - **Windows**:
      ```bash
      start chrome.exe --remote-debugging-port=9222 --user-data-dir=remote-profile
      ```
3.  **Log in to LinkedIn** in this new Chrome window.
4.  **Configure `.env`**:
    ```
    REMOTE_DEBUGGING_PORT=9222
    ```
5.  **Run the scraper**:
    ```bash
    node index.js
    ```

The script will detect the port and attach to your browser instead of launching a new one.

## Data Structure

Output JSON format:

```json
[
  {
    "date": "5 months",
    "author": "Your Name",
    "context": "Post text content...",
    "images": ["https://..."],
    "attachments": ["https://..."]
  }
]
```
