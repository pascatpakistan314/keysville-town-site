# Forms inventory: what the town offers as PDF/Word today

Source files were downloaded from keysvilleva.gov on 2026-10-24 into
`source-forms/` and read with pdftotext (text PDFs), tesseract (scanned
PDFs: business license, zoning permit, broadband survey) and the raw
`word/document.xml` of the two .docx files. Nothing was executed.

Department keys used by the demo: `clerk`, `billing`, `works`, `manager`.

Rule of thumb for sensitive fields: the demo never collects a Social Security
number, date of birth, driver's license number or bank account online. Where
the paper form asks for one, the online form says so and tells the person to
bring it to Town Hall when they finish the application there.

---

## 1. Zoning Permit Application

- Source: https://keysvilleva.gov/wp-content/uploads/2024/09/ZONING-PERMIT-APPLICATION.pdf (scanned, 1 page)
- Online form id: `zoning-permit`; routes to `manager` (the form is signed off by the Zoning Administrator; the demo has no zoning department key) [verify who the Zoning Administrator is]
- Fee stated on the form: "FEE: $35.00 (Required with Application)"
- Attachments stated: "two (2) drawings of the plot plan showing the lot dimensions, building location on the lot, building dimensions and building plans. (One copy will be retained by the Town, the other will be returned.)"
- Fields:
  - Owner: owner's name, telephone, address
  - Lot: size and location of lot, zoning of lot
  - Application for: New Construction / Improvement / Demolition / Other (with text)
  - Building will be used for
  - Contractor: name, address, telephone
  - Contract price or value
  - Construction: exterior, interior, roofing, heating
  - General features: number of bathrooms, rooms, stories; foundation type; floor type; porch number; size (L × W, square feet); garage/carport (L × W, square feet)
  - Certification: "I hereby certify that the above is true and correct to the best of my knowledge and belief." Applicant's signature, date
  - Office use only block (does/does not meet ordinance, approved/not approved, comments, Zoning Administrator signature): not shown online; staff mark it in Town Desk
- Sensitive fields: none (no SSN or ID numbers). Contract value is a business figure; collected as entered.
- Where it goes: Town Hall, 120 J Street (the form does not say how to return it) [verify].

## 2. 2026 Business License Application

