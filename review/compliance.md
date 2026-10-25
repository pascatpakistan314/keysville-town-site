# Keysville Replacement Site: Compliance Audit and Legal Page Spec

Audited 2026-10-24 against the live site at keysvilleva.gov (WordPress 7.1.3, Divi 4.27.9, built by Zachary McKinney Technology). Only public pages were read. Town population: 807 (2020 census), so the town falls in the under-50,000 tier for the DOJ web rule and the over-250 tier for Virginia FOIA posting.

## Part 1. Audit findings

| Item | Status | Checked | Notes |
|---|---|---|---|
| Privacy policy | Missing | / , /privacy-policy/ (404), sitemap | No privacy page anywhere. Required by Va. Code 2.2-3803(B). |
| Cookie notice / consent | Weak | / | "Beautiful & Responsive Cookie Consent" banner says "This website uses cookies to ensure you get the best experience." Offers Technical/Marketing toggles but the site loads no analytics or marketing scripts. The policy link is empty and the second link still points to the plugin's placeholder "https://yourdomain/anotherLink". No cookie policy page. |
| Accessibility statement | Missing | /accessibility/ (404), site search of homepage | No mention of accessibility anywhere. |
| Nondiscrimination / ADA notice | Missing | / , /government/ | None. |
| FOIA rights and responsibilities | Present, weak | /government/foia/ | Good plain-English text, response times, fees and FOIA Council contact. Gaps against 2.2-3704.1: no list of record types held, no exemption list, no written fee policy with current rates, no link to the FOIA Council comment form (2.2-3704.1(B)). Contact email is townoffice@townofkeysville.com while the footer says townoffice@keysvilleva.gov. Homepage link exists only in the Government menu. |
| Terms of use | Missing | / | None. |
| Public notices | Weak | /news/ | One post ("Town Council & Public Hearing Meeting- July 13th"). No notices section. |
| Open meeting notices and agendas | Weak | /events/ , /news/ | Events page renders empty. No agendas posted. 2.2-3707 requires notice and agenda on the website before each meeting. |
| Meeting minutes | Weak | /government/form-downloads/town-council-minutes/ | Page renders only the heading "document library". |
| Website ownership / contact | Present | / footer | 120 J Street, PO Box 42, Keysville VA 23947, 434-736-9551, townoffice@keysvilleva.gov. Fax number duplicates phone number. |
| Copyright / public domain statement | Weak | / footer | "© 2024-2026Town of Keysville, VA" (missing space). No statement about reuse of public records. |
| Security contact | Missing | / | No security@ address or disclosure policy. |
| Language access notice | Missing | / | English only, no notice, no interpreter line. |
| Site map (human) | Missing | / | Only the WordPress XML sitemap at /wp-sitemap.xml. |
| External link disclaimer | Missing | / | None. |
| Records retention statement | Missing | all | None. |
| Who built it | Present | / footer | "Site by Zachary McKinney Technology" linking to http://tech.zackmckinney.com/ (not HTTPS). |
| Viewport meta | Fail (ADA) | / | `maximum-scale=1.0, user-scalable=0` blocks pinch zoom. Fails WCAG 1.4.4 Resize Text and 1.4.10 Reflow. |
| Exposed metadata | Weak | /wp-sitemap-users-1.xml, /wp-json/ | Author archives and REST user list exposed; xmlrpc.php linked. |

## Part 2. What the law expects (with sources)

