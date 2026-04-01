'use client'

import { motion } from 'framer-motion'
import { 
  Settings, 
  Bell, 
  Shield, 
  Palette,
  Mail,
  Database,
  Key,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field'
import { Separator } from '@/components/ui/separator'

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
}

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      {/* Page Header */}
      <div>
        <h1 className="font-serif text-2xl font-bold">Configurações</h1>
        <p className="text-muted-foreground text-sm">
          Gerencie as configurações do sistema
        </p>
      </div>

      {/* General Settings */}
      <motion.div
        variants={fadeInUp}
        initial="initial"
        animate="animate"
        transition={{ duration: 0.3 }}
      >
        <Card className="border-border/50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              <CardTitle className="font-serif text-lg">Configurações Gerais</CardTitle>
            </div>
            <CardDescription>
              Configurações básicas do sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <Field>
                <FieldLabel>Nome do Sistema</FieldLabel>
                <Input defaultValue="Aracaju Resolve" className="max-w-md" />
              </Field>
              <Field>
                <FieldLabel>E-mail de Contato</FieldLabel>
                <Input defaultValue="contato@aracajuresolve.com" className="max-w-md" />
              </Field>
            </FieldGroup>
          </CardContent>
        </Card>
      </motion.div>

      {/* Notification Settings */}
      <motion.div
        variants={fadeInUp}
        initial="initial"
        animate="animate"
        transition={{ duration: 0.3, delay: 0.05 }}
      >
        <Card className="border-border/50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              <CardTitle className="font-serif text-lg">Notificações</CardTitle>
            </div>
            <CardDescription>
              Configure como e quando receber notificações
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">Novas denúncias</p>
                <p className="text-sm text-muted-foreground">
                  Receber notificação quando uma nova denúncia for registrada
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">Denúncias críticas</p>
                <p className="text-sm text-muted-foreground">
                  Alertas para denúncias marcadas como críticas
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">Relatórios semanais</p>
                <p className="text-sm text-muted-foreground">
                  Receber resumo semanal por e-mail
                </p>
              </div>
              <Switch />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">Notificações por e-mail</p>
                <p className="text-sm text-muted-foreground">
                  Enviar notificações também por e-mail
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Security Settings */}
      <motion.div
        variants={fadeInUp}
        initial="initial"
        animate="animate"
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Card className="border-border/50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <CardTitle className="font-serif text-lg">Segurança</CardTitle>
            </div>
            <CardDescription>
              Configurações de segurança da conta
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">Autenticação em duas etapas</p>
                <p className="text-sm text-muted-foreground">
                  Adicione uma camada extra de segurança
                </p>
              </div>
              <Button variant="outline" size="sm">Configurar</Button>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">Sessões ativas</p>
                <p className="text-sm text-muted-foreground">
                  Gerencie dispositivos conectados
                </p>
              </div>
              <Button variant="outline" size="sm">Ver sessões</Button>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">Alterar senha</p>
                <p className="text-sm text-muted-foreground">
                  Atualize sua senha de acesso
                </p>
              </div>
              <Button variant="outline" size="sm">Alterar</Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Appearance Settings */}
      <motion.div
        variants={fadeInUp}
        initial="initial"
        animate="animate"
        transition={{ duration: 0.3, delay: 0.15 }}
      >
        <Card className="border-border/50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Palette className="h-5 w-5 text-primary" />
              <CardTitle className="font-serif text-lg">Aparência</CardTitle>
            </div>
            <CardDescription>
              Personalize a aparência do painel
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">Tema escuro automático</p>
                <p className="text-sm text-muted-foreground">
                  Seguir configuração do sistema
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">Animações reduzidas</p>
                <p className="text-sm text-muted-foreground">
                  Reduzir animações para melhor performance
                </p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* API Settings */}
      <motion.div
        variants={fadeInUp}
        initial="initial"
        animate="animate"
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Card className="border-border/50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Key className="h-5 w-5 text-primary" />
              <CardTitle className="font-serif text-lg">API e Integrações</CardTitle>
            </div>
            <CardDescription>
              Configurações de API e integrações externas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <Field>
                <FieldLabel>Chave de API</FieldLabel>
                <div className="flex gap-2 max-w-md">
                  <Input defaultValue="sk_live_xxxxxxxxxxxxx" type="password" readOnly />
                  <Button variant="outline">Copiar</Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Use esta chave para integrar com sistemas externos
                </p>
              </Field>
            </FieldGroup>
          </CardContent>
        </Card>
      </motion.div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button className="bg-primary hover:bg-primary/90">
          Salvar Alterações
        </Button>
      </div>
    </div>
  )
}
