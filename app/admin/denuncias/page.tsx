'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  Search, 
  Filter, 
  X, 
  LayoutGrid, 
  List as ListIcon,
  MoreHorizontal,
  Eye,
  CheckCircle2,
  Clock,
  Archive,
  Download,
  Loader2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
import { ComplaintCard } from '@/components/complaint-card'
import { toast } from '@/hooks/use-toast'
import { useComplaints } from '@/lib/complaints-store'
import { 
  CATEGORY_LABELS, 
  STATUS_LABELS, 
  PRIORITY_LABELS,
  NEIGHBORHOODS,
  type ComplaintCategory,
  type ComplaintStatus,
  type ComplaintPriority,
} from '@/lib/types'
import { cn } from '@/lib/utils'

const statusColors: Record<ComplaintStatus, string> = {
  aberta: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  em_andamento: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  resolvida: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  arquivada: 'bg-muted text-muted-foreground',
}

const priorityColors: Record<ComplaintPriority, string> = {
  baixa: 'bg-slate-500/10 text-slate-600 dark:text-slate-400',
  media: 'bg-sky-500/10 text-sky-600 dark:text-sky-400',
  alta: 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
  critica: 'bg-red-500/10 text-red-600 dark:text-red-400',
}

export default function AdminComplaintsPage() {
  const { complaints, updateComplaint } = useComplaints()
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [priorityFilter, setPriorityFilter] = useState<string>('all')
  const [neighborhoodFilter, setNeighborhoodFilter] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table')
  const [updatingComplaintId, setUpdatingComplaintId] = useState<string | null>(null)

  const activeFilters = [
    categoryFilter !== 'all' && { key: 'category', label: CATEGORY_LABELS[categoryFilter as ComplaintCategory] },
    statusFilter !== 'all' && { key: 'status', label: STATUS_LABELS[statusFilter as ComplaintStatus] },
    priorityFilter !== 'all' && { key: 'priority', label: PRIORITY_LABELS[priorityFilter as ComplaintPriority] },
    neighborhoodFilter !== 'all' && { key: 'neighborhood', label: neighborhoodFilter },
  ].filter(Boolean) as { key: string; label: string }[]

  const clearFilter = (key: string) => {
    if (key === 'category') setCategoryFilter('all')
    if (key === 'status') setStatusFilter('all')
    if (key === 'priority') setPriorityFilter('all')
    if (key === 'neighborhood') setNeighborhoodFilter('all')
  }

  const clearAllFilters = () => {
    setCategoryFilter('all')
    setStatusFilter('all')
    setPriorityFilter('all')
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
      const matchesPriority = priorityFilter === 'all' || complaint.priority === priorityFilter
      const matchesNeighborhood = neighborhoodFilter === 'all' || complaint.neighborhood === neighborhoodFilter

      return matchesSearch && matchesCategory && matchesStatus && matchesPriority && matchesNeighborhood
    })
  }, [complaints, search, categoryFilter, statusFilter, priorityFilter, neighborhoodFilter])

  const handleStatusUpdate = async (complaintId: string, status: ComplaintStatus) => {
    setUpdatingComplaintId(complaintId)

    try {
      await updateComplaint(complaintId, { status })
      toast({
        title: 'Status atualizado',
        description: `A denúncia foi marcada como ${STATUS_LABELS[status].toLowerCase()}.`,
      })
    } catch (error) {
      console.error(error)
      toast({
        title: 'Erro ao atualizar',
        description: 'Não foi possível atualizar o status da denúncia.',
        variant: 'destructive',
      })
    } finally {
      setUpdatingComplaintId(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold">Gestão de Denúncias</h1>
          <p className="text-muted-foreground text-sm">
            Gerencie e acompanhe todas as denúncias do sistema
          </p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Exportar
        </Button>
      </div>

      {/* Filters */}
      <Card className="border-border/50">
        <CardContent className="p-4">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar denúncias..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 h-10"
                />
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-2">
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-[150px] h-10">
                    <SelectValue placeholder="Categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                      <SelectItem key={key} value={key}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[140px] h-10">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    {Object.entries(STATUS_LABELS).map(([key, label]) => (
                      <SelectItem key={key} value={key}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger className="w-[130px] h-10">
                    <SelectValue placeholder="Prioridade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    {Object.entries(PRIORITY_LABELS).map(([key, label]) => (
                      <SelectItem key={key} value={key}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={neighborhoodFilter} onValueChange={setNeighborhoodFilter}>
                  <SelectTrigger className="w-[140px] h-10">
                    <SelectValue placeholder="Bairro" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    {NEIGHBORHOODS.map((neighborhood) => (
                      <SelectItem key={neighborhood} value={neighborhood}>{neighborhood}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* View Mode Toggle */}
                <div className="flex border border-border rounded-lg overflow-hidden">
                  <Button
                    variant={viewMode === 'table' ? 'secondary' : 'ghost'}
                    size="icon"
                    className="rounded-none h-10 w-10"
                    onClick={() => setViewMode('table')}
                  >
                    <ListIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'cards' ? 'secondary' : 'ghost'}
                    size="icon"
                    className="rounded-none h-10 w-10"
                    onClick={() => setViewMode('cards')}
                  >
                    <LayoutGrid className="h-4 w-4" />
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
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {filteredComplaints.length} denúncia{filteredComplaints.length !== 1 ? 's' : ''} encontrada{filteredComplaints.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Content */}
      {viewMode === 'table' ? (
        <Card className="border-border/50">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-xs">Título</TableHead>
                <TableHead className="text-xs">Bairro</TableHead>
                <TableHead className="text-xs">Categoria</TableHead>
                <TableHead className="text-xs">Status</TableHead>
                <TableHead className="text-xs">Prioridade</TableHead>
                <TableHead className="text-xs">Confirmações</TableHead>
                <TableHead className="text-xs">Data</TableHead>
                <TableHead className="text-xs text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredComplaints.map((complaint) => (
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
                  <TableCell>
                    <Badge 
                      variant="secondary" 
                      className={cn('text-xs', priorityColors[complaint.priority])}
                    >
                      {PRIORITY_LABELS[complaint.priority]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {complaint.confirmations}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Intl.DateTimeFormat('pt-BR', {
                      day: '2-digit',
                      month: 'short',
                    }).format(complaint.createdAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8" disabled={updatingComplaintId === complaint.id}>
                          {updatingComplaintId === complaint.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <MoreHorizontal className="h-4 w-4" />
                          )}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild className="gap-2">
                          <Link href={`/denuncia/${complaint.id}`}>
                            <Eye className="h-4 w-4" />
                            Ver detalhes
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="gap-2"
                          onClick={() => handleStatusUpdate(complaint.id, 'em_andamento')}
                          disabled={complaint.status === 'em_andamento' || updatingComplaintId === complaint.id}
                        >
                          <Clock className="h-4 w-4" />
                          Marcar em andamento
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="gap-2 text-emerald-600"
                          onClick={() => handleStatusUpdate(complaint.id, 'resolvida')}
                          disabled={complaint.status === 'resolvida' || updatingComplaintId === complaint.id}
                        >
                          <CheckCircle2 className="h-4 w-4" />
                          Marcar resolvida
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="gap-2 text-muted-foreground"
                          onClick={() => handleStatusUpdate(complaint.id, 'arquivada')}
                          disabled={complaint.status === 'arquivada' || updatingComplaintId === complaint.id}
                        >
                          <Archive className="h-4 w-4" />
                          Arquivar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredComplaints.map((complaint, index) => (
            <ComplaintCard key={complaint.id} complaint={complaint} index={index} />
          ))}
        </div>
      )}
    </div>
  )
}
