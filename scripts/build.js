/*
  Vercel build step for the link preview (no packages needed).

  Copies the site into dist/ and turns the relative preview links in index.html
  (og:image, og:url, canonical) into full URLs, because WhatsApp, iMessage,
  LinkedIn and X need full URLs to show the preview image.

  The address comes from Vercel's system variable VERCEL_PROJECT_PRODUCTION_URL
  (your vercel.app address, or your own domain once you add one).
  To force a specific address, add SITE_URL (e.g. https://thunderwheels.in)
  in Vercel › Settings › Environment Variables.
*/
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const out = path.join(root, "dist");
const skip = new Set([".git", ".github", "node_modules", "dist", "scripts", ".vercel", "vercel.json", ".gitignore", "README.md"]);

fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out);
for (const name of fs.readdirSync(root)) {
  if (skip.has(name) || name.startsWith(".")) continue;
  fs.cpSync(path.join(root, name), path.join(out, name), { recursive: true });
}

let host = process.env.SITE_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL || "";
host = host.replace(/\/+$/, "");
if (host && !/^https?:\/\//.test(host)) host = "https://" + host;

const file = path.join(out, "index.html");
let html = fs.readFileSync(file, "utf8");
if (host) {
  html = html.replace(/(<meta (?:property|name)="(?:og:image|og:url|twitter:image)" content=")\/([^"]*)"/g, (m, a, rest) => a + host + "/" + rest + '"');
  html = html.replace(/(<link rel="canonical" href=")\/([^"]*)"/, (m, a, rest) => a + host + "/" + rest + '"');
  fs.writeFileSync(file, html);
  console.log("Link preview URLs set to " + host);
} else {
  console.log("No site address found; link preview tags left as relative URLs.");
}
