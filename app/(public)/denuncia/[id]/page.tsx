'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import { 
  MapPin, 
  Calendar, 
  Building2, 
  User, 
  ChevronLeft,
  CheckCircle2,
  AlertTriangle,
  ThumbsUp,
  Share2,
  Clock,
  Loader2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useComplaints } from '@/lib/complaints-store'
import { useAuth } from '@/lib/auth-context'
import { 
  CATEGORY_LABELS, 
  STATUS_LABELS, 
  PRIORITY_LABELS,
  type ComplaintStatus,
  type ComplaintPriority
} from '@/lib/types'
import { cn } from '@/lib/utils'
import Link from 'next/link'

const MapComponent = dynamic(() => import('@/components/map-component'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[300px] bg-muted animate-pulse rounded-lg flex items-center justify-center">
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
    </div>
  ),
})

const statusColors: Record<ComplaintStatus, string> = {
  aberta: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
  em_andamento: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
  resolvida: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  arquivada: 'bg-muted text-muted-foreground border-muted',
}

const priorityColors: Record<ComplaintPriority, string> = {
  baixa: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20',
  media: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20',
  alta: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20',
  critica: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
}

export default function ComplaintDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { getComplaintById, confirmComplaint, markAsResolved, isLoading } = useComplaints()
  const { user, isAuthenticated } = useAuth()
  
  const [complaint, setComplaint] = useState<ReturnType<typeof getComplaintById>>(undefined)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [showResolvedModal, setShowResolvedModal] = useState(false)
  const [hasConfirmed, setHasConfirmed] = useState(false)
  const [isConfirming, setIsConfirming] = useState(false)
  const [isResolving, setIsResolving] = useState(false)

  useEffect(() => {
    if (!isLoading && params.id) {
      const found = getComplaintById(params.id as string)
      setComplaint(found)
    }
  }, [params.id, isLoading, getComplaintById])

  const handleConfirm = async () => {
    if (!complaint) return
    setIsConfirming(true)

    try {
      await confirmComplaint(complaint.id)
      setHasConfirmed(true)
      setShowConfirmModal(false)
      const updated = getComplaintById(complaint.id)
      setComplaint(updated)
    } finally {
      setIsConfirming(false)
    }
  }

  const handleMarkResolved = async () => {
    if (!complaint) return
    setIsResolving(true)

    try {
      await markAsResolved(complaint.id)
      setShowResolvedModal(false)
      const updated = getComplaintById(complaint.id)
      setComplaint(updated)
    } finally {
      setIsResolving(false)
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: complaint?.title,
          text: complaint?.description,
          url: window.location.href,
        })
      } catch (err) {
        // User cancelled share
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      alert('Link copiado para a área de transferência!')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!complaint) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <AlertTriangle className="h-16 w-16 text-muted-foreground" />
        <h1 className="text-2xl font-serif font-bold">Denúncia não encontrada</h1>
        <p className="text-muted-foreground">A denúncia que você procura não existe ou foi removida.</p>
        <Link href="/denuncias">
          <Button variant="outline">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Voltar para denúncias
          </Button>
        </Link>
      </div>
    )
  }

  const formattedDate = new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(complaint.createdAt)

  const formattedUpdateDate = new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(complaint.updatedAt)

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6"
        >
          <Button 
            variant="ghost" 
            onClick={() => router.back()}
            className="gap-2 text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="h-4 w-4" />
            Voltar
          </Button>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Header */}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <Badge variant="outline" className={cn("font-medium", statusColors[complaint.status])}>
                  {STATUS_LABELS[complaint.status]}
                </Badge>
                <Badge variant="outline" className={cn("font-medium", priorityColors[complaint.priority])}>
                  {PRIORITY_LABELS[complaint.priority]}
                </Badge>
                <Badge variant="secondary">
                  {CATEGORY_LABELS[complaint.category]}
                </Badge>
              </div>
              
              <h1 className="font-serif text-2xl sm:text-3xl font-bold mb-2 text-balance">
                {complaint.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <User className="h-4 w-4" />
                  {complaint.userName}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  {formattedDate}
                </span>
              </div>
            </div>

            {/* Image */}
            {complaint.imageUrl && (
              <div className="rounded-xl overflow-hidden border border-border">
                <img
                  src={complaint.imageUrl}
                  alt={complaint.title}
                  className="w-full h-auto max-h-[400px] object-cover"
                />
              </div>
            )}

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle className="font-serif text-lg">Descrição do Problema</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                  {complaint.description}
                </p>
              </CardContent>
            </Card>

            {/* Location Map */}
            <Card>
              <CardHeader>
                <CardTitle className="font-serif text-lg flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Localização
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg overflow-hidden border border-border h-[300px]">
                  <MapComponent 
                    complaints={[complaint]} 
                    selectedComplaintId={complaint.id}
                  />
                </div>
                <p className="mt-3 text-sm text-muted-foreground">
                  {complaint.neighborhood}, Aracaju - SE
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-4"
          >
            {/* Actions Card */}
            <Card>
              <CardHeader>
                <CardTitle className="font-serif text-lg">Ações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {complaint.status !== 'resolvida' && complaint.status !== 'arquivada' && (
                  <>
                    <Button 
                      className="w-full gap-2 bg-primary hover:bg-primary/90"
                      onClick={() => setShowConfirmModal(true)}
                      disabled={hasConfirmed}
                    >
                      <ThumbsUp className="h-4 w-4" />
                      {hasConfirmed ? 'Confirmação enviada' : 'Confirmar problema'}
                    </Button>
                    
                    <Button 
                      variant="outline"
                      className="w-full gap-2 border-emerald-500/50 text-emerald-600 hover:bg-emerald-500/10 hover:text-emerald-600"
                      onClick={() => setShowResolvedModal(true)}
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      Informar que foi resolvido
                    </Button>
                  </>
                )}
                
                {complaint.status === 'resolvida' && (
                  <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                    <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="h-5 w-5" />
                      <span className="font-medium">Problema resolvido!</span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Esta denúncia foi marcada como resolvida.
                    </p>
                  </div>
                )}

                <Separator />

                <Button 
                  variant="ghost" 
                  className="w-full gap-2"
                  onClick={handleShare}
                >
                  <Share2 className="h-4 w-4" />
                  Compartilhar
                </Button>
              </CardContent>
            </Card>

            {/* Info Card */}
            <Card>
              <CardHeader>
                <CardTitle className="font-serif text-lg">Informações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <ThumbsUp className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{complaint.confirmations}</p>
                    <p className="text-sm text-muted-foreground">Confirmações</p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Building2 className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{complaint.responsibleOrgan}</p>
                    <p className="text-xs text-muted-foreground">Órgão Responsável</p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <MapPin className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{complaint.neighborhood}</p>
                    <p className="text-sm text-muted-foreground">Bairro</p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Clock className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Última atualização</p>
                    <p className="text-xs text-muted-foreground">{formattedUpdateDate}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Confirm Modal */}
      <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-serif">Confirmar problema</DialogTitle>
            <DialogDescription>
              Ao confirmar, você está informando que este problema ainda existe no local indicado. 
              Isso ajuda a priorizar as denúncias mais urgentes.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setShowConfirmModal(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleConfirm}
              disabled={isConfirming}
              className="bg-primary hover:bg-primary/90"
            >
              {isConfirming ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Confirmando...
                </>
              ) : (
                <>
                  <ThumbsUp className="h-4 w-4 mr-2" />
                  Confirmar
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Resolved Modal */}
      <Dialog open={showResolvedModal} onOpenChange={setShowResolvedModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-serif">Informar resolução</DialogTitle>
            <DialogDescription>
              Você está informando que este problema foi resolvido. 
              Esta ação ajuda a manter o sistema atualizado e fecha a denúncia.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground">
                  Certifique-se de que o problema foi realmente resolvido antes de confirmar. 
                  Informações falsas podem prejudicar a comunidade.
                </p>
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setShowResolvedModal(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleMarkResolved}
              disabled={isResolving}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {isResolving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Processando...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Confirmar resolução
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
