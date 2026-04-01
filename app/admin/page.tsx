'use client'

import { motion } from 'framer-motion'
import {
  FileText,
  AlertCircle,
  Clock,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  MapPin,
  Building2,
  ArrowRight,
  BarChart3,
} from 'lucide-react'
import Link from 'next/link'
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
  mockStats, 
  mockComplaints, 
  mockNeighborhoodStats, 
  mockCategoryData,
  mockMonthlyData 
} from '@/lib/mock-data'
import { STATUS_LABELS, CATEGORY_LABELS, type ComplaintStatus } from '@/lib/types'
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

const statusColors: Record<ComplaintStatus, string> = {
  aberta: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  em_andamento: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  resolvida: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  arquivada: 'bg-muted text-muted-foreground',
}

const statCards = [
  {
    title: 'Total de Denúncias',
    value: mockStats.totalComplaints,
    change: '+12.5%',
    trend: 'up',
    icon: FileText,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
  {
    title: 'Abertas',
    value: mockStats.openComplaints,
    change: '+8.2%',
    trend: 'up',
    icon: AlertCircle,
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/10',
  },
  {
    title: 'Em Andamento',
    value: mockStats.inProgressComplaints,
    change: '+15.3%',
    trend: 'up',
    icon: Clock,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
  },
  {
    title: 'Resolvidas',
    value: mockStats.resolvedComplaints,
    change: '+23.1%',
    trend: 'up',
    icon: CheckCircle2,
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-500/10',
  },
]

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
}

export default function AdminDashboardPage() {
  const recentComplaints = mockComplaints.slice(0, 5)
  const criticalComplaints = mockComplaints.filter(c => c.priority === 'critica' || c.priority === 'alta').slice(0, 3)
  const topNeighborhoods = mockNeighborhoodStats.slice(0, 5)

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold">Visão Geral</h1>
          <p className="text-muted-foreground text-sm">
            Painel de monitoramento do Aracaju Resolve
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            Sistema Operacional
          </Badge>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.title}
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card className="border-border/50 hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className={cn('p-2 rounded-lg', stat.bgColor)}>
                      <Icon className={cn('h-5 w-5', stat.color)} />
                    </div>
                    <div className={cn(
                      'flex items-center gap-1 text-xs font-medium',
                      stat.trend === 'up' ? 'text-emerald-500' : 'text-red-500'
                    )}>
                      {stat.trend === 'up' ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                      {stat.change}
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

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Monthly Evolution Chart */}
        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="font-serif text-base font-semibold">
                Evolução Mensal
              </CardTitle>
              <Link href="/admin/analytics">
                <Button variant="ghost" size="sm" className="text-xs gap-1">
                  Ver mais <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={mockMonthlyData}>
                    <defs>
                      <linearGradient id="colorComplaints" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#539FA2" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#539FA2" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22C55E" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#22C55E" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                    <XAxis 
                      dataKey="month" 
                      className="text-xs fill-muted-foreground"
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis 
                      className="text-xs fill-muted-foreground"
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="complaints"
                      name="Denúncias"
                      stroke="#539FA2"
                      fillOpacity={1}
                      fill="url(#colorComplaints)"
                    />
                    <Area
                      type="monotone"
                      dataKey="resolved"
                      name="Resolvidas"
                      stroke="#22C55E"
                      fillOpacity={1}
                      fill="url(#colorResolved)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Category Distribution */}
        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.3, delay: 0.25 }}
        >
          <Card className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="font-serif text-base font-semibold">
                Denúncias por Categoria
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={mockCategoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="count"
                    >
                      {mockCategoryData.map((entry, index) => (
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
              <div className="flex flex-wrap justify-center gap-4 mt-4">
                {mockCategoryData.map((item) => (
                  <div key={item.category} className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-xs text-muted-foreground">{item.category}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent/Critical Complaints */}
        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.3, delay: 0.3 }}
          className="lg:col-span-2"
        >
          <Card className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="font-serif text-base font-semibold">
                Denúncias Recentes
              </CardTitle>
              <Link href="/admin/denuncias">
                <Button variant="ghost" size="sm" className="text-xs gap-1">
                  Ver todas <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="text-xs">Título</TableHead>
                    <TableHead className="text-xs">Bairro</TableHead>
                    <TableHead className="text-xs">Categoria</TableHead>
                    <TableHead className="text-xs">Status</TableHead>
                    <TableHead className="text-xs text-right">Ação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentComplaints.map((complaint) => (
                    <TableRow key={complaint.id}>
                      <TableCell className="font-medium text-sm max-w-[200px] truncate">
                        {complaint.title}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {complaint.neighborhood}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {CATEGORY_LABELS[complaint.category]}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="secondary" 
                          className={cn('text-xs', statusColors[complaint.status])}
                        >
                          {STATUS_LABELS[complaint.status]}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" className="h-7 text-xs">
                          Ver
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </motion.div>

        {/* Neighborhood Ranking */}
        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.3, delay: 0.35 }}
        >
          <Card className="border-border/50 h-full">
            <CardHeader className="pb-2">
              <CardTitle className="font-serif text-base font-semibold flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                Bairros Mais Afetados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topNeighborhoods.map((neighborhood, index) => {
                  const percentage = Math.round((neighborhood.resolvedCount / neighborhood.complaintsCount) * 100)
                  return (
                    <div key={neighborhood.name}>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-muted text-xs font-medium">
                            {index + 1}
                          </span>
                          <span className="text-sm font-medium">{neighborhood.name}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {neighborhood.complaintsCount}
                        </span>
                      </div>
                      <Progress value={percentage} className="h-1.5" />
                    </div>
                  )
                })}
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-border/50">
                <div className="text-center">
                  <p className="font-serif text-2xl font-bold text-primary">
                    {mockStats.avgResolutionDays}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Dias (média resolução)
                  </p>
                </div>
                <div className="text-center">
                  <p className="font-serif text-2xl font-bold text-emerald-500">
                    {Math.round((mockStats.resolvedComplaints / mockStats.totalComplaints) * 100)}%
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Taxa de resolução
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Critical Complaints Alert */}
      {criticalComplaints.length > 0 && (
        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <Card className="border-amber-500/50 bg-amber-500/5">
            <CardHeader className="pb-2">
              <CardTitle className="font-serif text-base font-semibold flex items-center gap-2 text-amber-600 dark:text-amber-400">
                <AlertCircle className="h-4 w-4" />
                Denúncias Críticas que Precisam de Atenção
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {criticalComplaints.map((complaint) => (
                  <div 
                    key={complaint.id}
                    className="p-4 rounded-lg bg-card border border-border/50"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <Badge 
                        variant="secondary" 
                        className="bg-red-500/10 text-red-600 dark:text-red-400 text-xs"
                      >
                        {complaint.priority === 'critica' ? 'Crítica' : 'Alta'}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {complaint.confirmations} confirmações
                      </span>
                    </div>
                    <h4 className="font-medium text-sm line-clamp-1 mb-1">
                      {complaint.title}
                    </h4>
                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                      {complaint.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {complaint.neighborhood}
                      </span>
                      <Button variant="ghost" size="sm" className="h-7 text-xs text-primary">
                        Resolver
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
