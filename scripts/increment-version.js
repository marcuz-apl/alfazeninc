const fs = require('fs');
const path = require('path');

const pkgPath = path.resolve(__dirname, '..', 'package.json');
if (!fs.existsSync(pkgPath)) {
  console.error('package.json not found at:', pkgPath);
  process.exit(1);
}

const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
const versionStr = pkg.version || '1.0.0';
const match = versionStr.match(/^(\d+)\.(\d+)\.(\d+)$/);

if (!match) {
  console.error('Invalid version format in package.json:', versionStr);
  process.exit(1);
}

let m = parseInt(match[1], 10);
let n = parseInt(match[2], 10);
let p = parseInt(match[3], 10);

// Increment patch (p)
p += 1;

// If patch version reaches 10, reset to 0 and increment minor version (n)
if (p >= 10) {
  p = 0;
  n += 1;
}

// If minor version reaches 10, reset to 0 and increment major version (m)
if (n >= 10) {
  n = 0;
  m += 1;
}

// If major version exceeds 20, wrap around back to initial 1.0.0
if (m > 20) {
  m = 1;
  n = 0;
  p = 0;
}

const nextVersion = `${m}.${n}.${p}`;
pkg.version = nextVersion;

fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
console.log(`Version incremented to: ${nextVersion}`);
