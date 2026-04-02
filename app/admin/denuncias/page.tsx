'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  Search,
  X,
  LayoutGrid,
  List as ListIcon,
  MoreHorizontal,
  Eye,
  CheckCircle2,
  Clock,
  Archive,
  Download,
  Loader2,
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
      const matchesSearch =
        search === '' ||
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
        description: `A denuncia foi marcada como ${STATUS_LABELS[status].toLowerCase()}.`,
      })
    } catch (error) {
      console.error(error)
      toast({
        title: 'Erro ao atualizar',
        description: 'Nao foi possivel atualizar o status da denuncia.',
        variant: 'destructive',
      })
    } finally {
      setUpdatingComplaintId(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold">Gestao de Denuncias</h1>
          <p className="text-muted-foreground text-sm">Gerencie e acompanhe todas as denuncias do sistema</p>
        </div>
        <Button variant="outline" className="w-full sm:w-auto gap-2">
          <Download className="h-4 w-4" />
          Exportar
        </Button>
      </div>

      <Card className="border-border/50">
        <CardContent className="p-4">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col xl:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar denuncias..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 h-10"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:flex xl:flex-wrap gap-2 w-full xl:w-auto">
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-full xl:w-[150px] h-10">
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
                  <SelectTrigger className="w-full xl:w-[140px] h-10">
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
                  <SelectTrigger className="w-full xl:w-[130px] h-10">
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
                  <SelectTrigger className="w-full xl:w-[140px] h-10">
                    <SelectValue placeholder="Bairro" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    {NEIGHBORHOODS.map((neighborhood) => (
                      <SelectItem key={neighborhood} value={neighborhood}>{neighborhood}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="flex border border-border rounded-lg overflow-hidden">
                  <Button
                    variant={viewMode === 'table' ? 'secondary' : 'ghost'}
                    size="icon"
                    className="rounded-none h-10 flex-1 xl:w-10"
                    onClick={() => setViewMode('table')}
                  >
                    <ListIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'cards' ? 'secondary' : 'ghost'}
                    size="icon"
                    className="rounded-none h-10 flex-1 xl:w-10"
                    onClick={() => setViewMode('cards')}
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {activeFilters.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm text-muted-foreground">Filtros ativos:</span>
                {activeFilters.map((filter) => (
                  <Badge key={filter.key} variant="secondary" className="gap-1 pr-1">
                    {filter.label}
                    <button onClick={() => clearFilter(filter.key)} className="ml-1 hover:bg-muted rounded-full p-0.5">
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

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {filteredComplaints.length} denuncia{filteredComplaints.length !== 1 ? 's' : ''} encontrada{filteredComplaints.length !== 1 ? 's' : ''}
        </p>
      </div>

      {viewMode === 'table' ? (
        <Card className="border-border/50">
          <div className="hidden lg:block overflow-x-auto">
            <Table className="min-w-[900px]">
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-xs">Titulo</TableHead>
                  <TableHead className="text-xs">Bairro</TableHead>
                  <TableHead className="text-xs">Categoria</TableHead>
                  <TableHead className="text-xs">Status</TableHead>
                  <TableHead className="text-xs">Prioridade</TableHead>
                  <TableHead className="text-xs">Confirmacoes</TableHead>
                  <TableHead className="text-xs">Data</TableHead>
                  <TableHead className="text-xs text-right">Acoes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredComplaints.map((complaint) => (
                  <TableRow key={complaint.id}>
                    <TableCell className="font-medium text-sm max-w-[200px] truncate">{complaint.title}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{complaint.neighborhood}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{CATEGORY_LABELS[complaint.category]}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={cn('text-xs', statusColors[complaint.status])}>
                        {STATUS_LABELS[complaint.status]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={cn('text-xs', priorityColors[complaint.priority])}>
                        {PRIORITY_LABELS[complaint.priority]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{complaint.confirmations}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Intl.DateTimeFormat('pt-BR', {
                        day: '2-digit',
                        month: 'short',
                      }).format(complaint.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <ComplaintActions
                        complaintId={complaint.id}
                        complaintStatus={complaint.status}
                        updatingComplaintId={updatingComplaintId}
                        onStatusUpdate={handleStatusUpdate}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="space-y-4 p-4 lg:hidden">
            {filteredComplaints.map((complaint) => (
              <div key={complaint.id} className="rounded-lg border border-border/50 p-4 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-medium text-sm">{complaint.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{complaint.neighborhood}</p>
                  </div>
                  <ComplaintActions
                    complaintId={complaint.id}
                    complaintStatus={complaint.status}
                    updatingComplaintId={updatingComplaintId}
                    onStatusUpdate={handleStatusUpdate}
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className={cn('text-xs', statusColors[complaint.status])}>
                    {STATUS_LABELS[complaint.status]}
                  </Badge>
                  <Badge variant="secondary" className={cn('text-xs', priorityColors[complaint.priority])}>
                    {PRIORITY_LABELS[complaint.priority]}
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {CATEGORY_LABELS[complaint.category]}
                  </Badge>
                </div>
                <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
                  <span>{complaint.confirmations} confirmacoes</span>
                  <span>
                    {new Intl.DateTimeFormat('pt-BR', {
                      day: '2-digit',
                      month: 'short',
                    }).format(complaint.createdAt)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredComplaints.map((complaint, index) => (
            <ComplaintCard key={complaint.id} complaint={complaint} index={index} />
          ))}
        </div>
      )}
    </div>
  )
}

function ComplaintActions({
  complaintId,
  complaintStatus,
  updatingComplaintId,
  onStatusUpdate,
}: {
  complaintId: string
  complaintStatus: ComplaintStatus
  updatingComplaintId: string | null
  onStatusUpdate: (complaintId: string, status: ComplaintStatus) => Promise<void>
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8" disabled={updatingComplaintId === complaintId}>
          {updatingComplaintId === complaintId ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <MoreHorizontal className="h-4 w-4" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild className="gap-2">
          <Link href={`/denuncia/${complaintId}`}>
            <Eye className="h-4 w-4" />
            Ver detalhes
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="gap-2"
          onClick={() => onStatusUpdate(complaintId, 'em_andamento')}
          disabled={complaintStatus === 'em_andamento' || updatingComplaintId === complaintId}
        >
          <Clock className="h-4 w-4" />
          Marcar em andamento
        </DropdownMenuItem>
        <DropdownMenuItem
          className="gap-2 text-emerald-600"
          onClick={() => onStatusUpdate(complaintId, 'resolvida')}
          disabled={complaintStatus === 'resolvida' || updatingComplaintId === complaintId}
        >
          <CheckCircle2 className="h-4 w-4" />
          Marcar resolvida
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="gap-2 text-muted-foreground"
          onClick={() => onStatusUpdate(complaintId, 'arquivada')}
          disabled={complaintStatus === 'arquivada' || updatingComplaintId === complaintId}
        >
          <Archive className="h-4 w-4" />
          Arquivar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
