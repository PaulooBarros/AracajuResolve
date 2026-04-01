'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  FileText,
  Map,
  BarChart3,
  Building2,
  Users,
  Settings,
  LogOut,
  Sun,
  Moon,
  Bell,
  Search,
  Menu,
  ChevronDown,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet'
import { AuthProvider, useAuth } from '@/lib/auth-context'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

const sidebarItems = [
  { href: '/admin', label: 'Visão Geral', icon: LayoutDashboard },
  { href: '/admin/denuncias', label: 'Denúncias', icon: FileText },
  { href: '/admin/mapa', label: 'Mapa', icon: Map },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/admin/orgaos', label: 'Órgãos Responsáveis', icon: Building2 },
  { href: '/admin/usuarios', label: 'Usuários', icon: Users },
  { href: '/admin/configuracoes', label: 'Configurações', icon: Settings },
]

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, isAdmin, isLoading, logout } = useAuth()
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      router.push('/login')
    }
  }, [isLoading, isAdmin, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!isAdmin) {
    return null
  }

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 border-r border-border/50 bg-card">
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-border/50">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Map className="h-4 w-4" />
            </div>
            <span className="font-serif text-lg font-bold">
              Aracaju<span className="text-primary">Resolve</span>
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {sidebarItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? 'secondary' : 'ghost'}
                  className={cn(
                    'w-full justify-start gap-3 h-10',
                    isActive && 'bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Button>
              </Link>
            )
          })}
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-border/50">
          <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
            <Avatar className="h-9 w-9">
              <AvatarFallback className="bg-primary/10 text-primary text-sm">
                {user?.name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-xs text-muted-foreground">Administrador</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 lg:pl-64">
        {/* Header */}
        <header className="sticky top-0 z-40 h-16 flex items-center gap-4 px-4 lg:px-6 border-b border-border/50 bg-background/80 backdrop-blur-xl">
          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <div className="h-16 flex items-center px-6 border-b border-border/50">
                <Link href="/admin" className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <Map className="h-4 w-4" />
                  </div>
                  <span className="font-serif text-lg font-bold">
                    Aracaju<span className="text-primary">Resolve</span>
                  </span>
                </Link>
              </div>
              <nav className="px-4 py-6 space-y-1">
                {sidebarItems.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href
                  return (
                    <Link key={item.href} href={item.href}>
                      <Button
                        variant={isActive ? 'secondary' : 'ghost'}
                        className={cn(
                          'w-full justify-start gap-3 h-10',
                          isActive && 'bg-primary/10 text-primary'
                        )}
                      >
                        <Icon className="h-4 w-4" />
                        {item.label}
                      </Button>
                    </Link>
                  )
                })}
              </nav>
            </SheetContent>
          </Sheet>

          {/* Page Title - Will be set by each page */}
          <div className="flex-1" />

          {/* Search */}
          <div className="hidden md:flex relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar..."
              className="pl-9 h-9 bg-muted/50 border-0"
            />
          </div>

          {/* Theme Toggle */}
          <Button variant="ghost" size="icon" onClick={toggleTheme} className="h-9 w-9">
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="h-9 w-9 relative">
            <Bell className="h-4 w-4" />
            <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-primary text-[10px] text-primary-foreground items-center justify-center">
                3
              </span>
            </span>
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2 h-9 px-2">
                <Avatar className="h-7 w-7">
                  <AvatarFallback className="bg-primary/10 text-primary text-xs">
                    {user?.name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <div className="px-2 py-1.5">
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/" className="flex items-center gap-2">
                  <Map className="h-4 w-4" />
                  Ver Site
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/admin/configuracoes" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Configurações
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="text-destructive">
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </AuthProvider>
  )
}
