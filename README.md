# brickinfo

A quick and responsive Manifest V3 Chrome Extension that uses the Bricklink Affiliate API to inject real-time aftermarket element prices into Pick a Brick.

## Description

If you want to save time swapping tabs and comparing literal **thousands** of bricks one-by-one then this extension is for you. Just install it and browse Pick a Brick as normal. Prices will show below the PAB prices as they load.
Page load times should NOT be affected by brickinfo. Brickinfo allows page rendering uninterrupted, and simply injects new information to the page as it gets it.

## Demo

https://github.com/user-attachments/assets/bec71b15-780c-4960-9604-997f1552fc3e

## Installation

The below assumes some coding experience and step detail is lacking. Better instructions will be added at a later date. If you have questions, please email me at [skylar@brickquery.com](mailto:skylar@brickquery.com).

### From Release

1. Download the release zip and extract it wherever you want
2. Follow the unpacked extension loading instructions [here](https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world#load-unpacked)

### From Source

1. Reference [chrome-extension-cli](https://github.com/dutiyesh/chrome-extension-cli) for help building from source

## Before You Begin

### Set API Key

   1. Click the extension icon to open the extension settings popup.
   2. Replace **undefined** with your Affiliate API Key

         ![extension](https://github.com/user-attachments/assets/d3dcde35-ca9f-4860-bda4-4e3847376b04)
      
   3. Click **Save**
   4. Browse [Pick a Brick](https://www.lego.com/en-us/pick-and-build/pick-a-brick)

### Update Parts Database

   1. Make sure you are **currently** logged into Bricklink in your browser **[NECESSARY]**
   2. Click the extension icon to open the extension settings popup
   3. Click **Update DB**

         ![extension](https://github.com/user-attachments/assets/d3dcde35-ca9f-4860-bda4-4e3847376b04)

## Troubleshooting

- Make sure you have an **active** session with bricklink.com (only necessary for DB download).

- Make sure you update your Bricklink Database using the instructions above.

- Verify you at least have SOME parts database by checking latest date in extension popup.

- Make sure you have a valid Affiliate API Key and that it saved correctly in the extension popup.

- Change pages on PAB without refreshing (for now).

## Known Issues

- [ ] Bricklink Affiliate API key is not yet provided, and must be added manually. This key was leaked, and I disclosed it to Bricklink, meaning it may stop working at any time

- [x] Prices for elements will not show if that element does not have at least one

- [x] First navigation to or refresh of PAB will not load prices, you must change search settings or current page

## Roadmap

- [x] Move API key variable to popup.js so extension can be packed

- [ ] Obtain affiliate API key for this application (currently using scraped key)

- [x] Build packed extension

- [ ] Publish to chrome extension store

- [ ] Auto-update database daily (opt-out)

- [x] Manual update part database through Chrome Extension popup

- [x] Add styling to injected prices

- [x] Add hyperlinks to injected prices

- [x] Add more types of prices

- [x] Add fallback average price algorithms when necessary values are not present in inventory_used

- [x] Maybe switch over to per-div scraping for element ID and eliminate need for LEGO.com GraphQL at all. Would require element to color DB expansion

- [ ] Add user customization for average price type (Used, New, etc)

- [ ] Automatically switch currency based on session

- [ ] Add cross-platform functionality (show current Pick a Brick prices on Bricklink)

- [ ] Add more price platforms and more browsing platforms (BrickOwl, Rebrickable, eBay, etc.)

## APIs

- Bricklink Affiliate API [REDACTED]

- [Dexie](https://dexie.org)

## Acknowledgments

- [chrome-extension-cli](https://github.com/dutiyesh/chrome-extension-cli) Massive thanks to [dutiyesh](https://github.com/dutiyesh) and all contributors for making this godsend of a package.

- [Bricklink Catalog Download](https://www.bricklink.com/catalogDownload.asp) used for Element ID to Bricklink Part ID and Color ID conversion.

- Bricklink, LEGO.com, and The LEGO Group have no affiliation with this tool whatsoever. Bricklink Affiliate API is used for the purposes of this amateur project without approval.
