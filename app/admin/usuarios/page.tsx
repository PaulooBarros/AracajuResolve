'use client'

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Users,
  UserCheck,
  Shield,
  FileText,
  Search,
  Loader2,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useProfiles } from '@/lib/profiles-store'
import { cn } from '@/lib/utils'

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
}

export default function AdminUsersPage() {
  const { users, isLoading, totalUsers, totalAdmins, totalProfiles } = useProfiles()
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('all')

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        search === '' ||
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())

      const matchesRole = roleFilter === 'all' || user.role === roleFilter
      return matchesSearch && matchesRole
    })
  }, [roleFilter, search, users])

  if (isLoading) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold">Usuarios</h1>
        <p className="text-muted-foreground text-sm">Lista real de perfis cadastrados no Supabase.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        <motion.div variants={fadeInUp} initial="initial" animate="animate" transition={{ duration: 0.3 }}>
          <Card className="border-border/50">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-serif text-3xl font-bold">{totalProfiles}</p>
                <p className="text-sm text-muted-foreground">Total</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={fadeInUp} initial="initial" animate="animate" transition={{ duration: 0.3, delay: 0.05 }}>
          <Card className="border-border/50">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-emerald-500/10">
                <UserCheck className="h-6 w-6 text-emerald-500" />
              </div>
              <div>
                <p className="font-serif text-3xl font-bold">{totalUsers}</p>
                <p className="text-sm text-muted-foreground">Cidadaos</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={fadeInUp} initial="initial" animate="animate" transition={{ duration: 0.3, delay: 0.1 }}>
          <Card className="border-border/50">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-violet-500/10">
                <Shield className="h-6 w-6 text-violet-500" />
              </div>
              <div>
                <p className="font-serif text-3xl font-bold">{totalAdmins}</p>
                <p className="text-sm text-muted-foreground">Administradores</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <Card className="border-border/50">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome ou email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 h-10"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full sm:w-[160px] h-10">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="user">Cidadaos</SelectItem>
                <SelectItem value="admin">Administradores</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/50">
        <div className="hidden md:block overflow-x-auto">
          <Table className="min-w-[720px]">
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-xs">Usuario</TableHead>
                <TableHead className="text-xs">E-mail</TableHead>
                <TableHead className="text-xs">Tipo</TableHead>
                <TableHead className="text-xs">Denuncias</TableHead>
                <TableHead className="text-xs">Cadastro</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback
                          className={cn(
                            user.role === 'admin' ? 'bg-violet-500/10 text-violet-500' : 'bg-primary/10 text-primary'
                          )}
                        >
                          {user.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-sm">{user.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{user.email}</TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={cn(
                        'text-xs',
                        user.role === 'admin'
                          ? 'bg-violet-500/10 text-violet-600 dark:text-violet-400'
                          : 'bg-primary/10 text-primary'
                      )}
                    >
                      {user.role === 'admin' ? 'Admin' : 'Cidadao'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">
                    <div className="flex items-center gap-1.5">
                      <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                      {user.complaintsCount}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Intl.DateTimeFormat('pt-BR', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    }).format(user.createdAt)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="space-y-4 p-4 md:hidden">
          {filteredUsers.map((user) => (
            <div key={user.id} className="rounded-lg border border-border/50 p-4">
              <div className="flex items-start gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback
                    className={cn(
                      user.role === 'admin' ? 'bg-violet-500/10 text-violet-500' : 'bg-primary/10 text-primary'
                    )}
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium text-sm">{user.name}</p>
                    <Badge
                      variant="secondary"
                      className={cn(
                        'text-[11px]',
                        user.role === 'admin'
                          ? 'bg-violet-500/10 text-violet-600 dark:text-violet-400'
                          : 'bg-primary/10 text-primary'
                      )}
                    >
                      {user.role === 'admin' ? 'Admin' : 'Cidadao'}
                    </Badge>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground break-all">{user.email}</p>
                  <div className="mt-3 flex items-center justify-between gap-3 text-xs text-muted-foreground">
                    <span>{user.complaintsCount} denuncias</span>
                    <span>
                      {new Intl.DateTimeFormat('pt-BR', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      }).format(user.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <p className="text-sm text-muted-foreground">
        Mostrando {filteredUsers.length} de {users.length} usuarios
      </p>
    </div>
  )
}
