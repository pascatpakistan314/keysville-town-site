# Living here: research notes

Date: 2026-10-24. Scope: facts behind the `living`, `trash`, `streets`, `parks`
and `newhere` views (`src/56-living.js`). Nothing below is invented; each line
has a source. `[verify]` marks what Town Hall or the client must confirm before
launch. `[confirm]` marks a list the town itself has to supply.

Method: WebSearch, WebFetch, and curl with a browser User-Agent for pages that
block fetchers (county site, town site, VDOT). Raw HTML saved in the session
scratchpad only; nothing from those pages was executed.

## What the current town site says

- keysvilleva.gov/living-here/ is a prose welcome page with no service facts.
  Its two sub-pages, Trash & Recycling and Water and Sewer Rates, both read
  "More information coming soon…" (fetched 2026-10-24). The Water and Sewer
  Policy page is real and current (updated March 17, 2025).
- Water and Sewer Policy (keysvilleva.gov/living-here/water-and-sewer-policy/):
  the Town bills water and sewer monthly; residential deposit $100; $35 fee to
  initiate or restore service; bills due on receipt, 10% penalty after the
  15th; backflow device inspection reports due to the Town Office by December
  31 each year; connection fees from $2,750 (5/8–3/4 in. meter). Bill-payment
  help: Charlotte County DSS 434-542-5164; Virginia DSS Energy Assistance
  804-726-7386; CommonHelp 800-552-3431.
- So: the Town of Keysville is the water and sewer provider inside town. The
  `water` view already covers this; the living pages link to it.
- Local government page: Mayor Robert Schaefer; council Rhonda Benn, Rachael
  Clark, Anthony Ferranto, Scotty Jackson, Tom Fisher, Wendy Gallion; Town
  Manager Stephanie Clay; Town Clerk/Treasurer Sherry Marker
  (keysvilleva.gov/government/local-government/). The `government` view owns
  names; the living pages only link there.

## Trash and recycling

- Curbside trash inside town: the current site says nothing. Who collects
  (town crew or contractor), the day(s), can rules, bulky-item rules and
  missed-pickup policy are all `[verify]`. The pickup-day lookup is marked
  sample.
- Charlotte County Waste Management
  (charlottecountyva.gov/departments/waste_management.php):
  - Seven county "convenience centers" (the page also calls them recycling
    centers), run by county Public Works. Info line: County Administrator's
    Office 434-542-5117.
  - Hours, all centers: Monday to Saturday 7:00 a.m. to 6:00 p.m.; Sunday
    1:00 p.m. to 5:00 p.m. `[verify]` (page undated; hours can change by season)
  - Keysville Convenience Center, 65 Arvin Street, Keysville. Others: Bacon
    District/Saxe 1224 Hermon Road; Charlotte Court House 300 Dixie Youth
    Drive; Drakes Branch 150 Depot Street; Phenix 301 Chester Street;
    Madisonville 1758 Rolling Hill Road; Wylliesburg/Red Oak 2640 Jeb Stuart
    Hwy.
  - Recyclables taken at all centers: newspapers, glass (rinsed, lids off),
    corrugated cardboard, scrap metal and aluminum, passenger tires (4 per
    visit, 8 per year per resident).
  - Co-mingled (mixed) recycling: Charlotte Court House center only.
  - Not accepted: hazardous materials, paint, oil, ammunition, sheetrock and
    shingles and other construction debris, brush, stumps and yard debris,
    asbestos, propane tanks, bulk contractor debris, oversized tires, items
    too large for the containers.
  - Construction debris, brush and oversized loads go to the Southside
    Regional Landfill, 4803 Highway Ninety-two, Chase City, Monday to Friday
    8:00 a.m. to 4:00 p.m., fee per ton, 434-738-6210 (serves Charlotte,
    Mecklenburg and Halifax). Source: same county page; landfill page at
    mecklenburgva.com/245/Regional-Landfill.
- Recycling reality: there is no curbside recycling program documented
  anywhere for Keysville. Plastics and mixed paper are not on the county's
  "accepted at all centers" list; mixed recycling exists only at Charlotte
  Court House. The page says so plainly rather than promising more.

## Streets, snow and street lights

- Code of Virginia §33.2-319 (law.lis.virginia.gov): urban street maintenance
  payments go to towns over 3,500 (and cities); a town under 3,500 does not
  get them unless named in the statute. Keysville (807, 2020 census) is not
  named.
