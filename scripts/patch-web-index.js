const fs = require('fs');
const path = require('path');

function resolveOutputDir(rootDir) {
  // Prefer env var, then existing 'docs', then 'web-build'
  const fromEnv = process.env.EXPO_EXPORT_OUTPUT_DIR && path.join(rootDir, process.env.EXPO_EXPORT_OUTPUT_DIR);
  const candidates = [fromEnv, path.join(rootDir, 'docs'), path.join(rootDir, 'web-build')].filter(Boolean);
  for (const dir of candidates) {
    if (fs.existsSync(path.join(dir, 'index.html'))) {
      return dir;
    }
  }
  return null;
}

function patchIndexHtml(rootDir) {
  const outputDir = resolveOutputDir(rootDir);
  if (!outputDir) {
    console.error('patch-web-index: Could not locate export output dir (tried EXPO_EXPORT_OUTPUT_DIR, docs, web-build)');
    process.exit(1);
  }

  const indexPath = path.join(outputDir, 'index.html');
  let html = fs.readFileSync(indexPath, 'utf8');
  // Ensure ESM
  html = html.replace('<script src="', '<script type="module" src="');
  // Ensure <base href="./"> exists for relative module resolution on subpaths
  if (!/\<base\s+href=\"\.\/\"/i.test(html)) {
    html = html.replace('<head>', '<head>\n    <base href=\"./\">');
  }
  // Make asset/script paths relative for GitHub Pages subpath
  html = html.replace('href="/favicon.ico"', 'href="./favicon.ico"');
  html = html.replace('src="/_expo/', 'src="./_expo/');
  // Cache bust entry bundle to avoid GH Pages CDN caching old file
  try {
    html = html.replace(/<script type=\"module\" src=\"([^\"]+)\"/,
      (m, p1) => `<script type=\"module\" src=\"${p1}${p1.includes('?') ? '&' : '?'}v=${Date.now()}\"`);
  } catch {}
  fs.writeFileSync(indexPath, html, 'utf8');
  console.log(`patch-web-index: Patched ${path.relative(rootDir, indexPath)} for GH Pages`);

  // Ensure GH Pages doesn't strip _expo directory
  const noJekyllPath = path.join(outputDir, '.nojekyll');
  try {
    fs.writeFileSync(noJekyllPath, '', 'utf8');
    console.log(`patch-web-index: wrote .nojekyll in ${path.relative(rootDir, outputDir)}`);
  } catch (e) {
    console.warn('patch-web-index: failed to write .nojekyll', e);
  }

  // Ensure 404.html exists for SPA fallback on GitHub Pages
  try {
    const indexHtml = fs.readFileSync(indexPath, 'utf8');
    const notFoundPath = path.join(outputDir, '404.html');
    fs.writeFileSync(notFoundPath, indexHtml, 'utf8');
    console.log(`patch-web-index: wrote 404.html in ${path.relative(rootDir, outputDir)}`);
  } catch (e) {
    console.warn('patch-web-index: failed to write 404.html', e);
  }
}

patchIndexHtml(process.cwd());


