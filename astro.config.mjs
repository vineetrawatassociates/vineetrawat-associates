import { defineConfig } from 'astro/config';
import rehypeRaw from 'rehype-raw';

export default defineConfig({
  site: 'https://vineetrawatassociates.com',
  markdown: {
    rehypePlugins: [rehypeRaw],
  },
});
