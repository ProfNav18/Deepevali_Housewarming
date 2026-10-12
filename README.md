# Happy Deepavali · Open House & Housewarming

Digital invitation (e-card) for our Deepavali Open House & Housewarming.
Theme: warm bronze with gold and orange, marigold garlands on every section, kuthu vilakku lamps, hanging lanterns and falling petals. It's a static site (HTML/CSS/JS) with no build step.

**Saturday, 14 November 2026 · 6:00 PM – 10:00 PM**
No 19, Jalan Rimba 15, Taman Rimba, Bandar Gamuda Cove, Banting, Kuala Langat, 42700 Selangor

## Page flow

1. **Gold envelope cover**: "Happy Deepavali". Tapping the diya seal opens the envelope and sets off fireworks.
2. **Deepavali wish**: the wish appears word by word with fireworks, plus a "Light more crackers" button.
3. **Video**: plays automatically and silently on loop inside a royal arch frame.
4. **Invitation**: invites guests and their families to the open house and housewarming.
5. **When & where**: date, time, address, countdown, embedded map, and Google Maps, Waze and Add to Calendar buttons.
6. **RSVP**: name, phone, attendance, number of guests, vegetarian / non-vegetarian counts and wishes, saved to Google Sheets. A "Wishes for the Family" wall shows below the form; guest and meal totals stay in the Sheet.
7. **Short write-up**: "A Home Filled With Light".
8. **Closing**: "We hope to see you…" and Happy Deepavali.

## Files

```
index.html                  page structure + SVG art (diya, rangoli)
css/style.css               design & colours
js/config.js                ⭐ ALL TEXT & SETTINGS — edit this file
js/app.js                   envelope, fireworks, video, map, countdown, RSVP
assets/video/               put your video here
assets/music/               optional background music
google-apps-script/Code.gs  RSVP backend (Google Sheets)
```

## Edit the content

Open `js/config.js`. All the text, the host names (`hosts`), date, address, video and RSVP URL are set there.

## Add the video later

- **MP4 file**: put it in `assets/video/` (e.g. `deepavali.mp4`) and set `video: "assets/video/deepavali.mp4"`.
- **YouTube**: set `video: "https://youtu.be/XXXXXXXXXXX"` (Shorts links work too).

Portrait and landscape videos are detected automatically.

## RSVP → Google Sheets (download as Excel anytime)

1. Create a new Google Sheet.
2. Go to **Extensions → Apps Script**, paste in `google-apps-script/Code.gs`, and click Save.
3. Go to **Deploy → New deployment → Web app**. Set Execute as to *Me* and Who has access to *Anyone*, then authorise.
4. Copy the `/exec` URL into `js/config.js` → `rsvpApiUrl`.

Each RSVP becomes a row: Timestamp, Name, Phone, Attendance, Guests, Vegetarian, Non-Vegetarian, Wishes.
To get an Excel file, use **File → Download → Microsoft Excel (.xlsx)**.
Phone numbers are never shown on the public page.

While `rsvpApiUrl` is empty, the page runs in **demo mode**: RSVPs are only saved in the visitor's own browser.

If you change the Apps Script later, go to **Deploy → Manage deployments → Edit → New version** so the same URL keeps working.

## Deploy (Netlify / Vercel / GitHub Pages)

There's no build step.
- **Netlify**: Import from Git → choose this repo. Leave the build command empty and set the publish directory to `.`.
- **Vercel**: New Project → Framework preset *Other*.
- **GitHub Pages**: Settings → Pages → Deploy from branch `main`, folder `/`.

After deploying, change `og:image` in `index.html` to the full URL (e.g. `https://your-site.netlify.app/assets/og-image.jpg`) so the preview image shows when the link is shared on WhatsApp.

## Test locally

```
python3 -m http.server 8000
```
