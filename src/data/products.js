/**
 * Kiosk content. Edit this file to change what visitors see.
 *
 * - `image` paths are relative to /public. Drop a 16:10-ish JPG in
 *   /public/products/ and reference it here. If the file is missing the
 *   kiosk shows a styled placeholder instead of a broken image.
 * - `url` is what the QR code points to.
 * - `tile` controls the home-screen grid: `wide` tiles take 7/10 columns,
 *   `narrow` tiles take 3/10, `half` tiles take 5/10.
 */

export const brand = {
  name: 'SafeSurge',
  logo: '/safesurge.png',
  site: 'https://safesurge.com',
  tagline: 'Learn what we do.',
}

export const products = [
  {
    id: 'conveyors',
    name: 'Conveyors',
    eyebrow: 'Material handling',
    icon: 'conveyor',
    tile: 'half',
    image: '/products/conveyors.jpg',
    url: 'https://safesurge.com/conveyors',
    description:
      'Keep your operations moving with our reliable, high-performance conveyor belts, designed for smooth and efficient material handling across a wide range of industrial applications.',
  },
  {
    id: 'guarding',
    name: 'Safety Guarding',
    eyebrow: 'Machine protection',
    icon: 'shield',
    tile: 'half',
    image: '/products/guarding.jpg',
    url: 'https://safesurge.com/guarding',
    description:
      'Modular perimeter and point-of-operation guarding that keeps people clear of moving machinery without slowing down production. Engineered to ISO 14120 and ready for fast installation.',
  },
  {
    id: 'automation',
    name: 'Automation',
    eyebrow: 'Controls & robotics',
    icon: 'robot',
    tile: 'wide',
    image: '/products/automation.jpg',
    url: 'https://safesurge.com/automation',
    description:
      'From PLC panels to fully integrated robotic cells, we design, build and commission automation that increases throughput while making every station safer to work around.',
  },
  {
    id: 'service',
    name: 'Service',
    eyebrow: 'Support & maintenance',
    icon: 'wrench',
    tile: 'narrow',
    image: '/products/service.jpg',
    url: 'https://safesurge.com/service',
    description:
      'Preventive maintenance, safety audits and 24/7 breakdown support from engineers who know your line. We keep your equipment compliant, certified and running.',
  },
]
