/**
 * Kiosk content. Edit this file to change what visitors see.
 *
 * The home screen shows one tile per entry in `categories`. Each tile lists
 * the products (sub-categories) whose `category` matches its `id`; tapping a
 * chip opens that product, tapping the tile opens the first one.
 *
 * - `image` paths are relative to /public. Drop a 16:10-ish JPG in
 *   /public/products/ and reference it here. If the file is missing the
 *   kiosk shows a styled placeholder instead of a broken image.
 * - `video` (optional) is a short muted MP4 loop; `image` becomes its poster.
 *   Cover media sources: A&D / Mesutronic product photos (OEM partners),
 *   Pexels photos and Mixkit clips (both free for commercial use).
 * - `url` is the product's page on the website. The kiosk's QR codes do not
 *   use it: every product QR carries `brand.catalog`, or whichever link the
 *   admin has set at /admin.
 * - `tile` (categories only) controls the home-screen grid: `wide` tiles take
 *   7/10 columns, `narrow` 3/10, `half` 5/10, `full` 10/10. Rows must add up
 *   to 10.
 * - `partner` (optional) is the OEM whose technology the product is built on.
 *
 * The product screen is a deck of cards. What a product defines decides
 * which cards it gets:
 *
 * - Overview (always): `description`, `facts` (3–4 headline specs shown as
 *   small stat blocks) and, optionally, `applications` — a row of icon chips
 *   `{ icon, name }` for where the product is used.
 * - Key advantages: `advantages`, a list of `{ icon, title, points }` where
 *   each point is `{ lead, text }`. Four entries make a 2 × 2 grid.
 * - At a glance: `performance`, a list of `{ value, label, note }` shown as
 *   big figures on dark tiles. Keep `value` short (a number or one word).
 * - Range: `range`, a list of groups, each with `title` (optional) and
 *   `items` of `{ name, note, docs }`. Model codes, conveyor types, etc.
 *   `rangeLabel` names the card after what the list actually is: "Models",
 *   "Coil types", "Configurations", "Capabilities", "Features"... Products
 *   that leave it out get "What's included".
 * - Case studies: `caseStudies`, a list of `{ industry, title, video, image,
 *   challenge, solution, results }`. `industry` is the small tag above the
 *   title (customer or sector, e.g. "Jayanti Foods · Alwar"). `video`
 *   (optional) is a short muted MP4 loop and `image` its poster, or a plain
 *   photo when there is no clip; both live under /public/case-studies/ and
 *   a styled placeholder shows if the files are missing. `results` is up
 *   to three `{ value, label }` figures. Adds a "Case studies" card of
 *   tiles; tapping a tile opens the study full-screen with the clip large
 *   and the full story.
 *   Case-study media: site videos and photos supplied by SafeSurge
 *   (clips cut to ~9 s, muted, 720p) plus the Crimson Tech FMCG use-case
 *   deck for the vision descriptions.
 * - Documents: `docs`, a list of ids from `documents` below. Adds a
 *   "Documents" card listing the manufacturer's datasheets, brochures and
 *   manuals; tapping one opens it full-screen on the kiosk. A range item
 *   can also carry `docs: [ids]` to put a datasheet button on that model.
 *
 * Sources: aandd.jp (AD-4961 specs), aanddindia.in, mesutronic.de
 * (METRON / QUICKTRON), conveline.com, safesurge.co.in (product pages).
 */

export const brand = {
  name: 'SafeSurge',
  logo: '/safesurge.png',
  site: 'https://safesurge.co.in',
  // Default link behind every product QR code. Changeable live at /admin.
  catalog: 'https://safesurge-demo.s3.us-east-1.amazonaws.com/Safesurge+-+Catalog.pdf',
  tagline: 'Inspect. Convey. Automate.',
}

/**
 * Content for the About screen (#/about).
 *
 * The About page is a title, the head-office photo and a deck of cards the
 * visitor swipes through. A card has a `label` (used in the card index)
 * and one of: `text` + `stats`, `categories: true` (lists the home-screen
 * categories), `groups` of chips, or numbered `steps`.
 */
export const about = {
  company: 'Safesurge Inspection Technologies Pvt. Ltd.',
  eyebrow: 'About us',
  title: 'Inspection technology, engineered in India.',
  image: '/safesurge-images/hq.png',
  imageAlt: 'SafeSurge head office at IMT Manesar',
  cards: [
    {
      id: 'who',
      label: 'Who we are',
      text: 'An Indian industrial inspection and automation company, headquartered in IMT Manesar. We design, build and integrate quality inspection and end-of-line automation for food, FMCG, pharma, packaging and manufacturing plants.',
      stats: [
        { value: '500+', label: 'Installations' },
        { value: '5', label: 'Industries' },
        { value: 'ISO 9001', label: 'Certified' },
        { value: 'India', label: 'Built in' },
      ],
    },
    {
      id: 'build',
      label: 'What we build',
      categories: true,
    },
  ],
  contact: {
    address: 'Plot 107, Sector 4, IMT Manesar, Gurugram, Haryana 122050',
    phone: '+91 124 426 2612',
    email: 'sales@safesurgeindia.com',
    web: 'safesurge.co.in',
  },
}

/**
 * Manufacturer documents the kiosk can open. PDFs live in /public/docs/;
 * `url` is where each was downloaded from and is what the "open on your
 * phone" QR in the viewer points to. `type` is shown as the eyebrow and
 * `label` on the small buttons under a range model.
 *
 * Products list the ids they want under `docs`; range items under
 * `docs` too. Same id, same file, so a document can sit on several products.
 */
