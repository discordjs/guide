import { docsearchPlugin } from '@vuepress/plugin-docsearch';
import { googleAnalyticsPlugin } from '@vuepress/plugin-google-analytics';
import path from 'node:path';
import { defineUserConfig, viteBundler } from 'vuepress-vite';
import sidebar from './sidebar';
import { discordJSTheme } from './theme';

const config = defineUserConfig({
  bundler: viteBundler(),
  templateDev: path.join(__dirname, 'templates', 'index.dev.html'),
  templateBuild: path.join(__dirname, 'templates', 'index.build.html'),
  lang: 'en-US',
  title: 'discord.js Guide',
  description:
    'Imagine a guide... that explores the many possibilities for your discord.js bot.',
  head: [
    ['meta', { charset: 'utf-8' }],
    [
      'meta',
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
    ],
    ['link', { rel: 'icon', href: '/favicon.png' }],
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
    ['meta', { name: 'twitter:card', content: 'summary' }],
    ['meta', { property: 'og:title', content: 'discord.js Guide' }],
    [
      'meta',
      {
        property: 'og:description',
        content:
          'Imagine a guide... that explores the many possibilities for your discord.js bot.',
      },
    ],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:url', content: 'https://discordjs.guide/' }],
    ['meta', { property: 'og:locale', content: 'en_US' }],
    ['meta', { property: 'og:image', content: '/meta-image.png' }],
  ],
  theme: discordJSTheme({
    contributors: false,
    sidebar,
    repo: 'discordjs/guide',
    docsDir: 'guide',
    sidebarDepth: 3,
    editLinks: true,
    lastUpdated: true,
    navbar: [
      {
        text: 'Voice',
        link: '/voice/',
      },
      {
        text: 'Documentation',
        link: 'https://discord.js.org/#/',
      },
    ],
    themePlugins: {
      mediumZoom: false,
    },
  }),
  plugins: [],
});

const {
  ALGOLIA_DOCSEARCH_API_KEY,
  ALGOLIA_DOCSEARCH_APP_ID,
  GOOGLE_ANALYTICS_ID,
  NODE_ENV,
} = process.env;

if (
  NODE_ENV === 'production' &&
  ALGOLIA_DOCSEARCH_API_KEY &&
  GOOGLE_ANALYTICS_ID
) {
  config.plugins.push(
    docsearchPlugin({
      appId: ALGOLIA_DOCSEARCH_APP_ID,
      apiKey: ALGOLIA_DOCSEARCH_API_KEY,
      indexName: 'discordjs',
      placeholder: 'Search guide',
    }),
    googleAnalyticsPlugin({ id: GOOGLE_ANALYTICS_ID })
  );
}

export default config;
