# keysvilleva.gov — Document and Page Inventory

Surveyed 2026-10-24 with WebFetch only (public pages, sitemaps and the site's public WordPress REST media listing at `/wp-json/wp/v2/media`). No admin paths, no logins, no scripts.

Key finding: the "Document Library" pages (Town Council Minutes, Local & State Ordinances, Event Forms & Applications, Plans & Reports) render **no document links** in their server-side HTML. Only three documents are linked from any public page. The other ~94 files sit in the WordPress media library with no page pointing to them. All URLs below were read directly from the site; every one is a real file the site reports.

## 1. Summary count by category

Counts are **unique documents** after collapsing re-uploads of the same file (`-1`, `-2`, … suffixes) and PDF/DOCX pairs of the same document. Raw media count: 97 PDF/DOCX/XLSX files + ~26 notice/flyer images.

| Category | Unique docs | Notes |
|---|---|---|
| minutes | 33 | July 2024 through Sept 2026; includes public-hearing minutes and one budget work session |
| agenda | 0 | No agendas published anywhere |
| ordinance | 15 | Charter + Code chapters 00–12 (chapter 06 Miscellaneous, 10 Water & Sewer, 11 BPOL, 12 Taxation) + two Zoning Ordinance uploads |
| budget | 2 | FY26-27 Budget Synopsis (public hearing), FY26-27 Utility Rate Synopsis |
| form | 7 | Business license, water/sewer application, zoning permit, employment application, parade applications (2025, 2026), broadband survey |
| notice | 26 | Meeting postponed, public hearing notices, violation notices, office-closed and holiday-hours flyers, job postings, event flyers |
| map | 1 | Zoning Map |
| report | 5 | 2025 CCR, 2024 CCR/Drinking Water Quality Report (2 titles), Water & Sewer Policy (2025), BOOMS Summary |
| other | 4 | Christmas parade winners (2024, 2025), parade contributions (2024), parade line-up (2024) |
| **Total** | **93** | (matches `src/41b-docs-real.js`) |

Linked from an actual page: **3** (2025 Drinking Water Report, Standard Application, 2026 Christmas Parade Application). Everything else is orphaned in the media library.

## 2. All documents

"Page" is the public page where the link was seen. "Media Library" means the file exists on the server but no public page links to it. Year is from the filename/title, not the upload date. Dup = same document uploaded more than once; the canonical copy used in `41b-docs-real.js` is marked ★.

### Minutes

| Title / link text | URL | Page | Type | Year | Cat |
|---|---|---|---|---|---|
| September 14 2026 Town Council Meeting Minutes | https://keysvilleva.gov/wp-content/uploads/2026/10/September-14-2026-Town-Council-Meeting-Minutes.pdf | Media Library | PDF | 2026 | minutes |
| August 10, 2026 Town Council Mintues [sic] | https://keysvilleva.gov/wp-content/uploads/2026/09/August-10-2026-Town-Council-Mintues.pdf | Media Library | PDF | 2026 | minutes |
| July 13, 2026 Council Minutes | https://keysvilleva.gov/wp-content/uploads/2026/09/July-13-2026-Council-Minutes.pdf | Media Library | PDF | 2026 | minutes |
| July 13, 2026 Public Hearing Minutes | https://keysvilleva.gov/wp-content/uploads/2026/09/July-13-2026-Public-Hearing-Minutes.pdf | Media Library | PDF | 2026 | minutes |
| June 8 2026 Town Council Minutes | https://keysvilleva.gov/wp-content/uploads/2026/07/June-8-2026-Town-Council-Minutes.pdf | Media Library | PDF | 2026 | minutes |
| Public Hearing June 8 2026 | https://keysvilleva.gov/wp-content/uploads/2026/07/Public-Hearing-June-8-2026.pdf | Media Library | PDF | 2026 | minutes |
| May 11 2026 Town Council Minutes | https://keysvilleva.gov/wp-content/uploads/2026/07/May-11-2026-Town-Council-Minutes.pdf | Media Library | PDF | 2026 | minutes |
| April 13 2026 Town Council Minutes | https://keysvilleva.gov/wp-content/uploads/2026/05/April-13-2026-Town-Council-Minutes.pdf | Media Library | PDF | 2026 | minutes |
| March 9 2026 Council Minutes | https://keysvilleva.gov/wp-content/uploads/2026/05/March-9-2026-Council-Minutes.pdf | Media Library | PDF | 2026 | minutes |
| FEBRUARY 9 2026 TOWN COUNCIL MINUTES | https://keysvilleva.gov/wp-content/uploads/2026/03/FEBRUARY-9-2026-TOWN-COUNCIL-MINUTES.pdf | Media Library | PDF | 2026 | minutes |
| JANUARY 12 2026 COUNCIL MINUTES | https://keysvilleva.gov/wp-content/uploads/2026/02/JANUARY-12-2026-COUNCIL-MINUTES.pdf | Media Library | PDF | 2026 | minutes |
| December 8 2025 TOWN COUNCIL MINUTES | https://keysvilleva.gov/wp-content/uploads/2026/02/December-8-2025-TOWN-COUNCIL-MINUTES.pdf | Media Library | PDF | 2025 | minutes |
| NOVEMBER 10 2025 TOWN COUNCIL MINUTES | https://keysvilleva.gov/wp-content/uploads/2026/02/NOVEMBER-10-2025-TOWN-COUNCIL-MINUTES.pdf | Media Library | PDF | 2025 | minutes |
| October 20 2025 Minutes | https://keysvilleva.gov/wp-content/uploads/2025/12/October-20-2025-Minutes.pdf | Media Library | PDF | 2025 | minutes |
| October 20 2025 Public Hearing Mintues [sic] | https://keysvilleva.gov/wp-content/uploads/2025/12/October-20-2025-Public-Hearing-Mintues.pdf | Media Library | PDF | 2025 | minutes |
| September 8 2025 Minutes | https://keysvilleva.gov/wp-content/uploads/2025/12/September-8-2025-Minutes.pdf | Media Library | PDF | 2025 | minutes |
| August 11 2025 Minutes | https://keysvilleva.gov/wp-content/uploads/2025/09/August-11-2025-Minutes.pdf | Media Library | PDF | 2025 | minutes |
| JULY 14 2025 MINUTES ★ (dup, later upload) | https://keysvilleva.gov/wp-content/uploads/2025/08/JULY-14-2025-MINUTES-1.pdf | Media Library | PDF | 2025 | minutes |
| JULY 14 2025 MINUTES (dup, first upload) | https://keysvilleva.gov/wp-content/uploads/2025/08/JULY-14-2025-MINUTES.pdf | Media Library | PDF | 2025 | minutes |
| JULY 14 2025 PUBLIC HEARING MINUTES ★ (dup) | https://keysvilleva.gov/wp-content/uploads/2025/08/JULY-14-2025-PUBLIC-HEARING-MINUTES-1.pdf | Media Library | PDF | 2025 | minutes |
| JULY 14 2025 PUBLIC HEARING MINUTES (dup) | https://keysvilleva.gov/wp-content/uploads/2025/08/JULY-14-2025-PUBLIC-HEARING-MINUTES.pdf | Media Library | PDF | 2025 | minutes |
| JUNE 9 2025 MINTUES [sic] ★ (dup) | https://keysvilleva.gov/wp-content/uploads/2025/08/JUNE-9-2025-MINTUES-1.pdf | Media Library | PDF | 2025 | minutes |
| JUNE 9 2025 MINTUES (dup) | https://keysvilleva.gov/wp-content/uploads/2025/08/JUNE-9-2025-MINTUES.pdf | Media Library | PDF | 2025 | minutes |
| MAY 12 2025 MINUTES | https://keysvilleva.gov/wp-content/uploads/2025/08/MAY-12-2025-MINUTES.pdf | Media Library | PDF | 2025 | minutes |
| MAY 12 2025 PUBLIC HEARING | https://keysvilleva.gov/wp-content/uploads/2025/08/MAY-12-2025-PUBLIC-HEARING.pdf | Media Library | PDF | 2025 | minutes |
| APRIL 14 2025 MINUTES | https://keysvilleva.gov/wp-content/uploads/2025/06/APRIL-14-2025-MINUTES.docx | Media Library | DOCX | 2025 | minutes |
| BUDGET WORK SESSION 04032025 | https://keysvilleva.gov/wp-content/uploads/2025/06/BUDGET-WORK-SESSION-04032025.docx | Media Library | DOCX | 2025 | minutes |
| MARCH 10 2025 MINUTES | https://keysvilleva.gov/wp-content/uploads/2025/04/MARCH-10-2025-MINUTES.docx | Media Library | DOCX | 2025 | minutes |
| FEBRUARY 10 2025 MINTUES [sic] | https://keysvilleva.gov/wp-content/uploads/2025/03/FEBRUARY-10-2025-MINTUES.pdf | Media Library | PDF | 2025 | minutes |
| JANUARY 13 2025 MINTUES [sic] | https://keysvilleva.gov/wp-content/uploads/2025/03/JANUARY-13-2025-MINTUES.pdf | Media Library | PDF | 2025 | minutes |
| DECEMBER 9 2024 MINTUES [sic] | https://keysvilleva.gov/wp-content/uploads/2025/03/DECEMBER-9-2024-MINTUES.pdf | Media Library | PDF | 2024 | minutes |
| NOVEMBER 11 2024 MINTUES [sic] | https://keysvilleva.gov/wp-content/uploads/2025/03/NOVEMBER-11-2024-MINTUES.pdf | Media Library | PDF | 2024 | minutes |
| October 14 2024 Minutes | https://keysvilleva.gov/wp-content/uploads/2024/12/October-14-2024-Minutes.pdf | Media Library | PDF | 2024 | minutes |
| September 9 2024 Minutes | https://keysvilleva.gov/wp-content/uploads/2024/10/September-9-2024-Minutes.pdf | Media Library | PDF | 2024 | minutes |
| August 19 2024 Mintues [sic] | https://keysvilleva.gov/wp-content/uploads/2024/09/August-19-2024-Mintues.pdf | Media Library | PDF | 2024 | minutes |
| July 22 2024 Minutes | https://keysvilleva.gov/wp-content/uploads/2024/09/July-22-2024-Minutes-1.pdf | Media Library | PDF | 2024 | minutes |

Gaps in the minutes run: no Aug 2024 regular (Aug 19 is listed), no Jan 2025 budget, no June 2024 or earlier, no Oct 2026 yet (meeting was moved to Oct 19). Regular meetings appear to be the second Monday of each month.

### Ordinances (Town Code chapters)

| Title | URL | Page | Type | Year | Cat |
|---|---|---|---|---|---|
| 00 – The Charter | https://keysvilleva.gov/wp-content/uploads/2024/09/00-The-Charter.pdf | Media Library | PDF | 2024 (upload) | ordinance |
| 01 – General Provisions | https://keysvilleva.gov/wp-content/uploads/2024/09/01-General-Provisions.pdf | Media Library | PDF | 2024 | ordinance |
| 02 – Administration | https://keysvilleva.gov/wp-content/uploads/2024/09/02-Administration.pdf | Media Library | PDF | 2024 | ordinance |
| 03 – Animals | https://keysvilleva.gov/wp-content/uploads/2024/09/03-Animals.pdf | Media Library | PDF | 2024 | ordinance |
| 04 – Food and Food Establishments | https://keysvilleva.gov/wp-content/uploads/2024/09/04-Food-and-Food-Establishments.pdf | Media Library | PDF | 2024 | ordinance |
| 05 – Health and Sanitation | https://keysvilleva.gov/wp-content/uploads/2024/09/05-Health-and-Sanitation.pdf | Media Library | PDF | 2024 | ordinance |
| 06 – Miscellaneous | https://keysvilleva.gov/wp-content/uploads/2025/12/06-Miscellaneous.pdf | Media Library | PDF | 2025 | ordinance |
| 07 – Signs, Billboards, and Awnings | https://keysvilleva.gov/wp-content/uploads/2024/09/07-Signs-Billboards-and-Awnings.pdf | Media Library | PDF | 2024 | ordinance |
| 08 – Subdivisions | https://keysvilleva.gov/wp-content/uploads/2024/09/08-Subdivisions.pdf | Media Library | PDF | 2024 | ordinance |
| 09 – Vehicles and Traffic | https://keysvilleva.gov/wp-content/uploads/2024/09/09-Vehicles-and-Traffic.pdf | Media Library | PDF | 2024 | ordinance |
| 10 – Water and Sewer | https://keysvilleva.gov/wp-content/uploads/2025/04/10-Water-and-Sewer.pdf | Media Library | PDF | 2025 | ordinance |
| 11 – BPOL | https://keysvilleva.gov/wp-content/uploads/2024/09/11-BPOL.pdf | Media Library | PDF | 2024 | ordinance |
| 12 – Taxation | https://keysvilleva.gov/wp-content/uploads/2025/03/12-Taxation.pdf | Media Library | PDF | 2025 | ordinance |
| TOWN OF KEYSVILLE- ZONING ORDINANCE (2026 upload) | https://keysvilleva.gov/wp-content/uploads/2026/06/TOWN-OF-KEYSVILLE-ZONING-ORDINANCE.pdf | Media Library | PDF | 2026 | ordinance |
| Zoning Ordinance (2025 upload) | https://keysvilleva.gov/wp-content/uploads/2025/09/Zoning-Ordinance.pdf | Media Library | PDF | 2025 | ordinance |

Chapter numbering: 00–12 present with no gaps. Chapter titles have no year of adoption in filename; year shown is upload year.

### Budget

| Title | URL | Page | Type | Year | Cat |
|---|---|---|---|---|---|
| PH – Budget Synopsis – 05-27-26 | https://keysvilleva.gov/wp-content/uploads/2026/06/PH-Budget-Synopsis-05-27-26.pdf | Media Library | PDF | 2026 | budget |
| UTILITY RATE SYNOPSIS 26-27 | https://keysvilleva.gov/wp-content/uploads/2026/06/UTILITY-RATE-SYNOPSIS-26-27.pdf | Media Library | PDF | 2026 | budget |

No adopted budget document, no prior-year budgets, no audit/financial statements found.

### Forms

| Title | URL | Page | Type | Year | Cat |
|---|---|---|---|---|---|
| 2026 Christmas Parade Application ("Click Here") | https://keysvilleva.gov/wp-content/uploads/2026/10/2026-Christmas-Parade-Application.pdf | Christmas Parade (news post) | PDF | 2026 | form |
| 2026 BUSINESS LICENSE APPLICATION | https://keysvilleva.gov/wp-content/uploads/2026/08/2026-BUSINESS-LICENSE-APPLICATION.pdf | Media Library | PDF | 2026 | form |
| WATER-SEWER APPLICATION 06262026 | https://keysvilleva.gov/wp-content/uploads/2026/08/WATER-SEWER-APPLICATION-06262026.docx | Media Library | DOCX | 2026 | form |
| Standard Application ("Application") | https://keysvilleva.gov/wp-content/uploads/2026/06/Standard-Application.pdf (page links the same file at www.townofkeysvilleva.com) | Employment Opportunities | PDF | 2026 | form |
| 2025 Parade Application | https://keysvilleva.gov/wp-content/uploads/2025/10/2025-Parade-Application.docx | Media Library | DOCX | 2025 | form |
| Broadband Internet Survey | https://keysvilleva.gov/wp-content/uploads/2024/11/Broadband-Internet-Survey.pdf | Media Library | PDF | 2024 | form |
| Zoning Permit Application | https://keysvilleva.gov/wp-content/uploads/2024/09/ZONING-PERMIT-APPLICATION.pdf | Media Library | PDF | 2024 | form |

### Map

| Title | URL | Page | Type | Year | Cat |
|---|---|---|---|---|---|
| ZONING MAP | https://keysvilleva.gov/wp-content/uploads/2026/06/ZONING-MAP.pdf | Media Library | PDF | 2026 | map |

### Reports

| Title | URL | Page | Type | Year | Cat |
|---|---|---|---|---|---|
| 2025 Drinking Water Report (2025 CCR report) | https://keysvilleva.gov/wp-content/uploads/2026/06/2025-CCR-report.pdf (page links it at www.townofkeysvilleva.com) | Plans & Reports | PDF | 2025 | report |
| Keysville BOOMS Summary | https://keysvilleva.gov/wp-content/uploads/2026/08/Keysville-BOOMS-Summary.pdf | Media Library | PDF | 2026 | report |
| 2024 Annual Drinking Water Quality Report ★ | https://keysvilleva.gov/wp-content/uploads/2025/07/2024-Annual-Drinking-Water-Quality-Report.pdf | Media Library | PDF | 2024 | report |
| 2024 Annual Drinking Water Quality Report (DOCX dup) | https://keysvilleva.gov/wp-content/uploads/2025/07/2024-Annual-Drinking-Water-Quality-Report.docx | Media Library | DOCX | 2024 | report |
| Consumer Confidence Report – 2024 | https://keysvilleva.gov/wp-content/uploads/2025/07/Consumer-Confidence-Report-2024.pdf | Media Library | PDF | 2024 | report |
| Keysville Water and Sewer Policy, Updated 3-17-2025 ★ | https://keysvilleva.gov/wp-content/uploads/2025/04/Keysville-Water-and-Sewer-Policy-Updated-3-17-2025-1.pdf | Media Library | PDF | 2025 | report |
| Keysville Water and Sewer Policy, Updated 3-17-2025 (DOCX dup) | https://keysvilleva.gov/wp-content/uploads/2025/04/Keysville-Water-and-Sewer-Policy-Updated-3-17-2025-4.docx | Media Library | DOCX | 2025 | report |

### Notices

| Title | URL | Page | Type | Year | Cat |
|---|---|---|---|---|---|
| Town Council Meeting Postponed ★ (PDF, 6 uploads; latest) | https://keysvilleva.gov/wp-content/uploads/2026/10/Town-Council-Meeting-Postponed-5.pdf | Media Library | PDF | 2026 | notice |
| Town Council Meeting Postponed (other uploads) | …/2026/10/Town-Council-Meeting-Postponed.pdf, -1.pdf, -2.pdf, -3.pdf, -4.pdf | Media Library | PDF | 2026 | notice |
| Town Council Meeting Postponed (image) | https://keysvilleva.gov/wp-content/uploads/2026/10/Town-Council-Meeting-Postponed-scaled.jpg | Town Council Meeting moved to October 19th (post) | JPG | 2026 | notice |
| 2026 Christmas Parade Flyer (image) | https://keysvilleva.gov/wp-content/uploads/2026/10/2026-Christmas-Parade-Flyer.jpg | Christmas Parade (post) | JPG | 2026 | notice |
| CHRISTMAS FLYER | https://keysvilleva.gov/wp-content/uploads/2026/09/CHRISTMAS-FLYER.pdf | Media Library | PDF | 2026 | notice |
| HALLOWEEN FLYER (image) | https://keysvilleva.gov/wp-content/uploads/2026/09/HALLOWEEN-FLYER.jpg | Halloween Hours (post) | JPG | 2026 | notice |
| SMOKE DETECTOR FLYER (image) | https://keysvilleva.gov/wp-content/uploads/2026/09/SMOKE-DETECTOR-FLYER.jpg | Free Smoke & Carbon Monoxide Detectors (post) | JPG | 2026 | notice |
| PW-Maintenance Job Posting | https://keysvilleva.gov/wp-content/uploads/2026/06/PW-Maintenance-Job-Posting.pdf | Media Library | PDF | 2026 | notice |
| Keysville Town Manager, Invitation to Apply, Full-time ★ | https://keysvilleva.gov/wp-content/uploads/2026/01/Keysville-Town-Manager-Invitation-to-Apply-Full-time.pdf | Media Library | PDF | 2026 | notice |
| Keysville Town Manager Full-time.01272026 (DOCX ×3 dups) | …/2026/01/Keysville-Town-Manager-Full-time.01272026.docx, -1.docx, -2.docx | Media Library | DOCX | 2026 | notice |
| Town Manager Position (2025) ★ | https://keysvilleva.gov/wp-content/uploads/2025/05/Keysville-Town-Manager-Invitation-to-Apply.pdf | Media Library | PDF | 2025 | notice |
| Town Manager Position (2025, dup) | https://keysvilleva.gov/wp-content/uploads/2025/05/Keysville-Town-Manager-Invitation-to-Apply-2.pdf | Media Library | PDF | 2025 | notice |
| 2025 Christmas Parade (image) | https://keysvilleva.gov/wp-content/uploads/2025/11/2025-Christmas-Parade.png | Media Library | PNG | 2025 | notice |
| Closed Veterans Day (image) | https://keysvilleva.gov/wp-content/uploads/2025/11/Closed-Veterans-Day.png | Media Library | PNG | 2025 | notice |
| Trick-Or-Treating Hours 2025 (image) | https://keysvilleva.gov/wp-content/uploads/2025/10/Trick-or-Treat-2025.png | Media Library | PNG | 2025 | notice |
| NOTICE OF PUBLIC HEARINGS ★ (DOCX ×3) | https://keysvilleva.gov/wp-content/uploads/2025/10/NOTICE-OF-PUBLIC-HEARINGS-1.docx | Media Library | DOCX | 2025 | notice |
| Notice of Public Hearings (other DOCX) | …/2025/10/NOTICE-OF-PUBLIC-HEARINGS.docx, …/2025/10/Notice_of_Public_Hearings_Keysville.docx | Media Library | DOCX | 2025 | notice |
| Notice of Public Hearings (image ×3) | …/2025/10/Notice-of-Public-Hearings.png, -1.png, -2.png | Media Library | PNG | 2025 | notice |
| COLUMBUS DAY CLOSED | https://keysvilleva.gov/wp-content/uploads/2025/10/COLUMBUS-DAY-CLOSED.docx | Media Library | DOCX | 2025 | notice |
| TOWN OFFICE CLOSED (image ×2) | https://keysvilleva.gov/wp-content/uploads/2025/10/TOWN-OFFICE-CLOSED-1.png (and TOWN-OFFICE-CLOSED.png) | Media Library | PNG | 2025 | notice |
| Happy Fourth of July! (image ×2) | https://keysvilleva.gov/wp-content/uploads/2025/07/Happy-Fourth-of-July.png | Media Library | PNG | 2025 | notice |
| Public Hearing Notice – Proposed Real Property Tax Increase | https://keysvilleva.gov/wp-content/uploads/2025/06/NOTICE-OF-PROPOSED-REAL-PROPERTY-TAX-INCREASE.docx | Media Library | DOCX | 2025 | notice |
| Memorial Day Holiday Office Hours (image ×3) | https://keysvilleva.gov/wp-content/uploads/2025/05/Memorial-Day.png | Media Library | PNG | 2025 | notice |
| Public Hearing Notice – Budget 2025-2026 (image) | https://keysvilleva.gov/wp-content/uploads/2025/05/PUBLIC-HEARING-BUDGET-2025-2026-1.png | Media Library | PNG | 2025 | notice |
| Potholes (image) | https://keysvilleva.gov/wp-content/uploads/2025/03/Potholes.png | Media Library | PNG | 2025 | notice |
| PRESIDENTS DAY – CLOSED (image ×2) | https://keysvilleva.gov/wp-content/uploads/2025/02/PRESIDENTS-DAY-CLOSED.png | Media Library | PNG | 2025 | notice |
| Christmas Holiday Opening Hours (image ×2) | https://keysvilleva.gov/wp-content/uploads/2024/12/Christmas-Happy-Holiday-Opening-Hours-Instagram-Post.png | Media Library | PNG | 2024 | notice |
| Notice of Alleged Violation Nov 6 2024 | https://keysvilleva.gov/wp-content/uploads/2024/12/VIOLATION-NOTICE-3.docx | Media Library | DOCX | 2024 | notice |
| Community Meetings – Regional Broadband Affordability and Adoption Plan (image) | https://keysvilleva.gov/wp-content/uploads/2024/11/Community-Meetings-Flyer.png | Media Library | PNG | 2024 | notice |
| Trick or Treat Hours 2024 | https://keysvilleva.gov/wp-content/uploads/2024/10/Trick-or-Treat-Hours-2024.docx | Media Library | DOCX | 2024 | notice |
| Trick or Treat 2024 (image ×2) | https://keysvilleva.gov/wp-content/uploads/2024/10/trick-or-treat2024.png | Media Library | PNG | 2024 | notice |
| Old Main Vending Festival (image) | https://keysvilleva.gov/wp-content/uploads/2024/10/Old-Main-Vending-Festival.jpg | Media Library | JPG | 2024 | notice |
| Notice of Alleged Violation – Water, 29 Aug 2024 | https://keysvilleva.gov/wp-content/uploads/2024/08/Notice_of_Alleged_Violation_Water_29Aug2024.pdf | Media Library | PDF | 2024 | notice |

### Other

| Title | URL | Page | Type | Year | Cat |
|---|---|---|---|---|---|
| 2025 Christmas Winners ★ (XLSX ×4; latest) | https://keysvilleva.gov/wp-content/uploads/2025/12/2025-Christmas-Winners-3.xlsx | Media Library | XLSX | 2025 | other |
| 2025 Christmas Parade Winners (image) | https://keysvilleva.gov/wp-content/uploads/2025/12/2025-Christmas-Parade-Winners.png | Media Library | PNG | 2025 | other |
| 2024 CHRISTMAS PARADE WINNERS ★ | https://keysvilleva.gov/wp-content/uploads/2024/12/2024-CHRISTMAS-PARADE-WINNERS.pdf | Media Library | PDF | 2024 | other |
| Christmas Parade Winners for 2024 (DOCX dup) | https://keysvilleva.gov/wp-content/uploads/2024/12/Christmas-Parade-Winners-for-2024.docx | Media Library | DOCX | 2024 | other |
| 2024 Christmas Parade Contributions | https://keysvilleva.gov/wp-content/uploads/2024/12/2024-Christmas-Parade-Contributions.docx | Media Library | DOCX | 2024 | other |
| CHRISTMAS PARADE LINE UP (image) | https://keysvilleva.gov/wp-content/uploads/2024/12/CHRISTMAS-PARADE-LINE-UP.png | Media Library | PNG | 2024 | other |

## 3. Page inventory

Main nav: Home (links to www.townofkeysvilleva.com, not keysvilleva.gov) · Visitors · Living Here (Trash & Recycling, Water and Sewer Rates, Water and Sewer Policy) · Government (href `#`; children Document Library → Event Forms & Applications / Local & State Ordinances / Plans & Reports / Town Council Minutes; FOIA; Local Government) · Business Directory · News · Events · Employment · Pay Online (ipn2.paymentus.com/rotp/kysv). Footer: "Site by Zachary McKinney Technology".

| URL | What is there |
|---|---|
| https://keysvilleva.gov/ | Home: logo, nav, tiles for Online Payment / Business Directory / Events, three Oct 8 2026 news items, office hours (8:30–3 M–F), phone/fax 434-736-9551, townoffice@keysvilleva.gov, 120 J Street, PO Box 42, Keysville VA 23947. No documents. |
| https://keysvilleva.gov/visitors/ | Two paragraphs of welcome copy about countryside, history and small-town feel. No links or docs. |
| https://keysvilleva.gov/living-here/ | Promotional copy about community, schools, recreation, housing. No docs. |
| https://keysvilleva.gov/living-here/trash-and-recycling/ | "More information coming soon…" placeholder. |
| https://keysvilleva.gov/living-here/rates/ | "Water and Sewer Rates" — "More information coming soon…" placeholder (the FY26-27 Utility Rate Synopsis PDF exists but is not linked here). |
| https://keysvilleva.gov/living-here/water-and-sewer-policy/ | Full water/sewer policy as page text: charges, connection fees, deposits, disconnection, cross-connection, plus four external assistance links (Charlotte Co. DSS, VDSS energy assistance, PIPP, CommonHelp). No PDF link (the 2025 policy PDF exists in media). |
| https://keysvilleva.gov/water-and-sewer-policy/ | Duplicate slug of the above, but only "More information coming soon." Stale duplicate page. |
| https://keysvilleva.gov/government/ | "More information coming soon…" placeholder. Not in nav (nav parent is `#`). |
| https://keysvilleva.gov/government/local-government/ | Mayor Robert Schaefer; Council: Rhonda Benn, Rachael Clark, Anthony Ferranto, Scotty Jackson, Tom Fisher, Wendy Gallion; Town Manager Stephanie Clay; Town Clerk/Treasurer Sherry Marker. Headshots for 4 people, logo placeholders for 5. No meeting schedule stated. Google Calendar embed. |
| https://keysvilleva.gov/government/foia/ | FOIA rights-and-responsibilities text: 5-working-day response, fees, exemptions, FOIA officer Sherry Marker. Email given as townoffice@townofkeysville.com (differs from footer domain). No links. |
| https://keysvilleva.gov/government/form-downloads/ | "Document Library" heading, contact block, calendar embed. **No documents listed.** |
| https://keysvilleva.gov/government/form-downloads/town-council-minutes/ | Title "Town Council Minutes"; body is only the "document library" heading, contact block and Google Calendar agenda embed. **Zero minutes linked**, though 36 minutes PDFs/DOCX exist in the media library. |
| https://keysvilleva.gov/government/form-downloads/local-state-ordinances/ | Same empty shell. **Zero ordinances linked** (15 exist). |
| https://keysvilleva.gov/government/form-downloads/event-forms-applications/ | Same empty shell (first fetch returned a server error, second succeeded). **Zero forms linked.** |
| https://keysvilleva.gov/government/form-downloads/plans-reports/ | One link: "2025 Drinking Water Report" → 2025-CCR-report.pdf (hosted at www.townofkeysvilleva.com). Only working document page on the site. |
| https://keysvilleva.gov/business-directory/ | Simple Business Directory Pro listing of 77 entries (Dollar General #429 twice; several are out-of-state corporate addresses, i.e., a business-license roll, not a visitor directory). Every listing has placeholder image and a "Get Direction" Google Maps link; 74 have `#` website links. Contact form with CAPTCHA. |
| https://keysvilleva.gov/news/ | Static page announcing a July 13 Town Council & Public Hearing meeting (stale), calendar embed. Does not list posts. |
| https://keysvilleva.gov/category/news/ | Actual post archive: 4 posts (below). No pagination. |
| https://keysvilleva.gov/christmas-parade/ | Post, Oct 8 2026: flyer image + "Christmas Parade Application: Click Here" → 2026-Christmas-Parade-Application.pdf. |
| https://keysvilleva.gov/halloween-hours/ | Post, Oct 8 2026: flyer image only, no text (hours are only in the image). |
| https://keysvilleva.gov/town-council-meeting-moved-to-october-19th/ | Post, Oct 8 2026: image only, no text with new date/time. |
| https://keysvilleva.gov/free-smoke-carbon-monoxide-detectors/ | Post, Oct 2 2026: flyer image only, no text. |
| https://keysvilleva.gov/events/ | Events page: contact block only; no events listed (calendar is a Google Calendar embed elsewhere). |
| https://keysvilleva.gov/employment-opportunities/ | Plant Operator/Town Maintenance posting ($15–20/hr, Class 4 within 9 mo, Class 3 within 18 mo), apply to townmanager@townofkeysville.com; "Application" → Standard-Application.pdf. |
| https://keysvilleva.gov/embed-link/ | Orphan page from a locations/search plugin (Distance/Miles/KM/Find/Clear widget). |
| https://keysvilleva.gov/locations/ | Orphan plugin page; contact block only. |
| https://keysvilleva.gov/categories/ , /tags/ | In sitemap; plugin archive stubs (not fetched individually). |
| https://keysvilleva.gov/my-bookings/ | Orphan booking-plugin page; contact block only. |
| https://www.townofkeysvilleva.com/ | Same WordPress site on the old domain (canonical points to keysvilleva.gov; logo and Home link still use the old domain; two linked PDFs are served from it). |

Sitemaps: `/sitemap.xml` and `/wp-sitemap.xml` both resolve to the WP core index listing posts (4), pages (24), category (1) and a users sitemap (not fetched).

### What the Town Council Minutes page actually contains
Heading "document library", office hours, phone/fax (same number), email, mailing address, an embedded Google Calendar in agenda mode, and a "See all events" link. Nothing else. The minutes are uploaded to WordPress but never inserted into the page, so a resident cannot reach them from the site at all.

## 4. Quality notes

- **Orphaned library.** 94 of 97 uploaded documents are not linked from any page. The four Document Library sub-pages are empty shells. The demo should surface all of them, grouped by category and year.
- **Scanned vs text.** Not verified file-by-file (PDFs were not downloaded). Filenames such as `IMG_0872.jpeg` and the `-rotated`/`-scaled` variants show phone photos were uploaded in Aug 2026; the minutes PDFs are likely scans of signed paper minutes given naming (`Mintues`) and workflow. Treat as scanned/unsearchable until checked.
- **Typos in titles/filenames:** "Mintues" appears in 7 filenames (June 9 2025, Oct 20 2025 PH, Feb 10 2025, Jan 13 2025, Dec 9 2024, Nov 11 2024, Aug 19 2024, Aug 10 2026). Inconsistent casing (ALL CAPS vs Title Case) across minutes.
- **Duplicate uploads:** Town Council Meeting Postponed ×6 PDFs + image; Town Manager DOCX ×3; 2025 Christmas Winners XLSX ×4; Notice of Public Hearings DOCX ×3 + PNG ×3; July 14 2025 minutes and PH minutes ×2 each; June 9 2025 ×2; Memorial Day ×3; Presidents Day ×2; Town Office Closed ×2; Fourth of July ×2; Christmas hours ×2; 2025 Town Manager PDF ×2. Suggests no media management.
- **Mixed formats:** 3 sets of minutes are DOCX only (Mar 10, Apr 14 2025 and Apr 3 2025 budget work session); several notices DOCX only. Residents on phones cannot open DOCX reliably.
- **Missing years / gaps:** Minutes begin July 22 2024; nothing older. No agendas at all. No adopted budget, audit, CAFR or comprehensive plan. No council meeting schedule stated anywhere. Ordinance chapters carry no adoption dates.
- **Two domains.** Home link, logos and two document links point to www.townofkeysvilleva.com; everything else is keysvilleva.gov. Two email domains appear (keysvilleva.gov, townofkeysville.com).
- **Image-only posts.** All four news posts carry their information only inside an image (no alt text on three of them): inaccessible and unsearchable.
- **Stale/duplicate pages:** /news/ still announces a July 13 meeting; /water-and-sewer-policy/ duplicates /living-here/water-and-sewer-policy/ with placeholder text; /government/, /living-here/rates/, /living-here/trash-and-recycling/ are placeholders.
- **Broken/odd links:** Government nav item is `href="#"`; 74 business listings link to `#`; Thompson Insurance "website" link is a relative mailto typo (`/business-directory/thompsoninsurance1922@gmail.com`); three listings have empty directions URLs.
- **Fetch failures:** Event Forms & Applications returned a server error once (succeeded on retry). REST media pages beyond the last page return 400 as expected. `/categories/`, `/tags/` and the users sitemap were not fetched.
- **Exposure note for the real site:** the public REST API lists every upload (and a users sitemap is published). Our build standard turns both off.