- Source: https://keysvilleva.gov/wp-content/uploads/2026/08/2026-BUSINESS-LICENSE-APPLICATION.pdf (scanned, 1 page)
- Online form id: `business-license`; routes to `clerk` (the paper form says return to "Treasurer, Town of Keysville, P.O. Box 42"; the demo has no treasurer key) [verify the treasurer is reached through the clerk's office]
- Fees stated (quoted exactly): "License Fee is based on Gross Receipts/Sales from January 1, 2025 through December 31, 2025."
  - Retail Merchant: $0.04 per $100 or $30 whichever is greater
  - Wholesale Merchant: $0.02 per $100 or $30 whichever is greater
  - Personal Service / Repair Service: $0.04 per $100 or $30 whichever is greater
  - Contractor: $0.04 per $100 or $30 whichever is greater
  - Financial / Real Estate / Professional Service: $0.04 per $100 or $30 whichever is greater
  - Peddler: $50.00 per year
  - Examples on the form: $50,000 gross = 500 × $0.04 = $20.00, license due $30.00; $100,000 gross = 1,000 × $0.04 = $40.00, license due $40.00
- Deadline stated: "ALL LICENSES ARE DUE AND PAYABLE BY March 1st OF EACH YEAR. ANY PERSON DOING BUSINESS WITHOUT HAVING PURCHASED SUCH LICENSE AFTER March 1st, 2026; SHALL PAY A PENALTY TO THE TOWN OF 10% OF THE LICENSE TAX OTHERWISE PRESCRIBED BEFORE SUCH LICENSE IS ISSUED."
- Attachments stated: "A tax form showing proof of gross receipts/sales may be required."
- Fields: business name, complete mailing address, complete physical address, phone, email; type of business (one of the six rows above); gross receipts/sales for the row that applies; tax due (computed); oath ("I, the undersigned applicant does hereby swear (or affirm) that the foregoing figures and statements are true and correct to the best of my knowledge and belief. The Town is authorized to summon my records for investigation as to the accuracy of this report."); date; applicant signature; applicant printed name
- Sensitive fields: gross receipts are a business tax figure, collected as entered. No SSN/EIN asked. Payment is not taken online in the demo (the amount due is shown; pay at Town Hall or by mail) [verify whether the town wants Paymentus for license fees].

## 3. Water and Sewer Service Application

- Source: https://keysvilleva.gov/wp-content/uploads/2026/08/WATER-SEWER-APPLICATION-06262026.docx (Word, 1 page)
- Online form id: `water-service`; routes to `billing`
- Fees stated (quoted): "I UNDERSTAND THAT A DEPOSIT OF $100.00 WILL BE REQUIRED UPON APPLICATION FOR SERVICE, AND A $35.00 CONNECTION FEE IS REQUIRED PRIOR TO HAVING THIS WATER/SEWER SERVICE CONNECTED IN MY NAME." Town-use block: "Fee of $135.00 Paid".
- Agreement: "I AGREE TO ABIDE BY THE BILLING POLICY OF THE TOWN OF KEYSVILLE AND TO PAY FOR ALL CHARGES FOR WATER AND SEWER CONSUMPTION."
- Fields: date; Social Security number; name(s); mailing address; service address; email; telephone; rent or own; owner's name and telephone; employer, employer's address, employer's telephone; customer signature
- Office use: witness initials, date to be turned on, town account number, fee paid (Town Desk only)
- Sensitive fields:
  - Social Security number: the full number is NOT collected online. The online form has one optional masked field for the last four digits (exactly four digits accepted, with a line saying why). The full number, if the town still needs it, is given in person at Town Hall [verify that the town still requires the SSN and why; Va. Code § 2.2-3808 requires a written notice on the form if it is kept].
  - Employer details: on the paper form; collected online as optional text (name and phone only).
- Where it goes: Town Hall; service is connected after the $135.00 is paid in person [verify payment options].

## 4. 2026 Christmas Parade Application (Official Entry & Registration Form)

- Source: https://keysvilleva.gov/wp-content/uploads/2026/10/2026-Christmas-Parade-Application.pdf (text PDF, 2 pages). The 2025 form at https://keysvilleva.gov/wp-content/uploads/2025/10/2025-Parade-Application.docx is the same form for last year and maps to the same online form.
- Online form id: `parade-entry`; routes to `clerk` (the form says "EMAIL TO: dhaley@keysvilleva.gov"; the demo does not show personal email addresses) [verify who D. Haley is and the title to show]
- Deadlines stated: "RETURN BY: Thursday, November 12, 2026"; music for the judges' stand "Deadline: November 20, 2026" (emailed to Zack McKinney at support@zackmckinney.com or delivered to 415 Railroad Ave, Keysville, Monday to Friday 9:00 am to 5:00 pm) [verify: third-party contact; shown as a bracketed line in the demo]
- Fee: none stated
- Attachments stated: "CRITICAL REQUIRED ATTACHMENT: You must attach a typed or clearly hand-printed description of your entry for the MC and Judges to read as you pass by. Without this description attached, your entry will strictly not be judged." The online form takes this as a text box instead of an attachment.
- Fields:
  - Applicant and organization: organization name, complete address, contact person, phone, email, want judged? (yes/no)
  - Entry type and specifications: total length of entry in feet (floats: front bumper of towing vehicle to end of trailer including the tongue); entry type, one of: Band / Marching Unit, Civic Float, Business Float, School Float, Religious Float, Emergency Vehicle, Show Vehicle, Tractor / Big Rig, Motorcycle / ATV / Side-by-Side
  - Music and MC announcer description (text)
  - Liability disclaimer and agreement (quoted on the form), authorized signature, date; "Parent/Guardian must sign if participant is under 18"
- Sensitive fields: none. The under-18 rule is handled with a yes/no question and a parent/guardian name field.

## 5. Standard Application for Employment

- Source: https://keysvilleva.gov/wp-content/uploads/2026/06/Standard-Application.pdf (text PDF, 2 pages)
- Online form id: `employment`; routes to `manager`
- Fee: none. Deadline: none on the form (set per job posting).
- Attachments: "You may attach a résumé, but all questions must be answered." Online: file name only (no upload in the demo).
- Fields:
  - Position applying for
  - Personal data: name (last, first, middle); street and/or mailing address, city, state, zip; home, business, cellular telephone; date you can start work; salary desired; high school diploma or GED (yes/no)
  - Position information: hours (full time, part time); shifts willing to work (days, evenings, swing, graveyard, weekends); status (regular, temporary)
  - Authorized to work in the U.S. on an unrestricted basis (yes/no)
  - Ever convicted of a felony (yes/no, "Convictions will not necessarily disqualify an applicant"), explain
  - Told the essential functions / viewed the job description (yes/no); can perform them with or without reasonable accommodation (yes/no)
  - Qualifications: up to three schools (name, degree, address/city/state)
  - Special skills (text)
  - References: three (name, address/city/state, phone, relationship)
  - Work history: up to four jobs (job title, start, end, company, supervisor, phone, city, state, zip, duties, reason for leaving, starting salary, ending salary); may we contact your present employer (yes/no/N/A)
  - Certification and at-will acknowledgement (quoted), signature, date
- Sensitive fields:
  - No SSN, DOB or driver's license on this form. Good.
  - Felony conviction question: kept because it is on the town's form, with the form's own wording; [verify with the town attorney that the question stays on the application rather than moving to the interview stage].
  - Salary history (starting/ending salary per job): kept as optional, [verify whether the town wants to keep asking].
  - Online: the form says applications are seen only by the hiring staff and are not public, [verify the records retention and FOIA treatment of employment applications, Va. Code § 2.2-3705.1(1)].

## 6. Broadband Internet Survey (2024)

- Source: https://keysvilleva.gov/wp-content/uploads/2024/11/Broadband-Internet-Survey.pdf (scanned, 8 pages). Regional survey branded Virginia DHCD / Commonwealth Regional Council "Imagine Virginia's Heartland".
- Online form id: `broadband-survey`; routes to `manager` (regional planning contact) [verify whether the survey is still open; it was posted November 2024 with the Regional Broadband Affordability and Adoption Plan meetings]
- Fee: none. Deadline: none stated. "This survey will take approximately 10-15 minutes to complete. Your responses are completely confidential."
- Fields: 40 questions. The online version keeps questions 1 to 29 (internet access, cost, use, barriers, digital skills, training interest) and the non-sensitive demographics (30 zip code, 31 age range, 34 town or county, 36 employment status, 37 household size).
- Sensitive fields: gender (32), Hispanic/Latino origin (33), race (35), household income (38), education (39), disability (40) are on the paper survey. The demo does not ask them online; a note says the full paper survey has a demographic section and where to get it. [verify with the survey sponsor whether those questions are still needed and under what confidentiality statement, since the town site is subject to FOIA]

---

## Not forms (left out on purpose)

- Job postings and the Town Manager invitation to apply are notices, not fillable forms; they link to the employment application.
- Flyers, minutes, ordinances, reports: no fields.

## Items that need the town's word before launch

1. Who receives each online submission (clerk, treasurer, zoning administrator, billing, manager) and the response time to promise.
2. Whether a typed name and date is accepted as the applicant's signature for each form (Virginia's Uniform Electronic Transactions Act, Va. Code § 59.1-479 et seq., lets a locality accept it, but the town decides).
3. Whether the SSN on the water application is still required and the notice that must accompany it.
4. Payment: fees are quoted from the forms; the demo takes no payment.
5. Whether the broadband survey is still open.
