import { defineConfig } from 'vite';

const repo = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? '';
const base = process.env.NODE_ENV === 'production' && repo ? `/${repo}/` : '/';

export default defineConfig({
  base,
  test: {
    environment: 'node'
  }
});
