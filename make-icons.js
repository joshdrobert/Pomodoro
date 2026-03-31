const fs = require('fs');
const sharp = require('sharp');

// Main App Icon (Beautiful Vector Tomato)
const iconSvg = `
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="tomGradient" cx="35%" cy="30%" r="65%">
      <stop offset="0%" stop-color="#ff8e8e" />
      <stop offset="35%" stop-color="#ff6b6b" />
      <stop offset="75%" stop-color="#e74c3c" />
      <stop offset="100%" stop-color="#c0392b" />
    </radialGradient>
  </defs>
  <!-- Main Body -->
  <path d="M 256 64 C 90 64 32 160 32 280 C 32 410 110 470 256 470 C 402 470 480 410 480 280 C 480 160 422 64 256 64 Z" fill="url(#tomGradient)" stroke="#c0392b" stroke-width="6"/>
  
  <!-- Blush -->
  <ellipse cx="130" cy="300" rx="36" ry="20" fill="#f8a5c2" opacity="0.6" />
  <ellipse cx="382" cy="300" rx="36" ry="20" fill="#f8a5c2" opacity="0.6" />
  
  <!-- Eyes -->
  <circle cx="170" cy="240" r="18" fill="#1a1a1a" />
  <circle cx="176" cy="234" r="6" fill="white" />
  
  <circle cx="342" cy="240" r="18" fill="#1a1a1a" />
  <circle cx="348" cy="234" r="6" fill="white" />
  
  <!-- Mouth -->
  <path d="M 230 276 Q 256 300 282 276" stroke="#1a1a1a" stroke-width="8" fill="none" stroke-linecap="round" />
  
  <!-- Stem & Calyx -->
  <g transform="translate(256, 74)">
    <rect x="-10" y="-45" width="20" height="50" fill="#1e8449" rx="8" />
    <path d="M 0,-10 C 20,20 60,30 80,10" stroke="#27ae60" stroke-width="24" fill="none" stroke-linecap="round" />
    <path d="M 0,-10 C -20,20 -60,30 -80,10" stroke="#27ae60" stroke-width="24" fill="none" stroke-linecap="round" />
    <path d="M 0,-10 C 10,-20 40,-40 50,-60" stroke="#27ae60" stroke-width="18" fill="none" stroke-linecap="round" />
    <path d="M 0,-10 C -10,-20 -40,-40 -50,-60" stroke="#27ae60" stroke-width="18" fill="none" stroke-linecap="round" />
    <circle cx="0" cy="-10" r="18" fill="#1e8449" />
  </g>
  
  <!-- Highlight -->
  <ellipse cx="140" cy="150" rx="45" ry="30" fill="white" opacity="0.3" transform="rotate(-35 140 150)" />
</svg>
`;

// Tray Icon Base (Monochrome black for macOS Template)
const traySvg1x = `
<svg width="22" height="22" viewBox="0 0 22 22" xmlns="http://www.w3.org/2000/svg">
  <path d="M 11 5 C 4.5 5 2.5 8 2.5 12.5 C 2.5 17.5 5 20.5 11 20.5 C 17 20.5 19.5 17.5 19.5 12.5 C 19.5 8 17.5 5 11 5 Z" fill="none" stroke="#000000" stroke-width="1.8" />
  
  <!-- Stem -->
  <path d="M 11 5 L 11 1 C 12.5 1 13 0.5 14 0 M 11 5 C 13 6 15 5 16 3 M 11 5 C 9 6 7 5 6 3" fill="none" stroke="#000000" stroke-width="1.8" stroke-linecap="round" />
  
  <!-- Face -->
  <circle cx="7.5" cy="12.5" r="1.5" fill="#000000" />
  <circle cx="14.5" cy="12.5" r="1.5" fill="#000000" />
  <path d="M 10 15 Q 11 16.5 12 15" fill="none" stroke="#000000" stroke-width="1.2" stroke-linecap="round" />
</svg>
`;

// Build configurations
const jobs = [
  { input: Buffer.from(iconSvg), width: 512, height: 512, out: 'icon.png' },
  // Native tray
  { input: Buffer.from(traySvg1x), width: 22, height: 22, out: 'trayTemplate.png' },
  // High-res retina tray
  { input: Buffer.from(traySvg1x), width: 44, height: 44, out: 'trayTemplate@2x.png' },
];

Promise.all(jobs.map(job => 
  sharp(job.input)
    .resize(job.width, job.height)
    .png()
    .toFile(job.out)
)).then(() => {
  console.log("Icons successfully generated as true transparent PNGs.");
}).catch(console.error);
