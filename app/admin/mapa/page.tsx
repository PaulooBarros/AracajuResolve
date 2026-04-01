'use client'

import { useState, useMemo } from 'react'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { Filter, Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useComplaints } from '@/lib/complaints-store'
import { 
  CATEGORY_LABELS, 
  STATUS_LABELS, 
  type ComplaintCategory,
  type ComplaintStatus 
} from '@/lib/types'
import { Progress } from '@/components/ui/progress'

const MapComponent = dynamic(() => import('@/components/map-component'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-muted rounded-lg">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  ),
})

export default function AdminMapPage() {
  const { complaints } = useComplaints()
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedComplaint, setSelectedComplaint] = useState<string | null>(null)

  const filteredComplaints = useMemo(() => {
    return complaints.filter((complaint) => {
      const matchesCategory = categoryFilter === 'all' || complaint.category === categoryFilter
      const matchesStatus = statusFilter === 'all' || complaint.status === statusFilter
      return matchesCategory && matchesStatus
    })
  }, [categoryFilter, complaints, statusFilter])

  const topNeighborhoods = useMemo(() => {
    return Object.entries(
      filteredComplaints.reduce<Record<string, number>>((acc, complaint) => {
        acc[complaint.neighborhood] = (acc[complaint.neighborhood] || 0) + 1
        return acc
      }, {})
    )
      .map(([name, complaintsCount]) => ({
        name,
        complaintsCount,
        resolvedCount: filteredComplaints.filter(
          (complaint) => complaint.neighborhood === name && complaint.status === 'resolvida'
        ).length,
      }))
      .sort((a, b) => b.complaintsCount - a.complaintsCount)
      .slice(0, 5)
  }, [filteredComplaints])

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold">Mapa Administrativo</h1>
          <p className="text-muted-foreground text-sm">
            Visão geográfica das denúncias em Aracaju
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">
            {filteredComplaints.length} ocorrências
          </Badge>
        </div>
      </div>

      {/* Filters */}
      <Card className="border-border/50">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px] h-10">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas categorias</SelectItem>
                {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                  <SelectItem key={key} value={key}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[160px] h-10">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos status</SelectItem>
                {Object.entries(STATUS_LABELS).map(([key, label]) => (
                  <SelectItem key={key} value={key}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Map and Side Panel */}
      <div className="grid lg:grid-cols-4 gap-6">
        {/* Map */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="lg:col-span-3"
        >
          <Card className="border-border/50 overflow-hidden">
            <div className="h-[500px]">
              <MapComponent 
                complaints={filteredComplaints}
                onSelectComplaint={setSelectedComplaint}
                selectedComplaintId={selectedComplaint}
              />
            </div>
          </Card>
        </motion.div>

        {/* Side Panel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="space-y-6"
        >
          {/* Legend */}
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Legenda</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <span className="text-sm">Aberta</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <span className="text-sm">Em andamento</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-sm">Resolvida</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-gray-500" />
                  <span className="text-sm">Arquivada</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Top Neighborhoods */}
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Bairros Mais Afetados</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                {topNeighborhoods.map((neighborhood, index) => {
                  const percentage = Math.round((neighborhood.resolvedCount / neighborhood.complaintsCount) * 100)
                  return (
                    <div key={neighborhood.name}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-muted text-xs font-medium">
                            {index + 1}
                          </span>
                          <span className="text-sm">{neighborhood.name}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {neighborhood.complaintsCount}
                        </span>
                      </div>
                      <Progress value={percentage} className="h-1" />
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Estatísticas Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Abertas</span>
                <span className="font-medium text-amber-600">
                  {filteredComplaints.filter(c => c.status === 'aberta').length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Em andamento</span>
                <span className="font-medium text-blue-600">
                  {filteredComplaints.filter(c => c.status === 'em_andamento').length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Resolvidas</span>
                <span className="font-medium text-emerald-600">
                  {filteredComplaints.filter(c => c.status === 'resolvida').length}
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
