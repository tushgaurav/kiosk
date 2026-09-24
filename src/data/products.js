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
 * - `url` is what the QR code points to.
 * - `tile` (categories only) controls the home-screen grid: `wide` tiles take
 *   7/10 columns, `narrow` 3/10, `half` 5/10, `full` 10/10. Rows must add up
 *   to 10.
 * - `partner` (optional) is the OEM whose technology the product is built on.
 * - `facts` are 3–4 headline specs shown as stat blocks.
 * - `range` is a list of groups, each with `title` (optional) and `items`
 *   of `{ name, note }`. Model codes, conveyor types, applications, etc.
 *
 * Sources: aandd.jp (AD-4961 specs), aanddindia.in, mesutronic.de
 * (METRON / QUICKTRON), safesurge.co.in (product pages).
 */

export const brand = {
  name: 'SafeSurge',
  logo: '/safesurge.png',
  site: 'https://safesurge.co.in',
  tagline: 'Inspect. Convey. Automate.',
}

/**
 * Content for the About screen (#/about) and its Visit-us subpage
 * (#/about/visit).
 *
 * - The About page is a title, the head-office photo and a deck of cards the
 *   visitor swipes through. A card has a `label` (used in the card index)
 *   and one of: `text` + `stats`, `categories: true` (lists the home-screen
 *   categories), `groups` of chips, or numbered `steps`.
 * - The Visit page is an interactive map centred on `location.lat/lng`,
 *   with the address plate and a QR that opens directions on a phone.
 */
