import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { AuthProvider } from '@/lib/auth-context'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </AuthProvider>
  )
}
