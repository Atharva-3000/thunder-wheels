# Thunder Wheels website

Plain HTML, CSS and JavaScript. No install, no build. Open `index.html` in a browser to see it.

## Files

- `index.html` – the page (hero, bikes, how it works, questions, map, footer, booking form)
- `styles.css` – the look
- `bikes.js` – **the bike list, prices and contact numbers. This is the file you edit.**
- `app.js` – date picker, prices, filters and the WhatsApp / email booking
- `images/` – bike photos

## Show or hide prices

Prices are hidden right now: visitors pick dates and a bike and ask for a quote on WhatsApp. The hero still says "Rates from ₹500 a day" (edit that line in `index.html` if it changes).

To show day rates and trip totals on every bike again, open `bikes.js` and set `showPrices: true`.

## Change a price or description

In `bikes.js`, change `price: 1700` to the new day rate, or edit the `note` text.

## Photos

Photos live in `images/` with these names (landscape photos work best, about 1280 × 960):

| Bike | File name |
|---|---|
| Activa 6G | `activa-6g.jpg` |
| Hunter 350 | `hunter-350.jpg` |
| Classic 350 | `classic-350.jpg` (also used in the big hero photo) |
| Meteor 350 | `meteor-350.jpg` |
| Himalayan 411 | `himalayan-411.jpg` |
| Himalayan 450 | `himalayan-450.jpg` |

The photos in there now are stand-ins from Wikimedia Commons; their sources and licences are listed in `images/credits.json`. When you swap in photos of your own bikes, keep the same file names.

If a photo is missing, the site shows a simple drawing of a bike or scooter instead.

## How booking works

1. The visitor sets pickup and return date and time in the bar under the hero.
2. They press **Book** on a bike. A booking form slides up with the bike and dates already filled in.
3. They add name and mobile and press **Send on WhatsApp**. WhatsApp opens with the bike, dates, how many days, name and number typed out (plus the estimate, when prices are switched on), addressed to +91 96640 97074. **Send by email** does the same to thunderwheels2017@gmail.com.

No server is needed. Every started 24 hours counts as one day. The browser remembers the visitor's dates if they come back.

## Map

The "Find us" section embeds the Google Maps pin for Thunder Wheels Motorcycle Rentals. To change it, replace the `src` of the `<iframe>` in `index.html` with a new embed link from Google Maps (Share › Embed a map).

## Putting it online

Drag the whole `thunder-wheels` folder onto Netlify Drop (app.netlify.com/drop), or upload it to any web host. Every file must stay in the same folder.

## Link preview (WhatsApp, iMessage, LinkedIn, X)

When the site link is shared, apps show `og-image.jpg` (1200 × 630) with the title and description set in the `<head>` of `index.html`.

Those apps need full URLs, so Vercel runs `scripts/build.js` on every deploy (set up in `vercel.json`). It copies the site into `dist/` and fills in the live address automatically from Vercel's `VERCEL_PROJECT_PRODUCTION_URL`. That's your vercel.app address, or your own domain once you add one. To force a specific address, add an environment variable `SITE_URL` (for example `https://thunderwheels.in`) in Vercel.

To change the preview picture, replace `og-image.jpg` with another 1200 × 630 JPG under 300 KB. Apps like WhatsApp cache previews, so a change can take a while to show. Add `?v=2` to the link to see the new one straight away.
