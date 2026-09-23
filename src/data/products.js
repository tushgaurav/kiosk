/**
 * Kiosk content. Edit this file to change what visitors see.
 *
 * - `image` paths are relative to /public. Drop a 16:10-ish JPG in
 *   /public/products/ and reference it here. If the file is missing the
 *   kiosk shows a styled placeholder instead of a broken image.
 * - `video` (optional) is a short muted MP4 loop; `image` becomes its poster.
 *   Cover media sources: A&D / Mesutronic product photos (OEM partners),
 *   Pexels photos and Mixkit clips (both free for commercial use).
 * - `url` is what the QR code points to.
 * - `tile` controls the home-screen grid: `wide` tiles take 7/10 columns,
 *   `narrow` tiles take 3/10, `half` tiles take 5/10. Rows must add up to 10.
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
 * Content for the About screen (#/about). Short sections behind a switcher;
 * each section may have `text`, `points`, `stats`, `chips` and/or `contact`.
 */
export const about = {
  company: 'Safesurge Inspection Technologies Pvt. Ltd.',
  eyebrow: 'About us',
  sections: [
    {
      id: 'overview',
      label: 'Overview',
      image: '/products/x-ray.jpg',
      title: 'Inspection technology, engineered for your line.',
      text: 'An Indian industrial inspection and automation company. We deliver quality inspection and end-of-line automation for food, FMCG, pharma, packaging and manufacturing plants.',
      stats: [
        { value: '500+', label: 'Installations' },
        { value: '5', label: 'Industries' },
        { value: 'ISO 9001', label: 'Certified' },
        { value: 'India', label: 'Built in' },
      ],
      chips: {
        title: 'What we build',
        items: ['AI Vision Inspection', 'Metal Detection', 'Checkweighing', 'X-Ray Inspection', 'End-of-line Automation'],
      },
    },
    {
      id: 'vision',
      label: 'Vision Inspection',
      image: '/products/vision.jpg',
      title: 'AI that sees every defect, in real time.',
      points: [
        'Spots product defects and packaging abnormalities on the line.',
        'Flags missing or misplaced components before they ship.',
        'Cuts dependence on manual inspection; keeps quality consistent.',
      ],
      chips: {
        title: 'Industries',
        items: ['Food Processing', 'FMCG', 'Pharmaceutical', 'Packaging', 'Manufacturing'],
      },
    },
    {
      id: 'approach',
      label: 'How we work',
      image: '/products/checkweighers.jpg',
      title: 'Built around your product and process.',
      points: [
        'We start with your production challenges, not a catalogue.',
        'Feasibility trials on your actual product before you commit.',
        'Solutions engineered to integrate into your existing line.',
      ],
      stats: [
        { value: '500+', label: 'Successful installations' },
        { value: 'Scalable', label: 'Practical, reliable systems' },
      ],
    },
    {
      id: 'contact',
      label: 'Contact',
      image: '/products/case-packing.jpg',
      title: 'Let\u2019s talk about your line.',
      contact: {
        address: 'Plot 107, Sector 4, IMT Manesar, Gurugram, Haryana 122050',
        phone: '+91 124 426 2612',
        email: 'sales@safesurgeindia.com',
        web: 'safesurge.co.in',
      },
    },
  ],
}

