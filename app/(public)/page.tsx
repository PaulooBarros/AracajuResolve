'use client'

import dynamic from 'next/dynamic'
import { useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  Map,
  FileText,
  Users,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  MapPin,
  Lightbulb,
  Vote,
  BarChart3,
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ComplaintCard } from '@/components/complaint-card'
import { useComplaints } from '@/lib/complaints-store'

const MapComponent = dynamic(() => import('@/components/map-component'), {
  ssr: false,
})

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

export default function HomePage() {
  const { complaints, isLoading } = useComplaints()

  const stats = useMemo(() => {
    const totalComplaints = complaints.length
    const resolvedComplaints = complaints.filter((complaint) => complaint.status === 'resolvida').length
    const totalNeighborhoods = new Set(
      complaints.map((complaint) => complaint.neighborhood).filter(Boolean)
    ).size

    const resolved = complaints.filter((complaint) => complaint.status === 'resolvida')
    const avgResolutionDays = resolved.length > 0
      ? Math.round(
          resolved.reduce((acc, complaint) => {
            const diffDays = Math.max(
              1,
              Math.round(
                (complaint.updatedAt.getTime() - complaint.createdAt.getTime()) / (1000 * 60 * 60 * 24)
              )
            )
            return acc + diffDays
          }, 0) / resolved.length
        )
      : 0

    const now = new Date()
    const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfPreviousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const endOfPreviousMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999)

    const currentMonthCount = complaints.filter((complaint) => complaint.createdAt >= startOfCurrentMonth).length
    const previousMonthCount = complaints.filter(
      (complaint) =>
        complaint.createdAt >= startOfPreviousMonth && complaint.createdAt <= endOfPreviousMonth
    ).length

    const growthPercentage = previousMonthCount > 0
      ? Math.round(((currentMonthCount - previousMonthCount) / previousMonthCount) * 100)
      : currentMonthCount > 0
        ? 100
        : 0

    return {
      totalComplaints,
      resolvedComplaints,
      totalNeighborhoods,
      avgResolutionDays,
      growthPercentage,
    }
  }, [complaints])

  const recentComplaints = useMemo(() => complaints.slice(0, 3), [complaints])

  const topNeighborhoods = useMemo(() => {
    return Object.entries(
      complaints.reduce<Record<string, { complaintsCount: number; resolvedCount: number }>>((acc, complaint) => {
        if (!complaint.neighborhood) return acc

        if (!acc[complaint.neighborhood]) {
          acc[complaint.neighborhood] = { complaintsCount: 0, resolvedCount: 0 }
        }

        acc[complaint.neighborhood].complaintsCount += 1
        if (complaint.status === 'resolvida') {
          acc[complaint.neighborhood].resolvedCount += 1
        }

        return acc
      }, {})
    )
      .map(([name, values]) => ({
        name,
        complaintsCount: values.complaintsCount,
        resolvedCount: values.resolvedCount,
      }))
      .sort((a, b) => b.complaintsCount - a.complaintsCount)
      .slice(0, 5)
  }, [complaints])

  const featuredComplaints = useMemo(() => {
    return complaints.filter((complaint) => complaint.latitude && complaint.longitude).slice(0, 8)
  }, [complaints])

  const featuredComplaint = featuredComplaints[0]
  const resolutionRate = stats.totalComplaints > 0
    ? Math.round((stats.resolvedComplaints / stats.totalComplaints) * 100)
    : 0

  return (
    <div className="relative">
      <section className="relative overflow-hidden bg-gradient-to-b from-background via-background to-muted/20 py-20 lg:py-28">
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.02]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23539FA2' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
            }}
          />
        </div>

        <div className="container mx-auto px-4 relative">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center lg:text-left"
            >
              <Badge variant="secondary" className="mb-6 bg-primary/10 text-primary border-0 px-4 py-1.5">
                Plataforma de Monitoramento Urbano
              </Badge>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-balance">
                Transforme problemas da cidade em{' '}
                <span className="text-primary">soluções visíveis</span>
              </h1>

              <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0 text-pretty">
                Registre denúncias, acompanhe a resolução e ajude a priorizar o que realmente
                importa para Aracaju.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-10">
                <Link href="/mapa">
                  <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90 gap-2 h-12 px-8">
                    <Map className="h-5 w-5" />
                    Ver mapa
                  </Button>
                </Link>
                <Link href="/nova-denuncia">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto gap-2 h-12 px-8 border-primary/30 hover:bg-primary/5"
                  >
                    <FileText className="h-5 w-5" />
                    Fazer denúncia
                  </Button>
                </Link>
              </div>

              <motion.div
                variants={staggerContainer}
                initial="initial"
                animate="animate"
                className="grid grid-cols-3 gap-6 pt-8 border-t border-border/50"
              >
                <motion.div variants={fadeInUp} className="text-center lg:text-left">
                  <p className="font-serif text-3xl font-bold text-primary">{stats.totalComplaints}</p>
                  <p className="text-sm text-muted-foreground">Denúncias registradas</p>
                </motion.div>
                <motion.div variants={fadeInUp} className="text-center lg:text-left">
                  <p className="font-serif text-3xl font-bold text-primary">{stats.resolvedComplaints}</p>
                  <p className="text-sm text-muted-foreground">Denúncias resolvidas</p>
                </motion.div>
                <motion.div variants={fadeInUp} className="text-center lg:text-left">
                  <p className="font-serif text-3xl font-bold text-primary">{stats.totalNeighborhoods}</p>
                  <p className="text-sm text-muted-foreground">Bairros ativos</p>
                </motion.div>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-primary/10 border border-border/50">
                <div className="aspect-[4/3] bg-gradient-to-br from-muted to-muted/50 relative">
                  {featuredComplaints.length > 0 ? (
                    <MapComponent complaints={featuredComplaints} initialZoom={12} interactive={false} />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                      {isLoading ? 'Carregando ocorrências...' : 'As novas denúncias vão aparecer aqui no mapa.'}
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="absolute bottom-4 left-4 right-4"
                  >
                    <Card className="bg-card/95 backdrop-blur border-border/50">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20">
                            {featuredComplaint ? featuredComplaint.status.replace('_', ' ') : 'Sem denúncias'}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {featuredComplaint
                              ? featuredComplaint.createdAt.toLocaleDateString('pt-BR')
                              : 'Envie a primeira denúncia'}
                          </span>
                        </div>
                        <p className="font-medium text-sm line-clamp-1">
                          {featuredComplaint?.title || 'As denúncias publicadas passam a aparecer aqui.'}
                        </p>
                        <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          <span>{featuredComplaint?.neighborhood || 'Aracaju'}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>
              </div>

              <div className="absolute -z-10 -top-4 -right-4 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
              <div className="absolute -z-10 -bottom-8 -left-8 w-64 h-64 bg-secondary/10 rounded-full blur-3xl" />
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10"
          >
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold mb-2">Problemas acontecendo agora</h2>
              <p className="text-muted-foreground">Veja as denúncias mais recentes da comunidade</p>
            </div>
            <Link href="/denuncias">
              <Button variant="outline" className="gap-2">
                Ver todas
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </motion.div>

          {recentComplaints.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentComplaints.map((complaint, index) => (
                <ComplaintCard key={complaint.id} complaint={complaint} index={index} />
              ))}
            </div>
          ) : (
            <Card className="border-dashed border-border/60">
              <CardContent className="flex min-h-40 items-center justify-center text-center text-muted-foreground">
                {isLoading ? 'Carregando denúncias...' : 'Nenhuma denúncia publicada ainda. A primeira vai aparecer aqui.'}
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-14"
          >
            <h2 className="font-serif text-2xl sm:text-3xl font-bold mb-4">Como funciona</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Em três passos simples, você ajuda a transformar Aracaju
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Lightbulb,
                title: 'Registre',
                description: 'Identifique um problema urbano e registre sua denúncia com fotos e localização.',
              },
              {
                icon: Vote,
                title: 'Comunidade valida',
                description: 'Outros cidadãos confirmam o problema, aumentando sua visibilidade e prioridade.',
              },
              {
                icon: BarChart3,
                title: 'Prioridade aumenta',
                description: 'Denúncias com mais confirmacoes ganham destaque e ajudam a orientar a resposta.',
              },
            ].map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full border-border/50 bg-card hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 text-center">
                  <CardContent className="p-8">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 text-primary mb-6">
                      <step.icon className="h-7 w-7" />
                    </div>
                    <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-muted text-muted-foreground font-serif font-bold text-sm mb-4">
                      {index + 1}
                    </div>
                    <h3 className="font-serif text-xl font-semibold mb-3">{step.title}</h3>
                    <p className="text-muted-foreground text-sm">{step.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="font-serif text-2xl sm:text-3xl font-bold mb-4">Bairros mais afetados</h2>
              <p className="text-muted-foreground mb-8">
                Acompanhe quais regiões precisam de mais atenção e como está o progresso de resolução em cada bairro.
              </p>

              {topNeighborhoods.length > 0 ? (
                <div className="space-y-4">
                  {topNeighborhoods.map((neighborhood, index) => {
                    const percentage = Math.round(
                      (neighborhood.resolvedCount / neighborhood.complaintsCount) * 100
                    )

                    return (
                      <motion.div
                        key={neighborhood.name}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="group"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-muted text-xs font-medium">
                              {index + 1}
                            </span>
                            <span className="font-medium">{neighborhood.name}</span>
                          </div>
                          <div className="flex items-center gap-4 text-sm">
                            <span className="text-muted-foreground">
                              {neighborhood.complaintsCount} denuncias
                            </span>
                            <span className="text-primary font-medium">{percentage}% resolvido</span>
                          </div>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${percentage}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: index * 0.1 }}
                            className="h-full bg-primary rounded-full"
                          />
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              ) : (
                <Card className="border-dashed border-border/60">
                  <CardContent className="flex min-h-32 items-center justify-center text-center text-muted-foreground">
                    Os bairros mais afetados serão listados conforme as denúncias forem chegando.
                  </CardContent>
                </Card>
              )}

              <Link href="/mapa" className="inline-block mt-8">
                <Button variant="outline" className="gap-2">
                  Ver mapa completo
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="hidden lg:block"
            >
              <Card className="border-border/50 bg-gradient-to-br from-primary/5 to-secondary/5">
                <CardContent className="p-8">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="text-center p-6 rounded-xl bg-card">
                      <TrendingUp className="h-8 w-8 text-primary mx-auto mb-3" />
                      <p className="font-serif text-3xl font-bold text-primary">
                        {stats.growthPercentage > 0 ? '+' : ''}
                        {stats.growthPercentage}%
                      </p>
                      <p className="text-sm text-muted-foreground">Crescimento mensal</p>
                    </div>
                    <div className="text-center p-6 rounded-xl bg-card">
                      <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto mb-3" />
                      <p className="font-serif text-3xl font-bold text-emerald-500">{resolutionRate}%</p>
                      <p className="text-sm text-muted-foreground">Taxa de resolução</p>
                    </div>
                    <div className="text-center p-6 rounded-xl bg-card">
                      <Users className="h-8 w-8 text-secondary mx-auto mb-3" />
                      <p className="font-serif text-3xl font-bold text-secondary">
                        {new Set(complaints.map((complaint) => complaint.userId)).size}
                      </p>
                      <p className="text-sm text-muted-foreground">Usuários denunciando</p>
                    </div>
                    <div className="text-center p-6 rounded-xl bg-card">
                      <FileText className="h-8 w-8 text-amber-500 mx-auto mb-3" />
                      <p className="font-serif text-3xl font-bold text-amber-500">{stats.avgResolutionDays}</p>
                      <p className="text-sm text-muted-foreground">Dias em média para resolver</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-primary/10 via-secondary/5 to-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-2xl mx-auto"
          >
            <h2 className="font-serif text-2xl sm:text-3xl font-bold mb-4">Faça parte da mudança</h2>
            <p className="text-muted-foreground mb-8">
              Cada denúncia registrada ajuda a construir uma cidade melhor. Junte-se a quem já está
              fazendo a diferenca.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/cadastro">
                <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90 gap-2 h-12 px-8">
                  Criar minha conta
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/mapa">
                <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2 h-12 px-8">
                  <Map className="h-5 w-5" />
                  Explorar o mapa
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
