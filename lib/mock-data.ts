import type { Complaint, ResponsibleOrgan, NeighborhoodStats, User } from './types'

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'João Silva',
    email: 'joao@email.com',
    role: 'user',
    createdAt: new Date('2024-01-15'),
    complaintsCount: 5,
  },
  {
    id: '2',
    name: 'Maria Santos',
    email: 'maria@email.com',
    role: 'user',
    createdAt: new Date('2024-02-20'),
    complaintsCount: 3,
  },
  {
    id: 'admin1',
    name: 'Admin Sistema',
    email: 'admin@aracajuresolve.com',
    role: 'admin',
    createdAt: new Date('2023-01-01'),
    complaintsCount: 0,
  },
]

// Coordenadas reais de Aracaju para cada bairro
export const mockComplaints: Complaint[] = [
  {
    id: '1',
    title: 'Buraco perigoso na Av. Beira Mar',
    description: 'Grande buraco na pista causando risco aos veículos. Já houve acidentes no local. O buraco tem aproximadamente 50cm de diâmetro e está localizado próximo à entrada do calçadão.',
    category: 'buracos',
    neighborhood: 'Atalaia',
    status: 'aberta',
    priority: 'critica',
    responsibleOrgan: 'EMURB - Empresa Municipal de Obras',
    imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=400',
    latitude: -10.9890,
    longitude: -37.0395,
    userId: '1',
    userName: 'João Silva',
    confirmations: 23,
    createdAt: new Date('2024-03-20'),
    updatedAt: new Date('2024-03-20'),
  },
  {
    id: '2',
    title: 'Lâmpadas queimadas na Rua Laranjeiras',
    description: 'Toda a rua está sem iluminação há mais de uma semana. Moradores relatam insegurança à noite. A situação afeta cerca de 200 metros da via.',
    category: 'iluminacao',
    neighborhood: 'Centro',
    status: 'em_andamento',
    priority: 'alta',
    responsibleOrgan: 'Energisa Sergipe',
    latitude: -10.9112,
    longitude: -37.0531,
    userId: '2',
    userName: 'Maria Santos',
    confirmations: 15,
    createdAt: new Date('2024-03-18'),
    updatedAt: new Date('2024-03-22'),
  },
  {
    id: '3',
    title: 'Descarte irregular de lixo',
    description: 'Terreno baldio sendo usado como lixão clandestino. Forte odor e presença de animais. Moradores pedem providências urgentes.',
    category: 'lixo',
    neighborhood: 'Farolândia',
    status: 'aberta',
    priority: 'alta',
    responsibleOrgan: 'EMSURB - Empresa de Serviços Urbanos',
    imageUrl: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400',
    latitude: -10.9485,
    longitude: -37.0635,
    userId: '1',
    userName: 'João Silva',
    confirmations: 31,
    createdAt: new Date('2024-03-15'),
    updatedAt: new Date('2024-03-15'),
  },
  {
    id: '4',
    title: 'Esgoto a céu aberto',
    description: 'Vazamento de esgoto na calçada há mais de um mês. Situação insalubre que afeta a mobilidade dos pedestres e causa mau cheiro.',
    category: 'esgoto',
    neighborhood: 'Jardins',
    status: 'em_andamento',
    priority: 'critica',
    responsibleOrgan: 'DESO - Companhia de Saneamento',
    latitude: -10.9420,
    longitude: -37.0580,
    userId: '2',
    userName: 'Maria Santos',
    confirmations: 42,
    createdAt: new Date('2024-03-10'),
    updatedAt: new Date('2024-03-21'),
  },
  {
    id: '5',
    title: 'Árvore com risco de queda',
    description: 'Árvore de grande porte inclinada sobre a via. Risco em dias de chuva. Galhos já caíram sobre a calçada.',
    category: 'arvores',
    neighborhood: 'Grageru',
    status: 'resolvida',
    priority: 'media',
    responsibleOrgan: 'SEMA - Secretaria de Meio Ambiente',
    latitude: -10.9305,
    longitude: -37.0720,
    userId: '1',
    userName: 'João Silva',
    confirmations: 8,
    createdAt: new Date('2024-03-05'),
    updatedAt: new Date('2024-03-19'),
  },
  {
    id: '6',
    title: 'Semáforo com defeito',
    description: 'Semáforo piscando em amarelo constantemente. Cruzamento perigoso com alto fluxo de veículos.',
    category: 'sinalizacao',
    neighborhood: 'Luzia',
    status: 'aberta',
    priority: 'alta',
    responsibleOrgan: 'SMTT - Superintendência de Transporte',
    latitude: -10.9230,
    longitude: -37.0480,
    userId: '2',
    userName: 'Maria Santos',
    confirmations: 19,
    createdAt: new Date('2024-03-22'),
    updatedAt: new Date('2024-03-22'),
  },
  {
    id: '7',
    title: 'Calçada destruída',
    description: 'Calçada completamente danificada. Idosos e cadeirantes não conseguem passar. Raízes de árvores quebraram o piso.',
    category: 'calcadas',
    neighborhood: 'Siqueira Campos',
    status: 'aberta',
    priority: 'media',
    responsibleOrgan: 'EMURB - Empresa Municipal de Obras',
    latitude: -10.9150,
    longitude: -37.0450,
    userId: '1',
    userName: 'João Silva',
    confirmations: 12,
    createdAt: new Date('2024-03-21'),
    updatedAt: new Date('2024-03-21'),
  },
  {
    id: '8',
    title: 'Cachorros abandonados',
    description: 'Grupo de cães abandonados na praça. Precisam de resgate. Estão magros e aparentemente doentes.',
    category: 'animais',
    neighborhood: 'Coroa do Meio',
    status: 'resolvida',
    priority: 'media',
    responsibleOrgan: 'Guarda Municipal',
    latitude: -10.9580,
    longitude: -37.0480,
    userId: '2',
    userName: 'Maria Santos',
    confirmations: 25,
    createdAt: new Date('2024-03-12'),
    updatedAt: new Date('2024-03-20'),
  },
  {
    id: '9',
    title: 'Som alto em bar',
    description: 'Estabelecimento com som alto até madrugada todos os dias. Perturbação do sossego público.',
    category: 'poluicao',
    neighborhood: 'Treze de Julho',
    status: 'em_andamento',
    priority: 'baixa',
    responsibleOrgan: 'Guarda Municipal',
    latitude: -10.9680,
    longitude: -37.0520,
    userId: '1',
    userName: 'João Silva',
    confirmations: 7,
    createdAt: new Date('2024-03-19'),
    updatedAt: new Date('2024-03-23'),
  },
  {
    id: '10',
    title: 'Vazamento de água na rua',
    description: 'Cano estourado desperdiçando água há dias. Rua alagada e água escorrendo para a sarjeta.',
    category: 'outros',
    neighborhood: 'Inácio Barbosa',
    status: 'aberta',
    priority: 'alta',
    responsibleOrgan: 'DESO - Companhia de Saneamento',
    imageUrl: 'https://images.unsplash.com/photo-1583245177184-4ab53e5e391a?w=400',
    latitude: -10.9350,
    longitude: -37.0550,
    userId: '2',
    userName: 'Maria Santos',
    confirmations: 18,
    createdAt: new Date('2024-03-23'),
    updatedAt: new Date('2024-03-23'),
  },
]