export const documents = {
  // ---- A&D checkweighers -------------------------------------------------
  'ad-4961': {
    title: 'AD-4961 Series',
    type: 'Brochure',
    label: 'AD-4961 brochure',
    note: 'Platform overview, unit breakdown, specifications and options for the 600 g, 2 kg and 6 kg models.',
    file: '/docs/ad-4961-brochure.pdf',
    source: 'A&D Company, Japan',
    url: 'https://aandd.jp/products/inspection_systems/pdf/ad4961.pdf',
  },
  'ad-4961a': {
    title: 'AD-4961A Series',
    type: 'Brochure',
    label: 'AD-4961A brochure',
    note: 'Current-generation platform: HPDF digital filter, 0.01 g resolution, stainless-steel cover option.',
    file: '/docs/ad-4961a-brochure.pdf',
    source: 'A&D Company, Japan',
    url: 'https://aandd.jp/products/inspection_systems/pdf/ad4961a.pdf',
  },
  'ad-4961-manual': {
    title: 'AD-4961-2KD-2035',
    type: 'Instruction manual',
    label: 'AD-4961 manual',
    note: 'Full operating manual: setup, product registration, calibration, outputs, communications and error codes.',
    file: '/docs/ad-4961-2kd-2035-manual.pdf',
    source: 'A&D Company, Japan',
    url: 'https://cms-prod.ricelake.com/media/wyujpogy/m_ad4961-2kd-2035_operation.pdf',
  },

  // ---- Mesutronic metal detectors ---------------------------------------
  'metron-05-d': {
    title: 'METRON 05 D',
    type: 'Brochure',
    label: 'METRON 05 D brochure',
    note: 'Divisible tunnel detector for conveyor belts.',
    file: '/docs/metron-05-d.pdf',
    source: 'Mesutronic, Germany',
    url: 'https://www.mesutronic.de/wp-content/uploads/2024/03/EN-Info-METRON05-D-Plast-20240313.pdf',
  },
  'metron-05-d-datasheet': {
    title: 'METRON 05 D',
    type: 'Data sheet',
    label: 'METRON 05 D data sheet',
    note: 'Dimensions, metal-free zone, electrical data and AMD 05 layout.',
    file: '/docs/metron-05-d-datasheet.pdf',
    source: 'Mesutronic, Germany',
    url: 'https://www.volta.it/wp-content/uploads/2022/02/EN-DB-MN05D-02.2018.pdf',
  },
  'metron-05-c': {
    title: 'METRON 05 C',
    type: 'Brochure',
    label: 'METRON 05 C brochure',
    note: 'Closed tunnel detector with integrated or remote electronics.',
    file: '/docs/metron-05-c.pdf',
    source: 'Mesutronic, Germany',
    url: 'https://www.mesutronic.de/wp-content/uploads/2024/03/EN-Info-METRON05-C-Plast-20240313.pdf',
  },
  'metron-05-ci': {
    title: 'METRON 05 CI',
    type: 'Brochure',
    label: 'METRON 05 CI brochure',
    note: 'Mid-range tunnel detector with built-in evaluation electronics.',
    file: '/docs/metron-05-ci.pdf',
    source: 'Mesutronic, Germany',
    url: 'https://www.mesutronic.de/wp-content/uploads/2024/03/EN-Info-METRON05-CI-Food-20240313.pdf',
  },
  'metron-07-ci': {
    title: 'METRON 07 CI',
    type: 'Brochure',
    label: 'METRON 07 CI brochure',
    note: 'High-end tunnel detector with built-in evaluation electronics.',
    file: '/docs/metron-07-ci.pdf',
    source: 'Mesutronic, Germany',
    url: 'https://www.mesutronic.de/wp-content/uploads/2025/12/EN-Info-METRON-07-CI-Food-20240805.pdf',
  },
  'metron-07-ci-datasheet': {
    title: 'METRON 07 CI',
    type: 'Data sheet',
    label: 'METRON 07 CI data sheet',
    note: 'Aperture sizes, dimensions, weights and metal-free zones.',
    file: '/docs/metron-07-ci-datasheet.pdf',
    source: 'Mesutronic, Germany',
    url: 'https://showcase.mesutronic.de/wp-content/uploads/2023/09/EN-DB-MN07CI-12.2022.pdf',
  },

  // ---- Mesutronic metal separators --------------------------------------
  'metron-05-cr': {
    title: 'METRON 05 CR',
    type: 'Brochure',
    label: 'METRON 05 CR brochure',
    note: 'Round-aperture detector for pipelines.',
    file: '/docs/metron-05-cr.pdf',
    source: 'Mesutronic, Germany',
    url: 'https://www.mesutronic.de/wp-content/uploads/2024/03/EN-Info-METRON05-CR-Food-20240313.pdf',
  },
  'quicktron-05-a': {
    title: 'QUICKTRON 05 A',
    type: 'Brochure',
    label: 'QUICKTRON 05 A brochure',
    note: 'Free-fall separator for powders and granulates.',
    file: '/docs/quicktron-05-a.pdf',
    source: 'Mesutronic, Germany',
    url: 'https://www.mesutronic.de/wp-content/uploads/2024/03/EN-Info-QUICKTRON05-A-Food-20240313.pdf',
  },
  'quicktron-03-r': {
    title: 'QUICKTRON 03 R',
    type: 'Brochure',
    label: 'QUICKTRON 03 R brochure',
    note: 'Compact free-fall separator for granulate and regrind.',
    file: '/docs/quicktron-03-r.pdf',
    source: 'Mesutronic, Germany',
    url: 'https://www.mesutronic.de/wp-content/uploads/2024/03/EN-Info-QUICKTRON03-R-Plast-20240313.pdf',
  },

  // ---- Mesutronic X-ray -------------------------------------------------
  'easyscope-st': {
    title: 'easySCOPE ST',
    type: 'Brochure',
    label: 'easySCOPE ST brochure',
    note: 'Flat and narrow packs up to 238 mm wide.',
    file: '/docs/easyscope-st.pdf',
    source: 'Mesutronic, Germany',
    url: 'https://www.mesutronic.de/wp-content/uploads/2024/03/EN-Info-easySCOPE-ST-Food-20240313.pdf',
  },
  'easyscope-400': {
    title: 'easySCOPE 400',
    type: 'Brochure',
    label: 'easySCOPE 400 brochure',
    note: 'Medium-sized packs up to 380 mm wide.',
    file: '/docs/easyscope-400.pdf',
    source: 'Mesutronic, Germany',
    url: 'https://www.mesutronic.de/wp-content/uploads/2024/03/EN-Info-easySCOPE-400-Food-20240313.pdf',
  },
  'easyscope-600': {
    title: 'easySCOPE 600',
    type: 'Brochure',
    label: 'easySCOPE 600 brochure',
    note: 'Large-format products and bulk packs.',
    file: '/docs/easyscope-600.pdf',
    source: 'Mesutronic, Germany',
    url: 'https://www.mesutronic.de/wp-content/uploads/2024/03/EN-Info-easySCOPE-600-Food-20240313.pdf',
  },
}

