const fs = require('fs');
const path = require('path');
let fetch;
// prefer global fetch (Node 18+)
if (global.fetch) {
  fetch = global.fetch;
} else {
  // lightweight fetch fallback using built-in http/https
  const http = require('http');
  const https = require('https');
  fetch = (url) => new Promise((resolve, reject) => {
    const lib = url.startsWith('https') ? https : http;
    lib.get(url, (res) => {
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => {
        const body = Buffer.concat(chunks);
        resolve({
          ok: res.statusCode >= 200 && res.statusCode < 300,
          status: res.statusCode,
          statusText: res.statusMessage,
          headers: {
            get: (name) => res.headers[name.toLowerCase()] || null,
          },
          buffer: async () => body,
          text: async () => body.toString('utf8'),
          json: async () => JSON.parse(body.toString('utf8')),
        });
      });
    }).on('error', reject);
  });
}
let pdfParse;
try {
  pdfParse = require('pdf-parse');
} catch (e) {
  pdfParse = null;
}

const OUT_PATH = path.join(__dirname, '..', 'src', 'data', 'kenyaCounties.generated.js');

// Candidate sources (we'll try each and merge results)
const SOURCES = [
  {
    name: 'IEBC Boundary PDF (final report)',
    url: 'https://www.iebc.or.ke/uploads/resources/9fIr43YjUT.pdf',
    type: 'pdf',
  },
  // Community-maintained CSV/JSON candidates (may change); script will skip if 404
  { name: 'Kenya admin CSV (kenya-ogd)', url: 'https://raw.githubusercontent.com/kenya-ogd/kenya-admin-boundaries/main/wards.csv', type: 'csv'},
  { name: 'Geohack/geo CSV candidate', url: 'https://raw.githubusercontent.com/geohacker/kenya/master/constituencies/wards.csv', type: 'csv'},
  // Add more candidate URLs here if you know them
];

function parseCsv(text) {
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  const hdr = lines.shift().split(',').map(h => h.trim().toLowerCase());
  const rows = lines.map(line => {
    const cols = line.split(',').map(c => c.trim());
    const obj = {};
    hdr.forEach((h, i) => obj[h] = cols[i] || '');
    return obj;
  });
  return rows;
}

function pushRow(coll, county, constituency, ward) {
  if (!county || !constituency || !ward) return;
  const c = county.trim();
  const con = constituency.trim();
  const w = ward.trim();
  if (!coll[c]) coll[c] = {};
  if (!coll[c][con]) coll[c][con] = new Set();
  coll[c][con].add(w);
}

(async function main(){
  console.log('Running build-kenya-wards.js — this runs locally and may take a few minutes.');
  const coll = {}; // county -> constituency -> Set(wards)

  for (const src of SOURCES) {
    try {
      console.log('Fetching', src.name, src.url);
      const res = await fetch(src.url);
      if (!res.ok) {
        console.warn('  Skipped (not ok):', res.status, res.statusText);
        continue;
      }
      const ctype = res.headers.get('content-type') || '';
      if (src.type === 'pdf' || ctype.includes('pdf')) {
        if (!pdfParse) {
          console.warn('  PDF parsing skipped (pdf-parse not installed). Install with: npm install pdf-parse');
          continue;
        }
        const buffer = await res.buffer();
        const data = await pdfParse(buffer);
        const text = data.text;
        // crude text parsing: look for lines that resemble County / Constituency / Ward
        const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
        let currentCounty = '';
        let currentCon = '';
        for (const line of lines) {
          // matches like "County: X" or all-caps county name
          const countyMatch = line.match(/^(?:County|COUNTY|County of)[:\s]*([A-Za-z'\- ]{2,})$/i);
          if (countyMatch) {
            currentCounty = countyMatch[1].trim();
            continue;
          }
          // try constituency headings
          const conMatch = line.match(/^([A-Za-z'\- ]+)(?: Constituency)?$/i);
          if (conMatch && line.toLowerCase().includes('constituency')) {
            currentCon = conMatch[1].trim();
            continue;
          }
          // wards may appear as lines; heuristic: short names
          if (currentCounty && currentCon && line.length < 60 && /^[A-Za-z'\- ()]+$/.test(line)) {
            pushRow(coll, currentCounty, currentCon, line);
          }
        }
      } else if (ctype.includes('text') || ctype.includes('csv') || src.type === 'csv') {
        const text = await res.text();
        const rows = parseCsv(text);
        for (const r of rows) {
          // try common header names
          const county = r.county || r.county_name || r.countyname || r.county_name_en || r.countyname_en || r.County || r.COUNTY || r.county_name_en;
          const constituency = r.constituency || r.constituency_name || r.constituencyname || r.CONSTITUENCY || r.Constituency;
          const ward = r.ward || r.ward_name || r.wardname || r.WARD || r.Ward;
          if (county && constituency && ward) pushRow(coll, county, constituency, ward);
        }
      } else if (ctype.includes('json')) {
        const json = await res.json();
        // try common shapes: array of features or simple records
        const arr = Array.isArray(json) ? json : (json.features || json.data || []);
        for (const item of arr) {
          const props = item.properties || item;
          const county = props.county || props.COUNTY || props.county_name;
          const constituency = props.constituency || props.CONSTITUENCY || props.constituency_name;
          const ward = props.ward || props.WARD || props.ward_name;
          if (county && constituency && ward) pushRow(coll, county, constituency, ward);
        }
      } else {
        console.warn('  Unknown content type:', ctype);
      }
    } catch (err) {
      console.warn('  Error fetching/parsing', src.url, err.message);
    }
  }

  // convert coll to objects with arrays
  const countyData = {};
  const counties = Object.keys(coll).sort();
  for (const county of counties) {
    countyData[county] = { constituencies: {} };
    const cons = Object.keys(coll[county]).sort();
    for (const con of cons) {
      const wards = Array.from(coll[county][con]).sort();
      countyData[county].constituencies[con] = wards;
    }
  }

  const output = `// Auto-generated by scripts/build-kenya-wards.js - please verify
module.exports = {
  counties: ${JSON.stringify(counties, null, 2)},
  countyData: ${JSON.stringify(countyData, null, 2)}
};
`;

  fs.writeFileSync(OUT_PATH, output, 'utf8');
  console.log('Wrote', OUT_PATH);
  console.log('Post-run: open the generated file, verify entries (especially ambiguous names), then rename to kenyaCounties.js to use in app.');
})();
