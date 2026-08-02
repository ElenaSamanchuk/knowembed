#!/usr/bin/env node
import { copyFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = path.join(root, 'android/app/build/outputs/apk/debug/app-debug.apk');
const destDir = path.join(root, 'public/downloads');
const dest = path.join(destDir, 'knowembed.apk');

mkdirSync(destDir, { recursive: true });
copyFileSync(src, dest);
console.log(`Copied APK → ${dest}`);
