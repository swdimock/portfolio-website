/** @type {import('next').NextConfig} */
const path = require('path');
const nextTranslate = require('next-translate');
const { config } = require('process');

module.exports = nextTranslate({
  webpack: (config, { isServer, webpack }) => {
    return config;
  },
  reactStrictMode: true,
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
})
