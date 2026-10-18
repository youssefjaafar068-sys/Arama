/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://arama-restaurant.vercel.app',
  generateRobotsTxt: true,
  exclude: ['/api/*'],
};