export const mockResponsibleOrgans: ResponsibleOrgan[] = [
  {
    id: '1',
    name: 'EMURB - Empresa Municipal de Obras',
    categories: ['buracos', 'calcadas'],
    complaintsCount: 2,
    resolvedCount: 0,
    avgResolutionDays: 12,
  },
  {
    id: '2',
    name: 'SMTT - Superintendência de Transporte',
    categories: ['sinalizacao'],
    complaintsCount: 1,
    resolvedCount: 0,
    avgResolutionDays: 5,
  },
  {
    id: '3',
    name: 'EMSURB - Empresa de Serviços Urbanos',
    categories: ['lixo'],
    complaintsCount: 1,
    resolvedCount: 0,
    avgResolutionDays: 3,
  },
  {
    id: '4',
    name: 'SEMA - Secretaria de Meio Ambiente',
    categories: ['arvores'],
    complaintsCount: 1,
    resolvedCount: 1,
    avgResolutionDays: 8,
  },
  {
    id: '5',
    name: 'Energisa Sergipe',
    categories: ['iluminacao'],
    complaintsCount: 1,
    resolvedCount: 0,
    avgResolutionDays: 4,
  },
  {
    id: '6',
    name: 'DESO - Companhia de Saneamento',
    categories: ['esgoto', 'outros'],
    complaintsCount: 2,
    resolvedCount: 0,
    avgResolutionDays: 15,
  },
  {
    id: '7',
    name: 'Guarda Municipal',
    categories: ['animais', 'poluicao'],
    complaintsCount: 2,
    resolvedCount: 1,
    avgResolutionDays: 2,
  },
]

