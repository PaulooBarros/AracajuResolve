'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  FileText,
  AlertCircle,
  Clock,
  CheckCircle2,
  MapPin,
  Loader2,
} from 'lucide-react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { STATUS_LABELS, CATEGORY_LABELS, type ComplaintStatus } from '@/lib/types'
import { useComplaints } from '@/lib/complaints-store'
import { useProfiles } from '@/lib/profiles-store'
import { cn } from '@/lib/utils'

const statusColors: Record<ComplaintStatus, string> = {
  aberta: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  em_andamento: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  resolvida: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  arquivada: 'bg-muted text-muted-foreground',
}

export default function AdminDashboardPage() {
  const { complaints, isLoading } = useComplaints()
  const { totalProfiles, totalUsers, totalAdmins, isLoading: usersLoading } = useProfiles()

  const summary = useMemo(() => {
    const openComplaints = complaints.filter((complaint) => complaint.status === 'aberta').length
    const inProgressComplaints = complaints.filter((complaint) => complaint.status === 'em_andamento').length
    const resolvedComplaints = complaints.filter((complaint) => complaint.status === 'resolvida').length
    const topNeighborhoods = [...complaints].reduce<Record<string, number>>((acc, complaint) => {
      acc[complaint.neighborhood] = (acc[complaint.neighborhood] || 0) + 1
      return acc
    }, {})

    return {
      openComplaints,
      inProgressComplaints,
      resolvedComplaints,
      recentComplaints: complaints.slice(0, 5),
      criticalComplaints: complaints
        .filter((complaint) => complaint.priority === 'critica' || complaint.priority === 'alta')
        .slice(0, 3),
      neighborhoods: Object.entries(topNeighborhoods)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5),
    }
  }, [complaints])

  if (isLoading || usersLoading) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const statCards = [
    { title: 'Total de Denuncias', value: complaints.length, icon: FileText, color: 'text-primary', bgColor: 'bg-primary/10' },
    { title: 'Abertas', value: summary.openComplaints, icon: AlertCircle, color: 'text-amber-500', bgColor: 'bg-amber-500/10' },
    { title: 'Em andamento', value: summary.inProgressComplaints, icon: Clock, color: 'text-blue-500', bgColor: 'bg-blue-500/10' },
    { title: 'Resolvidas', value: summary.resolvedComplaints, icon: CheckCircle2, color: 'text-emerald-500', bgColor: 'bg-emerald-500/10' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold">Visao Geral</h1>
          <p className="text-muted-foreground text-sm">Painel conectado ao Supabase.</p>
        </div>
        <div className="flex w-full sm:w-auto items-center gap-2">
          <Badge variant="secondary" className="w-full justify-center sm:w-auto bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            {totalUsers} cidadaos e {totalAdmins} admins
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card className="border-border/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className={cn('p-2 rounded-lg', stat.bgColor)}>
                      <Icon className={cn('h-5 w-5', stat.color)} />
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="font-serif text-3xl font-bold">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="border-border/50 lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2 gap-3">
            <CardTitle className="font-serif text-base font-semibold">Denuncias Recentes</CardTitle>
            <Link href="/admin/denuncias">
              <Button variant="ghost" size="sm" className="text-xs">
                Ver todas
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <div className="hidden md:block overflow-x-auto">
              <Table className="min-w-[620px]">
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="text-xs">Titulo</TableHead>
                    <TableHead className="text-xs">Bairro</TableHead>
                    <TableHead className="text-xs">Categoria</TableHead>
                    <TableHead className="text-xs">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {summary.recentComplaints.map((complaint) => (
                    <TableRow key={complaint.id}>
                      <TableCell className="font-medium text-sm max-w-[220px] truncate">{complaint.title}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{complaint.neighborhood}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{CATEGORY_LABELS[complaint.category]}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={cn('text-xs', statusColors[complaint.status])}>
                          {STATUS_LABELS[complaint.status]}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="space-y-3 p-4 md:hidden">
              {summary.recentComplaints.map((complaint) => (
                <div key={complaint.id} className="rounded-lg border border-border/50 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-medium text-sm">{complaint.title}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{complaint.neighborhood}</p>
                    </div>
                    <Badge variant="secondary" className={cn('text-[11px]', statusColors[complaint.status])}>
                      {STATUS_LABELS[complaint.status]}
                    </Badge>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">{CATEGORY_LABELS[complaint.category]}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="font-serif text-base font-semibold flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              Bairros Mais Afetados
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {summary.neighborhoods.map((item, index) => (
              <div key={item.name} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-muted text-xs font-medium">
                    {index + 1}
                  </span>
                  <span className="text-sm truncate">{item.name}</span>
                </div>
                <span className="text-xs text-muted-foreground shrink-0">{item.count}</span>
              </div>
            ))}
            <div className="pt-4 border-t border-border/50 text-sm text-muted-foreground">
              {totalProfiles} perfis cadastrados no total.
            </div>
          </CardContent>
        </Card>
      </div>

      {summary.criticalComplaints.length > 0 && (
        <Card className="border-amber-500/50 bg-amber-500/5">
          <CardHeader className="pb-2">
            <CardTitle className="font-serif text-base font-semibold flex items-center gap-2 text-amber-600 dark:text-amber-400">
              <AlertCircle className="h-4 w-4" />
              Denuncias Criticas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {summary.criticalComplaints.map((complaint) => (
                <div key={complaint.id} className="p-4 rounded-lg bg-card border border-border/50">
                  <h4 className="font-medium text-sm line-clamp-2 mb-1">{complaint.title}</h4>
                  <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{complaint.description}</p>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs text-muted-foreground truncate">{complaint.neighborhood}</span>
                    <span className="text-xs font-medium shrink-0">{complaint.confirmations} confirmacoes</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