- §33.2-339: in towns under 3,500, at the town's request the Commissioner of
  Highways may take selected streets into the secondary state system and
  maintain them with secondary funds, up to two miles at first plus up to a
  quarter mile a year. Which Keysville streets are in the state system is
  `[confirm]`: Town Hall holds the list. US 15/US 360 (four-lane, east edge of
  town) and VA 40 (through the center) are primary routes and VDOT's (Wikipedia,
  Keysville, Virginia).
- VDOT Lynchburg District covers Charlotte County (VDOT district map; the
  Lynchburg District includes Amherst, Appomattox, Buckingham, Campbell,
  Charlotte, Cumberland, Halifax, Nelson, Pittsylvania, Prince Edward)
  `[verify]` the residency office phone that serves Charlotte County.
- VDOT snow policy (virginiadot.org/travel/snow.asp, fetched by curl):
  interstates and primary routes (numbered 1–599) first; then major
  secondary roads (600 and up) with emergency and public facilities or high
  traffic; snow emergency routes designated by localities; other secondary
  and subdivision streets after main roads are clear; plowing generally starts
  at 2 inches; pre-treatment up to 48 hours ahead when pavement is above 20°F.
  Statewide road conditions: 511, my511.virginia.gov; report a road problem
  800-367-7623 (800-FOR-ROAD), my.vdot.virginia.gov.
- Street lights: in most Virginia small towns the town pays the electric
  utility for street lights and reports outages to the utility by pole number
  `[verify]` for Keysville, including which utility owns the poles.
- Leaf and brush collection, sidewalk and curb-ramp program: nothing published
  `[verify]`. Shown as sample with brackets.

## Parks and recreation

- Tower Park, Main Street, Keysville: "an outdoor playground located on Main
  Street in the town of Keysville" (charlottecountyva.gov/residents/recreation.php).
  Exact address, hours, what else is there (shelter, restrooms, track,
  fields), accessibility and who owns it (town or county) `[verify]`. Youth
  baseball, softball, soccer, basketball, football and cheerleading leagues
  exist countywide (same page), organizers `[verify]`.
- Keysville branch, Charlotte County Library: 200 King Street, Keysville,
  434-736-0083; closed 1 to 2 p.m. for lunch; open the first Saturday of the
  month 10 a.m. to 1 p.m.; weekday hours not in the listing `[verify]`
  (search.211virginia.org, Keysville Branch listing). The building is the
  former "Little Briery" Presbyterian church, rebuilt after the 1915 tornado
  (review/history-and-features.md; NRHP nomination).
- Southside Virginia Community College, John H. Daniel Campus, 200 Daniel
  Road, Keysville, 434-736-2000; opened 1971; Student Services Center (2014)
  holds the campus library (southside.edu/location/campus/Keysville). Public
  use of the campus library and walking paths `[verify]`.
- Twin Lakes State Park, 788 Twin Lakes Rd., Green Bay, VA 23942,
  434-392-3435; 7 a.m. to dusk; swimming beach on Goodwin Lake, 11 cabins,
  32-site campground (March to December), six miles of trails, Cedar Crest
  Conference Center; ADA: Cabin 2 and Bowen Lodge accessible, accessible
  picnic restroom and Shelter 1, concrete walks to the beach
  (dcr.virginia.gov/state-parks/twin-lakes). About 20 miles north of Keysville
  by US 15 and US 360 `[verify distance]`.
- Staunton River Battlefield State Park, 1035 Fort Hill Trail, Randolph, VA
  23962, 434-454-4312; 8 a.m. to dusk; Clover Visitor Center weekends 10 to 4;
  Roanoke Station visitor center closed for renovation; 1.2-mile battlefield
  trail, 0.75-mile nature trail with two wildlife towers, picnic shelter for
  90 (rent April 1 to Nov. 1); shelter and visitor center reached by sidewalk;
  only restroom is inside the visitor center
  (dcr.virginia.gov/state-parks/staunton-river-battlefield). About 15 miles
  southwest `[verify distance]`.
- Staunton River State Park, 1170 Staunton Trail, Scottsburg, VA 24589,
  434-572-4623; 8 a.m. to 10 p.m.; Virginia's first International Dark Sky
  Park; 8 CCC cabins, 48-site campground, 17+ miles of trails, boat launches;
  pool will not open; Dan River launch dock accessible; cabins not universally
  accessible (dcr.virginia.gov/state-parks/staunton-river). About 40 miles
  south `[verify distance]`.
