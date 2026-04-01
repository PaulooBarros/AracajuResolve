'use client'

import { motion } from 'framer-motion'
import {
  TrendingUp,
  TrendingDown,
  FileText,
  CheckCircle2,
  Clock,
  Users,
  MapPin,
  Calendar,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  mockStats, 
  mockMonthlyData, 
  mockCategoryData,
  mockNeighborhoodStats,
} from '@/lib/mock-data'
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
  LineChart,
  Line,
} from 'recharts'

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
}

const kpiCards = [
  {
    title: 'Taxa de Resolução',
    value: `${Math.round((mockStats.resolvedComplaints / mockStats.totalComplaints) * 100)}%`,
    change: '+5.2%',
    trend: 'up',
    description: 'vs. mês anterior',
    icon: CheckCircle2,
    color: 'text-emerald-500',
  },
  {
    title: 'Tempo Médio de Resolução',
    value: `${mockStats.avgResolutionDays} dias`,
    change: '-2.1 dias',
    trend: 'up',
    description: 'vs. mês anterior',
    icon: Clock,
    color: 'text-blue-500',
  },
  {
    title: 'Crescimento Mensal',
    value: `+${mockStats.growthPercentage}%`,
    change: '+3.4%',
    trend: 'up',
    description: 'novas denúncias',
    icon: TrendingUp,
    color: 'text-primary',
  },
  {
    title: 'Usuários Ativos',
    value: '2.4k',
    change: '+18.7%',
    trend: 'up',
    description: 'este mês',
    icon: Users,
    color: 'text-violet-500',
  },
]

const statusDistribution = [
  { name: 'Abertas', value: mockStats.openComplaints, color: '#f59e0b' },
  { name: 'Em Andamento', value: mockStats.inProgressComplaints, color: '#3b82f6' },
  { name: 'Resolvidas', value: mockStats.resolvedComplaints, color: '#22c55e' },
  { name: 'Arquivadas', value: mockStats.archivedComplaints, color: '#6b7280' },
]

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold">Analytics</h1>
          <p className="text-muted-foreground text-sm">
            Análise detalhada e indicadores de desempenho
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="gap-1">
            <Calendar className="h-3 w-3" />
            Últimos 30 dias
          </Badge>
        </div>
      </div>

      {/* KPI Cards */}
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
                    <div className={cn(
                      'flex items-center gap-1 text-xs font-medium',
                      kpi.trend === 'up' ? 'text-emerald-500' : 'text-red-500'
                    )}>
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

      {/* Main Charts */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Evolution Chart */}
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
                Evolução de Denúncias x Resoluções
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={mockMonthlyData}>
                    <defs>
                      <linearGradient id="colorComp" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#539FA2" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#539FA2" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorRes" x1="0" y1="0" x2="0" y2="1">
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
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="complaints"
                      name="Denúncias"
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

        {/* Status Distribution */}
        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.3, delay: 0.25 }}
        >
          <Card className="border-border/50 h-full">
            <CardHeader>
              <CardTitle className="font-serif text-base font-semibold">
                Distribuição por Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {statusDistribution.map((entry, index) => (
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
                {statusDistribution.map((item) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      />
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

      {/* Bottom Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Category Bar Chart */}
        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="font-serif text-base font-semibold">
                Denúncias por Categoria
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mockCategoryData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                    <XAxis type="number" className="text-xs fill-muted-foreground" />
                    <YAxis 
                      type="category" 
                      dataKey="category" 
                      className="text-xs fill-muted-foreground"
                      width={80}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                      {mockCategoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
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
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="font-serif text-base font-semibold flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                Ranking de Bairros
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mockNeighborhoodStats.slice(0, 8)}>
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

      {/* Executive Indicators */}
      <motion.div
        variants={fadeInUp}
        initial="initial"
        animate="animate"
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="font-serif text-base font-semibold">
              Indicadores Executivos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-4 rounded-lg bg-muted/30">
                <p className="text-xs text-muted-foreground mb-1">Eficiência Operacional</p>
                <p className="font-serif text-2xl font-bold text-primary">87%</p>
                <p className="text-xs text-emerald-500 flex items-center justify-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3" /> +4.2% vs. trimestre
                </p>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted/30">
                <p className="text-xs text-muted-foreground mb-1">Satisfação Cidadão</p>
                <p className="font-serif text-2xl font-bold text-emerald-500">4.2/5</p>
                <p className="text-xs text-emerald-500 flex items-center justify-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3" /> +0.3 vs. mês
                </p>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted/30">
                <p className="text-xs text-muted-foreground mb-1">Tempo Resposta Inicial</p>
                <p className="font-serif text-2xl font-bold text-blue-500">2.4h</p>
                <p className="text-xs text-emerald-500 flex items-center justify-center gap-1 mt-1">
                  <TrendingDown className="h-3 w-3" /> -18min vs. mês
                </p>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted/30">
                <p className="text-xs text-muted-foreground mb-1">Reincidência</p>
                <p className="font-serif text-2xl font-bold text-amber-500">8.3%</p>
                <p className="text-xs text-emerald-500 flex items-center justify-center gap-1 mt-1">
                  <TrendingDown className="h-3 w-3" /> -2.1% vs. mês
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
