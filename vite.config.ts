import { copyFileSync } from 'node:fs';
import { join } from 'node:path';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

const ghPagesBase = '/knowembed/';
const isGhPages = process.env.GITHUB_PAGES === 'true';

function ghPages404(): Plugin {
  return {
    name: 'gh-pages-404',
    closeBundle() {
      if (!isGhPages) return;
      const out = join(process.cwd(), 'dist');
      copyFileSync(join(out, 'index.html'), join(out, '404.html'));
    },
  };
}

export default defineConfig({
  plugins: [react(), ghPages404()],
  base: isGhPages ? ghPagesBase : '/',
});
