const fs = require('fs');
const path = require('path');

const EXCLUDED_DIRS = new Set(['openspec', 'node_modules']);
const EXCLUDED_FILES = new Set(['index.html', 'generator.html']);

const root = process.cwd();
const entries = fs.readdirSync(root, { withFileTypes: true });

const manifest = {};
for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
  if (!entry.isDirectory()) continue;
  if (entry.name.startsWith('.')) continue;
  if (EXCLUDED_DIRS.has(entry.name)) continue;

  const files = fs.readdirSync(path.join(root, entry.name))
    .filter(f => /\.html$/i.test(f) && !EXCLUDED_FILES.has(f))
    .sort((a, b) => a.localeCompare(b));

  manifest[entry.name] = files;
}

fs.writeFileSync(path.join(root, 'files.json'), JSON.stringify(manifest, null, 2) + '\n');
console.log('Generated files.json —', Object.keys(manifest).length, 'users,',
  Object.values(manifest).reduce((s, a) => s + a.length, 0), 'files');
