'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Edit3,
  FileText,
  Loader2,
  Mail,
  MapPin,
  PlusCircle,
  Save,
  Shield,
  UserRound,
  X,
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ComplaintCard } from '@/components/complaint-card'
import { toast } from '@/hooks/use-toast'
import { useAuth } from '@/lib/auth-context'
import { useComplaints } from '@/lib/complaints-store'
import { STATUS_LABELS, type ComplaintStatus } from '@/lib/types'
import { cn } from '@/lib/utils'

const statusStyles: Record<ComplaintStatus, string> = {
  aberta: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  em_andamento: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  resolvida: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  arquivada: 'bg-muted text-muted-foreground',
}

export default function ProfilePage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading, authError, updateProfile } = useAuth()
  const { complaints, isLoading: complaintsLoading } = useComplaints()

  const [name, setName] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [hasRedirected, setHasRedirected] = useState(false)

  useEffect(() => {
    if (user) {
      setName(user.name)
    }
  }, [user])

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !hasRedirected) {
      setHasRedirected(true)
      router.push('/login?redirect=/perfil')
    }
  }, [hasRedirected, isAuthenticated, isLoading, router])

  const userComplaints = useMemo(() => {
    if (!user) {
      return []
    }

    return complaints.filter((complaint) => complaint.userId === user.id)
  }, [complaints, user])

  const summary = useMemo(() => {
    const open = userComplaints.filter((complaint) => complaint.status === 'aberta').length
    const inProgress = userComplaints.filter((complaint) => complaint.status === 'em_andamento').length
    const resolved = userComplaints.filter(
      (complaint) => complaint.status === 'resolvida' || complaint.status === 'arquivada'
    ).length

    const mostCommonNeighborhood = Object.entries(
      userComplaints.reduce<Record<string, number>>((accumulator, complaint) => {
        accumulator[complaint.neighborhood] = (accumulator[complaint.neighborhood] || 0) + 1
        return accumulator
      }, {})
    )
      .sort((a, b) => b[1] - a[1])[0]?.[0]

    return {
      total: userComplaints.length,
      open,
      inProgress,
      resolved,
      mostCommonNeighborhood,
      recentComplaints: userComplaints.slice(0, 3),
    }
  }, [userComplaints])

  const joinedAtLabel = user
    ? new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }).format(user.createdAt)
    : ''

  const handleCancel = () => {
    setName(user?.name || '')
    setIsEditing(false)
  }

  const handleSave = async () => {
    const trimmedName = name.trim()

    if (!trimmedName) {
      toast({
        title: 'Nome obrigatorio',
        description: 'Informe um nome para salvar seu perfil.',
        variant: 'destructive',
      })
      return
    }

    if (trimmedName === user?.name) {
      setIsEditing(false)
      return
    }

    setIsSaving(true)

    try {
      const success = await updateProfile({ name: trimmedName })

      if (!success) {
        toast({
          title: 'Nao foi possivel salvar',
          description: authError || 'Tente novamente em instantes.',
          variant: 'destructive',
        })
        return
      }

      toast({
        title: 'Perfil atualizado',
        description: 'Seu nome foi atualizado com sucesso.',
      })
      setIsEditing(false)
    } catch (error) {
      console.error(error)
      toast({
        title: 'Erro ao atualizar perfil',
        description: 'Nao foi possivel salvar suas alteracoes.',
        variant: 'destructive',
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading || complaintsLoading || (!isAuthenticated && !hasRedirected)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  const statCards = [
    {
      title: 'Denuncias criadas',
      value: summary.total,
      icon: FileText,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'Abertas',
      value: summary.open,
      icon: Clock3,
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10',
    },
    {
      title: 'Em andamento',
      value: summary.inProgress,
      icon: Edit3,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'Concluidas',
      value: summary.resolved,
      icon: CheckCircle2,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10',
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border/50 bg-gradient-to-b from-primary/5 via-background to-background">
        <div className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between"
          >
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <Avatar className="h-20 w-20 border border-border/50 shadow-sm">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="bg-primary/10 text-primary text-2xl font-semibold">
                  {user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="font-serif text-3xl font-bold">Meu Perfil</h1>
                  <Badge
                    variant="secondary"
                    className={cn(
                      'text-xs',
                      user.role === 'admin'
                        ? 'bg-violet-500/10 text-violet-600 dark:text-violet-400'
                        : 'bg-primary/10 text-primary'
                    )}
                  >
                    {user.role === 'admin' ? 'Administrador' : 'Cidadao'}
                  </Badge>
                </div>
                <p className="mt-2 text-muted-foreground">
                  Gerencie seus dados e acompanhe seu historico de participacao na plataforma.
                </p>
                <div className="mt-4 flex flex-wrap gap-3 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    {user.email}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <CalendarDays className="h-4 w-4" />
                    Desde {joinedAtLabel}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link href="/nova-denuncia">
                <Button className="gap-2 bg-primary hover:bg-primary/90">
                  <PlusCircle className="h-4 w-4" />
                  Nova Denuncia
                </Button>
              </Link>
              <Link href="/minhas-denuncias">
                <Button variant="outline" className="gap-2">
                  <FileText className="h-4 w-4" />
                  Minhas Denuncias
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-8">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {statCards.map((stat, index) => {
            const Icon = stat.icon

            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className="border-border/50">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className={cn('rounded-lg p-3', stat.bgColor)}>
                        <Icon className={cn('h-5 w-5', stat.color)} />
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

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <Card className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div>
                <CardTitle className="font-serif text-xl">Dados da conta</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Atualize as informacoes principais exibidas no seu perfil.
                </p>
              </div>
              {!isEditing && (
                <Button variant="outline" size="sm" className="gap-2" onClick={() => setIsEditing(true)}>
                  <Edit3 className="h-4 w-4" />
                  Editar
                </Button>
              )}
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="profile-name" className="text-sm font-medium">
                    Nome completo
                  </label>
                  <Input
                    id="profile-name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    disabled={!isEditing || isSaving}
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="profile-email" className="text-sm font-medium">
                    E-mail
                  </label>
                  <Input id="profile-email" value={user.email} disabled className="h-11" />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-border/50 bg-muted/30 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Tipo de conta</p>
                  <p className="mt-2 flex items-center gap-2 font-medium">
                    {user.role === 'admin' ? <Shield className="h-4 w-4 text-violet-500" /> : <UserRound className="h-4 w-4 text-primary" />}
                    {user.role === 'admin' ? 'Administrador' : 'Cidadao'}
                  </p>
                </div>

                <div className="rounded-xl border border-border/50 bg-muted/30 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Conta criada</p>
                  <p className="mt-2 font-medium">{joinedAtLabel}</p>
                </div>

                <div className="rounded-xl border border-border/50 bg-muted/30 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Bairro mais frequente</p>
                  <p className="mt-2 flex items-center gap-2 font-medium">
                    <MapPin className="h-4 w-4 text-primary" />
                    {summary.mostCommonNeighborhood || 'Sem denuncias ainda'}
                  </p>
                </div>
              </div>

              {isEditing && (
                <div className="flex flex-wrap gap-3">
                  <Button className="gap-2" onClick={handleSave} disabled={isSaving}>
                    {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    Salvar alteracoes
                  </Button>
                  <Button variant="ghost" className="gap-2" onClick={handleCancel} disabled={isSaving}>
                    <X className="h-4 w-4" />
                    Cancelar
                  </Button>
                </div>
              )}

              {authError && <p className="text-sm text-destructive">{authError}</p>}
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader className="pb-4">
              <CardTitle className="font-serif text-xl">Resumo rapido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {([
                ['aberta', summary.open],
                ['em_andamento', summary.inProgress],
                ['resolvida', summary.resolved],
              ] as Array<[ComplaintStatus, number]>).map(([status, value]) => (
                <div key={status} className="flex items-center justify-between rounded-xl border border-border/50 p-4">
                  <div>
                    <Badge variant="secondary" className={cn('text-xs', statusStyles[status])}>
                      {STATUS_LABELS[status]}
                    </Badge>
                    <p className="mt-2 text-sm text-muted-foreground">Denuncias com esse status no seu historico.</p>
                  </div>
                  <span className="font-serif text-3xl font-bold">{value}</span>
                </div>
              ))}

              <div className="rounded-xl border border-dashed border-border/60 p-4 text-sm text-muted-foreground">
                Seu perfil ajuda a acompanhar suas demandas e dar contexto ao poder publico sobre a recorrencia dos problemas relatados.
              </div>
            </CardContent>
          </Card>
        </div>

        <section className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="font-serif text-2xl font-bold">Atividade recente</h2>
              <p className="text-sm text-muted-foreground">
                As ultimas denuncias registradas na sua conta.
              </p>
            </div>
            {summary.total > 0 && (
              <Link href="/minhas-denuncias">
                <Button variant="ghost" size="sm">
                  Ver historico completo
                </Button>
              </Link>
            )}
          </div>

          {summary.recentComplaints.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {summary.recentComplaints.map((complaint, index) => (
                <ComplaintCard key={complaint.id} complaint={complaint} index={index} />
              ))}
            </div>
          ) : (
            <Card className="border-border/50">
              <CardContent className="py-12 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-serif text-xl font-semibold">Nenhuma denuncia enviada ainda</h3>
                <p className="mt-2 text-muted-foreground">
                  Quando voce registrar sua primeira denuncia, ela vai aparecer aqui com status e acompanhamento.
                </p>
                <Link href="/nova-denuncia" className="inline-flex mt-6">
                  <Button className="gap-2 bg-primary hover:bg-primary/90">
                    <PlusCircle className="h-4 w-4" />
                    Criar primeira denuncia
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </section>
      </div>
    </div>
  )
}
