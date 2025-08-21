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
    fs.copyFileSync(src, dest);
  }
}

function publishDocsToRoot(rootDir) {
  const docsDir = path.join(rootDir, 'docs');
  const entries = ['index.html', '404.html', 'favicon.ico', 'metadata.json', '.nojekyll', '_expo', 'assets'];
  for (const entry of entries) {
    const from = path.join(docsDir, entry);
    const to = path.join(rootDir, entry);
    if (fs.existsSync(from)) {
      copyRecursiveSync(from, to);
      console.log('publish-to-root: copied', path.relative(rootDir, from), '->', path.relative(rootDir, to));
    } else {
      console.warn('publish-to-root: missing', path.relative(rootDir, from));
    }
  }
}

publishDocsToRoot(process.cwd());


