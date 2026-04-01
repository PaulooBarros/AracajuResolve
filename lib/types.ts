export type UserRole = 'user' | 'admin'

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: UserRole
  createdAt: Date
  complaintsCount: number
}

export type ComplaintStatus = 'aberta' | 'em_andamento' | 'resolvida' | 'arquivada'
export type ComplaintPriority = 'baixa' | 'media' | 'alta' | 'critica'

export type ComplaintCategory = 
  | 'iluminacao'
  | 'buracos'
  | 'lixo'
  | 'esgoto'
  | 'arvores'
  | 'sinalizacao'
  | 'calcadas'
  | 'animais'
  | 'poluicao'
  | 'outros'

export interface Complaint {
  id: string
  title: string
  description: string
  category: ComplaintCategory
  neighborhood: string
  status: ComplaintStatus
  priority: ComplaintPriority
  responsibleOrgan: string
  imageUrl?: string
  latitude: number
  longitude: number
  userId: string
  userName: string
  confirmations: number
  createdAt: Date
  updatedAt: Date
}

export interface ResponsibleOrgan {
  id: string
  name: string
  categories: ComplaintCategory[]
  complaintsCount: number
  resolvedCount: number
  avgResolutionDays: number
}

export interface NeighborhoodStats {
  name: string
  complaintsCount: number
  resolvedCount: number
  pendingCount: number
}

export const CATEGORY_LABELS: Record<ComplaintCategory, string> = {
  iluminacao: 'Iluminação Pública',
  buracos: 'Buracos nas Vias',
  lixo: 'Descarte Irregular de Lixo',
  esgoto: 'Problemas de Esgoto',
  arvores: 'Árvores e Podas',
  sinalizacao: 'Sinalização de Trânsito',
  calcadas: 'Calçadas Danificadas',
  animais: 'Animais Abandonados',
  poluicao: 'Poluição Sonora/Visual',
  outros: 'Outros',
}

export const STATUS_LABELS: Record<ComplaintStatus, string> = {
  aberta: 'Aberta',
  em_andamento: 'Em Andamento',
  resolvida: 'Resolvida',
  arquivada: 'Arquivada',
}

export const PRIORITY_LABELS: Record<ComplaintPriority, string> = {
  baixa: 'Baixa',
  media: 'Média',
  alta: 'Alta',
  critica: 'Crítica',
}

export const NEIGHBORHOODS = [
  'Atalaia',
  'Centro',
  'Jardins',
  'Farolândia',
  'Luzia',
  'Siqueira Campos',
  'Coroa do Meio',
  'Grageru',
  'Treze de Julho',
  'Inácio Barbosa',
  'Jabotiana',
  'São José',
  'América',
  'Industrial',
  'Ponto Novo',
  'Bugio',
  'Santos Dumont',
  'Pereira Lobo',
  'Suíssa',
  'Getúlio Vargas',
]

export const RESPONSIBLE_ORGANS = [
  'EMURB - Empresa Municipal de Obras',
  'SMTT - Superintendência de Transporte',
  'EMSURB - Empresa de Serviços Urbanos',
  'SEMA - Secretaria de Meio Ambiente',
  'Energisa Sergipe',
  'DESO - Companhia de Saneamento',
  'Defesa Civil',
  'Guarda Municipal',
]
