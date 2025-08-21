const fs = require('fs');
const path = require('path');

function patchIndexHtml(rootDir) {
  const indexPath = path.join(rootDir, 'web-build', 'index.html');
  if (!fs.existsSync(indexPath)) {
    console.error('patch-web-index: index.html not found at', indexPath);
    process.exit(1);
  }
  let html = fs.readFileSync(indexPath, 'utf8');
  // Ensure ESM
  html = html.replace('<script src="', '<script type="module" src="');
  // Make asset/script paths relative for GitHub Pages subpath
  html = html.replace('href="/favicon.ico"', 'href="./favicon.ico"');
  html = html.replace('src="/_expo/', 'src="./_expo/');
  fs.writeFileSync(indexPath, html, 'utf8');
  console.log('patch-web-index: applied type="module" and relative paths for GH Pages');

  // Ensure GH Pages doesn't strip _expo directory
  const noJekyllPath = path.join(rootDir, 'web-build', '.nojekyll');
  try {
    fs.writeFileSync(noJekyllPath, '', 'utf8');
    console.log('patch-web-index: wrote .nojekyll');
  } catch (e) {
    console.warn('patch-web-index: failed to write .nojekyll', e);
  }
}

patchIndexHtml(process.cwd());


