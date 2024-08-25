import fs from "fs";

import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
const __filename = fileURLToPath(import.meta.url);
// Define your routes and their properties
const routes = [
  { path: "/", priority: "1.00", changefreq: "daily" },
  { path: "/login", priority: "0.80", changefreq: "monthly" },
  { path: "/signup", priority: "0.80", changefreq: "monthly" },
  { path: "/blogs", priority: "0.90", changefreq: "weekly" },
  { path: "/record", priority: "0.80", changefreq: "monthly" },
  { path: "/health-check", priority: "0.80", changefreq: "monthly" },
  // Add dynamic routes here if necessary
];

// Function to generate the XML sitemap
const generateSitemap = (routes) => {
  const baseUrl = "https://www.vanii.ai"; // Replace with your website's base URL

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  routes.forEach((route) => {
    xml += `  <url>\n`;
    xml += `    <loc>${baseUrl}${route.path}</loc>\n`;
    xml += `    <priority>${route.priority}</priority>\n`;
    xml += `    <changefreq>${route.changefreq}</changefreq>\n`;
    xml += `  </url>\n`;
  });

  xml += `</urlset>\n`;
  return xml;
};

// Write the XML to a file
const sitemap = generateSitemap(routes);
fs.writeFileSync(
  path.join(dirname(__filename), "./dist/sitemap.xml"),
  sitemap,
  "utf8"
);

console.log("Sitemap has been generated.");