export const products = [
  // ---- Row 1: 7 + 3 ------------------------------------------------------
  {
    id: 'checkweighers',
    name: 'Checkweighers',
    eyebrow: 'Inspection',
    partner: 'A&D Company, Japan',
    icon: 'weight',
    tile: 'wide',
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
    name: 'Metal Detectors',
    eyebrow: 'Inspection',
    partner: 'Mesutronic, Germany',
    icon: 'magnet',
    tile: 'narrow',
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

  // ---- Row 2: 5 + 5 ------------------------------------------------------
  {
    id: 'metal-separators',
    name: 'Metal Separators',
    eyebrow: 'Inspection \u00b7 Bulk & pipeline',
    partner: 'Mesutronic, Germany',
    icon: 'funnel',
    tile: 'half',
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
    id: 'combi',
    name: 'Combi',
    eyebrow: 'Checkweigher + Metal Detector',
    partner: 'A&D \u00b7 Mesutronic',
    icon: 'layers',
    tile: 'half',
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

  // ---- Row 3: 3 + 7 ------------------------------------------------------
  {
    id: 'x-ray',
    name: 'X-Ray',
    eyebrow: 'Inspection',
    partner: 'Mesutronic, Germany',
    icon: 'xray',
    tile: 'narrow',
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
  {
    id: 'conveyors',
    name: 'Conveyors',
    eyebrow: 'Material handling',
    icon: 'conveyor',
    tile: 'wide',
    image: '/products/conveyors.jpg',
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

  // ---- Row 4: 5 + 5 ------------------------------------------------------
  {
    id: 'vision',
    name: 'AI-powered Vision',
    eyebrow: 'Quality inspection',
    icon: 'eye',
    tile: 'half',
    image: '/products/vision.jpg',
    url: 'https://safesurge.co.in/product-category/inspection-systems/vision-inspection/',
    description:
      'Camera-based inspection with AI models trained on your product. Checks every pack at line speed for print, codes, fill level, seal quality and foreign material, rejects what fails, and keeps learning as new defect types appear.',
    facts: [
      { label: 'Speed', value: 'Line speed' },
      { label: 'Inspections', value: '7 types' },
      { label: 'Model', value: 'Trained on you' },
    ],
    range: [
      {
        title: 'Quality inspection',
        items: [
          { name: 'OCR / OCV', note: 'Read and verify batch codes, dates and text.' },
          { name: 'Packaging inspection', note: 'Label presence, position, seal and damage.' },
          { name: 'Fill level detection', note: 'Under- and over-fill on bottles, jars and pouches.' },
          { name: 'Foreign material', note: 'Visible contaminants on product or in the pack.' },
          { name: 'Coding & inspection', note: 'Print, then verify, in one station.' },
          { name: 'Track & trace', note: 'Serialise and record every unit.' },
          { name: 'Barcode inspection', note: 'Grade and verify 1D / 2D codes.' },
        ],
      },
    ],
  },
  {
    id: 'robotics',
    name: 'Robotics',
    eyebrow: 'End-of-line automation',
    icon: 'robot',
    tile: 'half',
    image: '/products/robotics.jpg',
    video: '/products/robotics.mp4',
    url: 'https://safesurge.co.in/',
    description:
      'Robotic cells that take over the repetitive, heavy work at the end of the line: loading packs into cases, picking and placing product, and stacking finished cases onto pallets. Integrated with our conveyors, checkweighers and vision so only good product reaches the pallet.',
    facts: [
      { label: 'Tasks', value: 'Pack \u00b7 Pick \u00b7 Palletise' },
      { label: 'Integration', value: 'Conveyor \u00b7 CW \u00b7 Vision' },
      { label: 'Shift', value: '24 / 7' },
    ],
    range: [
      {
        items: [
          { name: 'Box packing', note: 'Collate and load pouches, cartons or bottles into cases.' },
          { name: 'Pick and place', note: 'High-speed handling of individual products between stations.' },
          { name: 'Palletisation / Depalletisation', note: 'Stack and unstack cases to programmed patterns.' },
        ],
      },
    ],
  },

  // ---- Row 5: 7 + 3 ------------------------------------------------------
  {
    id: 'case-packing',
    name: 'Case Erectors & Sealers',
    eyebrow: 'Secondary packaging',
    icon: 'box',
    tile: 'wide',
    image: '/products/case-packing.jpg',
    video: '/products/case-packing.mp4',
    url: 'https://safesurge.co.in/',
    description:
      'Automatic case erectors form and bottom-seal corrugated boxes on demand; case sealers close the top with tape or hot-melt after packing. Sized to your case range and paired with our robotic box packers for a hands-free end of line.',
    facts: [
      { label: 'Erector', value: 'Form + seal' },
      { label: 'Sealer', value: 'Tape \u00b7 Hot-melt' },
      { label: 'Pairs with', value: 'Robotic packing' },
    ],
    range: [
      {
        items: [
          { name: 'Case Erector', note: 'Pulls flat blanks from a magazine, squares the case and seals the bottom.' },
          { name: 'Case Sealer', note: 'Folds flaps and seals the top; fixed-size or random-size versions.' },
        ],
      },
    ],
  },
  {
    id: 'process',
    name: 'Process Machines',
    eyebrow: 'Processing',
    icon: 'gear',
    tile: 'narrow',
    image: '/products/process.jpg',
    url: 'https://safesurge.co.in/',
    description:
      'Custom-built process equipment for the stages before packing: stainless-steel storage tanks, hoppers and material-handling systems designed around your product and integrated with our conveying and inspection lines.',
    facts: [
      { label: 'Build', value: 'Stainless steel' },
      { label: 'Scope', value: 'Tanks \u00b7 Hoppers' },
      { label: 'Design', value: 'Hygienic' },
    ],
    range: [],
  },
]