- Briery Creek Lake / WMA, Prince Edward County, 3,164 acres with an 845-acre
  lake, about 7 miles south of Farmville off US 15 (Route 701 or 790); concrete
  ramps, courtesy piers, accessible fishing pier on Route 790; needs a hunting
  or fishing license, boat registration or DWR access permit
  (dwr.virginia.gov/wma/briery-creek). About 12 miles north of Keysville on
  US 15 `[verify distance]`.
- Tobacco Heritage Trail: trailheads in Victoria (10th Street, Firehouse
  Road), La Crosse, Boydton, Brodnax, Lawrenceville, Alberta, South Boston;
  none in Charlotte County (tobaccoheritagetrail.org/trailheads). Nearest to
  Keysville is Victoria, about 17 miles east on VA 40 `[verify distance]`.
- Buggs Island Lake (John H. Kerr Reservoir), 50,000 acres, southern tip of
  the county; Charlotte State Forest 5,688 acres (county recreation page).

## Schools, library, college

- Charlotte County Public Schools: an early learning center, three elementary
  schools, one middle school and one high school; Fall 2020 enrollment 1,725
  (charlottecountyva.gov/residents/education.php). Division office 250
  LeGrande Ave, Suite E, Charlotte Court House, 434-542-5151; Superintendent
  Robbie Mason (county directory).
- Eureka Elementary (PK–5), 315 Eureka School Rd, Keysville, VA 23947,
  434-736-8458, 471 students 2024-25 (schoolquality.virginia.gov). The division
  history says it was built in 1983 between Keysville and Charlotte Court
  House (ccpsk12.org). Attendance zones `[verify]`: Eureka is the elementary
  that physically serves Keysville but zone maps were not found.
- Central Middle School (6–8): address and phone `[verify]` (schoolquality
  page blocks fetchers).
- Randolph-Henry High School (9–12), 755 David Bruce Ave, Charlotte Court
  House, VA 23923, 434-542-4111, 460 students 2024-25 (schoolquality.virginia.gov).
- Other elementaries: Bacon District Elementary, Phenix Elementary
  (schoolquality.virginia.gov division page).
- Charlotte Adult Learning Center (GED, ESL, literacy), since 1986
  (charlotteadultlearningcenter.org via county education page).

## Safety and emergency

- Keysville Volunteer Fire Department, Station 7, 500 Osborne Street,
  Keysville (P.O. Box 167), Chief Lynn Duffey, 434-736-9727
  (charlottecountyva.gov fire departments page; NERIS FD51037866).
- Charlotte County Volunteer Rescue Squad, 8300 George Washington Highway,
  Keysville; main station in Keysville, three stations countywide, since
  1970, 2,000+ calls a year, volunteer plus paid staff; Supervisor Sally Pyle
  434-736-0087 (county rescue squad page).
- Charlotte County Sheriff's Office, Sheriff J.R. "Randy" Grissom, 222 Law
  Lane, Charlotte Court House, non-emergency 434-542-5141 (also E-911 office
  and Animal Control) (county sheriff page and directory). Keysville has no
  town police force documented `[verify]`.
- Emergencies: 911.

## Voting

- Charlotte County Voter Registrar: Jenni P. Booth, 420 Thomas Jefferson
  Hwy., Charlotte Court House, VA 23923, 434-542-5856,
  jboothregistrar@charlottecountyva.gov. Keysville precinct (0401) votes at
  the Keysville Fire Department, 500 Osborne Street. Register 29 days before
  an election; elections.virginia.gov citizen portal to check registration
  (charlottecountyva.gov/departments/voter_registrar/index.php). Election Day
  Nov 3, 2026, polls 6 a.m. to 7 p.m. (SPEC).

## Post office, DMV, county offices

- Keysville Post Office, 225 King St, Keysville, VA 23947-9998, 434-736-2382
  (zipcodes-us.com; USPS locator page did not render for fetch). Hours
  `[verify]` with the USPS locator.
- DMV: no full DMV in Charlotte County. Charlotte Court House DMV Select, 205
  David Bruce Avenue (Commissioner of the Revenue), Monday to Friday 8:30 a.m.
  to 4:45 p.m., no appointment: titles, registrations, plates, placards,
  transcripts, voter registration forms; cannot issue driver's licenses,
  learner's permits or ID cards (dmv.virginia.gov/locations/dmv-selects/
  charlotte-court-house). Nearest full-service DMV customer service center
  `[verify]` (Farmville or South Boston). DMV Connect mobile visits `[verify]`.
