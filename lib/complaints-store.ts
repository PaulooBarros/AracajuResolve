'use client'

import { useCallback, useEffect, useState } from 'react'
import type { Complaint, ComplaintCategory } from './types'
import { getSupabaseBrowserClient, isSupabaseConfigured } from '@/lib/supabase/client'
import { mapComplaintRecord, type ComplaintRecord } from '@/lib/supabase/mappers'

interface NewComplaintInput {
  title: string
  description: string
  category: ComplaintCategory
  neighborhood: string
  street?: string
  referencePoint?: string
  responsibleOrgan: string
  imageFile?: File | null
  latitude: number
  longitude: number
  userId: string
}

async function uploadComplaintImage(file: File, userId: string) {
  const supabase = getSupabaseBrowserClient()
  const extension = file.name.split('.').pop() || 'jpg'
  const filePath = `${userId}/${crypto.randomUUID()}.${extension}`

  const { error } = await supabase.storage.from('complaint-images').upload(filePath, file, {
    cacheControl: '3600',
    upsert: false,
  })

  if (error) {
    throw error
  }

  const { data } = supabase.storage.from('complaint-images').getPublicUrl(filePath)
  return data.publicUrl
}

async function fetchComplaintsFromSupabase() {
  if (!isSupabaseConfigured()) {
    return []
  }

  const supabase = getSupabaseBrowserClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  const complaintFields = `
    id,
    title,
    description,
    category,
    neighborhood,
    street,
    reference_point,
    status,
    priority,
    responsible_organ,
    image_url,
    latitude,
    longitude,
    user_id,
    confirmations_count,
    created_at,
    updated_at
  `

  const selectFields = session
    ? `
      ${complaintFields},
      profiles (
        id,
        email,
        full_name,
        role,
        avatar_url,
        created_at
      )
    `
    : complaintFields

  const { data, error } = await supabase
    .from('complaints')
    .select(selectFields)
    .order('created_at', { ascending: false })

  if (error) {
    throw error
  }

  return ((data || []) as ComplaintRecord[]).map(mapComplaintRecord)
}

export function useComplaints() {
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const refreshComplaints = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      setComplaints([])
      setIsLoading(false)
      return
    }

    setIsLoading(true)

    try {
      const nextComplaints = await fetchComplaintsFromSupabase()
      setComplaints(nextComplaints)
    } catch (error) {
      console.error(error)
      setComplaints([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void refreshComplaints()
  }, [refreshComplaints])

  const addComplaint = useCallback(async (complaintData: NewComplaintInput) => {
    const supabase = getSupabaseBrowserClient()
    let imageUrl: string | undefined

    if (complaintData.imageFile) {
      imageUrl = await uploadComplaintImage(complaintData.imageFile, complaintData.userId)
    }

    const { data, error } = await supabase
      .from('complaints')
      .insert({
        title: complaintData.title,
        description: complaintData.description,
        category: complaintData.category,
        neighborhood: complaintData.neighborhood,
        street: complaintData.street || null,
        reference_point: complaintData.referencePoint || null,
        responsible_organ: complaintData.responsibleOrgan || 'A definir',
        image_url: imageUrl || null,
        latitude: complaintData.latitude,
        longitude: complaintData.longitude,
        user_id: complaintData.userId,
      })
      .select(`
        id,
        title,
        description,
        category,
        neighborhood,
        street,
        reference_point,
        status,
        priority,
        responsible_organ,
        image_url,
        latitude,
        longitude,
        user_id,
        confirmations_count,
        created_at,
        updated_at,
        profiles (
          id,
          email,
          full_name,
          role,
          avatar_url,
          created_at
        )
      `)
      .single()

    if (error) {
      throw error
    }

    const complaint = mapComplaintRecord(data as ComplaintRecord)
    setComplaints((current) => [complaint, ...current])
    return complaint
  }, [])

  const updateComplaint = useCallback(async (id: string, updates: Partial<Complaint>) => {
    const supabase = getSupabaseBrowserClient()
    const payload: Record<string, unknown> = {}

    if (updates.title !== undefined) payload.title = updates.title
    if (updates.description !== undefined) payload.description = updates.description
    if (updates.category !== undefined) payload.category = updates.category
    if (updates.neighborhood !== undefined) payload.neighborhood = updates.neighborhood
    if (updates.street !== undefined) payload.street = updates.street || null
    if (updates.referencePoint !== undefined) payload.reference_point = updates.referencePoint || null
    if (updates.status !== undefined) payload.status = updates.status
    if (updates.priority !== undefined) payload.priority = updates.priority
    if (updates.responsibleOrgan !== undefined) payload.responsible_organ = updates.responsibleOrgan
    if (updates.imageUrl !== undefined) payload.image_url = updates.imageUrl || null

    const { error } = await supabase.from('complaints').update(payload).eq('id', id)

    if (error) {
      throw error
    }

    await refreshComplaints()
  }, [refreshComplaints])

  const confirmComplaint = useCallback(async (id: string) => {
    const supabase = getSupabaseBrowserClient()
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      throw userError || new Error('Usuário não autenticado.')
    }

    const { error } = await supabase.from('complaint_confirmations').insert({
      complaint_id: id,
      user_id: user.id,
    })

    if (error) {
      throw error
    }

    await refreshComplaints()
  }, [refreshComplaints])

  const markAsResolved = useCallback(async (id: string) => {
    const supabase = getSupabaseBrowserClient()
    const { error } = await supabase
      .from('complaints')
      .update({ status: 'resolvida' })
      .eq('id', id)

    if (error) {
      throw error
    }

    await refreshComplaints()
  }, [refreshComplaints])

  const getComplaintById = useCallback((id: string) => {
    return complaints.find((complaint) => complaint.id === id)
  }, [complaints])

  const getUserComplaints = useCallback((userId: string) => {
    return complaints.filter((complaint) => complaint.userId === userId)
  }, [complaints])

  return {
    complaints,
    isLoading,
    addComplaint,
    updateComplaint,
    confirmComplaint,
    markAsResolved,
    getComplaintById,
    getUserComplaints,
    refreshComplaints,
  }
}
