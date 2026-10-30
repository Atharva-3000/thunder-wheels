/* Thunder Wheels — site logic. Bike data and contact details live in bikes.js */
(function () {
  "use strict";

  var inr = new Intl.NumberFormat("en-IN");
  var rupees = function (n) { return "₹" + inr.format(n); };
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  var reduceMotion = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var SHOW_PRICES = typeof SETTINGS !== "undefined" && !!SETTINGS.showPrices;

  /* ---------- Drawings shown if a photo is missing ---------- */
  var DRAWINGS = {
    bike:
      '<svg class="drawing" viewBox="0 0 220 140" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<circle cx="46" cy="98" r="27" stroke-width="9"/><circle cx="176" cy="98" r="27" stroke-width="9"/>' +
      '<circle cx="46" cy="98" r="9"/><circle cx="176" cy="98" r="9"/>' +
      '<path d="M46 98 88 84"/><path d="M176 98 156 40"/><path d="M150 36l-10-8M150 36h16"/>' +
      '<circle cx="164" cy="50" r="7" fill="currentColor" stroke="none"/>' +
      '<path d="M84 58c10-14 44-16 60-6l2 12H82z" fill="currentColor" stroke-width="3"/>' +
      '<path d="M50 58h36" stroke-width="8"/>' +
      '<rect x="92" y="70" width="40" height="30" rx="5" fill="currentColor" stroke="none"/>' +
      '<path d="M146 64 132 86"/><path d="M100 104 40 112" stroke-width="6"/>' +
      '</svg>',
    scooter:
      '<svg class="drawing" viewBox="0 0 220 140" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<circle cx="52" cy="104" r="20"/><circle cx="170" cy="104" r="20"/>' +
      '<circle cx="52" cy="104" r="4" fill="currentColor"/><circle cx="170" cy="104" r="4" fill="currentColor"/>' +
      '<path d="M30 92c4-22 22-32 48-32h18"/>' +
      '<path d="M78 60c-6-8-2-16 8-16h34c8 0 10 8 4 16z" fill="currentColor" stroke-width="3"/>' +
      '<path d="M96 104h46l12-48"/><path d="M154 56l8-30h-14"/><path d="M162 26h12"/><path d="M72 104h24"/>' +
      '</svg>'
  };

  function photoInto(el, bike) {
    var img = new Image();
    img.alt = bike.name;
    img.loading = "lazy";
    img.decoding = "async";
    img.onerror = function () { img.remove(); el.insertAdjacentHTML("beforeend", DRAWINGS[bike.kind] || DRAWINGS.bike); };
    img.src = bike.image;
    el.appendChild(img);
  }

  /* ---------- Contact links ---------- */
  var GENERAL_WA_TEXT =
    "Hi Thunder Wheels, I'd like to book a bike.\n\n" +
    "Bike: \n\n" +
    "Pickup Date : \n" +
    "Pickup Time : \n\n" +
    "Drop Off Date : \n" +
    "Drop Off Time : ";
  function waLink(text) { return "https://wa.me/" + CONTACT.whatsapp + "?text=" + encodeURIComponent(text); }

  $$("[data-wa-general]").forEach(function (a) { a.href = waLink(GENERAL_WA_TEXT); });
  $$("[data-phone]").forEach(function (a) { a.href = "tel:" + CONTACT.phoneLink; });
  $$("[data-phone-text]").forEach(function (s) { s.textContent = CONTACT.phoneDisplay; });
  $$("[data-email]").forEach(function (a) { a.href = "mailto:" + CONTACT.email; });
  $$("[data-email-text]").forEach(function (s) { s.textContent = CONTACT.email; });

  /* ---------- Dates (shared by the date bar and the booking sheet) ---------- */
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function isoDate(d) { return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); }
  function addDays(iso, n) { var d = new Date(iso + "T00:00"); d.setDate(d.getDate() + n); return isoDate(d); }
  function toDate(day, time) { return day && time ? new Date(day + "T" + time) : null; }
  function fmtShort(d) {
    return d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" }) + ", " +
      d.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", hour12: true }).replace(":00", "");
  }
  function fmtDate(d) {
    return d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
  }
  function fmtTime(d) {
    return d.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", hour12: true });
  }

  var today = isoDate(new Date());
  var tomorrow = addDays(today, 1);
  var state = { pDate: tomorrow, pTime: "09:00", rDate: addDays(tomorrow, 1), rTime: "09:00" };

  try {
    var saved = JSON.parse(localStorage.getItem("tw-dates") || "null");
    if (saved && saved.pDate >= today) state = saved;
  } catch (e) {}

  function save() { try { localStorage.setItem("tw-dates", JSON.stringify(state)); } catch (e) {} }

  function trip() {
    var start = toDate(state.pDate, state.pTime), end = toDate(state.rDate, state.rTime);
    if (!start || !end) return { ok: false, msg: "Add your pickup and return date and time." };
    if (end <= start) return { ok: false, msg: "Return time has to be after pickup." };
    if (start < new Date(Date.now() - 30 * 60 * 1000)) return { ok: false, msg: "Pickup time has already passed. Pick a later time." };
    var days = Math.max(1, Math.ceil((end - start) / 864e5 - 1e-9));
    return { ok: true, start: start, end: end, days: days };
  }
  function dayWord(n) { return n + (n === 1 ? " day" : " days"); }

  var dateInputs = $$("input[data-key]");
  dateInputs.forEach(function (el) {
    el.min = today;
    el.addEventListener("change", function () {
      var k = el.getAttribute("data-key");
      state[k] = el.value;
      if (k === "pDate" && state.pDate && (!state.rDate || state.rDate < state.pDate)) state.rDate = addDays(state.pDate, 1);
      save();
      syncDates(el);
      refresh();
    });
  });

  function syncDates(except) {
    dateInputs.forEach(function (el) {
      if (el === except) return;
      var k = el.getAttribute("data-key");
      if (el.value !== state[k]) el.value = state[k] || "";
      if (k === "rDate") el.min = state.pDate || today;
    });
  }

  /* ---------- Date bar ---------- */
  var durationEl = $("[data-duration]");
  var dateErr = $("[data-date-error]");
  var tripSummary = $("[data-trip-summary]");

  $("#datebar").addEventListener("submit", function (e) {
    e.preventDefault();
    var t = trip();
    if (!t.ok) { dateErr.textContent = t.msg; dateErr.hidden = false; return; }
    $("#bikes").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
  });

  /* ---------- Fleet ---------- */
  var fleetEl = $("#fleet");
  var filter = "all";

  function renderFleet() {
    var t = trip();
    var list = BIKES.filter(function (b) {
      return filter === "all" || b.group === filter;
    });
    fleetEl.innerHTML = "";

    if (!list.length) {
      fleetEl.innerHTML = '<li class="empty">No bikes in this group. Try another filter, or WhatsApp us your dates and we\'ll suggest one.</li>';
      return;
    }

    list.forEach(function (b) {
      var li = document.createElement("li");
      li.className = "bike";
      var priceRow;
      var total = t.ok && t.days === 1
        ? '<div class="bike-total"><span>for 24 hours</span></div>'
        : t.ok
        ? '<div class="bike-total"><strong>' + rupees(b.price * t.days) + "</strong><span>for " + dayWord(t.days) + "</span></div>"
        : '<div class="bike-total"><span>Pick dates to see the total</span></div>';
      priceRow = SHOW_PRICES
        ? '<div class="bike-price">' +
            '<p class="plate" aria-label="' + rupees(b.price) + ' per day">' + "<span>" + rupees(b.price) + '<span class="plate-unit">/day</span></span></p>' +
            total +
          "</div>"
        : '<div class="bike-price"><p class="bike-quote">' +
            (t.ok ? "Quote for <strong>" + dayWord(t.days) + "</strong> on WhatsApp" : "Price on request") +
          "</p></div>";
      li.innerHTML =
        '<div class="bike-photo"></div>' +
        '<div class="bike-body">' +
          '<p class="bike-meta">' + b.type + " &nbsp;/&nbsp; " + b.cc + "</p>" +
          "<h3>" + b.short + "</h3>" +
          '<p class="bike-note">' + b.note + "</p>" +
          priceRow +
          '<button type="button" class="btn btn-ink" data-book="' + b.id + '">' +
            "Book " + b.short +
          "</button>" +
        "</div>";
      photoInto($(".bike-photo", li), b);
      fleetEl.appendChild(li);
    });
  }

  $$("[data-filter]").forEach(function (chip) {
    chip.addEventListener("click", function () {
      filter = chip.getAttribute("data-filter");
      $$("[data-filter]").forEach(function (c) { c.setAttribute("aria-pressed", String(c === chip)); });
      renderFleet();
    });
  });

  fleetEl.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-book]");
    if (btn) openBooking(btn.getAttribute("data-book"));
  });

  /* ---------- Booking sheet ---------- */
  var sheet = $("#booking");
  var form = $("#booking-form");
  var bikeSel = $("#bike");
  var sheetTitle = $("[data-sheet-title]");
  var sheetThumb = $("[data-sheet-thumb]");
  var estTotal = $("[data-est-total]");
  var estDetail = $("[data-est-detail]");
  var estLabel = $("[data-est-label]");
  var formErr = $("[data-form-error]");
  var lastFocus = null;

  bikeSel.innerHTML = '<option value="">Choose a bike</option>' + BIKES.map(function (b) {
    return '<option value="' + b.id + '">' + b.name + (SHOW_PRICES ? " (" + rupees(b.price) + "/day)" : "") + "</option>";
  }).join("");

  function selectedBike() { return BIKES.filter(function (b) { return b.id === bikeSel.value; })[0] || null; }

  function updateSheet() {
    var b = selectedBike(), t = trip();
    sheetTitle.textContent = b ? b.name : "Choose a bike";
    sheetThumb.innerHTML = "";
    if (b) photoInto(sheetThumb, b);

    estLabel.textContent = SHOW_PRICES ? "Estimated rent" : "Your rental";
    if (SHOW_PRICES && b && t.ok) {
      estTotal.textContent = rupees(b.price * t.days);
      estDetail.textContent = dayWord(t.days) + " × " + rupees(b.price);
    } else if (!SHOW_PRICES && t.ok) {
      estTotal.textContent = dayWord(t.days);
      estDetail.textContent = fmtShort(t.start) + " to " + fmtShort(t.end);
    } else {
      estTotal.textContent = SHOW_PRICES ? "₹ —" : "—";
      estDetail.textContent = !t.ok ? t.msg : "Choose a bike to see the price";
    }

  }

  function openBooking(id) {
    lastFocus = document.activeElement;
    if (id) bikeSel.value = id;
    formErr.hidden = true;
    syncDates();
    updateSheet();
    if (typeof sheet.showModal === "function") sheet.showModal(); else sheet.setAttribute("open", "");
    document.documentElement.style.overflow = "hidden";
    setTimeout(function () {
      var first = !bikeSel.value ? bikeSel : !$("#name").value ? $("#name") : $("#phone");
      first.focus({ preventScroll: true });
    }, 60);
  }
  function closeBooking() { if (sheet.open) sheet.close(); }
  sheet.addEventListener("close", function () {
    document.documentElement.style.overflow = "";
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  });

  $$("[data-open-booking]").forEach(function (b) { b.addEventListener("click", function () { openBooking(null); }); });
  $("[data-close]", sheet).addEventListener("click", closeBooking);
  sheet.addEventListener("click", function (e) { if (e.target === sheet) closeBooking(); });   // click on backdrop
  bikeSel.addEventListener("change", updateSheet);

  $$("input, select, textarea", form).forEach(function (el) {
    el.addEventListener("input", function () { el.classList.remove("invalid"); formErr.hidden = true; });
  });

  function fail(msg, field) {
    formErr.textContent = msg;
    formErr.hidden = false;
    if (field) { field.classList.add("invalid"); field.focus(); }
  }

  var lastChannel = "whatsapp";
  $$("[data-channel]", form).forEach(function (b) { b.addEventListener("click", function () { lastChannel = b.getAttribute("data-channel"); }); });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var channel = (e.submitter && e.submitter.getAttribute("data-channel")) || lastChannel;
    formErr.hidden = true;

    var b = selectedBike(), t = trip();
    var nameEl = $("#name"), phoneEl = $("#phone");
    var name = nameEl.value.trim();
    var phone = phoneEl.value.replace(/\D/g, "").replace(/^(91|0)(?=\d{10}$)/, "");

    if (!b) return fail("Choose a bike.", bikeSel);
    if (!t.ok) return fail(t.msg, $("#f-pdate"));
    if (!name) return fail("Add your name.", nameEl);
    if (phone.length !== 10) return fail("Enter a 10-digit mobile number.", phoneEl);

    var area = $("#area").value.trim(), note = $("#message").value.trim();
    var lines = (SHOW_PRICES ? [
      "Hi Thunder Wheels, I'd like to book a bike.",
      "",
      "Bike: " + b.name + " (" + rupees(b.price) + "/day)",
      "Duration: " + dayWord(t.days),
      "Estimate: " + rupees(b.price * t.days)
    ] : [
      "Hi Thunder Wheels, I'd like to book a bike. Please send me a quote.",
      "",
      "Bike: " + b.name,
      "Duration: " + dayWord(t.days)
    ]).concat([
      "",
      "Pickup Date : " + fmtDate(t.start),
      "Pickup Time : " + fmtTime(t.start),
      "",
      "Drop Off Date : " + fmtDate(t.end),
      "Drop Off Time : " + fmtTime(t.end),
      "",
      "Name: " + name,
      "Mobile: " + phone
    ]);
    if (area) lines.push("Riding to: " + area);
    if (note) lines.push("Note: " + note);
    var text = lines.join("\n");

    if (channel === "email") {
      var subject = "Booking request: " + b.name + ", " + t.start.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
      window.location.href = "mailto:" + CONTACT.email + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(text);
    } else {
      var url = waLink(text);
      var win = window.open(url, "_blank");
      if (win) { try { win.opener = null; } catch (err) {} } else window.location.href = url;
    }
  });

  /* ---------- Refresh everything that depends on dates ---------- */
  function refresh() {
    var t = trip();
    durationEl.textContent = t.ok ? dayWord(t.days) : "–";
    dateErr.hidden = t.ok || !state.pDate || !state.rDate;
    if (!t.ok) dateErr.textContent = t.msg;
    tripSummary.innerHTML = t.ok
      ? (SHOW_PRICES ? "Prices for <strong>" : "Your dates: <strong>") + fmtShort(t.start) + "</strong> to <strong>" + fmtShort(t.end) + "</strong> (" + dayWord(t.days) + "). " +
        '<button type="button" data-change-dates>Change dates</button>'
      : (SHOW_PRICES ? "Rent is per day (24 hours). Pick your dates above to see totals." : "Pick your dates above, then choose a bike.");
    renderFleet();
    if (sheet.open) updateSheet();
  }

  document.addEventListener("click", function (e) {
    if (!e.target.closest("[data-change-dates]")) return;
    $("#datebar").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
    setTimeout(function () { $("#bar-pdate").focus({ preventScroll: true }); }, reduceMotion ? 0 : 400);
  });

  /* ---------- Hero carousel: the next bike every few seconds ---------- */
  (function heroCarousel() {
    var root = $("[data-hero-carousel]");
    if (!root || !BIKES.length) return;
    var DELAY = 5000;   // how long each bike stays on screen, in milliseconds
    root.style.setProperty("--hero-delay", DELAY + "ms");

    var stage = $(".hero-slides", root);
    var smallEl = $("[data-hero-small]", root);
    var bigEl = $("[data-hero-big]", root);
    var dotsEl = $("[data-hero-dots]", root);
    var first = $("img", stage);

    // Start with the bike whose photo is already on the page, then go round the list
    var start = 0;
    BIKES.forEach(function (b, i) { if (first.getAttribute("src") === b.image) start = i; });
    var order = BIKES.slice(start).concat(BIKES.slice(0, start));
    var slides = [first];
    var idx = 0, hovering = false;

    order.forEach(function (b, i) {
      if (i > 0) {
        var img = new Image();
        img.alt = b.name;
        img.decoding = "async";
        img.setAttribute("aria-hidden", "true");
        img.src = b.image;
        stage.appendChild(img);
        slides.push(img);
      }
      var dot = document.createElement("button");
      dot.type = "button";
      dot.className = "hero-dot";
      dot.setAttribute("aria-label", "Show " + b.short);
      dot.addEventListener("click", function () { show(i); });
      dotsEl.appendChild(dot);
    });
    var dots = $$(".hero-dot", dotsEl);

    function show(i) {
      idx = (i + order.length) % order.length;
      slides.forEach(function (img, j) {
        img.classList.toggle("is-active", j === idx);
        img.setAttribute("aria-hidden", j === idx ? "false" : "true");
      });
      // Clearing and re-setting restarts the fill animation on the active dot
      dots.forEach(function (d) { d.removeAttribute("aria-current"); });
      void dotsEl.offsetWidth;
      dots[idx].setAttribute("aria-current", "true");

      var b = order[idx];
      if (SHOW_PRICES) {
        smallEl.textContent = b.short;
        bigEl.innerHTML = rupees(b.price) + '<span class="plate-unit">/day</span>';
      } else {
        smallEl.textContent = b.type + " / " + b.cc;
        bigEl.textContent = b.short;
      }
      root.classList.remove("swap");
      void root.offsetWidth;
      root.classList.add("swap");
    }

    // When the yellow bar on the active dot fills up, move to the next bike
    dotsEl.addEventListener("animationend", function (e) {
      if (e.animationName === "dot-fill" && e.target === dots[idx]) show(idx + 1);
    });

    // Hold while a mouse is over the photo, or the tab is hidden
    function hold() { root.classList.toggle("is-held", hovering || document.hidden); }
    root.addEventListener("pointerenter", function (e) { if (e.pointerType === "mouse") { hovering = true; hold(); } });
    root.addEventListener("pointerleave", function () { hovering = false; hold(); });
    document.addEventListener("visibilitychange", hold);

    show(0);
    root.classList.remove("swap");
  })();

  syncDates();
  refresh();
})();
