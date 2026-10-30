/*
  THUNDER WHEELS — bike list
  ------------------------------------------------------------
  This is the only file you need to edit day to day.

  available: true   -> shows "Available" (green)
  available: false  -> shows "Booked out" (red)

  price: rent per day in rupees
  group: which filter button the bike shows under
         ("scooter", "350", "adventure")
  image: photo inside the /images folder. If the photo is missing,
         a simple drawing is shown instead, so the site never breaks.
*/

const BIKES = [
  {
    id: "activa-6g",
    name: "Honda Activa 6G",
    short: "Activa 6G",
    type: "Scooter",
    cc: "110cc",
    group: "scooter",
    note: "No gears, easy in traffic. Good for city errands and short hops.",
    price: 500,
    image: "images/activa-6g.jpg",
    kind: "scooter",
    available: true
  },
  {
    id: "hunter-350",
    name: "Royal Enfield Hunter 350",
    short: "Hunter 350",
    type: "Roadster",
    cc: "350cc",
    group: "350",
    note: "The lightest Enfield. Quick through Mumbai traffic.",
    price: 1700,
    image: "images/hunter-350.jpg",
    kind: "bike",
    available: true
  },
  {
    id: "classic-350",
    name: "Royal Enfield Classic 350",
    short: "Classic 350",
    type: "Classic",
    cc: "350cc",
    group: "350",
    note: "The classic Bullet look and thump. Made for weekend rides.",
    price: 1800,
    image: "images/classic-350.jpg",
    kind: "bike",
    available: true
  },
  {
    id: "meteor-350",
    name: "Royal Enfield Meteor 350",
    short: "Meteor 350",
    type: "Cruiser",
    cc: "350cc",
    group: "350",
    note: "Low, relaxed seat. Easy on the back on long highway days.",
    price: 1800,
    image: "images/meteor-350.jpg",
    kind: "bike",
    available: true
  },
  {
    id: "himalayan-411",
    name: "Royal Enfield Himalayan 411",
    short: "Himalayan 411",
    type: "Adventure",
    cc: "411cc",
    group: "adventure",
    note: "Tall and tough. Ghats, broken roads, Konkan trips.",
    price: 2000,
    image: "images/himalayan-411.jpg",
    kind: "bike",
    available: true
  },
  {
    id: "himalayan-450",
    name: "Royal Enfield Himalayan 450",
    short: "Himalayan 450",
    type: "Adventure",
    cc: "452cc",
    group: "adventure",
    note: "The newest and most powerful bike we have. For long tours.",
    price: 2700,
    image: "images/himalayan-450.jpg",
    kind: "bike",
    available: true
  }
];

/* Prices
   showPrices: false -> day rates and totals are hidden; visitors ask for a quote
   showPrices: true  -> each bike shows its day rate and the total for the dates */
const SETTINGS = {
  showPrices: false
};

/* Contact details used by every button on the site */
const CONTACT = {
  whatsapp: "919664097074",          // country code + number, no + or spaces
  phoneDisplay: "+91 96640 97074",
  phoneLink: "+919664097074",
  email: "thunderwheels2017@gmail.com"
};
