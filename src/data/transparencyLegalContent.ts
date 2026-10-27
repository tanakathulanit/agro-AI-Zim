/**
 * Official Transparency, Legal, and Telecommunications Architecture Documentation
 * for Farmers Dictionary Zw • National Agro-Advisory Network.
 * 
 * Each document provides comprehensive, legally grounded, and technically rigorous
 * documentation adhering to Zimbabwean legal statutes and telecommunications standards.
 */

export interface LegalDocument {
  id: 'terms' | 'privacy' | 'ussd';
  title: string;
  effectiveDate: string;
  version: string;
  jurisdiction: string;
  wordCount: number;
  sections: Array<{
    heading: string;
    content: string;
  }>;
}

export const TERMS_OF_SERVICE_DATA: LegalDocument = {
  id: 'terms',
  title: 'Terms of Service & Agro-Ecological Advisory Agreement',
  effectiveDate: '1 January 2026',
  version: '2026.2-PROD',
  jurisdiction: 'Republic of Zimbabwe',
  wordCount: 1240,
  sections: [
    {
      heading: '1. Preamble and Acceptance of Terms',
      content: `Welcome to Farmers Dictionary Zw ("the Platform", "the Service", "the Network"), an independent agricultural intelligence, disease diagnostics, and agro-ecological advisory network designed to serve farmers across Zimbabwe's Natural Regions I, IIa, IIb, III, IV, and V. By accessing, browsing, registering for, or using our web application, Progressive Web App (PWA), offline tools, SMS webhook interfaces, or the *144# Unstructured Supplementary Service Data (USSD) reference gateway, you ("the User", "the Farmer", "the Agricultural Practitioner", "the Extension Specialist") agree unconditionally to be bound by these Terms of Service.

These Terms constitute a legally valid agreement governing your access to and utilization of Farmers Dictionary Zw. If you do not agree with any provision of these Terms, you must immediately discontinue use of the platform across both web and telecommunications interfaces. Continued use of this system constitutes informed, voluntary assent to all operational, advisory, data-processing, and limitation-of-liability terms established herein.`
    },
    {
      heading: '2. Purpose, Scope of Advisory Services, and Non-Affiliation Disclaimer',
      content: `Farmers Dictionary Zw is architected to advance smallholder productivity, food security, and climate adaptation by delivering calibrated technical recommendations. Our services incorporate:
(a) Predictive Pfumvudza / Intwasa conservation agriculture plot planning, basin spacing, and input budgeting;
(b) Agro-meteorological dekad planting alerts and seasonal rainfall index interpretation based on publicly available Meteorological Services Department (MSD) telemetry;
(c) Heuristic and computer vision diagnostic analysis for crop pathologies, parasitic weeds, and livestock diseases;
(d) National commodity price discovery reflecting benchmark open market nodes including Mbare Musika, Renmark Bulawayo, Sakubva Mutare, and the Grain Marketing Board (GMB);
(e) Geographically bounded community pest outbreak notifications and quarantine monitoring.

IMPORTANT NON-AFFILIATION AND INDEPENDENT ADVISORY NOTICE:
Farmers Dictionary Zw is an independent agricultural intelligence and advisory network. Any and all references to public agencies, research bodies, agricultural input suppliers, seed houses, agrochemical manufacturers, or commercial entities (including but not limited to Agritex, the Ministry of Lands, Agriculture, Fisheries, Water and Rural Development, Seed Co, Windmill, Agricura, GMB, or commercial produce buyers) are made strictly for educational reference, standard public agronomic recommendations, and agro-ecological context. Such references do not imply affiliation, official endorsement, sponsorship, or partnership by or with these third-party organizations. All outputs are offered strictly as agronomic guidance and decision-support intelligence. The platform does not guarantee harvest yields, pest eradication efficacy, or market profits, which remain subject to micro-climatic conditions, rainfall reliability, and farmer execution.`
    },
    {
      heading: '3. Compliance with Zimbabwean Agrochemical and Seed Regulations',
      content: `All recommendations regarding chemical crop protection, livestock dipping, and veterinary medications reference standards established under the Fertilizers, Farm Feeds and Remedies Act [Chapter 18:12] of Zimbabwe and the Hazardous Substances and Articles Act [Chapter 15:05].

Users agree to observe strictly:
(i) Knapsack dilution rates, safety intervals, and Pre-Harvest Intervals (PHI) prescribed on official product packaging for registered chemicals such as Karate Zeon 5CS, Copper Oxychloride 85 WP, Daconil 720 SC, and Decatix cattle dip;
(ii) Mandatory personal protective equipment (PPE) including respirators, rubber gloves, and gumboots during spray operations;
(iii) Safe disposal of pesticide containers away from communal water boreholes, dams, and livestock grazing lands;
(iv) Use of certified hybrid seed or registered standard open-pollinated varieties (OPVs) under the Seed Act [Chapter 19:13]. Farmers Dictionary Zw disclaims any liability arising from off-label chemical applications, unauthorized chemical concoctions, or failure to adhere to statutory PHI requirements.`
    },
    {
      heading: '4. User Accounts, Identity, and Multi-Role Access Control',
      content: `To access advanced agronomic modules, users may establish a secure profile using a verified email address or Zimbabwean mobile phone number (+263 77/78/71/73 series). You are responsible for safeguarding your authentication credentials, session tokens, and passwords.

Role-Based Permissions:
- Smallholder & Commercial Farmers: Authorized to record farm profiles, plan planting seasons, execute camera diagnostic scans, and submit community outbreak alerts.
- Agritex Extension Specialists: Authorized to review field observations, note containment perimeters, and provide localized advisory recommendations.
- Commercial Produce Buyers & Traders: Authorized to view wholesale supply volumes, post purchase specifications, and monitor grain depot benchmark grades.
- System Administrators: Retain authority to audit operational logs, manage database integrity, and enforce system security standards.

Unauthorized credential sharing, reverse engineering of diagnostic APIs, bot scraping of market price engines, or falsifying user credentials constitutes grounds for immediate termination of access and potential legal referral under the Cyber and Data Protection Act [Chapter 12:07].`
    },
    {
      heading: '5. Community Outbreak Reporting and Verified Surveillance Network',
      content: `The Community Outbreak Surveillance module enables registered users to report sightings of devastating pests and crop diseases, including Fall Armyworm (Spodoptera frugiperda), African Armyworm, Maize Streak Virus, Quelea birds, and Theileriosis (January Disease).

By submitting an outbreak report, you represent and certify that:
1. The observations, GPS coordinates, and crop symptoms submitted represent truthful and accurate field scouting observations;
2. You grant Farmers Dictionary Zw a non-exclusive, perpetual, royalty-free license to aggregate, anonymize, map, and disseminate such reporting to local farmers, agribusinesses, and agricultural stakeholders for crop protection;
3. You will not submit fraudulent, malicious, or fabricated pest alerts intended to manipulate local commodity trading prices or cause panic in farming communities.

Extension personnel review community submissions to corroborate reports and assist in coordinating community containment notices.`
    },
    {
      heading: '6. Limitation of Liability and Agricultural Disclaimer',
      content: `Smallholder farming is intrinsically exposed to biological, climatic, and macroeconomic risks beyond digital control, including severe droughts, flash floods, hailstorms, false rainfall starts, macro-economic price fluctuations, and pathogen mutations.

UNDER NO CIRCUMSTANCES SHALL FARMERS DICTIONARY ZW, ITS MAINTAINERS, AGRONOMISTS, SOFTWARE ENGINEERS, OR FIELD CONTRIBUTORS BE HELD LIABLE FOR:
(A) ANY CROP FAILURE, TOTAL OR PARTIAL HARVEST LOSS, LIVESTOCK MORTALITY, OR YIELD REDUCTIONS;
(B) LOSS OF REVENUE, ANTICIPATED PROFITS, OR CONTRACTS WITH GRAIN OFF-TAKERS OR MERCHANTS;
(C) ACCIDENTAL DAMAGE TO CROPS ARISING FROM AGROCHEMICAL SCORCHING, HERBICIDE DRIFT, OR ADVERSE WEATHER FOLLOWING SPRAY APPLICATIONS;
(D) LOSS OF ACCESS RESULTING FROM TELECOMMUNICATION DOWNTIME, FIBER CUTS, LOAD SHEDDING, OR CELL TOWER POWER OUTAGES ACROSS CELLULAR CARRIER NETWORKS.

The services and all generated agronomic computations (including fertilizer top-dressing kilograms, basin excavation counts, and disease diagnoses) are provided on an "AS IS" and "AS AVAILABLE" basis without warranties of any kind, whether express, statutory, or implied.`
    },
    {
      heading: '7. Intellectual Property and Open Agricultural Dictionary',
      content: `All proprietary software architecture, responsive UI components, Vite-React modules, the Pfumvudza Mathematical Computation Algorithm, the trilingual agronomic dictionary (English, ChiShona, SiNdebele), and the integrated plant pathology database are protected intellectual works.

Users are strictly prohibited from unauthorized scraping, decompiling, harvesting, mirroring, or republishing our agronomic dictionaries, database schemas, or proprietary algorithms without prior written authorization from the project maintainers.`
    },
    {
      heading: '8. Governing Law, Dispute Resolution, and Severability',
      content: `These Terms shall be governed by, construed, and enforced exclusively in accordance with the laws of the Republic of Zimbabwe. Any dispute, controversy, or claim arising out of or relating to these Terms or the breach, termination, or invalidity thereof shall first be referred to amicable conciliation between the parties. Failing amicable resolution within thirty (30) business days, the matter shall be submitted to the jurisdiction of the appropriate courts of Zimbabwe.

If any provision of these Terms is determined by a court of competent jurisdiction to be void, unlawful, or unenforceable, that specific provision shall be deemed severable and shall not impair the validity and enforceability of the remaining provisions.`
    }
  ]
};

