import { defaultCache } from '@serwist/next/worker'
import type { PrecacheEntry, SerwistGlobalConfig } from 'serwist'
import { Serwist } from 'serwist'

// This declares the value of `injectionPoint` to TypeScript.
// `injectionPoint` is the string that will be replaced by the
// actual precache manifest. By default, this string is set to
// `"self.__SW_MANIFEST"`.
declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined
  }
}

declare const self: ServiceWorkerGlobalScope

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  precacheOptions: {
    cleanupOutdatedCaches: true,
    cleanURLs: false,
    directoryIndex: null,
    fallbackToNetwork: true,
    ignoreURLParametersMatching: [/.*/],
  },
  skipWaiting: true,
  navigationPreload: true,
  clientsClaim: true,
  runtimeCaching: defaultCache,
  offlineAnalyticsConfig: false,
  disableDevLogs: true,
  fallbacks: {
    entries: [
      {
        matcher({ request }) {
          return request.destination === 'document'
        },
        url: '/~fallback',
      },
    ],
  },
})

self.addEventListener('install', event => {
  serwist.handleInstall(event).catch(error => {
    console.error(error)
  })
})

self.addEventListener('activate', event => {
  serwist.handleActivate(event).catch(error => {
    console.error(error)
  })
})

self.addEventListener('message', event => {
  serwist.handleCache(event)
})

serwist.addEventListeners()