export const about = {
  company: 'Safesurge Inspection Technologies Pvt. Ltd.',
  eyebrow: 'About us',
  title: 'Inspection technology, engineered in India.',
  image: '/safesurge-images/hq.png',
  imageAlt: 'SafeSurge head office at IMT Manesar',
  location: {
    place: 'IMT Manesar, Gurugram',
    coords: '28.36\u00b0 N \u00b7 76.93\u00b0 E',
    // Sector 4, IMT Manesar. Nudge these to the exact plot if needed.
    lat: 28.3563,
    lng: 76.9312,
    zoom: 15,
  },
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
    {
      id: 'markets',
      label: 'Industries & partners',
      groups: [
        { label: 'Industries', items: ['Food Processing', 'FMCG', 'Pharmaceutical', 'Packaging', 'Manufacturing'] },
        {
          label: 'Technology partners',
          items: [
            { name: 'A&D Company', note: 'Japan \u00b7 Checkweighing' },
            { name: 'Mesutronic', note: 'Germany \u00b7 Metal detection & X-ray' },
          ],
        },
      ],
    },
    {
      id: 'approach',
      label: 'How we work',
      steps: [
        'We start with your production challenge, not a catalogue.',
        'Feasibility trials on your actual product before you commit.',
        'Engineered to integrate into your existing line.',
      ],
    },
  ],
  visit: {
    eyebrow: 'Visit us',
    title: 'Find us in IMT Manesar.',
    note: 'On the Delhi\u2013Jaipur highway (NH-48), south-west of Gurugram.',
  },
  contact: {
    address: 'Plot 107, Sector 4, IMT Manesar, Gurugram, Haryana 122050',
    phone: '+91 124 426 2612',
    email: 'sales@safesurgeindia.com',
    web: 'safesurge.co.in',
    // What the "Scan for directions" QR opens on the visitor's phone.
    mapsUrl:
      'https://www.google.com/maps/search/?api=1&query=Safesurge+Inspection+Technologies+Plot+107+Sector+4+IMT+Manesar+Gurugram',
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
    image: '/products/software.jpg',
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
    icon: 'conveyor',
    image: '/products/conveyor-1.jpg',
    video: '/products/conveyors.mp4',
    url: 'https://safesurge.co.in/product/spiral-conveyor-system/',
    description:
      'Food-grade belt, modular and screw conveyors manufactured in India and engineered with metal-free zones so detectors drop straight in. From a single straight section to complete multi-floor spiral systems, each line is sized to your product, speed and layout.',
    facts: [
      { label: 'Configurations', value: '11 types' },
      { label: 'Build', value: 'Made in India' },
      { label: 'Detector-ready', value: 'Metal-free zone' },
    ],
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
    range: [
      {
        title: 'Imported \u00b7 Made in Japan',
        items: [
          { name: 'AD4961-600K-1224', note: '600 g \u00b7 0.01 g resolution \u00b7 120 \u00d7 240 mm belt \u00b7 400 pcs/min' },
          { name: 'AD4961-2KD-2035', note: '500 g / 2 kg dual range \u00b7 0.08 g (3\u03c3) \u00b7 200 \u00d7 350 mm belt \u00b7 320 pcs/min' },
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
    range: [
      {
        title: 'Coil types',
        items: [
          {
            name: 'D coil',
            note: 'Divisible tunnel head with separate control electronics. Splits open for retrofits and quick belt changes; built for rough duty and larger bulk heights.',
          },
          {
            name: 'C coil',
            note: 'Tunnel detector with integrated or remote electronics. Mounts horizontally or vertically; apertures from 5 cm to over 2 m wide.',
          },
          {
            name: 'CI coil',
            note: 'Tunnel detector with evaluation electronics built in \u2014 no control cabinet. METRON 05 CI for mid-range duty, METRON 07 CI for the tightest specs.',
          },
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
    range: [
      {
        items: [
          { name: 'Weigh + detect', note: 'AD-4961 weighing conveyor with a METRON CI tunnel head on the infeed.' },
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
    range: [
      {
        items: [
          {
            name: 'METRON 05 CR',
            note: 'Round-aperture detector for pipelines from 30 mm to 450 mm. Liquids, pneumatic lines or free fall.',
          },
          {
            name: 'QUICKTRON 05 A',
            note: 'Free-fall metal separator for granulates, regrind and powders. Nominal bores 50\u2013400 mm; rectangular shafts for higher throughput.',
          },
          {
            name: 'QUICKTRON 03 R',
            note: 'Compact free-fall separator for granulate and regrind where installation space is tight.',
          },
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
  {
    id: 'machine-tending',
    category: 'robotics',
    name: 'Machine Tending',
    icon: 'wrench',
    image: '/products/robotics.jpg',
    url: 'https://safesurge.co.in/',
    description:
      'Robots that load and unload your existing machines \u2014 fillers, presses, moulders and packaging equipment \u2014 so they run without an operator standing by. We handle grippers, safety guarding and the PLC handshake; the machine keeps its cycle and the operator moves to higher-value work.',
    facts: [
      { label: 'Fits', value: 'Existing machines' },
      { label: 'Safety', value: 'Guarded \u00b7 Collaborative' },
      { label: 'Integration', value: 'PLC handshake' },
    ],
    range: [
      {
        items: [
          { name: 'Load / unload', note: 'Feed parts or packs into a machine and take finished product out.' },
          { name: 'Tray & magazine handling', note: 'Keep infeed magazines topped up and outfeed trays cleared.' },
          { name: 'Collaborative cells', note: 'Cobots for lower-speed tasks alongside operators.' },
          { name: 'Safety & guarding', note: 'Fencing, light curtains and safety PLC to current standards.' },
        ],
      },
    ],
  },

  // =========================================================================
  // Industry 5.0 Software
  // =========================================================================
  {
    id: 'production-monitoring',
    category: 'software',
    name: 'Production Monitoring',
    icon: 'monitor',
    image: '/products/software.jpg',
    url: 'https://safesurge.co.in/',
    description:
      'A live view of every line on one screen. Counts, rates, rejects and machine states are pulled from our checkweighers, detectors and conveyors \u2014 and from third-party PLCs \u2014 so supervisors see stoppages and slowdowns the moment they happen, on the floor or on a phone.',
    facts: [
      { label: 'View', value: 'Real-time' },
      { label: 'Sources', value: 'Machines \u00b7 PLCs' },
      { label: 'Access', value: 'Floor \u00b7 Phone \u00b7 Office' },
    ],
    range: [
      {
        items: [
          { name: 'Line dashboards', note: 'Throughput, rejects and machine state per line, live.' },
          { name: 'Downtime alerts', note: 'Notify supervisors when a machine stops or slows.' },
          { name: 'Shift reports', note: 'Automatic end-of-shift summaries by line and product.' },
          { name: 'Andon displays', note: 'Large-format status boards for the shop floor.' },
        ],
      },
    ],
  },
  {
    id: 'oee',
    category: 'software',
    name: 'OEE',
    icon: 'monitor',
    image: '/products/software.jpg',
    url: 'https://safesurge.co.in/',
    description:
      'Overall Equipment Effectiveness measured automatically, not on paper. Availability, performance and quality are calculated per machine, line and shift from real machine data, with loss reasons captured at the point of stoppage.',
    facts: [
      { label: 'Metrics', value: 'Availability \u00b7 Performance \u00b7 Quality' },
      { label: 'Granularity', value: 'Machine \u00b7 Line \u00b7 Shift' },
      { label: 'Losses', value: 'Reason-coded' },
    ],
    range: [
      {
        items: [
          { name: 'OEE dashboards', note: 'Live and historical OEE for every asset.' },
          { name: 'Loss analysis', note: 'Rank the six big losses by time and cost.' },
          { name: 'Reason capture', note: 'Operators code downtime on the HMI as it happens.' },
          { name: 'Target tracking', note: 'Compare shifts, lines and plants against goals.' },
        ],
      },
    ],
  },
  {
    id: 'traceability',
    category: 'software',
    name: 'Traceability',
    icon: 'shield',
    image: '/products/software.jpg',
    url: 'https://safesurge.co.in/',
    description:
      'A record for every pack. Weights, detector events, X-ray results and vision verdicts are stored against batch and product, giving you a complete audit trail for HACCP, IFS, BRC and SQF \u2014 and a fast answer when a customer asks.',
    facts: [
      { label: 'Records', value: 'Per pack \u00b7 Per batch' },
      { label: 'Audits', value: 'HACCP \u00b7 IFS \u00b7 BRC \u00b7 SQF' },
      { label: 'Recall', value: 'Minutes, not days' },
    ],
    range: [
      {
        items: [
          { name: 'Batch records', note: 'Every inspection result tied to batch, product and time.' },
          { name: 'Inspection logs', note: 'Checkweigher, detector, X-ray and vision events in one place.' },
          { name: 'Serialisation & codes', note: 'Print, verify and record unit-level codes.' },
          { name: 'Audit reports', note: 'Export audit-ready reports on demand.' },
        ],
      },
    ],
  },
  {
    id: 'data-analytics',
    category: 'software',
    name: 'Data & Analytics',
    icon: 'monitor',
    image: '/products/software.jpg',
    url: 'https://safesurge.co.in/',
    description:
      'Turn inspection data into decisions. Trend giveaway, reject rates and contamination events across lines and plants, spot drifting fillers before they cost you product, and export everything to your ERP or BI tools.',
    facts: [
      { label: 'Insights', value: 'Giveaway \u00b7 Rejects \u00b7 Trends' },
      { label: 'Export', value: 'ERP \u00b7 BI \u00b7 CSV' },
      { label: 'Scope', value: 'Line \u00b7 Plant \u00b7 Group' },
    ],
    range: [
      {
        items: [
          { name: 'Giveaway analysis', note: 'See over-fill by product and filler head, and tighten it.' },
          { name: 'Reject analytics', note: 'Which products, shifts and machines reject most, and why.' },
          { name: 'Trend & drift', note: 'Catch weight and quality drift before it becomes rejects.' },
          { name: 'ERP / BI export', note: 'Scheduled exports and APIs for your existing tools.' },
        ],
      },
    ],
  },
  {
    id: 'connected-factory',
    category: 'software',
    name: 'Connected Factory',
    icon: 'layers',
    image: '/products/software.jpg',
    url: 'https://safesurge.co.in/',
    description:
      'Machines, inspection and software talking to each other. Our systems ship with OPC UA, Modbus and Ethernet as standard; we connect them \u2014 and your existing equipment \u2014 into one plant network with remote diagnostics and secure cloud access.',
    facts: [
      { label: 'Protocols', value: 'OPC UA \u00b7 Modbus \u00b7 Ethernet' },
      { label: 'Access', value: 'Remote \u00b7 Cloud' },
      { label: 'Scope', value: 'New + existing' },
    ],
    range: [
      {
        items: [
          { name: 'Machine connectivity', note: 'Bring SafeSurge and third-party machines onto one network.' },
          { name: 'Remote diagnostics', note: 'Our engineers see faults before they call you.' },
          { name: 'Cloud dashboards', note: 'Secure access to plant data from anywhere.' },
          { name: 'MES / ERP integration', note: 'Orders down, production data up.' },
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
