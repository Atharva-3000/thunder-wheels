# Thunder Wheels website

Plain HTML, CSS and JavaScript. No install, no build. Open `index.html` in a browser to see it.

## Files

- `index.html` – the page (hero, bikes, how it works, questions, map, footer, booking form)
- `styles.css` – the look
- `bikes.js` – **the bike list, prices, availability and contact numbers. This is the file you edit.**
- `app.js` – date picker, prices, filters and the WhatsApp / email booking
- `images/` – bike photos

## Mark a bike booked or free

Open `bikes.js` and change `available: true` to `available: false` (or back). Save and upload the file again.

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

The photos in there now are stand-ins from Wikimedia Commons (free to use with credit). Their credits are in the page footer under **Photo credits** and in `images/credits.json`. When you swap in photos of your own bikes, keep the same file names and delete the credits block at the bottom of `index.html`.

If a photo is missing, the site shows a simple drawing of a bike or scooter instead.

## How booking works

1. The visitor sets pickup and return date and time in the bar under the hero. Every bike then shows the total for those dates.
2. They press **Book** on a bike. A booking form slides up with the bike and dates already filled in.
3. They add name and mobile and press **Send on WhatsApp**. WhatsApp opens with the bike, dates, estimate, name and number typed out, addressed to +91 96640 97074. **Send by email** does the same to thunderwheels2017@gmail.com.

No server is needed. The estimate counts every started 24 hours as one day × the day rate. The browser remembers the visitor's dates if they come back.

## Map

The "Find us" section embeds the Google Maps pin for Thunder Wheels Motorcycle Rentals. To change it, replace the `src` of the `<iframe>` in `index.html` with a new embed link from Google Maps (Share › Embed a map).

## Putting it online

Drag the whole `thunder-wheels` folder onto Netlify Drop (app.netlify.com/drop), or upload it to any web host. Every file must stay in the same folder.