/** Home-screen tiles. Order here is the order on screen. */
export const categories = [
  // ---- Row 1: 5 + 5 ------------------------------------------------------
  {
    id: 'handling',
    name: 'Conveyors & Material Handling',
    eyebrow: 'Move product',
    icon: 'conveyor',
    tile: 'half',
    image: '/products/conveyors.jpg',
    video: '/products/conveyors.mp4',
  },
  {
    id: 'inspection',
    name: 'Inspection & Quality Control',
    eyebrow: 'Protect product',
    icon: 'shield',
    tile: 'half',
    image: '/products/x-ray.jpg',
  },

  // ---- Row 2: 5 + 5 ------------------------------------------------------
  {
    id: 'robotics',
    name: 'Robotics & Automation',
    eyebrow: 'Automate the line',
    icon: 'robot',
    tile: 'half',
    image: '/products/robotics.jpg',
    video: '/products/robotics.mp4',
  },
  {
    id: 'software',
    name: 'Industry 5.0 Software',
    eyebrow: 'Connect the plant',
    icon: 'monitor',
    tile: 'half',
    image: '/products/software.png',
  },

  // ---- Row 3: 10 ----------------------------------------------------------
  {
    id: 'vision',
    name: 'AI Powered Vision',
    eyebrow: 'See every defect',
    icon: 'eye',
    tile: 'full',
    image: '/products/vision.jpg',
  },
]

/**
 * Products (sub-categories). Grouped by `category` in the same order as the
 * tiles so the info-screen pager walks category by category.
 */
