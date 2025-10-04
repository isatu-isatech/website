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

  // Custom transformation for individual pages
  transform: async (config, path) => {
    // Define priority and changefreq per page
    const customConfig = {
      "/": {
        priority: 1.0,
        changefreq: "daily",
      },
      "/about": {
        priority: 0.9,
        changefreq: "monthly",
      },
      "/membership": {
        priority: 0.9,
        changefreq: "monthly",
      },
      "/contact": {
        priority: 0.8,
        changefreq: "monthly",
      },
      "/privacy": {
        priority: 0.3,
        changefreq: "yearly",
      },
    };

    const pageConfig = customConfig[path] || {
      priority: config.priority,
      changefreq: config.changefreq,
    };

    return {
      loc: path,
      changefreq: pageConfig.changefreq,
      priority: pageConfig.priority,
      lastmod: new Date().toISOString(),
      // Add alternates for future i18n support
      // alternateRefs: [],
    };
  },

  // Exclude patterns
  exclude: ["/api/*", "/404", "/_next/*"],
};
