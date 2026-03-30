import { Problem } from "@/types/problem";

export const PROBLEMS: Problem[] = [
  {
    slug: "url-shortener",
    title: "URL Shortener",
    description:
      "Design a service like bit.ly that shortens long URLs and redirects users to the original URL.",
    difficulty: "Easy",
    category: "Infrastructure",
    tags: ["Hashing", "Cache", "NoSQL", "CDN"],
    estimatedMinutes: 45,
    requirements: {
      functional: [
        "Given a long URL, generate a unique short URL",
        "Redirect users from short URL to original long URL",
        "Allow users to optionally provide a custom short URL alias",
        "Short URLs should expire after a configurable TTL",
        "Track click analytics (count, timestamp, geo)",
      ],
      nonFunctional: [
        "100M URLs generated per day",
        "Read-heavy: 10:1 read/write ratio",
        "Redirects should happen in < 10ms (p99)",
        "99.99% availability",
        "URLs should not be guessable / enumerable",
      ],
    },
    hints: [
      "Consider base62 encoding of a counter vs MD5 hashing",
      "What happens when two users shorten the same long URL?",
      "How do you handle custom aliases with collision risk?",
      "Think about how a CDN or cache can reduce latency on reads",
    ],
  },
  {
    slug: "rate-limiter",
    title: "Rate Limiter",
    description:
      "Design a distributed rate limiting service to throttle API requests per user/IP.",
    difficulty: "Medium",
    category: "Infrastructure",
    tags: ["Redis", "Sliding Window", "Token Bucket", "Distributed"],
    estimatedMinutes: 45,
    requirements: {
      functional: [
        "Limit the number of requests a client can make in a time window",
        "Support multiple rate limit rules (per user, per IP, per API key)",
        "Return HTTP 429 with Retry-After header when limit is exceeded",
        "Provide a dashboard to view current usage",
      ],
      nonFunctional: [
        "Handle 10M requests/second across all users",
        "Rate limit decisions must be made in < 5ms",
        "Highly available — rate limiter failure should not take down the service",
        "Accurate to within 1% of the defined limit",
      ],
    },
    hints: [
      "Compare token bucket, leaky bucket, fixed window, sliding window algorithms",
      "How do you synchronize counters across multiple rate limiter nodes?",
      "Redis with INCR + EXPIRE vs Lua scripts — what are the trade-offs?",
      "What happens if the rate limiter itself goes down?",
    ],
  },
  {
    slug: "typeahead-search",
    title: "Typeahead / Autocomplete",
    description:
      "Design a real-time search suggestion system like Google's autocomplete that shows results as the user types.",
    difficulty: "Medium",
    category: "Search",
    tags: ["Trie", "Cache", "Elasticsearch", "Real-time"],
    estimatedMinutes: 45,
    requirements: {
      functional: [
        "Return top 10 search suggestions as user types each character",
        "Suggestions should be ranked by popularity / recency",
        "Support filtering suggestions by category",
        "Handle typos and fuzzy matching",
      ],
      nonFunctional: [
        "5B search queries per day",
        "Suggestion latency < 100ms (p95)",
        "System should update suggestions based on trending searches within 1 hour",
        "99.9% availability",
      ],
    },
    hints: [
      "Should you use a Trie in-memory or a search engine like Elasticsearch?",
      "How do you aggregate query frequency across billions of searches efficiently?",
      "How do you push trending term updates without full Trie rebuilds?",
      "Think about CDN caching for common prefix queries",
    ],
  },
  {
    slug: "distributed-cache",
    title: "Distributed Cache (Redis)",
    description:
      "Design a distributed in-memory cache system similar to Redis or Memcached.",
    difficulty: "Medium",
    category: "Storage",
    tags: ["Consistent Hashing", "LRU", "Replication", "Sharding"],
    estimatedMinutes: 50,
    requirements: {
      functional: [
        "GET and SET key-value pairs with optional TTL",
        "Support common data structures: strings, lists, sets, sorted sets, hashes",
        "Pub/Sub messaging between clients",
        "Atomic operations (INCR, SETNX, etc.)",
      ],
      nonFunctional: [
        "Sub-millisecond read/write latency",
        "Support petabyte-scale data across a cluster",
        "Handle node failures gracefully with automatic failover",
        "99.999% availability for cache reads",
      ],
    },
    hints: [
      "How does consistent hashing help with adding/removing nodes?",
      "What eviction policies exist and when would you choose each?",
      "How do you implement replication — leader-follower vs leaderless?",
      "How do you handle cache stampede / thundering herd?",
    ],
  },
  {
    slug: "web-crawler",
    title: "Web Crawler",
    description:
      "Design a scalable web crawler that can index billions of web pages for a search engine.",
    difficulty: "Medium",
    category: "Infrastructure",
    tags: ["BFS", "Queue", "Deduplication", "Robots.txt"],
    estimatedMinutes: 50,
    requirements: {
      functional: [
        "Start from seed URLs and crawl linked pages recursively",
        "Store crawled HTML content and extracted metadata",
        "Respect robots.txt and crawl-delay directives",
        "Detect and skip duplicate content",
        "Support re-crawling pages on a schedule",
      ],
      nonFunctional: [
        "Crawl 1 billion pages per day",
        "Politeness: max 1 request per domain per second",
        "Deduplication must detect near-duplicate content",
        "System must be resumable after failures",
      ],
    },
    hints: [
      "How do you avoid crawling the same URL twice at scale?",
      "BFS vs DFS — which is better for web crawling and why?",
      "How do you detect near-duplicate pages (simhash, minhash)?",
      "How do you prioritize which URLs to crawl first?",
    ],
  },
  {
    slug: "notification-service",
    title: "Notification Service",
    description:
      "Design a system that sends notifications to users via push, email, and SMS.",
    difficulty: "Easy",
    category: "Messaging",
    tags: ["Queue", "Push", "Email", "SMS", "Fan-out"],
    estimatedMinutes: 40,
    requirements: {
      functional: [
        "Send push notifications to iOS and Android devices",
        "Send email notifications via SMTP providers",
        "Send SMS via Twilio or similar",
        "Support user notification preferences and opt-outs",
        "Support scheduled and triggered notifications",
      ],
      nonFunctional: [
        "10M notifications per day",
        "Notifications should be delivered within 5 seconds",
        "At-least-once delivery guarantee",
        "99.9% availability",
      ],
    },
    hints: [
      "How do you handle different channels (push/email/SMS) with a single API?",
      "What message queue would you use and why?",
      "How do you handle delivery failures and retries?",
      "How do you avoid sending duplicate notifications?",
    ],
  },
  {
    slug: "twitter-feed",
    title: "Twitter / Social Feed",
    description:
      "Design a social media platform with a Twitter-like news feed, followers, and tweet functionality.",
    difficulty: "Hard",
    category: "Social",
    tags: ["Fan-out", "Timeline", "Cache", "Graph DB", "CDN"],
    estimatedMinutes: 60,
    requirements: {
      functional: [
        "Users can post tweets (text, images, videos)",
        "Users can follow/unfollow other users",
        "Home timeline shows tweets from followed users, reverse chronologically",
        "Trending topics and hashtag search",
        "Like, retweet, and reply to tweets",
      ],
      nonFunctional: [
        "300M daily active users",
        "Timeline must load in < 200ms (p99)",
        "Write: 600 tweets/second peak",
        "Read: 600K timeline reads/second",
        "99.99% availability",
      ],
    },
    hints: [
      "Fan-out on write vs fan-out on read — what are the trade-offs for celebrities?",
      "How do you handle users with 10M followers differently from normal users?",
      "How do you keep the timeline cache fresh when a user follows/unfollows?",
      "What storage would you use for the social graph?",
    ],
  },
  {
    slug: "ride-sharing",
    title: "Ride-Sharing (Uber)",
    description:
      "Design a ride-sharing platform that matches riders with nearby drivers in real-time.",
    difficulty: "Hard",
    category: "Real-time",
    tags: ["Geo-indexing", "WebSockets", "Matching", "Real-time"],
    estimatedMinutes: 60,
    requirements: {
      functional: [
        "Riders can request a ride with pickup and dropoff location",
        "Match riders with the nearest available driver",
        "Show real-time driver location on a map to the rider",
        "Dynamic pricing based on supply and demand",
        "Trip history and receipts",
      ],
      nonFunctional: [
        "1M concurrent trips globally",
        "Driver location updated every 5 seconds",
        "Matching latency < 1 second",
        "99.99% availability for ride requests",
        "GPS accuracy within 10 meters",
      ],
    },
    hints: [
      "How do you index driver locations for efficient nearest-neighbor queries?",
      "How do you handle the matching algorithm at scale?",
      "WebSockets vs polling for real-time driver location updates?",
      "How do you implement surge pricing — what signals drive it?",
    ],
  },
  {
    slug: "design-youtube",
    title: "YouTube / Video Streaming",
    description:
      "Design a video hosting and streaming platform that supports uploading, transcoding, and streaming videos.",
    difficulty: "Hard",
    category: "Media",
    tags: ["CDN", "Transcoding", "Object Storage", "Streaming"],
    estimatedMinutes: 60,
    requirements: {
      functional: [
        "Users can upload videos up to 10GB",
        "Videos are transcoded to multiple resolutions (360p, 720p, 1080p, 4K)",
        "Adaptive bitrate streaming based on network conditions",
        "Recommendations, likes, comments, subscriptions",
        "Live streaming support",
      ],
      nonFunctional: [
        "2B DAU, 500 hours of video uploaded per minute",
        "Video playback must start within 2 seconds",
        "99.99% availability for video playback",
        "Support global delivery with low latency",
      ],
    },
    hints: [
      "How does chunked uploading work and why is it necessary?",
      "How does HLS/DASH adaptive streaming work?",
      "How do you design the transcoding pipeline for 500 hours/min of uploads?",
      "How do you pre-position popular content at edge CDN nodes?",
    ],
  },
  {
    slug: "design-dropbox",
    title: "Dropbox / File Storage",
    description:
      "Design a cloud file storage system that supports file sync across devices.",
    difficulty: "Hard",
    category: "Storage",
    tags: ["Object Storage", "Sync", "Chunking", "Versioning", "Delta Sync"],
    estimatedMinutes: 60,
    requirements: {
      functional: [
        "Users can upload, download, and delete files",
        "File changes sync automatically across all user devices",
        "Support file versioning and recovery of deleted files",
        "Share files and folders with other users",
        "Offline access to files",
      ],
      nonFunctional: [
        "500M registered users, 100M DAU",
        "Sync latency < 5 seconds for files under 1MB",
        "Support files up to 1TB",
        "99.999% durability for stored files",
      ],
    },
    hints: [
      "How does delta/chunked sync work to avoid re-uploading entire files?",
      "How do you handle sync conflicts when two devices edit the same file?",
      "What storage backend would you use and how do you ensure durability?",
      "How does the file metadata service differ from the file storage service?",
    ],
  },
];

export function getProblemBySlug(slug: string): Problem | undefined {
  return PROBLEMS.find((p) => p.slug === slug);
}
