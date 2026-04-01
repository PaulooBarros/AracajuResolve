'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import type { User } from '@/lib/types'
import { useAuth } from '@/lib/auth-context'
import { getSupabaseBrowserClient, isSupabaseConfigured } from '@/lib/supabase/client'
import { mapProfileToUser, type ProfileRecord } from '@/lib/supabase/mappers'

interface AdminUserRow extends ProfileRecord {
  complaints_count: number
}

export function useProfiles() {
  const { isAdmin } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const refreshUsers = useCallback(async () => {
    if (!isSupabaseConfigured() || !isAdmin) {
      setUsers([])
      setIsLoading(false)
      return
    }

    setIsLoading(true)

    const supabase = getSupabaseBrowserClient()
    const { data, error } = await supabase
      .from('admin_user_summary')
      .select('id, email, full_name, role, avatar_url, created_at, complaints_count')
      .order('created_at', { ascending: false })

    if (error) {
      console.error(error)
      setUsers([])
      setIsLoading(false)
      return
    }

    setUsers((data as AdminUserRow[]).map((profile) => mapProfileToUser(profile, profile.complaints_count)))
    setIsLoading(false)
  }, [isAdmin])

  useEffect(() => {
    void refreshUsers()
  }, [refreshUsers])

  const summary = useMemo(() => {
    const totalUsers = users.filter((user) => user.role === 'user').length
    const totalAdmins = users.filter((user) => user.role === 'admin').length
    return {
      totalUsers,
      totalAdmins,
      totalProfiles: users.length,
    }
  }, [users])

  return {
    users,
    isLoading,
    refreshUsers,
    ...summary,
  }
}