- County Administrator 434-542-5117; Treasurer (taxes) and Commissioner of the
  Revenue 434-542-5546, 205 David Bruce Ave; Social Services 434-542-5164;
  Health Department 434-542-5251; Extension Office (4-H) 434-542-5884; Animal
  Shelter 434-736-6041, 900 Dogwood Road (county directory).

## Electric and internet

- Two electric utilities serve Charlotte County. Southside Electric
  Cooperative (HQ 2000 W Virginia Ave, Crewe) lists Charlotte County in its
  territory; outages 866-878-5514 (call, or text #out from the phone on the
  account), member line 800-552-2118 (sec.coop/contact-us; findenergy.com).
  Dominion Energy serves parts of the county; the town's own water policy
  points to the Dominion PIPP program. Dominion outage line 866-366-4357
  `[verify]`. Which company serves which Keysville addresses `[verify]`: the
  page tells residents to read the name on their bill.
- Internet (broadbandmap.com, Keysville 23947, advertised figures): Shentel
  cable (and fiber in part of town), Brightspeed DSL, Planet Networks fiber
  (48% of addresses), T-Mobile and Verizon 5G home, Starlink, Viasat,
  HughesNet. County broadband build-out: RiverStreet Networks north of US 360,
  Empower Broadband (Mecklenburg Electric Cooperative) south of US 360
  (charlottecountyva.gov/residents/broadband_deployment.php). Shown as "providers
  reported for 23947", not as a guarantee.

## Photo plan: 12 requests

| # | Shot | Where a real picture can come from | Permission needed |
|---|---|---|---|
| 1 | Tower Park playground on Main Street, mid-morning, a parent and child on the equipment, no faces identifiable or with signed release | Town staff with a phone; Town of Keysville Facebook page archive | Town-owned photo: none beyond staff approval. Children: written guardian release or shoot from behind |
| 2 | Keysville Convenience Center, 65 Arvin Street: the entrance sign and the row of containers, weekday, overcast light | Charlotte County Public Works (county owns the site); or a Pascat visit | County permission to photograph on site; credit "Charlotte County" |
| 3 | Town trash truck or crew on a residential street during pickup, can at the curb in foreground | Public Works, scheduled with the crew | Crew consent; keep faces incidental |
| 4 | King Street in snow with a VDOT plow or a town truck spreading salt | VDOT Lynchburg District communications office (they publish storm photos); residents via the community photo wall | VDOT photos: ask the district PIO for a release; resident photos: photo-wall rights checkbox |
| 5 | Keysville branch library, 200 King Street, front elevation in the block | Charlotte County Library staff; Virginia DHR Keysville Historic District archive (248-5001) for a historic pairing | Library: staff OK. DHR: credit required, request use rights |
| 6 | Keysville Volunteer Fire Department, 500 Osborne Street, apparatus bay doors open, one engine pulled forward | KVFD itself (volunteer departments usually have a photo officer) | Written OK from the chief; credit KVFD |
| 7 | Charlotte County Rescue Squad main station, 8300 George Washington Highway, ambulance in front | Rescue squad supervisor | Written OK from the squad |
| 8 | Twin Lakes State Park beach and Goodwin Lake, summer afternoon | Virginia State Parks media library (dcr.virginia.gov press/media), park staff | DCR permission and credit "Virginia State Parks" |
| 9 | Staunton River Battlefield State Park, the railroad bridge and earthworks from the trail | Virginia State Parks media library | Same as above |
| 10 | Eureka Elementary front entrance on a school morning, buses in line | Charlotte County Public Schools communications office | Division approval; no identifiable students |
| 11 | Keysville Post Office, 225 King Street, exterior with flag | Pascat visit, public sidewalk | None for exterior from public way |
| 12 | Mayor at Town Hall for the welcome letter portrait, daylight, 120 J Street entrance behind | Scheduled Pascat portrait session | Subject consent (public official) |

Also useful: Charlotte County tourism (vacrossroads.com, Virginia's Crossroads)
for countryside and lake imagery, with credit; Library of Congress 1943
Keysville photos (public domain) for the history pairing on the New-here page.
