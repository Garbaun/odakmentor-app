const fs = require('fs');
const path = require('path');

function copyRecursiveSync(src, dest) {
  if (!fs.existsSync(src)) return;
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    for (const entry of fs.readdirSync(src)) {
      const from = path.join(src, entry);
      const to = path.join(dest, entry);
      copyRecursiveSync(from, to);
    }
  } else {
    const dir = path.dirname(dest);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.copyFileSync(src, dest);
  }
}

function publishToSubpath(rootDir, subpath) {
  const docsDir = path.join(rootDir, 'docs');
  const targetDir = path.join(rootDir, subpath);
  if (!fs.existsSync(docsDir)) {
    console.error('publish-to-subpath: docs directory not found');
    process.exit(1);
  }
  // Clean target dir if exists
  if (fs.existsSync(targetDir)) {
    fs.rmSync(targetDir, { recursive: true, force: true });
  }
  copyRecursiveSync(docsDir, targetDir);
  console.log(`publish-to-subpath: copied docs -> ${subpath}`);

  // Flatten duplicated assets path in subpath too
  const nestedAssets = path.join(targetDir, 'assets', 'assets');
  const flatAssets = path.join(targetDir, 'assets');
  if (fs.existsSync(nestedAssets)) {
    console.log('publish-to-subpath: flattening assets/assets -> assets');
    for (const entry of fs.readdirSync(nestedAssets)) {
      const from = path.join(nestedAssets, entry);
      const to = path.join(flatAssets, entry);
      copyRecursiveSync(from, to);
      console.log('publish-to-subpath: copied', path.relative(targetDir, from), '->', path.relative(targetDir, to));
    }
  }
}

publishToSubpath(process.cwd(), 'odakmentor-app');


