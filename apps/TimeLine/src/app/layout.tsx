import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import { RoleProvider } from '@/lib/role-context'
import { AppApolloProvider } from '@/components/providers/apollo-provider'
import { ThemeProvider } from '@/components/theme-provider'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Academic TimeLine - Өрөө удирдлагын систем',
  description: 'Сургуулийн өрөө болон төхөөрөмжийн удирдлагын систем',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="mn" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased bg-background text-foreground`}>
        <Script id="esbuild-name-helper" strategy="beforeInteractive">
          {`
            window.__name ||= function(target, value) {
              return Object.defineProperty(target, "name", { value: value, configurable: true });
            };
          `}
        </Script>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AppApolloProvider>
            <RoleProvider>
              {children}
            </RoleProvider>
          </AppApolloProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
