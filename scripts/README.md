build-kenya-wards.js

This script attempts to download authoritative Kenya constituency/ward sources (IEBC and community datasets), parse them, and produce `src/data/kenyaCounties.generated.js`.

Prerequisites
- Node.js >=14
- Install dependencies:

```bash
npm install node-fetch@2 pdf-parse
```

Run

```bash
node scripts/build-kenya-wards.js
```

Output
- `src/data/kenyaCounties.generated.js` — open and verify accuracy. If correct, rename or replace the existing `src/data/kenyaCounties.js` with the generated file.

Notes
- PDF parsing is heuristic and may miss structured labels; verify critical counties/wards (e.g., Maua / Meru mappings).
- You can add more reliable raw CSV/JSON URLs to the `SOURCES` array in the script for better coverage.
