/*
 * ============================================================
 *  INVITATION SETTINGS — edit this file to change the content
 * ============================================================
 *  All text, date, location, video and RSVP settings live here.
 *  The design (css/style.css) does not need to be touched.
 */
window.INVITE = {
  // --- Cover & envelope ---
  title: "Happy Deepavali",
  subtitle: "Festival of Lights · 2026",
  hosts: "Mahendran & Family",        // shown in the invitation and closing
  envelopeTo: "To You & Your Beloved Family",
  envelopeHint: "Tap the seal to open",

  // --- The wish revealed inside the envelope (with fireworks) ---
  wishHeading: "Wishing You a Radiant Deepavali",
  wish: [
    "May the glow of a thousand diyas light every corner of your home,",
    "may Lakshmi bless your family with abundance and good health,",
    "and may this Festival of Lights fill your hearts with joy,",
    "sweetness and love that lasts all year long."
  ],

  // --- Video ---
  // Option 1: put an MP4 in assets/video/ and set video: "assets/video/deepavali.mp4"
  // Option 2: paste a YouTube link, e.g. "https://youtu.be/XXXXXXXXXXX"
  // Leave empty to show the "coming soon" frame.
  video: "assets/video/deepavali.mp4",
  videoWebm: "assets/video/deepavali.webm",   // optional fallback for browsers that cannot play MP4
  videoPoster: "assets/video/deepavali-poster.jpg",

  // --- Invitation text ---
  inviteOpening: "With hearts full of light and gratitude,",
  inviteBody: "we warmly invite you and your family to celebrate Deepavali with us and bless our new home at our",
  eventName: "Deepavali Open House & Housewarming",
  inviteClosing: "Your presence and blessings would make this celebration complete.",

  // --- Date & time ---
  dateDisplay: "Saturday · 14 November 2026",
  dateShort: "14 · 11 · 2026",
  time: "6:00 PM – 10:00 PM",
  start: "2026-11-14T18:00:00+08:00",   // Malaysia time, used for the countdown
  end: "2026-11-14T22:00:00+08:00",     // used for "Add to Calendar"

  // --- Location ---
  venue: "Our New Home",
  address: "No 19, Jalan Rimba 15, Taman Rimba, Bandar Gamuda Cove, Banting, Kuala Langat, 42700 Selangor",
  mapsUrl: "",   // optional: paste a Google Maps share link; empty = search by address
  wazeUrl: "",   // optional: paste a Waze share link; empty = search by address

  // --- RSVP (Google Sheets) ---
  // Paste the Google Apps Script Web App URL here (ends with /exec). Empty = demo mode.
  rsvpApiUrl: "",
  maxPax: 10,
  rsvpDeadline: "Kindly RSVP by 7 November 2026",

  // --- Short write-up ---
  storyHeading: "A Home Filled With Light",
  story: [
    "This Deepavali is extra special for us — it is our first festival in our new home.",
    "Every lamp we light here carries a prayer of thanks for the journey that brought us to this doorstep, and for the family and friends who walked it with us.",
    "Come share the sweets, the laughter and the lights. A home only truly becomes a home when it is filled with the people we love."
  ],

  // --- Closing ---
  closing: "We hope to see you and your family there!",
  closingWish: "Happy Deepavali",
  closingNote: "May light triumph over darkness, and may your year ahead shine bright.",
  dressCode: "Dress code: Traditional / festive wear",

  // --- Background music (optional MP3 in assets/music/) ---
  music: ""
};
