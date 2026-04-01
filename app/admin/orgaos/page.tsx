'use client'

import { motion } from 'framer-motion'
import { 
  Building2, 
  FileText, 
  CheckCircle2, 
  Clock,
  TrendingUp,
  MoreHorizontal,
  Edit,
  Trash2,
  Plus,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
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
import { mockResponsibleOrgans } from '@/lib/mock-data'
import { CATEGORY_LABELS } from '@/lib/types'
import { cn } from '@/lib/utils'

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
}

export default function AdminOrgaosPage() {
  const totalComplaints = mockResponsibleOrgans.reduce((acc, org) => acc + org.complaintsCount, 0)
  const totalResolved = mockResponsibleOrgans.reduce((acc, org) => acc + org.resolvedCount, 0)
  const avgResolution = Math.round(mockResponsibleOrgans.reduce((acc, org) => acc + org.avgResolutionDays, 0) / mockResponsibleOrgans.length)

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold">Órgãos Responsáveis</h1>
          <p className="text-muted-foreground text-sm">
            Gerencie os órgãos e secretarias responsáveis pelas denúncias
          </p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 gap-2">
          <Plus className="h-4 w-4" />
          Novo Órgão
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
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-serif text-3xl font-bold">{mockResponsibleOrgans.length}</p>
                  <p className="text-sm text-muted-foreground">Órgãos Cadastrados</p>
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
                  <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                </div>
                <div>
                  <p className="font-serif text-3xl font-bold">
                    {Math.round((totalResolved / totalComplaints) * 100)}%
                  </p>
                  <p className="text-sm text-muted-foreground">Taxa de Resolução</p>
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
                <div className="p-3 rounded-lg bg-blue-500/10">
                  <Clock className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <p className="font-serif text-3xl font-bold">{avgResolution} dias</p>
                  <p className="text-sm text-muted-foreground">Tempo Médio Resolução</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Organs Table */}
      <motion.div
        variants={fadeInUp}
        initial="initial"
        animate="animate"
        transition={{ duration: 0.3, delay: 0.15 }}
      >
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="font-serif text-base font-semibold">
              Lista de Órgãos
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-xs">Órgão</TableHead>
                  <TableHead className="text-xs">Categorias</TableHead>
                  <TableHead className="text-xs">Denúncias</TableHead>
                  <TableHead className="text-xs">Resolvidas</TableHead>
                  <TableHead className="text-xs">Taxa</TableHead>
                  <TableHead className="text-xs">Tempo Médio</TableHead>
                  <TableHead className="text-xs text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockResponsibleOrgans.map((organ) => {
                  const rate = Math.round((organ.resolvedCount / organ.complaintsCount) * 100)
                  return (
                    <TableRow key={organ.id}>
                      <TableCell className="font-medium text-sm">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-muted">
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <span className="max-w-[200px] truncate">{organ.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {organ.categories.slice(0, 2).map((cat) => (
                            <Badge key={cat} variant="secondary" className="text-xs">
                              {CATEGORY_LABELS[cat]}
                            </Badge>
                          ))}
                          {organ.categories.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{organ.categories.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{organ.complaintsCount}</TableCell>
                      <TableCell className="text-sm text-emerald-600">{organ.resolvedCount}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={rate} className="w-16 h-1.5" />
                          <span className="text-xs text-muted-foreground">{rate}%</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        <span className={cn(
                          organ.avgResolutionDays <= 5 ? 'text-emerald-600' : 
                          organ.avgResolutionDays <= 10 ? 'text-amber-600' : 'text-red-600'
                        )}>
                          {organ.avgResolutionDays} dias
                        </span>
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
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>

      {/* Performance Overview */}
      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="font-serif text-base font-semibold">
                Ranking por Eficiência
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[...mockResponsibleOrgans]
                  .sort((a, b) => (b.resolvedCount / b.complaintsCount) - (a.resolvedCount / a.complaintsCount))
                  .slice(0, 5)
                  .map((organ, index) => {
                    const rate = Math.round((organ.resolvedCount / organ.complaintsCount) * 100)
                    return (
                      <div key={organ.id} className="flex items-center gap-4">
                        <span className={cn(
                          "flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium",
                          index === 0 ? "bg-amber-500 text-white" :
                          index === 1 ? "bg-slate-400 text-white" :
                          index === 2 ? "bg-amber-700 text-white" :
                          "bg-muted text-muted-foreground"
                        )}>
                          {index + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{organ.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Progress value={rate} className="flex-1 h-1.5" />
                            <span className="text-xs text-muted-foreground w-10">{rate}%</span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.3, delay: 0.25 }}
        >
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="font-serif text-base font-semibold">
                Ranking por Velocidade
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[...mockResponsibleOrgans]
                  .sort((a, b) => a.avgResolutionDays - b.avgResolutionDays)
                  .slice(0, 5)
                  .map((organ, index) => (
                    <div key={organ.id} className="flex items-center gap-4">
                      <span className={cn(
                        "flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium",
                        index === 0 ? "bg-emerald-500 text-white" :
                        index === 1 ? "bg-emerald-400 text-white" :
                        index === 2 ? "bg-emerald-300 text-emerald-900" :
                        "bg-muted text-muted-foreground"
                      )}>
                        {index + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{organ.name}</p>
                        <p className="text-xs text-muted-foreground">{organ.complaintsCount} denúncias</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-emerald-600">{organ.avgResolutionDays} dias</p>
                        <p className="text-xs text-muted-foreground">tempo médio</p>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
