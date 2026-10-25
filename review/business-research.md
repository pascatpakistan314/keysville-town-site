# Keysville business directory: research notes

Date: 2026-10-24. Scope: businesses on the Town of Keysville business-license
directory (town limits, ZIP 23947), each enriched from public sources. Nothing
invented; every fact below has a URL. Output: `src/41e-biz-real.js`
(`BIZ_REAL`, 58 records), wired into the seed in `src/41-data.js`.

## Counts

| | |
|---|---|
| Entries on the town directory (business-license roll) | 77 |
| Duplicate on the roll (Dollar General #429, twice) | 1 |
| Kept out of the public directory (license-only filings, kiosks, out-of-town with no local presence) | 18 |
| Public listings produced (`BIZ_REAL`) | 58 |
| With a street address a customer can go to | 52 (6 are P.O. box or by appointment only) |
| With published hours found | 24 (33 carry `hoursNote`, "Hours to be confirmed" or "By appointment") |
| With a phone | 55 |
| With a website | 26 |
| Year established stated by the business itself | 7 (Browning-Duffer 1946, Thompson 1922, Bank of Charlotte branch 1979, Pino's 1993, White's 2017, Zachary McKinney 2013, BHR 2019 via SCC) |
| Owner name self-published | 2 (Fiorella Seguel, Zack McKinney) |
| Spotlights | 6 (Blooms By Shannon, Browning-Duffer, Keysville Auto Parts/NAPA, Pino's, White's Building Supply, Wilson's Funeral Home) |

## Method

1. Fetched `https://keysvilleva.gov/business-directory/` with curl (one request,
   browser UA). Saved raw HTML to `source-biz/directory-1.html` (untrusted).
   The page is one Simple Business Directory Pro list (id 209), not paginated.
   Each entry is an `<li id="item-209-N">` with `data-title`, `data-phone`,
   `data-address`; `data-url`, `data-tag`, `data-businesshour`, `data-subtitle`
   are empty on all 77. Parsed with `python3 -I` into
   `source-biz/directory-parsed.tsv`. The client's pasted copy
   (`source-biz/town-directory-roll.txt`) has the same 77 names, so the scrape
   is used as the master because it carries the addresses.
2. For each entry: a web search, then WebFetch of the business's own site when
   one exists, otherwise a public listing (MapQuest, Birdeye, Healthgrades,
   Tripadvisor, chain store locators, FFL registries, SCC mirrors). Yelp,
   Nextdoor, Yellow Pages, Chamber of Commerce and the county's dining page
   refuse automated fetches; Facebook was not fetched.
3. Address rule: `street` is where customers go, from the roll or a public
   listing; `mail` keeps the P.O. box. Rural-road addresses on the roll that
   look residential (Jupiter Creek Rd, Crab Orchard Rd, Horseshoe Bend Rd,
   Old Iron Lane) were not used as `street`.
4. Hours only when a source lists them; otherwise `hoursNote`. Descriptions
   use the business's own words (short quotes) or neutral statements of what
   public listings show. Where sources disagree the record says so.

## Public listings (58)

Category map: the business view supports only `food shop auto services health`
(`PA_CATS` in `50-public-a.js` is a hard-coded array and `paCatName()` reads
`t('pa_cat_*')` from `53-strings-a.js`), so no new categories could be added
from a data file. Industrial, trades, finance, law, funeral, venue and
nonprofit records are mapped to `services`; grocery, pharmacy and dollar
store to `shop`/`health`; gas station and car wash to `auto`.

| Name (display) | Roll name if different | Cat | Street | Phone | Website | Hours | Main source |
|---|---|---|---|---|---|---|---|
| A Plus Tax Accounting LLC | | services | 125B Pecan St (P.O. Box 802) | 434.233.0108 | | yes (MapQuest) | mapquest.com/us/virginia/a-plus-tax-accounting-427265062 |
| Food Lion | Ahold Delhaize USA, INC ( FOOD LION ) | shop | 690 King St | (434) 736-0308 local | stores.foodlion.com | yes | stores.foodlion.com/va/keysville/690-king-street |
| Bella's Grooming Boutique | | services | 245 King St (P.O. Box 594) | 434.736.2300 | | no | mapquest.com/us/virginia/bellas-grooming-boutique-796308640 |
| BHR Handy Man Service, LLC | | services | 9216 Church St | 434.414.5147 | | appt | city-data SCC mirror S8385116 |
| Billy M. Rutherford, DDS | Billy M. Rutherford | health | 126 J St (P.O. Box 108) | 434.736.8748 | | no | healthgrades.com/dentist/dr-billy-rutherford-yrcx8 |
| Blacktop Seal Coating & Striping | | services | none (P.O. Box 185) | 804.721.5168 | | appt | roll only |
| Blooms By Shannon | | shop | 139 King St (P.O. Box 382) | 434.736.8880 | bloomsbyshannon.com | yes | bloomsbyshannon.com/contact_us.php |
| Boliek-White Construction | | services | 471 Pettus St (P.O. Box 169) | 434.736.8855 | | appt | prolicensecheck.com license 026174; MapQuest |
| Bretcetera | | shop | 122 King St (P.O. Box 63) | 434.660.9304 | | no | MapQuest; Style Weekly Aug 2021 |
| Browning-Duffer Funeral Home | Browning - Duffer Funeral Home | services | 110 H St (P.O. Box 253) | 434.736.9577 | browningduffer.com | note | browningduffer.com/family-history ("since 1946"); imortuary for street |
| Burger King | Burger King # 1564 | food | 660 King St | 434-736-8484 local (roll: 315.424.0513 franchise office, Syracuse NY) | | yes | tripadvisor.com d4621266 |
| Barber Shop (Linda Southall) | Barber Shop - Linda Southall | services | 415 Railroad Ave | 434.315.1736 | | no | roll only |
| Dollar General | Dollar General Store # 429 (twice) | shop | 314 King St | (434) 736-5209 local (roll: 615.855.4000 corporate) | dollargeneral.com | yes | dollargeneral.com/store-directory/va/keysville; ladysavings |
| Fiorella Seguel, State Farm | Fiorella Seguel State Farm | services | 145 King St (P.O. Box 598) | 434-736-8188 | statefarm.com agent page | yes | statefarm.com/agent/.../fiorella-seguel-2d7m5743pgf |
| Genesis Products (Plant 4) | Genesis | services | 8818 Church St | 434.736.8405 | genesisproductsinc.com | n/a (plant) | genesisproductsinc.com/resources/contact-us |
| Get Salty | | shop | 131 King St per roll (Birdeye says 142 King St) (P.O. Box 323) | 434.774.6837 | | yes (Birdeye) | reviews.birdeye.com/get-salty-llc... |
| H&R Block | H & R Block | services | 435 Railroad Ave | (434) 736-9095 | hrblock.com office 16426 | seasonal | hrblock.com/tax-office-near-me/virginia/keysville/16426 |
| Hawthorne & Hawthorne, P.C. | Hawthorne & Hawthorne PC | services | 191 King St (P.O. Box 269) | 434.736.8451 | hawthorne.law | yes | hawthorne.law/locations/keysville |
| Jeff's Professional Painting Service | | services | none (P.O. Box 473) | 434.390.2569 | | appt | roll only |
| Kai Xia Chinese Restaurant | | food | 155 King St (P.O. Box 43) | 434.736.9898 | kiasxiachineserestaurant.netwaiter.com | yes | netwaiter page; Tripadvisor |
| Keysville Auto Center | | auto | 8825 Church St (P.O. Box 628) | 434.736.2277 (shared with R & C Laser Wash) | | no | motominer.com dealer page |
| Keysville Auto Parts (NAPA Auto Parts) | Keysville Auto Parts, LLC | auto | 8839 Church St (P.O. Box 57) | 434.736.9620 | napaonline.com store 21446 | yes | napaonline.com/en/VA/Keysville/store/21446 |
| Keysville Chiropractic Wellness Center | ...Center PLC | health | 176 King St (P.O. Box 24) | 434.736.9895 | keysvillechiropractic.com | yes (split days noted) | keysvillechiropractic.com/the-office |
| Keysville Family Pawn LLC | | shop | 9001 Church St | 434.470.0692 | | no | ffls.com FFL record |
| Keysville Mini-Storage | Keysville Mimi -Storage (typo) | services | 214 King St (P.O. Box 1) | 434.736.8400 (shared with Vaughan) | vaughanrealty.com | office hours (Birdeye) | MapQuest (83 units); Birdeye |
| Keysville Pediatrics | | health | 130 J St (P.O. Box 829) | 434.736.0544 | | no | healthgrades group page |
| Subway | Keysville Subway Restaurant | food | 140 King St | (434) 736-8599 local (roll: 919.904.0016) | restaurants.subway.com | yes | restaurants.subway.com/united-states/va/keysville/140-king-st |
| Keysville Video | | shop | Railroad Ave, no number (P.O. Box 75) | 434.736.0057 | | no (MapQuest hours implausible, not used) | mapquest.com keysville-video-rental-arcade |
| Kings & Priests Coffee | Kings & Priest Café | food | 150 King St (P.O. Box 33) | none published | kingsandpriestscoffee.com | yes (Restaurantji) | restaurantji; roadtrippers; Style Weekly |
| Lazy Daisy Flowers & Gifts | Lazy Daisy | shop | 244 King St (P.O. Box 7) | 434-736-8656 | lazydaisyflowers.com | yes | lazydaisyflowers.com |
| Logan Newcomb Trash Talk LLC | | services | none | none | | appt | roll only (no address or phone on roll) |
| M & M Auto Repair | | auto | 271 Railroad Ave | 434.394.4448 | | no | shoogle listing |
| Newcomb & Co, LLC | | services | 107 King St (P.O. Box 692) | 434.736.8935 | | no | bookmysalon.io |
| OneSeventeen Salon | | services | none shown (roll: 1045 Jupiter Creek Rd) | none | | appt | roll only |
| Passionately Vegan | | food | 961 King St | 814.441.2993 | | no | roll only |
| Pete's Auto Service | | auto | 245 Main St (P.O. Box 763) | 434.736.8393 | | conflicting (8-5 vs 9-6), not used | MapQuest; Birdeye |
| Pino's Pizza | | food | 365 King St per own site (roadtrippers: 365 Railroad Ave) | 434-736-0072 (roll: 801.744.6133) | pinospizzakeysville.com | yes (delivery hours) | pinospizzakeysville.com; roadtrippers ("opened our doors in 1993") |
| Pregnancy Support Center of Southside VA | | health | 142 King St (P.O. Box 281 Farmville) | 434.391.1011 | pscsouthside.org | Wed 10-4 | pregnancydecisionline.org Keysville page; pscsouthside.org/contact |
| Pulpwood Logging, Inc | | services | 191 King St (P.O. Box 599) | 434.736.9440 | | appt | MapQuest |
| R & C Laser Wash | | auto | 8825 Church St (P.O. Box 628) | 434.736.2277 (shared) | | no | b2bhint SCC record; MapQuest title |
| Keysville Exxon (Rocha Ventures VA Inc) | Rocha Ventures Va INC (EXXON) | auto | 309 Railroad Ave (P.O. Box 117) | 434.736.8235 | | yes | gas-stations.cmac.ws/keysville-exxon/25218 |
| Ryan's Automotive Repair | | auto | 9010 Church St per MapQuest (roll: 800 Old Iron Lane) | 434.414.6123 | | no | MapQuest |
| SKD Entertainment Soundstage | | services | 435 Four Locust Hwy (P.O. Box 452 Drakes Branch) | 813.649.7977 | eventbrite.com/o/1299437835 | events | Eventbrite event page (venue address) |
| Southside School of Dance, LLC | | services | 244 King St (P.O. Box 566) | 434.736.8431 (shared with Thompson Insurance) | | no | MapQuest |
| Sundae Service | | food | 150 King St (P.O. Box 33) | 540.448.3167 | | yes (MapQuest) | MapQuest; Style Weekly |
| TCL Healing Arts Massage Studio, LLC | | health | none shown (roll: 3897 Crab Orchard Rd) | 434.547.8949 | | appt | roll only |
| Tucker Timber Products Inc | | services | 200 Spaulding Ave (P.O. Box 630) | 434.736.0804 | (tuckertimberproducts.com redirect loop, omitted) | no | Yelp title; Facebook |
| Uncle Bob's Law Enforcement & Sporting Goods | | shop | 115 King St (P.O. Box 783) | 434.436.0489 | | no | ffls.com FFL record |
| Vaughan Auction & Realty Company | | services | 214 King St (P.O. Box 1) | 434.736.8400 (shared) | vaughanrealty.com | yes (Birdeye; Sat "to midnight" dropped) | Birdeye; MapQuest |
| Village Antiques & Collectibles | | shop | 209 King St per MapQuest (roll: 2070 Horseshoe Bend Rd) | 434.607.0507 | etsy.com/shop/VillageAntiquesVA | no | MapQuest; Etsy |
| Walgreens | Walgreen Co DBA Walgreens # 17493 | health | 665 King St | 434.736.0060 | walgreens.com locator | not used (third-party hours contradictory) | walgreens.com locator id=17493 |
| Wayland Nursing & Rehabilitation Center | Waylands Nursing & Rehab | health | 730 Lunenburg Dr | 434-736-8406 | waylandrehab.com | 24-hour care, note | waylandrehab.com |
| White's Building Supply (Ace Hardware) | Whites Building and Supply | shop | 255 Railroad Ave (P.O. Box 338) | 434.736.9000 | whitesbuildingsupplyva.com | yes | whitesbuildingsupplyva.com ("since 2017") |
| Wilson's Funeral Home | | services | 125 Wilson St (P.O. Box 207) | 434.736.8696 | | note | sowhenyougo.com (OSM); NRHP form for Jesse H. Wilson link |
| Zachary McKinney Technology | | services | 415 Railroad Ave | 434.321.8558 | tech.zackmckinney.com | yes | tech.zackmckinney.com/about |
| Thompson Insurance Agency | | services | 114 King St | 434-736-8431 | thompsoninsurance1922.com (site refused the fetch; not verified live) | yes (MapQuest) | MapQuest; agent.travelers.com/va/keysville |
| The Bank of Charlotte County | | services | 208 King St | 434.736.8411 | bankofcharlotte.com | yes (lobby) | bankbranchlocator.com; bankofcharlotte.com |
| Cherish The Moments Designs | | shop | none (P.O. Box 752) | 434.390.6685 | | appt | roll only |

## Kept out of the public directory (18 roll entries, plus the duplicate)

| Roll entry | Why |
|---|---|
| AnW Wireless (P.O. 924 Romney, WV) | Out-of-state licensee, no Keysville location found |
| Associated Services Corp (Danville) | Out-of-town service company, no local office |
| RT's Comb and Shear Shop (P.O. Box 686 Victoria) | Victoria address; no Keysville shop found |
| Cello Partnership d/b/a Verizon Wireless (c/o KPMG, Lisle IL) | Telecom corporate filing (roll typo "Partnershp") |
| Clear Rate Telecom, LLC (Longwood FL) | Telecom corporate filing |
| Coinstar (Bellevue WA) | Kiosk inside a store |
| Complete Underground LLC (Midlothian) | Out-of-town contractor |
| Dollar General Store # 429 (second entry) | Duplicate; merged into one listing |
| Forest Pro, INC (Scottsville) | Out-of-town forestry contractor |
| Google Fi (Longwood FL) | Telecom corporate filing |
| Granite Telecommunications, LLC (Quincy MA) | Telecom corporate filing |
| La Guadalupana IV (South Boston) | No Keysville location found in any public listing (the chain's VA listing is in Blairs) |
| M.C.D Inc (Farmville) | Unknown business, Farmville P.O. box, no local presence found |
| Maggie Leigh Boutique (South Boston / Roxboro NC) | Boutique based elsewhere; no Keysville shop found |
| MCL Metro Access Transmission Service (c/o KPMG) | Telecom corporate filing |
| Redbox Automated Retail LLC | Kiosk |
| Trane US Inc (La Crosse WI) | Corporate filing, no local office |
| Verizon South Inc (c/o KPMG) | Telecom corporate filing |
| Yelloh (Cygnus Home Service LLC, Marshall MN) | Home-delivery route, no local storefront |

Pregnancy Support Center of Southside VA (Farmville P.O. box) was kept because a
public directory lists a Keysville satellite office at 142 King Street; the
organization's own contact page does not list it, so the record says hours are
from a directory. SKD Entertainment Soundstage (Drakes Branch P.O. box) was
kept because its venue is at 435 Four Locust Hwy, Keysville, per its Eventbrite
event pages.

## Data-quality notes

- **Town site links.** 76 of 77 entries link to `href="#"`; the plugin's
  `data-url` is empty on every entry, so the town site publishes no websites.
  No categories, hours or emails either (one email sits in the address field
  for Thompson Insurance Agency: thompsoninsurance1922@gmail.com).
- **P.O. boxes.** 37 roll entries give only a P.O. box. Street addresses for
  these came from public listings; 6 listings still have no street.
- **Corporate numbers on the roll.** Dollar General 615.855.4000, Burger King
  315.424.0513, Subway 919.904.0016, Pino's 801.744.6133, Food Lion none. Local
  store numbers were substituted from the chains' own locators and noted in
  each `story`.
- **Shared numbers.** Thompson Insurance and Southside School of Dance
  (434.736.8431); Keysville Auto Center and R & C Laser Wash (434.736.2277);
  Keysville Mini-Storage and Vaughan Auction & Realty (434.736.8400). Kept as
  separate listings; each story mentions the shared number.
- **Typos fixed for display, original kept here:** "Mimi -Storage" to
  Mini-Storage; "Partnershp" to Partnership (excluded entry); "Whites Building
  and Supply" shown as White's Building Supply (Ace Hardware) per its own site;
  "Kings & Priest Café" shown as Kings & Priests Coffee per its own site;
  "Waylands Nursing & Rehab" shown as Wayland Nursing & Rehabilitation Center.
- **Address conflicts recorded in the story:** Pino's (365 King St vs 365
  Railroad Ave), Get Salty (131 vs 142 King St), Ryan's Automotive (9010 Church
  St vs 800 Old Iron Lane), Browning-Duffer (110 H St from a legacy listing;
  its own site gives only a map pin).
- **Dead or unreachable websites:** tuckertimberproducts.com redirects in a
  loop (omitted); thompsoninsurance1922.com and a-plus-tax.com refused the
  fetch (Thompson kept because the roll's own email uses that name; A Plus
  omitted); petesautoservice.com refused the fetch and is not confirmed to be
  the Keysville shop (omitted).
- **Hours not used:** MapQuest auto-generated hours for Keysville Video
  ("12 am to 7 pm"), Southside School of Dance (generic 9 to 6) and the
  Vaughan Saturday "to midnight" line; loc8nearme hours for Walgreens
  (Thursday closed) contradict Walgreens' own page.
- **Jesse H. Wilson.** The Keysville Historic District NRHP form records that
  Jesse H. Wilson's 1893 Wilson & Co. building on Railroad Avenue held a
  funeral home and that the funeral home he started is still in business. The
  Wilson's Funeral Home story cites this; the present address (125 Wilson St)
  comes from an OpenStreetMap-based listing, so the story does not claim the
  home operates from the 1893 building.
- **Likely outside the downtown grid.** Roll addresses on Jupiter Creek Rd,
  Crab Orchard Rd, Horseshoe Bend Rd and Old Iron Lane are rural roads with a
  Keysville mailing address; they hold town licenses, so they stay listed, but
  the street field is blank or taken from a public storefront listing (Village
  Antiques: roll says 2070 Horseshoe Bend Rd, shop is at 209 King St). Town
  staff should confirm town-limits status.

## Follow-ups for the lead

1. `tests/harness.js` PUBLIC_ROUTES still names `biz-main-street-diner` and
   `biz-county-line-auto` (sample ids). They now render the "not found" page
   without errors. Suggested replacements: `biz-pinos-pizza`,
   `biz-wilsons-funeral-home`.
2. The profile view prints `[year]` / `[Owner]` when `since` or `owner` is
   blank (`pa_bizp_since` / `pa_bizp_owner` line). With real data most records
   leave these blank, so the line should be hidden when both are empty.
3. The view shows "Closed" for every day when hours are unknown. Records
   carry `hoursNote: {en, es}`; the view should print it in place of the
   hours table (or under it) when present. `hours` is an object with all
   seven days `null` rather than `null`, because `52-desk.js` reads
   `b.hours[d]` directly and would throw on `null`.
4. `41e-biz-real.js` had to go **before** `41-data.js` in `build.sh`
   because `41-data.js` runs `S = load() || seed();` at load time. The file
   has no dependencies, so this is safe.
5. New fields on each record not in the SPEC shape: `hoursNote`, `verified`,
   `claimed`, `sourceUrls`. The desk editor ignores and drops `sourceUrls` on
   save; fine for the demo, but note it.

## Disclosure line for the Businesses page

> Listings come from the town’s business-license directory and each business’s
> own public pages. Owners can claim and correct their listing. Not an
> endorsement.

Spanish: "Las fichas provienen del directorio de licencias comerciales del
pueblo y de las páginas públicas de cada negocio. Los dueños pueden reclamar y
corregir su ficha. No es un respaldo."
