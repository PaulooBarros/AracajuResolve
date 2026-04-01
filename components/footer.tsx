'use client'

import Link from 'next/link'
import { Map } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-card">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Map className="h-5 w-5" />
              </div>
              <span className="font-serif text-xl font-bold tracking-tight">
                Aracaju<span className="text-primary">Resolve</span>
              </span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-sm">
              Plataforma de monitoramento urbano para a cidade de Aracaju. 
              Juntos, transformamos problemas em soluções visíveis.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-serif font-semibold mb-4">Navegação</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/mapa" className="text-muted-foreground hover:text-foreground transition-colors">
                  Mapa de Denúncias
                </Link>
              </li>
              <li>
                <Link href="/denuncias" className="text-muted-foreground hover:text-foreground transition-colors">
                  Todas as Denúncias
                </Link>
              </li>
              <li>
                <Link href="/nova-denuncia" className="text-muted-foreground hover:text-foreground transition-colors">
                  Fazer Denúncia
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-serif font-semibold mb-4">Institucional</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Sobre o Projeto
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Termos de Uso
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Política de Privacidade
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/50 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            {new Date().getFullYear()} Aracaju Resolve. Todos os direitos reservados.
          </p>
          <p className="text-sm text-muted-foreground">
            Feito com carinho para Aracaju
          </p>
        </div>
      </div>
    </footer>
  )
}
