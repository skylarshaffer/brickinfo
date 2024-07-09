# brickinfo

A quick and responsive Manifest V3 Chrome Extension that uses the LEGO.com Pick A Brick GraphQL API and the Bricklink Affiliate API to inject real-time aftermarket element prices into Pick a Brick.

## Description

If you want to save time swapping tabs and comparing literal **thousands** of bricks one-by-one then this extension is for you. Just install it and browse Pick a Brick as normal. Prices will show below the PAB prices as they load.
Page load times are NOT affected by brickinfo. Brickinfo allows page rendering uninterrupted, and simply injects new information to the page as it gets it.

This extension is not yet released, and there are currently no active users. I am working to develop this quickly and am hoping to launch within the month. This source can be used to run the extension, but it is VERY early. **User discretion advised.**

## Demo

![Screenshot](https://github.com/skylarshaffer/brickinfo/assets/161654841/7081b86e-101a-4445-8819-9cddd3e8b973)

https://github.com/skylarshaffer/brickinfo/assets/161654841/168a192a-7859-4006-907d-f03447bbc763

## Installation

The below assumes some coding experience and step detail is lacking. Better instructions will be added at a later date. If you have questions, please email me at [skylar@brickquery.com](mailto:skylar@brickquery.com).

### Extension

1. Download the source zip, extract it, and copy the **brickinfo** folder wherever you want.
2. Add a file titled **api.js** to the folder **brickinfo/data**.
3. Write the following to the file: `const blAffiliateApiKey = '<YOUR AFFILIATE API KEY>'`.
4. Follow the unpacked extension loading instructions [here](https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world#load-unpacked).

## Usage

### Chrome Extension

Install the extension, grant permissions (if necessary), and browse [Pick a Brick](https://www.lego.com/en-us/pick-and-build/pick-a-brick).

### Update Database

Download the source zip, extract it, and copy the **data** folder wherever you want. All below database operations will take place in the **data** folder.

#### Parts

1. Login to [Bricklink](https://bricklink.com)
2. Download the **Part and Color Codes XML**. Either:
    1. Click [here](https://www.bricklink.com/catalogDownload.asp?downloadType=X&viewType=5) to download the latest file.
    
    **OR**
    
    2. Navigate to [Catalog Download](https://www.bricklink.com/catalogDownload.asp) and select the **Part and Color Codes** radio and set the dropdown from **Tab-Delimited File** to **XML**.

    ![image](https://github.com/skylarshaffer/brickinfo/assets/161654841/e9741ac8-24ad-4616-8dc2-b5cd5868c9d2)

3. Replace **data/xml/codes.xml** with the one you just downloaded
4. Run **data/codesToElementToPart.js** to update **data/js/elementToPart.js**.

#### Colors

1. Add a new file to **data**: **data/api.js**
2. Write the following to the file: `const rbApiKey = '<YOUR REBRICKABLE API KEY>'`.
3. Run **data/fetchColors.js** to update **data/js/colors.js**.

### Replace Extension Database

1. Copy both **data/js/colors.js** and **data/js/elementToPart.js** to **brickinfo/data**, replacing the existing files.

## Version History

* 1.0
    * Initial Release

## Known Issues

- [ ] Bricklink Affiliate API key is not yet provided, and must be added to source

- [ ] Prices for elements will not show if that element does not have at least one 

- [ ] Rebrickable API key must be added to data to update colors list. This can be easily obtained at [Rebrickable API](https://rebrickable.com/api/)

## Roadmap

- [ ] Obtain affiliate API key for this application (currently using scraped key)

- [ ] Build packed extension

- [ ] Publish to chrome extension store

- [ ] Opt-out update database daily and manual update through Chrome Extension popup

- [ ] Add styling and hyperlinks to injected prices

- [ ] Add more types of prices

- [ ] Add fallback average price algorithms when necessary values are not present in inventory_used

- [ ] Maybe switch over to per-div scraping for element ID and eliminate need for LEGO.com GraphQL at all. Would require element to color DB expansion

- [ ] Add user customization for average price type (Used, New, etc)

- [ ] Automatically switch currency based on session

- [ ] Add cross-platform functionality (show current Pick a Brick prices on Bricklink)

- [ ] Add more price platforms and more browsing platforms (BrickOwl, Rebrickable, eBay, etc.)

## APIs

- [Rebrickable API](https://rebrickable.com/api/)

- LEGO.com GraphQL API [REDACTED]

- Bricklink Affiliate API [REDACTED]

## Acknowledgments

- [Rebrickable API](https://rebrickable.com/api/) used for LEGO to Bricklink Color ID conversion.

- [Bricklink Catalog Download](https://www.bricklink.com/catalogDownload.asp) used for LEGO to Bricklink Part ID conversion.

- Bricklink, LEGO.com, and The LEGO Group have no affiliation with this tool whatsoever. Both APIs related to The LEGO Group are used for the purposes of this amateur project without approval.

