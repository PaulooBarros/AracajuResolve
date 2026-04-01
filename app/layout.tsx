import type { Metadata, Viewport } from 'next'
import { Inter, Plus_Jakarta_Sans } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/theme-provider'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const plusJakarta = Plus_Jakarta_Sans({ 
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Aracaju Resolve | Monitoramento Urbano',
  description: 'Plataforma de monitoramento urbano para a cidade de Aracaju. Registre denúncias, acompanhe a resolução e ajude a priorizar o que realmente importa.',
  keywords: ['Aracaju', 'denúncias', 'monitoramento urbano', 'cidade', 'problemas urbanos', 'cidadania'],
  authors: [{ name: 'Aracaju Resolve' }],
  openGraph: {
    title: 'Aracaju Resolve | Monitoramento Urbano',
    description: 'Transforme problemas da cidade em soluções visíveis.',
    type: 'website',
    locale: 'pt_BR',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#539FA2' },
    { media: '(prefers-color-scheme: dark)', color: '#0F172A' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${inter.variable} ${plusJakarta.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
