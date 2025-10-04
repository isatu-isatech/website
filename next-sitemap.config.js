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

  // Additional paths to include (in case static export doesn't catch them)
  additionalPaths: async () => {
    const result = [];

    // Define all pages with custom config
    const pages = [
      { path: "/", priority: 1.0, changefreq: "daily" },
      { path: "/about", priority: 0.9, changefreq: "monthly" },
      { path: "/membership", priority: 0.9, changefreq: "monthly" },
      { path: "/contact", priority: 0.8, changefreq: "monthly" },
      { path: "/privacy", priority: 0.3, changefreq: "yearly" },
    ];

    for (const page of pages) {
      result.push({
        loc: page.path,
        changefreq: page.changefreq,
        priority: page.priority,
        lastmod: new Date().toISOString(),
      });
    }

    return result;
  },

  // Exclude patterns
  exclude: ["/api/*", "/404", "/_next/*"],
};
