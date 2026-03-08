# Inspector+ DevTools Extension (MVP)

## What it does
- Adds an `Inspector+` tab to Chrome DevTools.
- Streams network requests from DevTools API.
- Captures page `console.log/info/warn/error`.
- Supports manual storage snapshot (`localStorage`, `sessionStorage`, `cookie` counts).
- Exports collected events to JSON.

## Setup
1. Install dependencies:
   - `npm install`
2. Build once:
   - `npm run build`
3. Or watch build during development:
   - `npm run dev`

## Load in Chrome
1. Open `chrome://extensions`.
2. Enable `Developer mode`.
3. Click `Load unpacked`.
4. Select the `dist` folder in this project.
5. Open any site, open DevTools (`F12`), then open the `Inspector+` tab.

## Notes
- This extension adds a custom DevTools panel. It does not replace native `Network`, `Console`, or `Application` tabs.
- Console capture starts after content script + hook injection; very early page logs can be missed.
