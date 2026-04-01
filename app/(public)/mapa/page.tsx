'use client'

import { useState, useMemo } from 'react'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { Filter, X, List, MapPin, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { ComplaintCard } from '@/components/complaint-card'
import { useComplaints } from '@/lib/complaints-store'
import { 
  CATEGORY_LABELS, 
  STATUS_LABELS, 
  NEIGHBORHOODS,
  type ComplaintCategory,
  type ComplaintStatus 
} from '@/lib/types'

// Dynamic import for Leaflet (avoids SSR issues)
const MapComponent = dynamic(() => import('@/components/map-component'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-muted">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  ),
})

export default function MapPage() {
  const { complaints, isLoading } = useComplaints()
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [neighborhoodFilter, setNeighborhoodFilter] = useState<string>('all')
  const [selectedComplaint, setSelectedComplaint] = useState<string | null>(null)

  const activeFilters = [
    categoryFilter !== 'all' && { key: 'category', label: CATEGORY_LABELS[categoryFilter as ComplaintCategory] },
    statusFilter !== 'all' && { key: 'status', label: STATUS_LABELS[statusFilter as ComplaintStatus] },
    neighborhoodFilter !== 'all' && { key: 'neighborhood', label: neighborhoodFilter },
  ].filter(Boolean) as { key: string; label: string }[]

  const clearFilter = (key: string) => {
    if (key === 'category') setCategoryFilter('all')
    if (key === 'status') setStatusFilter('all')
    if (key === 'neighborhood') setNeighborhoodFilter('all')
  }

  const clearAllFilters = () => {
    setCategoryFilter('all')
    setStatusFilter('all')
    setNeighborhoodFilter('all')
  }

  const filteredComplaints = useMemo(() => {
    return complaints.filter((complaint) => {
      const matchesCategory = categoryFilter === 'all' || complaint.category === categoryFilter
      const matchesStatus = statusFilter === 'all' || complaint.status === statusFilter
      const matchesNeighborhood = neighborhoodFilter === 'all' || complaint.neighborhood === neighborhoodFilter
      return matchesCategory && matchesStatus && matchesNeighborhood
    })
  }, [complaints, categoryFilter, statusFilter, neighborhoodFilter])

  const selectedComplaintData = useMemo(() => {
    return complaints.find(c => c.id === selectedComplaint)
  }, [complaints, selectedComplaint])

  if (isLoading) {
    return (
      <div className="h-[calc(100vh-4rem)] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      {/* Header with Filters */}
      <div className="bg-background border-b border-border/50 p-4">
        <div className="container mx-auto">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              <h1 className="font-serif text-xl font-bold">Mapa de Denúncias</h1>
              <Badge variant="secondary" className="ml-2">
                {filteredComplaints.length} ocorrências
              </Badge>
            </div>

            <div className="flex flex-wrap gap-2">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[160px] h-9 text-sm">
                  <Filter className="h-3.5 w-3.5 mr-2" />
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
                <SelectTrigger className="w-[140px] h-9 text-sm">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos status</SelectItem>
                  {Object.entries(STATUS_LABELS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={neighborhoodFilter} onValueChange={setNeighborhoodFilter}>
                <SelectTrigger className="w-[140px] h-9 text-sm">
                  <SelectValue placeholder="Bairro" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos bairros</SelectItem>
                  {NEIGHBORHOODS.map((neighborhood) => (
                    <SelectItem key={neighborhood} value={neighborhood}>{neighborhood}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Mobile: List View */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="h-9 sm:hidden">
                    <List className="h-4 w-4 mr-2" />
                    Lista
                  </Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="h-[70vh]">
                  <SheetHeader>
                    <SheetTitle>Denúncias ({filteredComplaints.length})</SheetTitle>
                  </SheetHeader>
                  <div className="mt-4 space-y-4 overflow-y-auto max-h-[calc(70vh-80px)]">
                    {filteredComplaints.map((complaint, index) => (
                      <ComplaintCard 
                        key={complaint.id} 
                        complaint={complaint} 
                        index={index}
                        compact
                      />
                    ))}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {/* Active Filters */}
          {activeFilters.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mt-3">
              <span className="text-xs text-muted-foreground">Filtros:</span>
              {activeFilters.map((filter) => (
                <Badge 
                  key={filter.key} 
                  variant="secondary" 
                  className="gap-1 pr-1 text-xs"
                >
                  {filter.label}
                  <button 
                    onClick={() => clearFilter(filter.key)}
                    className="ml-1 hover:bg-muted rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              <Button variant="ghost" size="sm" onClick={clearAllFilters} className="text-xs h-6 px-2">
                Limpar
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative">
        <MapComponent 
          complaints={filteredComplaints}
          onSelectComplaint={setSelectedComplaint}
          selectedComplaintId={selectedComplaint}
        />

        {/* Desktop: Side Panel for Selected Complaint */}
        {selectedComplaintData && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="hidden sm:block absolute top-4 right-4 w-80 z-[1000]"
          >
            <Card className="border-border/50 shadow-lg">
              <CardContent className="p-0">
                <div className="flex items-center justify-between p-3 border-b border-border/50">
                  <span className="text-sm font-medium">Detalhes</span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7"
                    onClick={() => setSelectedComplaint(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="p-4">
                  <ComplaintCard complaint={selectedComplaintData} compact />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Legend */}
        <div className="absolute bottom-4 left-4 z-[1000]">
          <Card className="border-border/50 shadow-lg bg-background/95 backdrop-blur">
            <CardContent className="p-3">
              <p className="text-xs font-medium mb-2">Legenda</p>
              <div className="flex flex-wrap gap-3 text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <span>Aberta</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <span>Em andamento</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span>Resolvida</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
