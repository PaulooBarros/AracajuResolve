'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import {
  Upload,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Camera,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useAuth } from '@/lib/auth-context'
import { useComplaints } from '@/lib/complaints-store'
import { CATEGORY_LABELS, NEIGHBORHOODS, RESPONSIBLE_ORGANS, type ComplaintCategory } from '@/lib/types'
import Link from 'next/link'
import type { ResolvedLocationDetails } from '@/components/location-picker'

const LocationPicker = dynamic(() => import('@/components/location-picker'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[300px] bg-muted animate-pulse rounded-lg flex items-center justify-center">
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
    </div>
  ),
})

export default function NewComplaintPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading: authLoading, user } = useAuth()
  const { addComplaint } = useComplaints()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [neighborhood, setNeighborhood] = useState('')
  const [street, setStreet] = useState('')
  const [referencePoint, setReferencePoint] = useState('')
  const [responsibleOrgan, setResponsibleOrgan] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [latitude, setLatitude] = useState<number | null>(null)
  const [longitude, setLongitude] = useState<number | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setImage(null)
    setImagePreview(null)
  }

  const handleLocationSelect = (lat: number, lng: number, details?: ResolvedLocationDetails) => {
    setLatitude(lat)
    setLongitude(lng)

    if (details?.neighborhood) {
      setNeighborhood(details.neighborhood)
    }

    if (details?.street) {
      setStreet(details.street)
    }

    if (details?.referencePoint) {
      setReferencePoint(details.referencePoint)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isAuthenticated) {
      setShowLoginModal(true)
      return
    }

    if (!latitude || !longitude) {
      alert('Por favor, selecione a localização do problema no mapa.')
      return
    }

    setIsSubmitting(true)

    await new Promise((resolve) => setTimeout(resolve, 1000))

    addComplaint({
      title,
      description,
      category: category as ComplaintCategory,
      neighborhood,
      street,
      referencePoint,
      responsibleOrgan: responsibleOrgan || 'A definir',
      imageUrl: imagePreview || undefined,
      latitude,
      longitude,
      userId: user?.id || 'anonymous',
      userName: user?.name || 'Usuário',
    })

    setIsSubmitting(false)
    setShowSuccess(true)

    setTimeout(() => {
      router.push('/minhas-denuncias')
    }, 2000)
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-8">
            <h1 className="font-serif text-3xl font-bold mb-2">Nova Denúncia</h1>
            <p className="text-muted-foreground">
              Registre um problema urbano e ajude a melhorar Aracaju
            </p>
          </div>

          {!isAuthenticated && (
            <Card className="mb-6 border-amber-500/50 bg-amber-500/5">
              <CardContent className="p-4 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Você precisa estar logado</p>
                  <p className="text-sm text-muted-foreground">
                    Para fazer uma denúncia, faça{' '}
                    <Link href="/login?redirect=/nova-denuncia" className="text-primary hover:underline">
                      login
                    </Link>{' '}
                    ou{' '}
                    <Link href="/cadastro" className="text-primary hover:underline">
                      cadastre-se
                    </Link>
                    .
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="font-serif text-lg">Informações da Denúncia</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="title">Título da denúncia *</FieldLabel>
                    <Input
                      id="title"
                      placeholder="Ex: Buraco perigoso na Av. Beira Mar"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                      className="h-11"
                    />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="description">Descrição detalhada *</FieldLabel>
                    <Textarea
                      id="description"
                      placeholder="Descreva o problema com o máximo de detalhes possíveis..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                      rows={4}
                      className="resize-none"
                    />
                  </Field>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <Field>
                      <FieldLabel>Categoria *</FieldLabel>
                      <Select value={category} onValueChange={setCategory} required>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Selecione a categoria" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                            <SelectItem key={key} value={key}>
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>

                    <Field>
                      <FieldLabel>Bairro *</FieldLabel>
                      <Select value={neighborhood} onValueChange={setNeighborhood} required>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Selecione o bairro" />
                        </SelectTrigger>
                        <SelectContent>
                          {NEIGHBORHOODS.map((item) => (
                            <SelectItem key={item} value={item}>
                              {item}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <Field>
                      <FieldLabel htmlFor="street">Rua</FieldLabel>
                      <Input
                        id="street"
                        placeholder="Ex: Av. Beira Mar"
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
                        className="h-11"
                      />
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="referencePoint">Ponto de Referência</FieldLabel>
                      <Input
                        id="referencePoint"
                        placeholder="Ex: Próximo ao calçadão"
                        value={referencePoint}
                        onChange={(e) => setReferencePoint(e.target.value)}
                        className="h-11"
                      />
                    </Field>
                  </div>

                  <Field>
                    <FieldLabel>Órgão Responsável</FieldLabel>
                    <Select value={responsibleOrgan} onValueChange={setResponsibleOrgan}>
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Selecione o Órgão (opcional)" />
                      </SelectTrigger>
                      <SelectContent>
                        {RESPONSIBLE_ORGANS.map((organ) => (
                          <SelectItem key={organ} value={organ}>
                            {organ}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground mt-1">
                      Se você souber qual Órgão deve resolver o problema
                    </p>
                  </Field>

                  <Field>
                    <FieldLabel>Localização no Mapa *</FieldLabel>
                    <LocationPicker
                      onLocationSelect={handleLocationSelect}
                      initialLat={latitude || undefined}
                      initialLng={longitude || undefined}
                    />
                    {latitude && longitude && (
                      <div className="mt-2 space-y-1">
                        <p className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Localização selecionada com sucesso
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Bairro, rua e ponto de referência serãoo preenchidos automaticamente quando disponíveis.
                        </p>
                      </div>
                    )}
                  </Field>

                  <Field>
                    <FieldLabel>Foto do Problema</FieldLabel>
                    {imagePreview ? (
                      <div className="relative rounded-lg overflow-hidden border border-border">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-48 object-cover"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2 h-8 w-8"
                          onClick={removeImage}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                        <Camera className="h-8 w-8 text-muted-foreground mb-2" />
                        <span className="text-sm text-muted-foreground">
                          Clique para adicionar uma foto
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageChange}
                        />
                      </label>
                    )}
                  </Field>

                  <Button
                    type="submit"
                    className="w-full h-11 bg-primary hover:bg-primary/90"
                    disabled={
                      isSubmitting ||
                      !title ||
                      !description ||
                      !category ||
                      !neighborhood ||
                      !latitude ||
                      !longitude
                    }
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Enviar Denúncia
                      </>
                    )}
                  </Button>
                </FieldGroup>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <Dialog open={showLoginModal} onOpenChange={setShowLoginModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-serif">Login Necessário</DialogTitle>
            <DialogDescription>
              Para fazer uma denúncia, você precisa estar logado na plataforma.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <Link href="/login?redirect=/nova-denuncia" className="flex-1">
              <Button className="w-full bg-primary hover:bg-primary/90">Fazer Login</Button>
            </Link>
            <Link href="/cadastro" className="flex-1">
              <Button variant="outline" className="w-full">
                Criar Conta
              </Button>
            </Link>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="mx-auto w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4"
          >
            <CheckCircle2 className="h-8 w-8 text-emerald-500" />
          </motion.div>
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">Denúncia Enviada!</DialogTitle>
            <DialogDescription>
              Sua denúncia foi registrada com sucesso. Você pode acompanhar o status na página
              {' Minhas Denúncias'}.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  )
}
