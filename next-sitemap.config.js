/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://isatech.club",
  generateRobotsTxt: true,
  generateIndexSitemap: false, // Single sitemap is fine for small sites

  // Crawl configuration
  changefreq: "weekly", // Default fallback
  priority: 0.7, // Default fallback

  // Enhanced robots.txt configuration
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        crawlDelay: 0,
      },
      {
        userAgent: "Bingbot",
        allow: "/",
        crawlDelay: 0,
      },
    ],
    additionalSitemaps: [
      // Future: Add image sitemap, video sitemap if needed
      // 'https://isatech.club/sitemap-images.xml',
    ],
  },

  // Exclude patterns.
  // - `/quiz/result` is a server-side redirect page (its OG tags are only
  //   meaningful to social crawlers that don't follow redirects); it must not
  //   be in the sitemap.
  // - Pages under app routes are auto-discovered, so no `additionalPaths`
  //   (the previous block stamped a fresh `lastmod` on every build, churning
  //   the sitemap on each deploy).
  exclude: ["/api/*", "/404", "/_next/*", "/quiz/result"],
};
