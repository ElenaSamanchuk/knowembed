#!/usr/bin/env node
/**
 * Copy generated icon.png into Android mipmap + splash drawables.
 */
import { execSync } from 'node:child_process';
import { copyFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const icon = path.join(root, 'resources/icon.png');
const res = path.join(root, 'android/app/src/main/res');

const sizes = {
  'mipmap-mdpi': 48,
  'mipmap-hdpi': 72,
  'mipmap-xhdpi': 96,
  'mipmap-xxhdpi': 144,
  'mipmap-xxxhdpi': 192,
};

for (const [folder, size] of Object.entries(sizes)) {
  const dir = path.join(res, folder);
  for (const name of ['ic_launcher.png', 'ic_launcher_round.png', 'ic_launcher_foreground.png']) {
    const out = path.join(dir, name);
    execSync(`sips -z ${size} ${size} "${icon}" --out "${out}"`, { stdio: 'pipe' });
  }
}

const splashDirs = readdirSync(res).filter((d) => d.startsWith('drawable') && d.includes('splash') === false);
for (const folder of readdirSync(res)) {
  if (!folder.startsWith('drawable')) continue;
  const splash = path.join(res, folder, 'splash.png');
  try {
    copyFileSync(icon, splash);
  } catch {
    /* folder may not have splash.png */
  }
}

console.log('Android icons updated');
