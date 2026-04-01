'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Users, 
  UserCheck, 
  Shield,
  FileText,
  MoreHorizontal,
  Edit,
  Trash2,
  UserPlus,
  Search,
  Mail,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { mockUsers } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
}

// Extended mock users for demo
const extendedUsers = [
  ...mockUsers,
  {
    id: '3',
    name: 'Carlos Oliveira',
    email: 'carlos@email.com',
    role: 'user' as const,
    createdAt: new Date('2024-03-01'),
    complaintsCount: 8,
  },
  {
    id: '4',
    name: 'Ana Paula',
    email: 'ana.paula@email.com',
    role: 'user' as const,
    createdAt: new Date('2024-02-15'),
    complaintsCount: 12,
  },
  {
    id: '5',
    name: 'Roberto Lima',
    email: 'roberto@email.com',
    role: 'user' as const,
    createdAt: new Date('2024-01-20'),
    complaintsCount: 4,
  },
  {
    id: 'admin2',
    name: 'Gestor Municipal',
    email: 'gestor@aracaju.gov.br',
    role: 'admin' as const,
    createdAt: new Date('2023-06-15'),
    complaintsCount: 0,
  },
]

export default function AdminUsersPage() {
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('all')

  const totalUsers = extendedUsers.filter(u => u.role === 'user').length
  const totalAdmins = extendedUsers.filter(u => u.role === 'admin').length

  const filteredUsers = extendedUsers.filter((user) => {
    const matchesSearch = search === '' || 
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter

    return matchesSearch && matchesRole
  })

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold">Usuários</h1>
          <p className="text-muted-foreground text-sm">
            Gerencie usuários e permissões do sistema
          </p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 gap-2">
          <UserPlus className="h-4 w-4" />
          Novo Usuário
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.3 }}
        >
          <Card className="border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-serif text-3xl font-bold">{extendedUsers.length}</p>
                  <p className="text-sm text-muted-foreground">Total de Usuários</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.3, delay: 0.05 }}
        >
          <Card className="border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-emerald-500/10">
                  <UserCheck className="h-6 w-6 text-emerald-500" />
                </div>
                <div>
                  <p className="font-serif text-3xl font-bold">{totalUsers}</p>
                  <p className="text-sm text-muted-foreground">Cidadãos</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-violet-500/10">
                  <Shield className="h-6 w-6 text-violet-500" />
                </div>
                <div>
                  <p className="font-serif text-3xl font-bold">{totalAdmins}</p>
                  <p className="text-sm text-muted-foreground">Administradores</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Filters */}
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
              <SelectTrigger className="w-[160px] h-10">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="user">Cidadãos</SelectItem>
                <SelectItem value="admin">Administradores</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <motion.div
        variants={fadeInUp}
        initial="initial"
        animate="animate"
        transition={{ duration: 0.3, delay: 0.15 }}
      >
        <Card className="border-border/50">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-xs">Usuário</TableHead>
                <TableHead className="text-xs">E-mail</TableHead>
                <TableHead className="text-xs">Tipo</TableHead>
                <TableHead className="text-xs">Denúncias</TableHead>
                <TableHead className="text-xs">Cadastro</TableHead>
                <TableHead className="text-xs">Status</TableHead>
                <TableHead className="text-xs text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className={cn(
                          user.role === 'admin' ? 'bg-violet-500/10 text-violet-500' : 'bg-primary/10 text-primary'
                        )}>
                          {user.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-sm">{user.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5" />
                      {user.email}
                    </div>
                  </TableCell>
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
                      {user.role === 'admin' ? 'Admin' : 'Cidadão'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">
                    {user.complaintsCount > 0 ? (
                      <div className="flex items-center gap-1.5">
                        <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                        {user.complaintsCount}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Intl.DateTimeFormat('pt-BR', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    }).format(user.createdAt)}
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="secondary" 
                      className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs"
                    >
                      Ativo
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="gap-2">
                          <FileText className="h-4 w-4" />
                          Ver denúncias
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2">
                          <Edit className="h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="gap-2 text-destructive">
                          <Trash2 className="h-4 w-4" />
                          Desativar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </motion.div>

      {/* Results count */}
      <p className="text-sm text-muted-foreground">
        Mostrando {filteredUsers.length} de {extendedUsers.length} usuários
      </p>
    </div>
  )
}