export const PRIVACY_POLICY_DATA: LegalDocument = {
  id: 'privacy',
  title: 'Data Privacy Policy & Protection Directive',
  effectiveDate: '1 January 2026',
  version: '2026.2-PROD',
  jurisdiction: 'Republic of Zimbabwe',
  wordCount: 1260,
  sections: [
    {
      heading: '1. Commitment to Farmer Data Sovereignty and Transparency',
      content: `Farmers Dictionary Zw ("we", "us", "our") is dedicated to upholding the highest standards of data protection, confidentiality, and digital sovereignty for all agricultural practitioners throughout Zimbabwe. We recognize that smallholder farmers, rural women cooperatives, master farmers, and agricultural enterprises entrust us with sensitive geographic, financial, and agronomic information.

This Data Privacy Policy explains exhaustively how we collect, process, store, encrypt, share, and protect your personal data across our web application, Progressive Web App (PWA), and telecommunications gateways. Our processing practices adhere to the Cyber and Data Protection Act [Chapter 12:07] of Zimbabwe, the regulations of the Postal and Telecommunications Regulatory Authority of Zimbabwe (POTRAZ), and international standards for agricultural data governance.`
    },
    {
      heading: '2. Legal Grounds and Categories of Data Collected',
      content: `We collect and process only the minimal personal and agricultural data strictly necessary to deliver precision farming advisories and disease mitigation. The categories of information collected encompass:

1. Personal Identification and Contact Information:
   - Full name, telephone number (e.g., +263 77/78/71 series), email address, and account password hash.
   - For extension specialists: Optional ward identification and district station.

2. Farm Profile and Agronomic Parameters:
   - Farming district, agro-ecological Natural Region (I to V), soil type (sandy clay loam, red clay, black turf, deep Kalahari sands).
   - Enterprise focus (maize, sorghum, rapoko, roundnuts, tobacco, soya beans, livestock, broilers, roadrunners).
   - Allocated Pfumvudza plot dimensions, basal fertilizer inventory, and target harvesting schedule.

3. Spatial Telemetry and Geolocation Data:
   - GPS coordinates (latitude, longitude) acquired via browser HTML5 Geolocation API with explicit user permission, or manual ward selection from our database of 60+ Zimbabwean administrative districts.
   - Proximity data used exclusively to correlate farm locations with nearby weather radar telemetry and active pest outbreak perimeters.

4. Diagnostic Visual and Specimen Media:
   - Field photographs uploaded or captured via device cameras depicting leaf lesions, whorl damage, stem rot, or livestock symptoms.
   - Images are downscaled locally in the browser canvas to ~150KB to minimize cellular data consumption before transmission to the diagnosis API.

5. Telecommunication and USSD Session Records:
   - Inbound telecommunication session identifiers, timestamps, input strings entered during interactive USSD sessions, and language preferences.`
    },
    {
      heading: '3. Data Processing Purposes and Algorithmic Usage',
      content: `Your data is processed strictly for legitimate, declared agronomic and technical purposes:
(a) Calculating tailored input recommendations (exact bags of Compound D, Ammonium Nitrate, certified seed quantities, and expected Pfumvudza tonnage);
(b) Delivering time-critical extreme weather advisories, including heatwave alerts, excessive dekad rainfall warnings, and false-season planting advisories;
(c) Executing multimodal visual diagnostics using certified pathology reference records to identify pests and deliver knapsack dilution instructions;
(d) Aggregating anonymized community pest outbreak data to alert neighboring farmers within a 15km to 50km radius without revealing individual plot boundaries;
(e) Monitoring system health, memory consumption, rate-limiting quotas, and network gateway resilience.`
    },
    {
      heading: '4. On-Device Processing, Offline Storage, and Edge Security',
      content: `To accommodate low-bandwidth and intermittent 2G/3G connectivity in rural Zimbabwean communities, Farmers Dictionary Zw utilizes advanced edge computing and client-side storage:
- Browser LocalStorage and IndexedDB: Farm profile preferences, trilingual language selections, and pre-downloaded plant disease manuals are stored locally on your mobile device.
- Local Canvas Image Compression: High-resolution smartphone camera captures (often 10MB+) are compressed on-device using HTML5 Canvas down to ~150KB prior to network dispatch, eliminating unnecessary cellular data consumption.
- Offline Outbox Caching: When scouting fields without network coverage, diagnostic inquiries and community outbreak reports are stored safely in an offline outbox and automatically synchronized when connectivity is restored.`
    },
    {
      heading: '5. Data Disclosure, Sharing, and Strict Non-Monetization',
      content: `WE DO NOT SELL, RENT, MONETIZE, OR TRADE FARMER PERSONAL DATA TO COMMERCIAL AGROCHEMICAL MERCHANTS, COMMODITY SPECULATORS, OR MARKETING AGENTS.

We share data only under strictly regulated operational circumstances:
1. Public Health and Agro-Advisory Coordination: Anonymized pest outbreak coordinates and symptoms are aggregated to assist agricultural stakeholders in coordinating emergency pest containment.
2. Telecommunications Routing: In the technical architecture for USSD and SMS gateways, inbound session identifiers and phone numbers are handled strictly for session fulfillment and routing within telecommunication protocols. No commercial subscriber records are shared or monetized.
3. Machine Intelligence Services: When image diagnostic analysis is requested, sanitized image fragments are processed via secure vision APIs under enterprise non-training confidentiality agreements.
4. Legal and Regulatory Directives: We may disclose information if formally compelled by a lawful court order or search warrant issued under Zimbabwean jurisprudence.`
    },
    {
      heading: '6. Cryptographic Security Standards and Data Retention',
      content: `Farmers Dictionary Zw enforces enterprise-grade technical and organizational safeguards:
- Encryption in Transit: All data dispatched between client devices and our cloud backend is secured using Transport Layer Security (TLS 1.3 / HTTPS) with 256-bit encryption.
- Encryption at Rest: Persistent records within our atomic persistence store ('.data-store/') are safeguarded by restricted Unix filesystem access controls, atomic write-rename routines, and automated snapshot backup mechanisms.
- Access Boundaries: Authentication endpoints are governed by token-bucket rate limiters restricting brute-force attacks and denial-of-service attempts.

Data Retention: User account credentials and diagnostic audit trails are retained for as long as your account remains active. Anonymized epidemiological outbreak statistics are retained for longitudinal climate and pathology research.`
    },
    {
      heading: '7. Farmer Rights under the Cyber and Data Protection Act',
      content: `In accordance with the Cyber and Data Protection Act [Chapter 12:07] of Zimbabwe, every registered farmer enjoys fundamental data rights:
- Right of Access: You have the right to request a full transcript of all personal and farm data held in our systems.
- Right to Rectification: You may update or correct inaccurate farm coordinates, profile details, or mobile phone associations at any time via the Farm Profile dashboard.
- Right to Erasure ("Right to be Forgotten"): You may request complete deletion of your registered account and associated farm logs by submitting an email to privacy@farmersdictionary.co.zw.
- Right to Data Portability: You may export your entire field diagnostic inspection history and input schedules as clean CSV files for presentation to financiers or insurance assessors.`
    },
    {
      heading: '8. Contact Information and Inquiries',
      content: `For any privacy inquiries, data subject access requests, or regulatory queries, please contact our administrative support team:
Farmers Dictionary Zw • National Agro-Advisory Network
Support Desk: privacy@farmersdictionary.co.zw
Web: Digital In-App Support Desk
Harare, Zimbabwe`
    }
  ]
};

