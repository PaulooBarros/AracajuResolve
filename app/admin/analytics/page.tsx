'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  Clock,
  Users,
  MapPin,
  Calendar,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useComplaints } from '@/lib/complaints-store'
import { CATEGORY_LABELS } from '@/lib/types'
import { cn } from '@/lib/utils'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from 'recharts'

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
}

export default function AdminAnalyticsPage() {
  const { complaints } = useComplaints()

  const analytics = useMemo(() => {
    const now = new Date()
    const monthLabels = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
    const monthlyData = Array.from({ length: 6 }, (_, index) => {
      const date = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1)
      return {
        key: `${date.getFullYear()}-${date.getMonth()}`,
        month: monthLabels[date.getMonth()],
        complaints: 0,
        resolved: 0,
      }
    })

    const monthMap = new Map(monthlyData.map((item) => [item.key, item]))

    complaints.forEach((complaint) => {
      const createdKey = `${complaint.createdAt.getFullYear()}-${complaint.createdAt.getMonth()}`
      const createdMonth = monthMap.get(createdKey)
      if (createdMonth) createdMonth.complaints += 1

      if (complaint.status === 'resolvida') {
        const resolvedKey = `${complaint.updatedAt.getFullYear()}-${complaint.updatedAt.getMonth()}`
        const resolvedMonth = monthMap.get(resolvedKey)
        if (resolvedMonth) resolvedMonth.resolved += 1
      }
    })

    const resolvedComplaints = complaints.filter((complaint) => complaint.status === 'resolvida')
    const totalComplaints = complaints.length
    const resolvedCount = resolvedComplaints.length
    const resolutionRate = totalComplaints > 0 ? Math.round((resolvedCount / totalComplaints) * 100) : 0
    const avgResolutionDays = resolvedCount > 0
      ? Math.round(
          resolvedComplaints.reduce((acc, complaint) => {
            const diffDays = Math.max(
              1,
              Math.round((complaint.updatedAt.getTime() - complaint.createdAt.getTime()) / (1000 * 60 * 60 * 24))
            )
            return acc + diffDays
          }, 0) / resolvedCount
        )
      : 0

    const currentMonthCount = monthlyData.at(-1)?.complaints || 0
    const previousMonthCount = monthlyData.at(-2)?.complaints || 0
    const growthPercentage = previousMonthCount > 0
      ? Math.round(((currentMonthCount - previousMonthCount) / previousMonthCount) * 100)
      : currentMonthCount > 0
        ? 100
        : 0

    const categoryPalette = ['#539FA2', '#22c55e', '#3b82f6', '#f59e0b', '#a855f7', '#ef4444']
    const categoryData = Object.entries(
      complaints.reduce<Record<string, number>>((acc, complaint) => {
        acc[complaint.category] = (acc[complaint.category] || 0) + 1
        return acc
      }, {})
    )
      .map(([category, count], index) => ({
        category: CATEGORY_LABELS[category as keyof typeof CATEGORY_LABELS] || category,
        count,
        color: categoryPalette[index % categoryPalette.length],
      }))
      .sort((a, b) => b.count - a.count)

    const neighborhoodStats = Object.entries(
      complaints.reduce<Record<string, { complaintsCount: number; resolvedCount: number }>>((acc, complaint) => {
        if (!complaint.neighborhood) return acc

        if (!acc[complaint.neighborhood]) {
          acc[complaint.neighborhood] = { complaintsCount: 0, resolvedCount: 0 }
        }

        acc[complaint.neighborhood].complaintsCount += 1
        if (complaint.status === 'resolvida') {
          acc[complaint.neighborhood].resolvedCount += 1
        }

        return acc
      }, {})
    )
      .map(([name, values]) => ({
        name,
        complaintsCount: values.complaintsCount,
        resolvedCount: values.resolvedCount,
      }))
      .sort((a, b) => b.complaintsCount - a.complaintsCount)

    const uniqueReporters = new Set(complaints.map((complaint) => complaint.userId)).size
    const openComplaints = complaints.filter((complaint) => complaint.status === 'aberta').length
    const inProgressComplaints = complaints.filter((complaint) => complaint.status === 'em_andamento').length
    const archivedComplaints = complaints.filter((complaint) => complaint.status === 'arquivada').length

    return {
      totalComplaints,
      resolvedCount,
      resolutionRate,
      avgResolutionDays,
      growthPercentage,
      uniqueReporters,
      monthlyData,
      categoryData,
      neighborhoodStats,
      statusDistribution: [
        { name: 'Abertas', value: openComplaints, color: '#f59e0b' },
        { name: 'Em andamento', value: inProgressComplaints, color: '#3b82f6' },
        { name: 'Resolvidas', value: resolvedCount, color: '#22c55e' },
        { name: 'Arquivadas', value: archivedComplaints, color: '#6b7280' },
      ],
    }
  }, [complaints])

  const kpiCards = [
    {
      title: 'Taxa de resolucao',
      value: `${analytics.resolutionRate}%`,
      change: `${analytics.resolvedCount} resolvidas`,
      trend: 'up',
      description: 'base total',
      icon: CheckCircle2,
      color: 'text-emerald-500',
    },
    {
      title: 'Tempo medio de resolucao',
      value: `${analytics.avgResolutionDays} dias`,
      change: analytics.avgResolutionDays > 0 ? 'historico real' : 'sem resolvidas',
      trend: 'up',
      description: 'calculado no banco',
      icon: Clock,
      color: 'text-blue-500',
    },
    {
      title: 'Crescimento mensal',
      value: `${analytics.growthPercentage > 0 ? '+' : ''}${analytics.growthPercentage}%`,
      change: `${analytics.monthlyData.at(-1)?.complaints || 0} no mes`,
      trend: analytics.growthPercentage >= 0 ? 'up' : 'down',
      description: 'comparado ao mes anterior',
      icon: TrendingUp,
      color: 'text-primary',
    },
    {
      title: 'Usuarios ativos',
      value: `${analytics.uniqueReporters}`,
      change: `${analytics.totalComplaints} registros`,
      trend: 'up',
      description: 'autores distintos',
      icon: Users,
      color: 'text-violet-500',
    },
  ] as const

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold">Analytics</h1>
          <p className="text-muted-foreground text-sm">Análise detalhada e indicadores de desempenho</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="gap-1">
            <Calendar className="h-3 w-3" />
            Últimos 30 dias
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((kpi, index) => {
          const Icon = kpi.icon
          return (
            <motion.div
              key={kpi.title}
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card className="border-border/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Icon className={cn('h-5 w-5', kpi.color)} />
                    <div
                      className={cn(
                        'flex items-center gap-1 text-xs font-medium',
                        kpi.trend === 'up' ? 'text-emerald-500' : 'text-red-500'
                      )}
                    >
                      {kpi.trend === 'up' ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                      {kpi.change}
                    </div>
                  </div>
                  <p className="font-serif text-3xl font-bold">{kpi.value}</p>
                  <p className="text-sm text-muted-foreground">{kpi.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{kpi.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.3, delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="font-serif text-base font-semibold">
                Evolução de denúncias x resoluções
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analytics.monthlyData}>
                    <defs>
                      <linearGradient id="colorComp" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#539FA2" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#539FA2" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorRes" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22C55E" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                    <XAxis dataKey="month" className="text-xs fill-muted-foreground" tickLine={false} axisLine={false} />
                    <YAxis className="text-xs fill-muted-foreground" tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="complaints"
                      name="Denuncias"
                      stroke="#539FA2"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorComp)"
                    />
                    <Area
                      type="monotone"
                      dataKey="resolved"
                      name="Resolvidas"
                      stroke="#22C55E"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorRes)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
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
          <Card className="border-border/50 h-full">
            <CardHeader>
              <CardTitle className="font-serif text-base font-semibold">Distribuição por status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analytics.statusDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {analytics.statusDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2 mt-4">
                {analytics.statusDistribution.map((item) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-sm">{item.name}</span>
                    </div>
                    <span className="text-sm font-medium">{item.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="font-serif text-base font-semibold">Denúncias por categoria</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics.categoryData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                    <XAxis type="number" className="text-xs fill-muted-foreground" />
                    <YAxis type="category" dataKey="category" className="text-xs fill-muted-foreground" width={110} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                      {analytics.categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.3, delay: 0.35 }}
        >
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="font-serif text-base font-semibold flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                Ranking de bairros
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics.neighborhoodStats.slice(0, 8)}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                    <XAxis
                      dataKey="name"
                      className="text-xs fill-muted-foreground"
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis className="text-xs fill-muted-foreground" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Legend />
                    <Bar dataKey="complaintsCount" name="Total" fill="#539FA2" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="resolvedCount" name="Resolvidas" fill="#22C55E" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div
        variants={fadeInUp}
        initial="initial"
        animate="animate"
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="font-serif text-base font-semibold">Indicadores executivos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-4 rounded-lg bg-muted/30">
                <p className="text-xs text-muted-foreground mb-1">Eficiência operacional</p>
                <p className="font-serif text-2xl font-bold text-primary">{analytics.resolutionRate}%</p>
                <p className="text-xs text-emerald-500 flex items-center justify-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3" /> taxa geral de resolução
                </p>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted/30">
                <p className="text-xs text-muted-foreground mb-1">Cidadãos participantes</p>
                <p className="font-serif text-2xl font-bold text-emerald-500">{analytics.uniqueReporters}</p>
                <p className="text-xs text-emerald-500 flex items-center justify-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3" /> autores distintos
                </p>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted/30">
                <p className="text-xs text-muted-foreground mb-1">Novas denúncias do mês</p>
                <p className="font-serif text-2xl font-bold text-blue-500">{analytics.monthlyData.at(-1)?.complaints || 0}</p>
                <p className="text-xs text-emerald-500 flex items-center justify-center gap-1 mt-1">
                  <TrendingDown className="h-3 w-3" /> volume recente
                </p>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted/30">
                <p className="text-xs text-muted-foreground mb-1">Total de registros</p>
                <p className="font-serif text-2xl font-bold text-amber-500">{analytics.totalComplaints}</p>
                <p className="text-xs text-emerald-500 flex items-center justify-center gap-1 mt-1">
                  <TrendingDown className="h-3 w-3" /> base consolidada
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
