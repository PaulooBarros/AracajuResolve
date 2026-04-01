'use client'

import { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { PlusCircle, FileText, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ComplaintCard } from '@/components/complaint-card'
import { useAuth } from '@/lib/auth-context'
import { useComplaints } from '@/lib/complaints-store'

export default function MyComplaintsPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading } = useAuth()
  const { complaints, isLoading: complaintsLoading } = useComplaints()

  // Filter complaints by current user
  const userComplaints = useMemo(() => {
    if (!user) return []
    // Show complaints from current user + demo complaints
    return complaints.filter(c => c.userId === user.id || c.userId === '1' || c.userId === '2')
  }, [user, complaints])

  const openComplaints = userComplaints.filter(c => c.status === 'aberta')
  const inProgressComplaints = userComplaints.filter(c => c.status === 'em_andamento')
  const resolvedComplaints = userComplaints.filter(c => c.status === 'resolvida' || c.status === 'arquivada')

  if (isLoading || complaintsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!isAuthenticated) {
    router.push('/login?redirect=/minhas-denuncias')
    return null
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
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <div>
              <h1 className="font-serif text-3xl font-bold mb-2">
                Minhas Denúncias
              </h1>
              <p className="text-muted-foreground">
                Acompanhe o status das suas denúncias registradas
              </p>
            </div>
            <Link href="/nova-denuncia">
              <Button className="bg-primary hover:bg-primary/90 gap-2">
                <PlusCircle className="h-4 w-4" />
                Nova Denúncia
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {userComplaints.length > 0 ? (
          <Tabs defaultValue="all">
            <TabsList className="mb-8">
              <TabsTrigger value="all">
                Todas ({userComplaints.length})
              </TabsTrigger>
              <TabsTrigger value="open">
                Abertas ({openComplaints.length})
              </TabsTrigger>
              <TabsTrigger value="progress">
                Em Andamento ({inProgressComplaints.length})
              </TabsTrigger>
              <TabsTrigger value="resolved">
                Resolvidas ({resolvedComplaints.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userComplaints.map((complaint, index) => (
                  <ComplaintCard key={complaint.id} complaint={complaint} index={index} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="open">
              {openComplaints.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {openComplaints.map((complaint, index) => (
                    <ComplaintCard key={complaint.id} complaint={complaint} index={index} />
                  ))}
                </div>
              ) : (
                <EmptyState message="Você não tem denúncias abertas." />
              )}
            </TabsContent>

            <TabsContent value="progress">
              {inProgressComplaints.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {inProgressComplaints.map((complaint, index) => (
                    <ComplaintCard key={complaint.id} complaint={complaint} index={index} />
                  ))}
                </div>
              ) : (
                <EmptyState message="Nenhuma denúncia em andamento." />
              )}
            </TabsContent>

            <TabsContent value="resolved">
              {resolvedComplaints.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {resolvedComplaints.map((complaint, index) => (
                    <ComplaintCard key={complaint.id} complaint={complaint} index={index} />
                  ))}
                </div>
              ) : (
                <EmptyState message="Nenhuma denúncia resolvida ainda." />
              )}
            </TabsContent>
          </Tabs>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <FileText className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="font-serif text-xl font-semibold mb-2">
              Nenhuma denúncia ainda
            </h2>
            <p className="text-muted-foreground mb-6">
              Você ainda não registrou nenhuma denúncia. Que tal começar agora?
            </p>
            <Link href="/nova-denuncia">
              <Button className="bg-primary hover:bg-primary/90 gap-2">
                <PlusCircle className="h-4 w-4" />
                Fazer Primeira Denúncia
              </Button>
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  )
}

function EmptyState({ message }: { message: string }) {
  return (
    <Card className="border-border/50">
      <CardContent className="py-12 text-center">
        <p className="text-muted-foreground">{message}</p>
      </CardContent>
    </Card>
  )
}
