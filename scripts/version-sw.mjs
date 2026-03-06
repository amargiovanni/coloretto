/**
 * Stamps sw.js with a build-time version (timestamp) so the cache
 * is automatically invalidated on every deploy.
 */
import { readFileSync, writeFileSync } from 'fs';

const SW_PATH = new URL('../public/sw.js', import.meta.url);
const version = `v${Date.now()}`;

let content = readFileSync(SW_PATH, 'utf-8');
content = content.replace(
    /const VERSION = '[^']+';/,
    `const VERSION = '${version}';`
);
writeFileSync(SW_PATH, content, 'utf-8');

console.log(`[version-sw] SW version set to ${version}`);