export const products = [
  // =========================================================================
  // Conveyors & Material Handling
  // =========================================================================
  {
    id: 'conveyors',
    category: 'handling',
    name: 'Conveyors',
    partner: 'Conveline Systems, India',
    icon: 'conveyor',
    image: '/products/conveyor-1.png',
    video: '/products/conveyors.mp4',
    url: 'https://safesurge.co.in/product/spiral-conveyor-system/',
    description:
      'Modern production environments need material handling that eliminates operational risk, minimises total cost of ownership and adapts to shifting demand. Our premium modular conveyor platforms deliver institutional-grade reliability, absolute layout flexibility and seamless integration into automated enterprise ecosystems.',
    facts: [
      { label: 'Configurations', value: '11 types' },
      { label: 'Build', value: 'Made in India' },
      { label: 'Detector-ready', value: 'Metal-free zone' },
    ],
    applications: [
      { icon: 'shield', name: 'Inspection lines' },
      { icon: 'box', name: 'End-of-line packing' },
      { icon: 'lift', name: 'Elevation & floor transfer' },
      { icon: 'stack', name: 'Accumulation & buffering' },
      { icon: 'funnel', name: 'Bulk & powder handling' },
      { icon: 'warehouse', name: 'Warehousing & intralogistics' },
    ],
    advantages: [
      {
        icon: 'ruler',
        title: 'Bespoke engineering',
        points: [
          {
            lead: 'Application-specific design.',
            text: 'Structural modelling tuned to your payload dynamics, environment and floor space.',
          },
          {
            lead: 'Turnkey footprint.',
            text: 'Custom-configured modules fit brownfield or greenfield layouts without structural compromise.',
          },
        ],
      },
      {
        icon: 'blocks',
        title: 'Modular & scalable',
        points: [
          {
            lead: 'Future-proof topology.',
            text: 'Reconfigure, extend or re-route the line with minimal capital expenditure.',
          },
          {
            lead: 'Interoperable by design.',
            text: 'Native compatibility with warehouse execution systems, robotics and upstream / downstream automation.',
          },
        ],
      },
      {
        icon: 'clock',
        title: 'Built for continuous duty',
        points: [
          {
            lead: 'Precision tolerances.',
            text: 'High-gauge, vibration-damping structure for ultra-smooth transit and less mechanical fatigue.',
          },
          {
            lead: '24/7/365 duty cycle.',
            text: 'Engineered for rigorous multi-shift operation, dramatically improving MTBF.',
          },
        ],
      },
      {
        icon: 'trend',
        title: 'Lower cost of ownership',
        points: [
          {
            lead: 'Rapid-access maintenance.',
            text: 'Toolless quick-release parts and accessible wear strips cut service windows from hours to minutes.',
          },
          {
            lead: 'High-efficiency powertrains.',
            text: 'Premium variable-frequency drives optimise energy use and support sustainability mandates.',
          },
        ],
      },
    ],
    performance: [
      { value: '24/7/365', label: 'Duty cycle', note: 'Continuous multi-shift operation with a longer mean time between failures.' },
      { value: '11', label: 'Configurations', note: 'Straight, incline, spiral, alpine and more \u2014 one modular platform.' },
      { value: 'Minutes', label: 'Service windows', note: 'Toolless quick-release parts and accessible wear strips, not hours of downtime.' },
      { value: 'VFD', label: 'Powertrains', note: 'Variable-frequency drives trim energy use and support sustainability targets.' },
    ],
    rangeLabel: 'Configurations',
    range: [
      {
        items: [
          { name: 'Straight', note: 'Belt or modular; the workhorse between machines and inspection points.' },
          { name: 'Incline / Decline', note: 'Cleated belts for controlled elevation change.' },
          { name: 'Z type', note: 'Horizontal infeed, incline and horizontal discharge in one frame.' },
          { name: 'L type', note: 'Horizontal run into a steep incline; compact footprint.' },
          { name: 'Gooseneck', note: 'Low infeed rising to a high discharge \u2014 ideal for feeding hoppers and fillers.' },
          { name: 'Radius', note: 'Curved sections to turn the line without a transfer.' },
          { name: 'Spiral (FG)', note: 'Vertical spiral for finished goods between floors or over walkways.' },
          { name: 'Spiral (Cooling)', note: 'Extended dwell time on a spiral path for baked and moulded products.' },
          { name: 'Alpine', note: 'Compact serpentine accumulator; buffers, elevates or cools while keeping FIFO order.' },
          { name: 'Vertical Lifter', note: 'Lifts cases or trays between levels with a minimal footprint.' },
          { name: 'Screw Conveyor', note: 'Enclosed auger for powders, granules and bulk solids.' },
        ],
      },
    ],
    caseStudies: [
      {
        industry: 'Jayanti Foods \u00b7 Alwar, Rajasthan',
        title: 'Vertical lifter for snack cartons and bulk bags',
        video: '/case-studies/vertical-lifter-jayanti.mp4',
        image: '/case-studies/vertical-lifter-jayanti.jpg',
        challenge:
          'Finished goods \u2014 cartons of chips, flat cartons, packing-roll plates and large polythene bags of namkeen \u2014 had to move between floors of the plant, with product formats changing through the day.',
        solution:
          'A SafeSurge vertical lifter fed by roller conveyors, with a touch-screen HMI that stores a recipe per product format. The operator picks the format and the lifter sets its own cycle; forward and reverse travel and every sensor are visible on screen.',
        results: [
          { value: '6', label: 'Product recipes' },
          { value: 'Cartons \u00b7 Bags', label: 'Formats handled' },
          { value: 'One tap', label: 'Changeover' },
        ],
      },
      {
        // TODO: confirm the customer name before showing it on the kiosk.
        industry: 'Frozen meat products \u00b7 Packing hall',
        title: 'Hygienic packing line for frozen meatballs',
        video: '/case-studies/meat-packing-line.mp4',
        image: '/case-studies/meat-packing-line.jpg',
        challenge:
          'Portioning, weighing and bagging frozen meatballs in a chilled, washdown room, with product moving between many operators without touching the floor.',
        solution:
          'A stainless-steel conveying line with raised in-line work tables, integrated weigh stations and a band sealer at the end, built to the hygiene standards of a red-zone meat room.',
        results: [
          { value: 'SS 304', label: 'Washdown build' },
          { value: 'Chilled', label: 'Room-rated' },
          { value: 'One line', label: 'Weigh \u00b7 Pack \u00b7 Seal' },
        ],
      },
    ],
  },
  {
    id: 'product-transfer',
    category: 'handling',
    name: 'Product Transfer',
    icon: 'conveyor',
    image: '/products/combi.jpg',
    url: 'https://safesurge.co.in/',
    description:
      'Transfer modules that move product cleanly between machines and inspection points: right-angle and dead-plate transfers, pushers and diverters, accumulation tables and vertical lifters. Each unit is matched to your pack, speed and layout so product arrives oriented and spaced for the next station.',
    facts: [
      { label: 'Transfers', value: '90\u00b0 \u00b7 Inline' },
      { label: 'Control', value: 'PLC \u00b7 Sensors' },
      { label: 'Build', value: 'Food-grade SS' },
    ],
    rangeLabel: 'Modules',
    range: [
      {
        items: [
          { name: 'Right-angle transfer', note: 'Turn product 90\u00b0 between conveyors without losing orientation.' },
          { name: 'Dead-plate / roller transfer', note: 'Smooth hand-off between belts for small or unstable packs.' },
          { name: 'Pusher & diverter', note: 'Split one lane into many, or merge lanes ahead of a packer.' },
          { name: 'Accumulation table', note: 'Buffer product during short downstream stops.' },
          { name: 'Vertical lifter', note: 'Move cases or trays between floor levels.' },
          { name: 'Reject station', note: 'Collect rejected packs from checkweighers, detectors and X-ray in a lockable bin.' },
        ],
      },
    ],
    caseStudies: [
      {
        // TODO: confirm the customer name before showing it on the kiosk.
        industry: 'Food & nutrition \u00b7 Jar filling line',
        title: 'Slat-chain accumulation table for jars',
        video: '/case-studies/jar-accumulator.mp4',
        image: '/case-studies/jar-accumulator.jpg',
        challenge:
          'Wide-mouth jars of spreads and powders arrived from the filler faster than the downstream machines could take them, so every short stop downstream stopped the filler too.',
        solution:
          'A multi-lane slat-chain accumulation table between filler and packer. Jars fan out across the lanes when the line backs up and merge back into single file when it clears, so the filler keeps running through short stops.',
        results: [
          { value: 'Multi-lane', label: 'Slat chain' },
          { value: 'Zero-pressure', label: 'Accumulation' },
          { value: 'Filler', label: 'Keeps running' },
        ],
      },
    ],
  },
  {
    id: 'material-handling',
    category: 'handling',
    name: 'Material Handling',
    icon: 'gear',
    image: '/products/process.jpg',
    url: 'https://safesurge.co.in/',
    description:
      'Stainless-steel hoppers, storage tanks, screw feeders and bulk handling systems for the stages before packing. Designed around your product and integrated with our conveying and inspection lines so material moves hygienically from receipt to filler.',
    facts: [
      { label: 'Build', value: 'Stainless steel' },
      { label: 'Scope', value: 'Tanks \u00b7 Hoppers \u00b7 Feeders' },
      { label: 'Design', value: 'Hygienic' },
    ],
    rangeLabel: 'Equipment',
    range: [
      {
        items: [
          { name: 'Storage tanks', note: 'Hygienic stainless-steel tanks for liquids and semi-solids.' },
          { name: 'Hoppers & feeders', note: 'Buffer and meter product into fillers and weighers.' },
          { name: 'Screw conveyors', note: 'Enclosed augers for powders, granules and bulk solids.' },
          { name: 'Bulk transfer', note: 'Move raw material between process steps without manual handling.' },
        ],
      },
    ],
  },

  // =========================================================================
  // Inspection & Quality Control
  // =========================================================================
  {
    id: 'checkweighers',
    category: 'inspection',
    name: 'Checkweighers',
    partner: 'A&D Company, Japan',
    icon: 'weight',
    image: '/products/checkweighers.jpg',
    url: 'https://safesurge.co.in/checkweighers/',
    description:
      'In-motion checkweighers built on A&D\u2019s AD-4961 platform. The IN range is made in India for 2 kg to 20 kg packs; ultra-precise 600 g and 2 kg models are imported from Japan. Every unit ships with a 7\u2033 colour touch panel, IP65 washdown build, Modbus TCP/RTU, 1,000-product memory and rejector / metal-detector I/O as standard.',
    facts: [
      { label: 'Accuracy', value: '0.08 g' },
      { label: 'Throughput', value: '400 / min' },
      { label: 'Capacity', value: '600 g \u2013 20 kg' },
      { label: 'Protection', value: 'IP65' },
    ],
    docs: ['ad-4961', 'ad-4961a', 'ad-4961-manual'],
    rangeLabel: 'Models',
    range: [
      {
        title: 'Imported \u00b7 Made in Japan',
        items: [
          { name: 'AD4961-600K-1224', note: '600 g \u00b7 0.01 g resolution \u00b7 120 \u00d7 240 mm belt \u00b7 400 pcs/min', docs: ['ad-4961'] },
          {
            name: 'AD4961-2KD-2035',
            note: '500 g / 2 kg dual range \u00b7 0.08 g (3\u03c3) \u00b7 200 \u00d7 350 mm belt \u00b7 320 pcs/min',
            docs: ['ad-4961', 'ad-4961-manual'],
          },
        ],
      },
      {
        title: 'IN range \u00b7 Made in India',
        items: [
          { name: 'AD4961-2KD-IN-2030', note: '2 kg \u00b7 200 \u00d7 300 mm belt' },
          { name: 'AD4961-2KD-IN-2035', note: '2 kg \u00b7 200 \u00d7 350 mm belt' },
          { name: 'AD4961-2KD-IN-3040', note: '2 kg \u00b7 300 \u00d7 400 mm belt' },
          { name: 'AD4961-5KD-IN-2030', note: '5 kg \u00b7 200 \u00d7 300 mm belt' },
          { name: 'AD4961-5KD-IN-2035', note: '5 kg \u00b7 200 \u00d7 350 mm belt' },
          { name: 'AD4961-5KD-IN-3040', note: '5 kg \u00b7 300 \u00d7 400 mm belt' },
          { name: 'AD4961-5KD-IN-3545', note: '5 kg \u00b7 350 \u00d7 450 mm belt' },
          { name: 'AD4961-5KD-IN-4050', note: '5 kg \u00b7 400 \u00d7 500 mm belt' },
          { name: 'AD4961-5KD-IN-4060', note: '5 kg \u00b7 400 \u00d7 600 mm belt' },
          { name: 'AD4961-10KD-IN-3040', note: '10 kg \u00b7 300 \u00d7 400 mm belt' },
          { name: 'AD4961-10KD-IN-3545', note: '10 kg \u00b7 350 \u00d7 450 mm belt' },
          { name: 'AD4961-10KD-IN-4050', note: '10 kg \u00b7 400 \u00d7 500 mm belt' },
          { name: 'AD4961-10KD-IN-4060', note: '10 kg \u00b7 400 \u00d7 600 mm belt' },
          { name: 'AD4961-10KD-IN-6080', note: '10 kg \u00b7 600 \u00d7 800 mm belt' },
          { name: 'AD4961-20KD-IN-80100', note: '20 kg \u00b7 800 \u00d7 1000 mm belt' },
          { name: 'Custom model', note: 'Built to your pack, belt and speed \u00b7 capacities up to 100 kg' },
        ],
      },
    ],
    caseStudies: [
      {
        industry: 'Bambino \u00b7 Vermicelli & pasta',
        title: 'In-line checkweighing of vermicelli pouches',
        video: '/case-studies/checkweigher-bambino.mp4',
        image: '/case-studies/checkweigher-bambino.jpg',
        challenge:
          'Pillow pouches off the vertical form-fill-seal machine needed a weight check on every pack, without slowing the packer or adding a manual sampling step.',
        solution:
          'An AD-4961 checkweigher on the packer outfeed weighs each pouch in motion and diverts under- and over-weight packs to a reject bin, logging every result for the shift report.',
        results: [
          { value: 'Every pack', label: 'Weighed in motion' },
          { value: 'Auto', label: 'Under / over reject' },
          { value: 'Logged', label: 'Shift records' },
        ],
      },
      {
        // TODO: confirm the customer name before showing it on the kiosk.
        industry: 'Powders & supplements \u00b7 Container line',
        title: 'Checkweigher on an HDPE container filling line',
        video: '/case-studies/checkweigher-containers.mp4',
        image: '/case-studies/checkweigher-containers.jpg',
        challenge:
          'Filled containers had to be verified for net weight before capping and labelling, on a line running at steady speed with a stainless, easy-clean build.',
        solution:
          'An A&D checkweigher with stainless-steel frame and 7\u2033 colour touch panel integrated into the container conveyor, with product memory for each pack size and a pusher reject for off-weight containers.',
        results: [
          { value: 'A&D', label: 'AD-4961 platform' },
          { value: '1,000', label: 'Product memory' },
          { value: 'IP65', label: 'Washdown' },
        ],
      },
    ],
  },
  {
    id: 'metal-detectors',
    category: 'inspection',
    name: 'Metal Detectors',
    partner: 'Mesutronic, Germany',
    icon: 'magnet',
    image: '/products/metal-detectors.jpg',
    url: 'https://safesurge.co.in/product/tunnel-metal-detector/',
    description:
      'Mesutronic METRON tunnel detectors integrated into our conveyors. They find ferrous, non-ferrous and stainless steel \u2014 loose or encapsulated \u2014 in packed, bulk and web products, and log every event for HACCP, IFS, BRC and SQF audits. Pick the coil that fits the line.',
    facts: [
      { label: 'Detects', value: 'Fe \u00b7 NFe \u00b7 SS' },
      { label: 'Coil types', value: 'D \u00b7 C \u00b7 CI' },
      { label: 'Connectivity', value: 'Ethernet \u00b7 OPC UA' },
    ],
    docs: ['metron-05-d', 'metron-05-d-datasheet', 'metron-05-c', 'metron-05-ci', 'metron-07-ci', 'metron-07-ci-datasheet'],
    rangeLabel: 'Coil types',
    range: [
      {
        items: [
          {
            name: 'D coil',
            note: 'Divisible tunnel head with separate control electronics. Splits open for retrofits and quick belt changes; built for rough duty and larger bulk heights.',
            docs: ['metron-05-d', 'metron-05-d-datasheet'],
          },
          {
            name: 'C coil',
            note: 'Tunnel detector with integrated or remote electronics. Mounts horizontally or vertically; apertures from 5 cm to over 2 m wide.',
            docs: ['metron-05-c'],
          },
          {
            name: 'CI coil',
            note: 'Tunnel detector with evaluation electronics built in \u2014 no control cabinet. METRON 05 CI for mid-range duty, METRON 07 CI for the tightest specs.',
            docs: ['metron-05-ci', 'metron-07-ci'],
          },
        ],
      },
    ],
    caseStudies: [
      {
        // TODO: confirm the customer name before showing it on the kiosk.
        industry: 'Powders & supplements \u00b7 Container line',
        title: 'Tunnel detector on a guarded container line',
        video: '/case-studies/metal-detector-containers.mp4',
        image: '/case-studies/metal-detector-containers.jpg',
        challenge:
          'Filled HDPE containers had to be screened for metal contamination as a critical control point, inside an existing guarded conveyor section with limited space.',
        solution:
          'A tunnel metal detector integrated into the guarded conveyor with its own control panel, stack light and reject, sized to the container height so every jar passes through the aperture at line speed.',
        results: [
          { value: 'Fe \u00b7 NFe \u00b7 SS', label: 'Detected' },
          { value: 'In-guard', label: 'Retrofit' },
          { value: 'HACCP', label: 'Control point' },
        ],
      },
      {
        // TODO: confirm the customer name before showing it on the kiosk.
        industry: 'Flour milling \u00b7 Atta bagging',
        title: 'Metal detection on atta bags after the bagger',
        video: '/case-studies/metal-detector-flour-bags.mp4',
        image: '/case-studies/metal-detector-flour-bags.jpg',
        challenge:
          'Filled flour bags coming off multiple bagging machines needed a final metal check in a dusty mill environment, without adding operators or slowing the baggers.',
        solution:
          'Tunnel metal detectors on conveyors behind each bagger, with detection heads and control units built for dust and a large aperture that takes the full bag. Alarms and rejects are signalled on a stack light at each station.',
        results: [
          { value: 'Per bagger', label: 'One detector each' },
          { value: 'Full bag', label: 'Aperture' },
          { value: 'Dust-rated', label: 'Build' },
        ],
      },
    ],
  },
  {
    id: 'combi',
    category: 'inspection',
    name: 'Combi Systems',
    partner: 'A&D \u00b7 Mesutronic',
    icon: 'layers',
    image: '/products/combi.jpg',
    url: 'https://safesurge.co.in/inspection-systems/',
    description:
      'Checkweigher and metal detector on one frame. Every pack is weighed and screened for metal in a single pass. The AD-4961 controller takes the detector\u2019s signal through its standard metal-detector input, so one rejector, one HMI and one history log cover both checks \u2014 saving line length and a second operator interface.',
    facts: [
      { label: 'Checks', value: 'Weight + Metal' },
      { label: 'Footprint', value: 'One frame' },
      { label: 'Reject', value: 'One station' },
    ],
    docs: ['ad-4961', 'metron-05-ci', 'metron-07-ci'],
    rangeLabel: 'How it works',
    range: [
      {
        items: [
          {
            name: 'Weigh + detect',
            note: 'AD-4961 weighing conveyor with a METRON CI tunnel head on the infeed.',
            docs: ['ad-4961', 'metron-05-ci'],
          },
          { name: 'Single reject', note: 'Pusher, air-jet or drop-flap rejector handles both off-weight and contaminated packs.' },
          { name: 'Unified records', note: 'Weighing and detection events in one USB / network log for audits.' },
        ],
      },
    ],
  },
  {
    id: 'metal-separators',
    category: 'inspection',
    name: 'Metal Separators',
    partner: 'Mesutronic, Germany',
    icon: 'funnel',
    image: '/products/metal-separators.jpg',
    url: 'https://safesurge.co.in/inspection-systems/',
    description:
      'For product that flows rather than rides a belt. METRON CR round-aperture detectors bolt into pipelines for liquids, pneumatic conveying or free fall. QUICKTRON separators inspect granulate, regrind and powder in free fall and divert contaminated material automatically, without stopping production.',
    facts: [
      { label: 'Pipe sizes', value: '30 \u2013 450 mm' },
      { label: 'Free-fall bore', value: '50 \u2013 400 mm' },
      { label: 'Particle size', value: '\u2264 10 mm' },
    ],
    docs: ['metron-05-cr', 'quicktron-05-a', 'quicktron-03-r'],
    rangeLabel: 'Models',
    range: [
      {
        items: [
          {
            name: 'METRON 05 CR',
            note: 'Round-aperture detector for pipelines from 30 mm to 450 mm. Liquids, pneumatic lines or free fall.',
            docs: ['metron-05-cr'],
          },
          {
            name: 'QUICKTRON 05 A',
            note: 'Free-fall metal separator for granulates, regrind and powders. Nominal bores 50\u2013400 mm; rectangular shafts for higher throughput.',
            docs: ['quicktron-05-a'],
          },
          {
            name: 'QUICKTRON 03 R',
            note: 'Compact free-fall separator for granulate and regrind where installation space is tight.',
            docs: ['quicktron-03-r'],
          },
        ],
      },
    ],
    caseStudies: [
      {
        // TODO: confirm the customer name and the exact function of the unit
        // (photos show a stainless T-joint with pneumatic actuator on an
        // overhead conveying line at a snacks plant).
        industry: 'Snacks \u00b7 Pneumatic conveying',
        title: 'Stainless T-joint diverter on an overhead product line',
        image: '/case-studies/pipeline-tjoint.jpg',
        challenge:
          'Product travelling in overhead stainless pipework to the packing machines had no way to be diverted without stopping the line and opening the pipe.',
        solution:
          'A fabricated stainless-steel T-joint with a pneumatically actuated diverter, welded into the existing overhead line above the packers, so a controlled portion of the flow can be sent to a second outlet on demand.',
        results: [
          { value: 'SS', label: 'Sanitary welds' },
          { value: 'Pneumatic', label: 'Actuation' },
          { value: 'Inline', label: 'No line stop' },
        ],
      },
    ],
  },
  {
    id: 'x-ray',
    category: 'inspection',
    name: 'X-Ray Inspection',
    partner: 'Mesutronic, Germany',
    icon: 'xray',
    image: '/products/x-ray.jpg',
    url: 'https://safesurge.co.in/x-ray/',
    description:
      'X-ray finds what metal detectors cannot: glass, stone, bone, high-density plastics and fine stainless wire \u2014 even inside aluminium packs. Standard quality algorithms also check piece count, fill and integrity, while masking lets you ignore clips and closures or monitor them for presence.',
    facts: [
      { label: 'Finds', value: 'Glass \u00b7 Stone \u00b7 SS' },
      { label: 'Packaging', value: 'Incl. aluminium' },
      { label: 'Also checks', value: 'Count \u00b7 Fill' },
    ],
    docs: ['easyscope-st', 'easyscope-400', 'easyscope-600'],
    rangeLabel: 'Capabilities',
    range: [
      {
        items: [
          { name: 'Foreign bodies', note: 'Metal, glass, stone, high-density plastic and wire-shaped contaminants.' },
          { name: 'Quality checks', note: 'Units per pack, missing or damaged pieces, masked zones for clips and seals.' },
          { name: 'Line-ready', note: 'Belt widths and lengths to suit; pusher, air-jet, swivel-arm or drop-flap reject.' },
          { name: 'Serviceable', note: 'Front access to generator and receiver, fold-away shielding tunnels, belt quick release.' },
        ],
      },
    ],
  },

  // =========================================================================
  // Robotics & Automation
  // =========================================================================
  {
    id: 'pick-place',
    category: 'robotics',
    name: 'Robotic Pick & Place',
    icon: 'robot',
    image: '/products/robotics.jpg',
    video: '/products/robotics.mp4',
    url: 'https://safesurge.co.in/',
    description:
      'High-speed robotic cells that pick individual products from a moving conveyor and place them into trays, flow-wrapper infeeds or cartons. Vision-guided, so position and orientation are corrected on the fly, and integrated with our checkweighers and inspection so only good product is picked.',
    facts: [
      { label: 'Guidance', value: 'Vision' },
      { label: 'Handling', value: 'Single \u00b7 Multi-pick' },
      { label: 'Integration', value: 'Conveyor \u00b7 CW \u00b7 Vision' },
    ],
    rangeLabel: 'Applications',
    range: [
      {
        items: [
          { name: 'Tray loading', note: 'Place product into trays and thermoform pockets at line speed.' },
          { name: 'Flow-wrapper infeed', note: 'Feed wrappers and cartoners with correctly spaced, oriented product.' },
          { name: 'Collating', note: 'Group products into counts and patterns ahead of packing.' },
          { name: 'Robot types', note: 'Delta for speed, SCARA for compact cells, 6-axis for reach and payload.' },
        ],
      },
    ],
  },
  {
    id: 'palletizing',
    category: 'robotics',
    name: 'Palletizing',
    icon: 'robot',
    image: '/products/robotics.jpg',
    url: 'https://safesurge.co.in/',
    description:
      'Robotic palletising and depalletising cells that stack cases, bags or trays to programmed patterns at the end of the line. Runs around the clock, handles multiple SKUs and pallet types, and takes the heaviest job on the floor off your operators.',
    facts: [
      { label: 'Tasks', value: 'Palletise \u00b7 Depalletise' },
      { label: 'Patterns', value: 'Programmable' },
      { label: 'Shift', value: '24 / 7' },
    ],
    rangeLabel: 'Applications',
    range: [
      {
        items: [
          { name: 'Case palletising', note: 'Stack cartons and trays to stable, programmed patterns.' },
          { name: 'Bag palletising', note: 'Handle sacks and bags with dedicated grippers.' },
          { name: 'Depalletising', note: 'Unstack incoming pallets to feed the line.' },
          { name: 'Pallet handling', note: 'Pallet dispensers, slip-sheet placement and stretch-wrap integration.' },
        ],
      },
    ],
  },
  {
    id: 'case-packing',
    category: 'robotics',
    name: 'Case Packing',
    icon: 'box',
    image: '/products/case-packing.jpg',
    video: '/products/case-packing.mp4',
    url: 'https://safesurge.co.in/',
    description:
      'Hands-free case packing from blank to sealed box. Automatic case erectors form and bottom-seal cartons on demand, robotic packers collate and load pouches, cartons or bottles, and case sealers close the top with tape or hot-melt. Sized to your case range and paired with our conveyors and palletisers.',
    facts: [
      { label: 'Erector', value: 'Form + seal' },
      { label: 'Packer', value: 'Robotic' },
      { label: 'Sealer', value: 'Tape \u00b7 Hot-melt' },
    ],
    rangeLabel: 'Machines',
    range: [
      {
        items: [
          { name: 'Case Erector', note: 'Pulls flat blanks from a magazine, squares the case and seals the bottom.' },
          { name: 'Robotic Box Packer', note: 'Collate and load pouches, cartons or bottles into open cases.' },
          { name: 'Case Sealer', note: 'Folds flaps and seals the top; fixed-size or random-size versions.' },
        ],
      },
    ],
  },

  // =========================================================================
  // Industry 5.0 Software
  // =========================================================================
  // One page for the whole suite: the former sub-categories (Production
  // Monitoring, OEE, Traceability, Data & Analytics, Connected Factory) are
  // the entries of its Features card.
  {
    id: 'software',
    category: 'software',
    name: 'Industry 5.0 Software',
    icon: 'monitor',
    image: '/products/software.png',
    url: 'https://safesurge.co.in/',
    description:
      'One software suite that connects the plant. Production monitoring, OEE, traceability, analytics and machine connectivity, built on live data from our checkweighers, detectors, X-ray and vision systems \u2014 and from your existing PLCs \u2014 so supervisors see every line the moment something changes, on the floor, in the office or on a phone.',
    facts: [
      { label: 'Modules', value: '5' },
      { label: 'Protocols', value: 'OPC UA \u00b7 Modbus \u00b7 Ethernet' },
      { label: 'Access', value: 'Floor \u00b7 Phone \u00b7 Office' },
    ],
    rangeLabel: 'Features',
    range: [
      {
        items: [
          {
            name: 'Production Monitoring',
            note: 'Live dashboards with counts, rates, rejects and machine states from SafeSurge machines and third-party PLCs. Downtime alerts, automatic shift reports and Andon boards for the shop floor.',
          },
          {
            name: 'OEE',
            note: 'Availability, performance and quality measured per machine, line and shift from real machine data. Operators code loss reasons on the HMI as they happen; the six big losses are ranked by time and cost.',
          },
          {
            name: 'Traceability',
            note: 'A record for every pack: weights, detector events, X-ray results and vision verdicts tied to batch and product. Serialisation, inspection logs and audit-ready reports for HACCP, IFS, BRC and SQF.',
          },
          {
            name: 'Data & Analytics',
            note: 'Giveaway by product and filler head, reject rates by shift and machine, and weight or quality drift caught before it becomes rejects. Scheduled exports and APIs for your ERP and BI tools.',
          },
          {
            name: 'Connected Factory',
            note: 'SafeSurge and existing machines on one plant network over OPC UA, Modbus and Ethernet, with remote diagnostics, secure cloud dashboards and MES / ERP integration.',
          },
        ],
      },
    ],
  },

  // =========================================================================
  // AI Powered Vision
  // =========================================================================
  {
    id: 'vision',
    category: 'vision',
    name: 'AI Vision Inspection',
    icon: 'eye',
    image: '/products/vision.jpg',
    url: 'https://safesurge.co.in/product-category/inspection-systems/vision-inspection/',
    description:
      'Camera-based inspection with AI models trained on your product. Checks every pack at line speed, rejects what fails, and keeps learning as new defect types appear. Built into our conveyors and rejectors so it drops into the line like any other inspection point.',
    facts: [
      { label: 'Speed', value: 'Line speed' },
      { label: 'Model', value: 'Trained on you' },
      { label: 'Integration', value: 'Conveyor \u00b7 Reject' },
    ],
    rangeLabel: 'Capabilities',
    range: [
      {
        items: [
          { name: 'Cameras & lighting', note: 'Area, line-scan and 3D cameras with lighting matched to your product.' },
          { name: 'AI model', note: 'Trained on your good and bad samples; no rule-writing.' },
          { name: 'Reject integration', note: 'Pusher, air-jet or drop-flap reject on the same conveyor.' },
          { name: 'Continuous learning', note: 'Flag new defect types and retrain without stopping the line.' },
        ],
      },
    ],
    caseStudies: [
      {
        // TODO: confirm the customer name before showing it on the kiosk.
        industry: 'Frozen breads \u00b7 Ahmedabad',
        title: 'Naan inspection from both sides at line speed',
        video: '/case-studies/vision-naan.mp4',
        image: '/case-studies/vision-naan.jpg',
        challenge:
          'Every naan had to be checked for size, shape, colour, burn marks and stray hair before freezing \u2014 on both faces \u2014 a job that manual inspection could not do consistently at line speed.',
        solution:
          'A SafeSurge AI Vision Inspection Station on the conveyor with cameras above and below the belt. An AI model trained on the customer\u2019s own product grades each naan and drives the reject; a live dashboard shows captures, rejects and the defect mix by camera and site.',
        results: [
          { value: 'Front + back', label: 'Both faces' },
          { value: '3', label: 'Defect classes tracked' },
          { value: 'Live', label: 'Quality dashboard' },
        ],
      },
      {
        // TODO: confirm the full customer name ("CG FP" on the HMI).
        industry: 'CG FP \u00b7 Instant noodles',
        title: 'Counting and cook-state check on noodle cakes',
        video: '/case-studies/vision-noodles.mp4',
        image: '/case-studies/vision-noodles.jpg',
        challenge:
          'Noodle cakes leaving the fryer on multi-lane conveyors had to be counted and any over- or under-cooked cake caught before packing, at a rate no operator could keep up with.',
        solution:
          'An AI camera station over the lanes detects every cake, classifies it as good, overcooked or undercooked and keeps a running count per class on the operator screen \u2014 integrated with the plant\u2019s Crimson Tech vision software.',
        results: [
          { value: '4,000', label: 'Cakes in the run' },
          { value: '3,994', label: 'Passed' },
          { value: '6', label: 'Rejected' },
        ],
      },
    ],
  },
  {
    id: 'defect-detection',
    category: 'vision',
    name: 'Defect Detection',
    icon: 'eye',
    image: '/products/vision.jpg',
    url: 'https://safesurge.co.in/product-category/inspection-systems/vision-inspection/',
    description:
      'Spots product defects and packaging abnormalities that rules-based vision misses: cracks, dents, discolouration, missing or misplaced components, torn or wrinkled seals. The model learns what good looks like on your product, so it catches defects nobody wrote a rule for.',
    facts: [
      { label: 'Finds', value: 'Product \u00b7 Pack defects' },
      { label: 'Method', value: 'AI \u00b7 Anomaly' },
      { label: 'Manual checks', value: 'Replaced' },
    ],
    rangeLabel: 'Capabilities',
    range: [
      {
        items: [
          { name: 'Product defects', note: 'Cracks, dents, deformation, discolouration and surface faults.' },
          { name: 'Packaging defects', note: 'Torn or wrinkled seals, damaged cartons, misapplied lids.' },
          { name: 'Missing components', note: 'Absent or misplaced parts, inserts and closures.' },
          { name: 'Foreign material', note: 'Visible contaminants on product or inside the pack.' },
        ],
      },
    ],
    caseStudies: [
      {
        // TODO: confirm the customer name before showing it on the kiosk.
        industry: 'Potato processing \u00b7 Raw material grading',
        title: 'Defect detection on whole potatoes',
        video: '/case-studies/vision-potato.mp4',
        image: '/case-studies/vision-potato.jpg',
        challenge:
          'Cuts, rot, greening and mechanical damage on incoming potatoes were being caught by eye on a fast roller conveyor, letting defective tubers reach the slicer.',
        solution:
          'A camera over the roller conveyor with an AI detection model that marks each defect on each tuber with a confidence score, so grading is consistent from shift to shift and the output can drive a reject.',
        results: [
          { value: 'Per tuber', label: 'Defects marked' },
          { value: 'Scored', label: 'Confidence per find' },
          { value: 'Roller belt', label: 'Inspected in motion' },
        ],
      },
      {
        // TODO: confirm the customer name before showing it on the kiosk.
        industry: 'Snacks \u00b7 Fried chips',
        title: 'Spotting burnt and defective chips on the line',
        video: '/case-studies/vision-chips.mp4',
        image: '/case-studies/vision-chips.jpg',
        challenge:
          'Dark, burnt or peel-spotted chips and fragments were passing through with good product on a wide, fast belt after the fryer.',
        solution:
          'An AI vision station over the belt detects and classifies each chip as it passes, flagging defective pieces and keeping running good / defect statistics on the operator screen for tuning the fryer.',
        results: [
          { value: 'Full width', label: 'Belt covered' },
          { value: 'Each chip', label: 'Classified' },
          { value: 'Live', label: 'Good / defect ratio' },
        ],
      },
    ],
  },
  {
    id: 'quality-inspection',
    category: 'vision',
    name: 'Quality Inspection',
    icon: 'eye',
    image: '/products/vision.jpg',
    url: 'https://safesurge.co.in/product-category/inspection-systems/vision-inspection/',
    description:
      'Verify that every pack leaves the line correct: codes read and match the batch, labels are present and straight, fill is within limits, barcodes grade. Print-and-verify in one station, with every result recorded for traceability.',
    facts: [
      { label: 'Inspections', value: '6 types' },
      { label: 'Codes', value: 'OCR \u00b7 OCV \u00b7 1D / 2D' },
      { label: 'Records', value: 'Every pack' },
    ],
    rangeLabel: 'Capabilities',
    range: [
      {
        items: [
          { name: 'OCR / OCV', note: 'Read and verify batch codes, dates and text.' },
          { name: 'Label inspection', note: 'Presence, position, skew and damage.' },
          { name: 'Fill level', note: 'Under- and over-fill on bottles, jars and pouches.' },
          { name: 'Barcode grading', note: 'Grade and verify 1D / 2D codes.' },
          { name: 'Coding & verification', note: 'Print, then verify, in one station.' },
          { name: 'Track & trace', note: 'Serialise and record every unit.' },
        ],
      },
    ],
  },
]