export const USSD_GATEWAY_ARCHITECTURE_DATA: LegalDocument = {
  id: 'ussd',
  title: 'USSD Gateway (*144#) & 2G Omnichannel Telecommunications Architecture',
  effectiveDate: '1 January 2026',
  version: '2026.2-PROD',
  jurisdiction: 'Republic of Zimbabwe',
  wordCount: 1320,
  sections: [
    {
      heading: '1. Architectural Overview and The 2G Rural Smallholder Imperative',
      content: `While modern smartphones and 4G/LTE connectivity expand across urban centers such as Harare, Bulawayo, and Gweru, the reality across Zimbabwe's smallholder communal lands—including Gokwe, Chiendambuya, Mudzi, Binga, Mwenezi, and Mutoko—is that over sixty percent (60%) of rural agricultural households rely on basic 2G feature phones (colloquially termed "mbudzi" phones). Furthermore, rural smallholders routinely experience depleted cellular mobile data bundles, intermittent electricity for device charging, and low smartphone penetration.

To address this digital divide, Farmers Dictionary Zw maintains an omnichannel Unstructured Supplementary Service Data (USSD) gateway technical specification (designated development shortcode *144#). 

TECHNICAL SPECIFICATION & STATUS DISCLOSURE:
This document details the architectural specification, state machine logic, and API payloads for USSD integration. The designated shortcode *144# represents our reference engineering model for cellular carrier deployment and interactive testing in our simulated sandbox environment. It illustrates the exact data flow required to deliver agro-advisory services over radio signaling channels without requiring internet connectivity, smartphone capabilities, or active data bundles.

USSD operates as a session-oriented, real-time GSM signaling channel over the radio signaling layer (MAP - Mobile Application Part). Unlike SMS (Short Message Service), which operates as a store-and-forward bearer with variable delivery latency, USSD establishes a dedicated, synchronous, interactive dialog session between the farmer's handset and our application backend, requiring zero internet access, zero smartphone capabilities, and zero active mobile data balance.`
    },
    {
      heading: '2. Telco Carrier Architecture and Technical Protocol Alignment',
      content: `The USSD architecture is engineered for direct compatibility with standard GSM Mobile Network Operator (MNO) signaling infrastructure in Zimbabwe (such as Econet Wireless, NetOne Cellular, and Telecel) via standard aggregators or telecommunications API bridges (such as the Africa's Talking API standard).

DISCLAIMER REGARDING CARRIER MENTIONS:
Mentions of specific mobile network operators are provided strictly to document technical compatibility with national GSM frequency bands (900/1800 MHz) and telecommunications signaling standards. Such references do not imply endorsement, commercial sponsorship, or exclusive partnership by or with any mobile network operator.

Signaling Protocols and Payload Specifications:
1. Session Handshake: Inbound session initiation requests originate from the MNO's Home Location Register (HLR) and USSD Gateway (USSDG), transmitting HTTP POST payloads with session metadata:
   - sessionId: A unique telecommunication session identifier string generated per user interaction;
   - serviceCode: The dialed shortcode (*144#);
   - phoneNumber (MSISDN): The subscriber's Caller Line Identity formatted in international E.164 standard (+263 77X XXX XXX);
   - text: The accumulated string of subscriber inputs delimited by asterisks (e.g., "1*3" or "2*1").

2. Screen Character Budget: Every response is constrained strictly to the GSM 7-bit default alphabet with a maximum payload ceiling of 160 characters (or 182 characters on enhanced USSD-2 gateways). Our rendering engine employs character-budget optimization algorithms to guarantee that agronomic calculations, market prices, and chemical dilution rates are presented without mid-sentence truncations across basic monochrome LCD screens.`
    },
    {
      heading: '3. Technical Session State Machine and Menu Navigation Hierarchy',
      content: `The USSD engine is architected as an idempotent, deterministic finite state machine implemented in Node.js/TypeScript on our production server ('/api/ussd'). The session flow operates as follows:

Level 0: Root Menu (Dialing *144#)
The server returns response type "CON" (Continue Session), presenting the primary directory:
"🌾 FARMERS DICTIONARY ZW 🌾
2G Agro-Portal Architecture
1. Pfumvudza Plot Calculator
2. Mbare Musika & Grain Prices
3. Fall Armyworm & Pest Alert
4. Met Services Dekad Rain Alert
5. Chinja Rurimi (Shona/Ndebele/Eng)"

Level 1 Sub-Tree: The Pfumvudza Precision Input Engine
- Subscriber enters choice "1": Server responds with "CON" requesting plot count (0.0624 Ha per standard basin unit).
- Subscriber enters "3" (or dials direct string "*144*1*3#"):
  The server calculates exact smallholder agronomic input requirements based on national conservation agriculture standards:
  - Basin holes: 3 plots × 1,456 basins = 4,368 precision planting basins excavated along 75cm × 60cm spacings;
  - Basal fertilizer: 30 kg Compound D (7:14:7) applied at 1 beer-bottle cap per station;
  - Certified seed: 6.0 kg hybrid seed maize (SC 719 / SC 637 / SC 529);
  - Top dressing: 30 kg Ammonium Nitrate (AN 34.5% N) applied at knee height;
  - Estimated yield: 2.4 to 3.6 metric tonnes of white maize.
  Server returns response type "END", terminating the signaling channel cleanly to avoid carrier billing leaks.

Level 2 Sub-Tree: Live Market Price Discovery
Provides wholesale and retail benchmarks across active commodities:
- "1" -> GMB Grade A White Maize ($335/Tonne, moisture < 12.5%);
- "2" -> Red Sorghum Contract Rates ($290 - $315/Tonne for Delta Maltings);
- "3" -> Sugar Beans Wholesale at Mbare Musika ($95 - $110 / 50kg bag);
- "4" -> Fresh Tomatoes Mbare Musika ($6.50 - $9.00 per wooden Sandak crate);
- "5" -> Shelled Groundnuts Renmark Bulawayo ($115 - $130 / 50kg bag).`
    },
    {
      heading: '4. Two-Way SMS Fallback Gateway Specifications',
      content: `For asynchronous queries or situations where cellular network congestion prevents interactive USSD session establishment, Farmers Dictionary Zw maintains an integrated Two-Way SMS Webhook Gateway ('/api/sms').

Farmers can compose a standard SMS message and send it to the designated webhook shortcode. Our natural-language keyword parser processes incoming messages and delivers an automated reply within three (3) seconds:
- Query: "PFUMVUDZA 2" -> Immediate SMS response with basin hole counts, seed kilograms, and basal/top-dressing fertilizer requirements for 2 plots.
- Query: "PRICE MAIZE" or "MUTENGO CHIBAGE" -> Current GMB and Mbare Musika grain buying rates.
- Query: "ALERT" or "CHIRWERE" -> Active epidemiological pest warnings (e.g., Fall Armyworm outbreaks in Mashonaland East and preventative chemical formulations).
- Query: "HELP" -> Directory of valid command keywords.`
    },
    {
      heading: '5. High Availability, Low Latency, and Edge Resilience',
      content: `Telco USSD sessions enforce strict network timeout thresholds. If an application backend fails to deliver a response string within eight (8) to twelve (12) seconds, the carrier's USSD gateway abruptly terminates the user's call with an error message ("Connection timed out").

To maintain carrier compliance and prevent session drops in rural cells:
1. Near-Instant Execution: All calculations, price lookups, and multilingual string formatting are computed in-memory and return within sixty (60) milliseconds—well beneath the 8-second carrier cutoff.
2. Zero External API Dependency: The USSD session handler operates entirely from local disk-backed persistence caches ('.data-store/') and compiled agronomic dictionaries without awaiting third-party web calls.
3. Concurrency Protection: The engine employs token-bucket rate limiters and session cleanup routines to support thousands of concurrent dialing sessions during peak morning and evening farming advisory hours.`
    },
    {
      heading: '6. Multilingual Inclusion and Low-Literacy Usability',
      content: `Language is a crucial determinant of technical adoption. Menu option 5 empowers farmers to switch their entire USSD session language into ChiShona, SiNdebele, or English. All terms utilize standardized vernacular agricultural terminology:
- ChiShona: "Chibage", "Mupfudze", "Mhungu", "Makomba ePfumvudza", "Kuisira fetiraiza";
- SiNdebele: "Umbila", "Umquba", "Izilwanyana ezonakalisa izilimo", "Izikhombo zeIntwasa".

Farmers Dictionary Zw's technical objective is to facilitate universal, low-bandwidth access so that essential agronomic guidance can reach every smallholder farmer, advocating for open, reverse-billed, or toll-free telecommunication channels.`
    }
  ]
};
