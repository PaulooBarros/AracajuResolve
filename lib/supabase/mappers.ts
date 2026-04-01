import type { Complaint, ComplaintCategory, ComplaintPriority, ComplaintStatus, User, UserRole } from '@/lib/types'

export interface ProfileRecord {
  id: string
  email: string
  full_name: string | null
  role: UserRole
  avatar_url: string | null
  created_at: string
}

export interface ComplaintRecord {
  id: string
  title: string
  description: string
  category: ComplaintCategory
  neighborhood: string
  street: string | null
  reference_point: string | null
  status: ComplaintStatus
  priority: ComplaintPriority
  responsible_organ: string
  image_url: string | null
  latitude: number
  longitude: number
  user_id: string
  confirmations_count: number
  created_at: string
  updated_at: string
  profiles?: ProfileRecord | null
}

export function mapProfileToUser(profile: ProfileRecord, complaintsCount = 0): User {
  return {
    id: profile.id,
    name: profile.full_name || profile.email.split('@')[0],
    email: profile.email,
    avatar: profile.avatar_url || undefined,
    role: profile.role,
    createdAt: new Date(profile.created_at),
    complaintsCount,
  }
}

export function mapComplaintRecord(record: ComplaintRecord): Complaint {
  return {
    id: record.id,
    title: record.title,
    description: record.description,
    category: record.category,
    neighborhood: record.neighborhood,
    street: record.street || undefined,
    referencePoint: record.reference_point || undefined,
    status: record.status,
    priority: record.priority,
    responsibleOrgan: record.responsible_organ,
    imageUrl: record.image_url || undefined,
    latitude: record.latitude,
    longitude: record.longitude,
    userId: record.user_id,
    userName: record.profiles?.full_name || record.profiles?.email?.split('@')[0] || 'Usuário',
    confirmations: record.confirmations_count,
    createdAt: new Date(record.created_at),
    updatedAt: new Date(record.updated_at),
  }
}
