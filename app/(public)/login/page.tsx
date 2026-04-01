'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Map, Eye, EyeOff, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuth } from '@/lib/auth-context'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/'
  const { login } = useAuth()
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState<'user' | 'admin'>('user')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const success = await login(email, password, activeTab)
      if (success) {
        router.push(activeTab === 'admin' ? '/admin' : redirect)
      } else {
        setError('Credenciais inválidas')
      }
    } catch {
      setError('Erro ao fazer login')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Map className="h-6 w-6" />
            </div>
            <span className="font-serif text-2xl font-bold tracking-tight">
              Aracaju<span className="text-primary">Resolve</span>
            </span>
          </Link>
          <h1 className="font-serif text-2xl font-bold mb-2">Bem-vindo de volta</h1>
          <p className="text-muted-foreground">
            Entre na sua conta para continuar
          </p>
        </div>

        <Card className="border-border/50">
          <CardContent className="p-6">
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'user' | 'admin')}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="user">Cidadão</TabsTrigger>
                <TabsTrigger value="admin">Administrador</TabsTrigger>
              </TabsList>

              <TabsContent value="user" className="mt-0">
                <form onSubmit={handleSubmit}>
                  <FieldGroup>
                    <Field>
                      <FieldLabel htmlFor="email">E-mail</FieldLabel>
                      <Input
                        id="email"
                        type="email"
                        placeholder="seu@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="h-11"
                      />
                    </Field>

                    <Field>
                      <div className="flex items-center justify-between">
                        <FieldLabel htmlFor="password">Senha</FieldLabel>
                        <Link href="/recuperar-senha" className="text-xs text-primary hover:underline">
                          Esqueceu a senha?
                        </Link>
                      </div>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Sua senha"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          className="h-11 pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </Field>

                    {error && (
                      <p className="text-sm text-destructive">{error}</p>
                    )}

                    <Button type="submit" className="w-full h-11 bg-primary hover:bg-primary/90" disabled={isLoading}>
                      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Entrar'}
                    </Button>
                  </FieldGroup>
                </form>
              </TabsContent>

              <TabsContent value="admin" className="mt-0">
                <form onSubmit={handleSubmit}>
                  <FieldGroup>
                    <Field>
                      <FieldLabel htmlFor="admin-email">E-mail Administrativo</FieldLabel>
                      <Input
                        id="admin-email"
                        type="email"
                        placeholder="admin@aracajuresolve.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="h-11"
                      />
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="admin-password">Senha</FieldLabel>
                      <div className="relative">
                        <Input
                          id="admin-password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Sua senha administrativa"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          className="h-11 pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </Field>

                    {error && (
                      <p className="text-sm text-destructive">{error}</p>
                    )}

                    <Button type="submit" className="w-full h-11 bg-primary hover:bg-primary/90" disabled={isLoading}>
                      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Entrar como Admin'}
                    </Button>

                    <p className="text-xs text-center text-muted-foreground mt-2">
                      Use admin@aracajuresolve.com para testar o acesso administrativo
                    </p>
                  </FieldGroup>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Não tem uma conta?{' '}
          <Link href="/cadastro" className="text-primary hover:underline font-medium">
            Cadastre-se
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
