import '~/styles/globals.css'

import { GeistSans } from 'geist/font/sans'
import {type Viewport } from 'next'
import { SessionProvider } from 'next-auth/react'

import { TRPCReactProvider } from '~/libs/trpc/react'

const APP_NAME = 'PWA App'
const APP_DEFAULT_TITLE = '트레이딩 블로그'
const APP_TITLE_TEMPLATE = '%s'
const APP_DESCRIPTION = '트레이딩 블로그'

export const metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  icons: [{ rel: 'icon', url: '/favicon.ico' }],
  appleWebApp: {
    statusBarStyle: 'default',
    title: APP_DEFAULT_TITLE,
    // startUpImage: [],
  },
  formatDetection: {
    telephone: false,
    address: false,
  },
  openGraph: {
    type: 'website',
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: 'summary',
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  other: {
    'mobile-web-app-capable': 'yes',
  },
}

export const viewport: Viewport = {
  themeColor: '#FFFFFF',
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang='ko' className={`${GeistSans.variable}`}>
      <body>
        <SessionProvider>
          <TRPCReactProvider>{children}</TRPCReactProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