- **DOJ ADA Title II web rule (28 CFR Part 35, Subpart H).** Published April 24, 2024. Standard: WCAG 2.1 A and AA for all web content and apps, including vendor-built. Deadline for entities under 50,000 residents (Keysville): April 26, 2027. Exceptions: labeled archived content, pre-existing PDFs/Office files not used for current services, third-party content, individualized secured documents, pre-existing social posts. We build to WCAG 2.2 AA, which includes all of 2.1 AA. ([UNC School of Government](https://www.sog.unc.edu/blogs/coates-canons/understanding-new-ada-web-accessibility-requirements-state-and-local-governments-1))
- **ADA coordinator.** 28 CFR 35.107 requires a coordinator and grievance procedure only at 50 or more employees; 35.106 requires every entity to post notice of ADA rights. For Keysville a named coordinator is best practice. ([ADA Tool Kit](https://archive.ada.gov/pcatoolkit/chap2toolkit.htm))
- **Section 508.** Federal agencies only; reference, not obligation. ([overview](https://accesstive.com/compliance-hub/section-508-us/))
- **Virginia FOIA posting, 2.2-3704.1.** Towns over 250 must link from the homepage to a notice with: plain-English rights and procedures; FOIA officer contact; index of record types held; description of exemptions; any routine-withholding policy; the prescribed charges statement; a written fee policy with current fees; plus a link to the FOIA Council comment form. ([2.2-3704.1](https://law.lis.virginia.gov/vacode/2.2-3704.1/)) Meetings (2.2-3707): notice three working days ahead on the website, a public posting place and the clerk's office, with date, time, location; agenda online before the meeting; minutes with attendance, discussion summary and votes. ([2.2-3707](https://law.lis.virginia.gov/vacode/title2.2/chapter37/section2.2-3707/))
- **Va. Code 2.2-3803(B).** Every public body website must conspicuously post a privacy statement: personal data collected, data gathered automatically, whether cookies are set and why, how data is used. ([2.2-3803](https://law.lis.virginia.gov/vacode/2.2-3803/))
- **Virginia Public Records Act, 42.1-76 et seq.** Library of Virginia locality schedules; records officer designated in writing (RM-25); destruction needs an RM-3 certificate. ([Library of Virginia](https://lva.virginia.gov/services/rm/schedules))
- **.gov domain.** HSTS preload; CISA recommends a published security@ contact, a disclosure policy and DMARC. ([get.gov](https://get.gov/domains/security/))
- **Virginia Relay 711.** Statewide relay for Deaf, hard of hearing and speech-disabled callers; Spanish relay available. ([VDDHH](https://www.vddhh.virginia.gov/varelay_features.htm))
- **Title VI / language access.** EO 14224 (March 2025) rescinded EO 13166 and lep.gov is suspended, but Title VI still bars national-origin discrimination by recipients of federal funds, and English-only services have been treated as disparate impact (Lau v. Nichols). A town taking water, sewer or CDBG money should post a short free-interpreter notice. ([CRS IF13076](https://www.everycrsreport.com/reports/IF13076.html), [DOJ](https://www.justice.gov/crt/limited-english-proficiency))
- **COPPA.** Commercial operators only; the FTC has said it does not reach state and local governments. ([summary](https://www.winston.com/print/v2/content/59534/ftc-clarifies-that-coppa-does-not-apply-to-schools-or-state.pdf))
- **Plain language.** The Plain Writing Act binds federal agencies, but 2.2-3704.1 itself requires plain English for the FOIA notice. ([Act text](https://www.govinfo.gov/content/pkg/PLAW-111publ274/html/PLAW-111publ274.htm))
- **"W3C compliant."** No certification exists. In practice: zero errors in the Nu HTML Checker and the CSS Validator on every page. Validity does not prove accessibility. ([W3C](https://validator.w3.org/docs/help))

## Part 3. Legal pages the new site must have

Footer links on every page: Privacy, Accessibility, FOIA, Nondiscrimination, Terms, Language Access, Security, Site Map. FOIA link also appears in the Government menu (homepage link is required by law).

### 1. Privacy Statement (/privacy/)

**Privacy Statement**

The Town of Keysville respects your privacy. This statement explains what this website collects and how we use it. It is posted under Virginia Code 2.2-3803.

**What we collect automatically.** Our web server records the date and time of your visit, the pages you viewed, your browser type, and your IP address. We use these logs to keep the site running and secure. Logs are kept for [90] days and then deleted.

**What our forms collect.** When you fill out a form, such as a contact form, a service request, or a FOIA request, we collect only what the form asks for. This is usually your name, phone number, email address, and your message. We use it to answer you and to carry out the business you asked about. Form submissions go to [Town Office email] and to the staff member who handles that service. They are kept as town records under the Virginia Public Records Act and the Library of Virginia retention schedule that applies, then destroyed.

**Cookies.** This site sets no tracking or advertising cookies. It stores only small preference settings on your device, such as text size or a dismissed notice. See our Cookie Notice.

**Who sees your information.** Town staff who need it to do their work. We do not sell or rent personal information. Records may be released under the Virginia Freedom of Information Act unless an exemption applies, and we may share information when the law requires it.

**Children.** This site is not directed to children and we do not knowingly collect information from anyone under 13.

**Links to other sites.** Other websites have their own privacy practices. We are not responsible for them.

**Questions.** Contact [Town Clerk name], [phone], [email], Town of Keysville, 120 J Street, PO Box 42, Keysville, VA 23947.

### 2. Cookie Notice (/cookies/)

**Cookie Notice**

This site does not use tracking, analytics, or advertising cookies, and it does not share your activity with third parties. Because of that, we do not show a cookie consent banner. The site uses only functional browser storage to remember choices you make, such as a closed alert or a text size setting. That storage stays on your device and is never sent to us. You can clear it at any time in your browser settings. If we ever add a tool that tracks visitors, we will update this notice and the Privacy Statement first.

### 3. Accessibility Statement (/accessibility/)

**Accessibility Statement**

The Town of Keysville wants everyone to be able to use this website. We follow the Web Content Accessibility Guidelines (WCAG) 2.2 at Level AA, which meets the standard set by the U.S. Department of Justice under Title II of the Americans with Disabilities Act (28 CFR Part 35).

**What we do.** Every page is tested with keyboard navigation, screen readers, zoom to 400 percent, and automated checkers before it is published. Pages validate as HTML5 and CSS with no errors. Documents we create for this site are posted as accessible HTML or tagged PDF.

**Known limitations.** Some older PDFs, such as scanned minutes and ordinances posted before [date], may not be fully accessible. We will provide any of them in an accessible format on request. Content from outside sources, such as embedded maps, may not meet all criteria.

**Need help or found a problem?** Contact [ADA Coordinator name and title], [phone], [email], or write to Town of Keysville, PO Box 42, Keysville, VA 23947. Tell us the page address and what went wrong. We will reply within [5] business days and give you the content in a format that works for you. Deaf, hard of hearing, or speech-disabled callers may dial 711 for Virginia Relay.

**Resumen en español.** El Pueblo de Keysville quiere que todos puedan usar este sitio web. Seguimos las Pautas de Accesibilidad para el Contenido Web (WCAG) 2.2, nivel AA. Si necesita ayuda o encuentra un problema, llame al [teléfono] o escriba a [correo electrónico]. Respondemos en [5] días hábiles. Personas sordas o con dificultades del habla pueden marcar 711 (Virginia Relay).

Last reviewed: [date].

### 4. Nondiscrimination and ADA Notice (/nondiscrimination/)

**Notice Under the Americans with Disabilities Act and Title VI**

The Town of Keysville does not discriminate on the basis of disability, race, color, national origin, sex, religion, or age in its programs, services, or activities.

**Reasonable accommodations.** If you need a sign language interpreter, materials in another format, or another accommodation to take part in a town meeting or service, contact the ADA Coordinator at least [48 hours] before the event. [ADA Coordinator name and title], [phone], 711 (Virginia Relay), [email], 120 J Street, PO Box 42, Keysville, VA 23947.

**Complaints.** You may file a written complaint with the ADA Coordinator within [60] days of the problem. Include your name, contact information, and what happened. We will meet with you or call you within [15] days and respond in writing within [30] days. You may also file with the U.S. Department of Justice at ada.gov. Using our process is not required before contacting a federal agency.

The town will not charge for accommodations and will not retaliate against anyone who makes a request or complaint.

### 5. FOIA Rights and Responsibilities (/foia/)

Keep the existing text (it is sound) and add the parts the law requires.

**FOIA Officer.** [Name], Town Clerk, 434-736-9551, [email ending in @keysvilleva.gov], 120 J Street, PO Box 42, Keysville, VA 23947. Office hours 8:30 a.m. to 3:00 p.m., Monday through Friday.

**How to request records.** Ask in person, by mail, phone, or email. You do not have to use a form or say "FOIA." Describe the records clearly enough that we can find them. We may ask for your name and legal address. You may ask for a cost estimate before we begin.

**Our response time.** We respond within five working days. Day one is the working day after we receive your request. If we cannot finish in five days, we will tell you in writing and take up to seven more working days. For very large requests we may ask the court for more time, but only after trying to reach an agreement with you.

**Records we keep.** Council minutes and agendas, ordinances and resolutions, budgets and audits, utility billing records, zoning and permit files, personnel files, contracts and bids, and correspondence.

**Records we may withhold.** Virginia FOIA lets us withhold some records, including personnel files (2.2-3705.1), attorney-client and legal records, certain real estate negotiation records, and records whose release would compromise security. Exemptions are read narrowly, and we release any part of a record that is not exempt. The town has no policy of routinely withholding any class of record.

**Charges.** A public body may make reasonable charges not to exceed its actual cost incurred in accessing, duplicating, supplying, or searching for the requested records. No public body shall impose any extraneous, intermediary, or surplus fees or expenses to recoup the general costs associated with creating or maintaining records or transacting the general business of the public body. Any duplicating fee shall not exceed the actual cost of duplication. Before searching, we will notify you in writing that charges may apply and ask whether you want a cost estimate in advance (2.2-3704(F)). Current fees: staff time at the hourly rate of the lowest-paid employee able to do the work, [$X.XX] per hour; copies [$0.10] per page; no charge for requests costing under [$X].

**Help and complaints.** The Virginia Freedom of Information Advisory Council answers questions and issues advisory opinions: foiacouncil@dls.virginia.gov, 804-698-1810, toll free 1-866-448-4100. You may also tell the Council how we handled your request through its public comment form at [FOIA Council comment form URL]. If you believe your rights were violated, you may petition the general district or circuit court.

### 6. Public Records Retention (/records/)

**How the Town Keeps Records**

Town records are public property. We keep them according to the Virginia Public Records Act (Virginia Code 42.1-76 and following) and the retention schedules issued by the Library of Virginia for localities. Our Records Officer is [name and title]. Records are destroyed only after their retention period ends, no audit, lawsuit, or FOIA request is pending, and a Certificate of Records Destruction has been signed. Council minutes and ordinances are kept permanently. Messages sent through this website are town records and are kept under the same rules.

### 7. Website Terms and External Links (/terms/)

**Terms of Use**

This website is run by the Town of Keysville, Virginia, for public information. We try to keep it accurate and current, but the official record of any ordinance, meeting, or policy is the signed document on file at the Town Office. If this site and the official record differ, the record controls.

**Public domain.** Text written by the town is public information and may be copied with attribution. Photos, logos, and seals may be subject to third-party rights or restricted to official use; ask before reusing them.

**Outside links.** Links to other websites are provided for convenience. The town does not control them and does not endorse their content, products, or privacy practices.

**No warranty.** The site is provided as is. The town is not liable for losses from using it or from downtime.

**Contact.** [Town Office email], 434-736-9551.

### 8. Language Access Notice (/language/)

**Language Help**

If you do not speak English well, the Town of Keysville will provide a free interpreter for town meetings and services. Call [phone] or email [email] at least [2] working days ahead when possible. Written documents can be translated on request. You will not be charged. This notice is provided under Title VI of the Civil Rights Act of 1964. Deaf or hard of hearing callers may dial 711.

**Ayuda en su idioma**

Si usted no habla bien inglés, el Pueblo de Keysville le proporcionará un intérprete gratuito para reuniones y servicios del pueblo. Llame al [teléfono] o escriba a [correo electrónico] con al menos [2] días hábiles de anticipación cuando sea posible. Los documentos escritos se pueden traducir si lo solicita. No se le cobrará. Este aviso se publica conforme al Título VI de la Ley de Derechos Civiles de 1964. Las personas sordas o con problemas de audición pueden marcar 711.

### 9. Security Contact (/security/)

**Report a Security Problem**

If you find a security weakness in this website or in a town system, please tell us at security@keysvilleva.gov. Tell us what you found and how to reproduce it. Do not access, change, or download data that is not yours, and do not disrupt services. We will confirm receipt within [3] business days and let you know when the issue is fixed. We will not take legal action against anyone who reports in good faith and follows these rules. This address is also listed with the .gov registry.

### 10. Public Comment and Meeting Notice Policy (/meetings/notice-policy/)

**How We Give Notice and Take Comment**

Town Council meets [second Tuesday of each month at 7:00 p.m.] at the Town Office, 120 J Street. Notice of every regular, special, or emergency meeting is posted on this website, on the bulletin board at the Town Office, and in the Clerk's office at least three working days before the meeting, as required by Virginia Code 2.2-3707. The notice gives the date, time, and location. The agenda and packet are posted here as soon as they go to Council members. Public hearings are also advertised as the law requires for that subject.

**Public comment.** Each regular meeting includes a public comment period. Sign in with the Clerk before the meeting starts. Speakers have [3] minutes. Comments may also be sent to [email] or mailed to PO Box 42 by [noon the day of the meeting] and will be given to Council. Draft minutes are posted within [10] working days and marked as drafts until approved.

**Accommodations.** Contact the ADA Coordinator at [phone] or 711 at least [48 hours] ahead for an interpreter or other accommodation.

## Build notes for the demo

- Viewport: `width=device-width, initial-scale=1`. Never set maximum-scale or user-scalable.
- `<html lang="en">`; Spanish blocks use `lang="es"`.
- Footer: "© [year] Town of Keysville, Virginia", address, phone, email, 711, and the legal links above.
- No analytics or third-party scripts until the Privacy Statement is updated.
- Block author archives, REST user listing and xmlrpc on the new install.
- Every page: zero errors in the Nu HTML Checker and CSS Validator, WCAG 2.2 AA pass at 320 to 430 px and at 400 percent zoom.
- Town must confirm every bracketed value before launch.
