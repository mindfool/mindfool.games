module.exports = {
  globDirectory: 'dist/',
  globPatterns: [
    '**/*.{js,css,html,json,ico,png,svg,woff,woff2}'
  ],
  globIgnores: [
    '**/node_modules/**/*',
    'sw.js',
    'workbox-*.js'
  ],
  swDest: 'dist/sw.js',
  skipWaiting: false,  // Prompt pattern for updates
  clientsClaim: true,
  runtimeCaching: [
    {
      // Cache page navigations with NetworkFirst
      urlPattern: ({ request }) => request.mode === 'navigate',
      handler: 'NetworkFirst',
      options: {
        cacheName: 'pages',
        networkTimeoutSeconds: 3,
      },
    },
    {
      // Cache images with CacheFirst
      urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'images',
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
        },
      },
    },
    {
      // Cache fonts
      urlPattern: /\.(?:woff|woff2|ttf|otf|eot)$/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'fonts',
        expiration: {
          maxEntries: 10,
          maxAgeSeconds: 365 * 24 * 60 * 60, // 1 year
        },
      },
    },
    {
      // Cache audio/video with StaleWhileRevalidate
      urlPattern: /\.(?:mp3|mp4|wav|ogg)$/,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'media',
        expiration: {
          maxEntries: 20,
          maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
        },
      },
    },
  ],
};
