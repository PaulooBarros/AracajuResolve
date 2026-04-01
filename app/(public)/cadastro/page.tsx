'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Map, Eye, EyeOff, Loader2, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field'
import { Checkbox } from '@/components/ui/checkbox'
import { useAuth } from '@/lib/auth-context'

export default function RegisterPage() {
  const router = useRouter()
  const { register, authError } = useAuth()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const passwordsMatch = password === confirmPassword
  const isValidPassword = password.length >= 6

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!passwordsMatch) {
      setError('As senhas não coincidem')
      return
    }

    if (!isValidPassword) {
      setError('A senha deve ter pelo menos 6 caracteres')
      return
    }

    if (!acceptTerms) {
      setError('Você deve aceitar os termos de uso')
      return
    }

    setIsLoading(true)

    try {
      const result = await register({ name, email, password })

      if (result.success) {
        if (result.requiresEmailConfirmation) {
          router.push('/login')
          return
        }

        router.push('/')
      } else {
        setError(result.error || 'Erro ao criar conta')
      }
    } catch {
      setError('Erro ao criar conta')
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
          <h1 className="font-serif text-2xl font-bold mb-2">Criar sua conta</h1>
          <p className="text-muted-foreground">Junte-se à comunidade do Aracaju Resolve</p>
        </div>

        <Card className="border-border/50">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit}>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="name">Nome completo</FieldLabel>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Seu nome"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="h-11"
                  />
                </Field>

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
                  <FieldLabel htmlFor="password">Senha</FieldLabel>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Mínimo 6 caracteres"
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
                  {password && (
                    <p className={`text-xs mt-1 ${isValidPassword ? 'text-emerald-500' : 'text-muted-foreground'}`}>
                      {isValidPassword ? (
                        <span className="flex items-center gap-1">
                          <Check className="h-3 w-3" /> Senha válida
                        </span>
                      ) : (
                        'Mínimo 6 caracteres'
                      )}
                    </p>
                  )}
                </Field>

                <Field>
                  <FieldLabel htmlFor="confirm-password">Confirmar senha</FieldLabel>
                  <Input
                    id="confirm-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Digite a senha novamente"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="h-11"
                  />
                  {confirmPassword && (
                    <p className={`text-xs mt-1 ${passwordsMatch ? 'text-emerald-500' : 'text-destructive'}`}>
                      {passwordsMatch ? (
                        <span className="flex items-center gap-1">
                          <Check className="h-3 w-3" /> Senhas coincidem
                        </span>
                      ) : (
                        'As senhas não coincidem'
                      )}
                    </p>
                  )}
                </Field>

                <div className="flex items-start gap-2">
                  <Checkbox
                    id="terms"
                    checked={acceptTerms}
                    onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                    className="mt-0.5"
                  />
                  <label htmlFor="terms" className="text-sm text-muted-foreground cursor-pointer">
                    Li e aceito os termos de uso e a política de privacidade.
                  </label>
                </div>

                {(error || authError) && <p className="text-sm text-destructive">{error || authError}</p>}

                <Button
                  type="submit"
                  className="w-full h-11 bg-primary hover:bg-primary/90"
                  disabled={isLoading || !acceptTerms || !passwordsMatch || !isValidPassword}
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Criar conta'}
                </Button>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Já tem uma conta?{' '}
          <Link href="/login" className="text-primary hover:underline font-medium">
            Entrar
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
