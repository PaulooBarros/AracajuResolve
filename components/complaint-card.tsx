'use client'

import { motion } from 'framer-motion'
import { MapPin, Calendar, Building2, Users, ChevronRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import type { Complaint, ComplaintStatus, ComplaintPriority } from '@/lib/types'
import { CATEGORY_LABELS, STATUS_LABELS, PRIORITY_LABELS } from '@/lib/types'
import { cn } from '@/lib/utils'
import Link from 'next/link'

interface ComplaintCardProps {
  complaint: Complaint
  index?: number
  compact?: boolean
}

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

// Format date consistently to avoid hydration mismatch
function formatDate(date: Date): string {
  const d = new Date(date)
  const day = d.getDate().toString().padStart(2, '0')
  const months = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']
  const month = months[d.getMonth()]
  const year = d.getFullYear()
  return `${day} de ${month}. de ${year}`
}

export function ComplaintCard({ complaint, index = 0, compact = false }: ComplaintCardProps) {
  const formattedDate = formatDate(complaint.createdAt)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Card className="group overflow-hidden border-border/50 bg-card hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
        <CardContent className={cn("p-0", compact ? "p-4" : "")}>
          <div className="flex gap-4">
            {/* Thumbnail */}
            {!compact && complaint.imageUrl && (
              <div className="relative w-28 h-full min-h-[120px] flex-shrink-0 overflow-hidden">
                <img
                  src={complaint.imageUrl}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            )}

            {/* Content */}
            <div className={cn("flex-1 py-4", !compact && "pr-4", !complaint.imageUrl && !compact && "pl-4")}>
              {/* Header with badges */}
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <Badge variant="outline" className={cn("text-xs font-medium", statusColors[complaint.status])}>
                  {STATUS_LABELS[complaint.status]}
                </Badge>
                <Badge variant="outline" className={cn("text-xs font-medium", priorityColors[complaint.priority])}>
                  {PRIORITY_LABELS[complaint.priority]}
                </Badge>
                <Badge variant="secondary" className="text-xs font-normal bg-muted/50">
                  {CATEGORY_LABELS[complaint.category]}
                </Badge>
              </div>

              {/* Title */}
              <h3 className="font-serif font-semibold text-base mb-1.5 line-clamp-1 group-hover:text-primary transition-colors">
                {complaint.title}
              </h3>

              {/* Description */}
              {!compact && (
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                  {complaint.description}
                </p>
              )}

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {complaint.neighborhood}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {formattedDate}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="h-3.5 w-3.5" />
                  {complaint.confirmations} confirmações
                </span>
              </div>

              {/* Responsible Organ */}
              {!compact && (
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
                  <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Building2 className="h-3.5 w-3.5" />
                    <span className="line-clamp-1">{complaint.responsibleOrgan}</span>
                  </span>
                  <Link href={`/denuncia/${complaint.id}`}>
                    <Button variant="ghost" size="sm" className="h-7 text-xs gap-1 text-primary hover:text-primary hover:bg-primary/10">
                      Ver detalhes
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// Simplified version for lists/tables
export function ComplaintCardCompact({ complaint, index = 0 }: { complaint: Complaint; index?: number }) {
  return <ComplaintCard complaint={complaint} index={index} compact />
}