export const mockNeighborhoodStats: NeighborhoodStats[] = [
  { name: 'Centro', complaintsCount: 1, resolvedCount: 0, pendingCount: 1 },
  { name: 'Atalaia', complaintsCount: 1, resolvedCount: 0, pendingCount: 1 },
  { name: 'Farolândia', complaintsCount: 1, resolvedCount: 0, pendingCount: 1 },
  { name: 'Jardins', complaintsCount: 1, resolvedCount: 0, pendingCount: 1 },
  { name: 'Luzia', complaintsCount: 1, resolvedCount: 0, pendingCount: 1 },
  { name: 'Siqueira Campos', complaintsCount: 1, resolvedCount: 0, pendingCount: 1 },
  { name: 'Grageru', complaintsCount: 1, resolvedCount: 1, pendingCount: 0 },
  { name: 'Coroa do Meio', complaintsCount: 1, resolvedCount: 1, pendingCount: 0 },
  { name: 'Treze de Julho', complaintsCount: 1, resolvedCount: 0, pendingCount: 1 },
  { name: 'Inácio Barbosa', complaintsCount: 1, resolvedCount: 0, pendingCount: 1 },
]

// Função helper para calcular estatísticas baseadas nos dados mock
export function calculateMockStats(complaints: typeof mockComplaints) {
  const total = complaints.length
  const open = complaints.filter(c => c.status === 'aberta').length
  const inProgress = complaints.filter(c => c.status === 'em_andamento').length
  const resolved = complaints.filter(c => c.status === 'resolvida').length
  const archived = complaints.filter(c => c.status === 'arquivada').length
  const neighborhoods = new Set(complaints.map(c => c.neighborhood)).size

  return {
    totalComplaints: total,
    openComplaints: open,
    inProgressComplaints: inProgress,
    resolvedComplaints: resolved,
    archivedComplaints: archived,
    totalNeighborhoods: neighborhoods,
    growthPercentage: 12.5,
    avgResolutionDays: 8,
  }
}

export const mockStats = calculateMockStats(mockComplaints)

export const mockMonthlyData = [
  { month: 'Jan', complaints: 2, resolved: 1 },
  { month: 'Fev', complaints: 3, resolved: 2 },
  { month: 'Mar', complaints: 10, resolved: 2 },
  { month: 'Abr', complaints: 0, resolved: 0 },
  { month: 'Mai', complaints: 0, resolved: 0 },
  { month: 'Jun', complaints: 0, resolved: 0 },
  { month: 'Jul', complaints: 0, resolved: 0 },
  { month: 'Ago', complaints: 0, resolved: 0 },
  { month: 'Set', complaints: 0, resolved: 0 },
  { month: 'Out', complaints: 0, resolved: 0 },
  { month: 'Nov', complaints: 0, resolved: 0 },
  { month: 'Dez', complaints: 0, resolved: 0 },
]

// Função helper para calcular dados de categoria baseado nas denúncias
export function calculateCategoryData(complaints: typeof mockComplaints) {
  const categoryMap: Record<string, { count: number; label: string; color: string }> = {
    iluminacao: { count: 0, label: 'Iluminação', color: '#539FA2' },
    buracos: { count: 0, label: 'Buracos', color: '#72B1A4' },
    lixo: { count: 0, label: 'Lixo', color: '#ABCCB1' },
    esgoto: { count: 0, label: 'Esgoto', color: '#C4DBB4' },
    sinalizacao: { count: 0, label: 'Sinalização', color: '#D4E2B6' },
    calcadas: { count: 0, label: 'Calçadas', color: '#539FA2' },
    arvores: { count: 0, label: 'Árvores', color: '#72B1A4' },
    animais: { count: 0, label: 'Animais', color: '#ABCCB1' },
    poluicao: { count: 0, label: 'Poluição', color: '#C4DBB4' },
    outros: { count: 0, label: 'Outros', color: '#D4E2B6' },
  }

  complaints.forEach(c => {
    if (categoryMap[c.category]) {
      categoryMap[c.category].count++
    }
  })

  return Object.values(categoryMap)
    .filter(c => c.count > 0)
    .map(c => ({ category: c.label, count: c.count, color: c.color }))
}

export const mockCategoryData = calculateCategoryData(mockComplaints)
