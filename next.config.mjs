import fs from 'fs';
import path from 'path';

import {
  PHASE_DEVELOPMENT_SERVER,
  PHASE_PRODUCTION_BUILD,
} from 'next/constants.js'

/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful for Docker builds.
 */
await import('./src/env.js')

/** @type {import("next").NextConfig} */
const nextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'tailwindui.com',
        port: '',
        pathname: '/img/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cloudflare-ipfs.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'ssl.pstatic.net',
        port: '',
        pathname: '/**',
      },
    ],
  },
}

const revision = crypto.randomUUID();

const getAllImages = (/** @type {String} */ dir, /** @type {Array<{ url: String, revision: String }>} */fileList = []) => {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      getAllImages(filePath, fileList);
    } else if (/\.(jpg|jpeg|png|ico|svg)$/.test(file)) {
      fileList.push({ url: filePath.replace(/^.*public/, ''), revision });
    }
  });

  return fileList;
};

const publicDir = path.join(import.meta.dirname, 'public');
const imageEntries = getAllImages(publicDir);

/** @type {(phase: string, defaultConfig: import("next").NextConfig) => Promise<import("next").NextConfig>} */
export default async phase => {
  /** @type {import("next").NextConfig} */
  if (phase === PHASE_DEVELOPMENT_SERVER || phase === PHASE_PRODUCTION_BUILD) {
    const withSerwist = (await import("@serwist/next")).default({
      disable: true, // true to disable PWA
      swSrc: "app/sw.ts",
      swDest: "public/sw.js",
      additionalPrecacheEntries: [
        { url: '/', revision },
        { url: '/~fallback', revision },

        { url: '/manifest.json', revision },

        ...imageEntries,
      ],
      // cacheOnNavigation: true
    });

    return withSerwist(nextConfig)
  }

  return nextConfig
}
