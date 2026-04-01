'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, X, LayoutGrid, List, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ComplaintCard } from '@/components/complaint-card'
import { useComplaints } from '@/lib/complaints-store'
import { 
  CATEGORY_LABELS, 
  STATUS_LABELS, 
  NEIGHBORHOODS,
  type ComplaintCategory,
  type ComplaintStatus 
} from '@/lib/types'

export default function ComplaintsPage() {
  const { complaints, isLoading } = useComplaints()
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [neighborhoodFilter, setNeighborhoodFilter] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

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
    setSearch('')
  }

  const filteredComplaints = useMemo(() => {
    return complaints.filter((complaint) => {
      const matchesSearch = search === '' || 
        complaint.title.toLowerCase().includes(search.toLowerCase()) ||
        complaint.description.toLowerCase().includes(search.toLowerCase())
      
      const matchesCategory = categoryFilter === 'all' || complaint.category === categoryFilter
      const matchesStatus = statusFilter === 'all' || complaint.status === statusFilter
      const matchesNeighborhood = neighborhoodFilter === 'all' || complaint.neighborhood === neighborhoodFilter

      return matchesSearch && matchesCategory && matchesStatus && matchesNeighborhood
    })
  }, [complaints, search, categoryFilter, statusFilter, neighborhoodFilter])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-b from-muted/50 to-background py-12 border-b border-border/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="font-serif text-3xl sm:text-4xl font-bold mb-4">
              Denúncias da Comunidade
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              Explore todas as denúncias registradas pela comunidade aracajuana. 
              Use os filtros para encontrar problemas específicos por categoria, status ou bairro.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col gap-4 mb-8"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar denúncias..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 h-11"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[180px] h-11">
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
                <SelectTrigger className="w-[160px] h-11">
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
                <SelectTrigger className="w-[160px] h-11">
                  <SelectValue placeholder="Bairro" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos bairros</SelectItem>
                  {NEIGHBORHOODS.map((neighborhood) => (
                    <SelectItem key={neighborhood} value={neighborhood}>{neighborhood}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* View Mode Toggle */}
              <div className="hidden sm:flex border border-border rounded-lg overflow-hidden">
                <Button
                  variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                  size="icon"
                  className="rounded-none h-11 w-11"
                  onClick={() => setViewMode('grid')}
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                  size="icon"
                  className="rounded-none h-11 w-11"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Active Filters */}
          {activeFilters.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-muted-foreground">Filtros ativos:</span>
              {activeFilters.map((filter) => (
                <Badge 
                  key={filter.key} 
                  variant="secondary" 
                  className="gap-1 pr-1"
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
              <Button variant="ghost" size="sm" onClick={clearAllFilters} className="text-xs h-7">
                Limpar todos
              </Button>
            </div>
          )}
        </motion.div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-muted-foreground">
            {filteredComplaints.length} denúncia{filteredComplaints.length !== 1 ? 's' : ''} encontrada{filteredComplaints.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Complaints Grid/List */}
        {filteredComplaints.length > 0 ? (
          <div className={viewMode === 'grid' 
            ? 'grid sm:grid-cols-2 lg:grid-cols-3 gap-6' 
            : 'flex flex-col gap-4'
          }>
            {filteredComplaints.map((complaint, index) => (
              <ComplaintCard 
                key={complaint.id} 
                complaint={complaint} 
                index={index}
              />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <p className="text-muted-foreground mb-4">
              Nenhuma denúncia encontrada com os filtros selecionados.
            </p>
            <Button variant="outline" onClick={clearAllFilters}>
              Limpar filtros
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
