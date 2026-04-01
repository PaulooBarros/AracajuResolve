'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { Session } from '@supabase/supabase-js'
import type { User, UserRole } from './types'
import { getSupabaseBrowserClient, isSupabaseConfigured } from '@/lib/supabase/client'
import { mapProfileToUser, type ProfileRecord } from '@/lib/supabase/mappers'

interface RegisterInput {
  name: string
  email: string
  password: string
}

interface RegisterResult {
  success: boolean
  requiresEmailConfirmation?: boolean
  error?: string
}

interface AuthContextType {
  user: User | null
  session: Session | null
  isAuthenticated: boolean
  isAdmin: boolean
  login: (email: string, password: string, role?: UserRole) => Promise<boolean>
  register: (input: RegisterInput) => Promise<RegisterResult>
  logout: () => Promise<void>
  isLoading: boolean
  authError: string | null
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

async function loadProfile(session: Session | null) {
  if (!session || !isSupabaseConfigured()) {
    return null
  }

  const supabase = getSupabaseBrowserClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('id, email, full_name, role, avatar_url, created_at')
    .eq('id', session.user.id)
    .maybeSingle<ProfileRecord>()

  if (error) {
    throw error
  }

  if (!data) {
    return null
  }

  const { count } = await supabase
    .from('complaints')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', data.id)

  return mapProfileToUser(data, count ?? 0)
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [authError, setAuthError] = useState<string | null>(null)

  const refreshUser = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      setUser(null)
      return
    }

    const supabase = getSupabaseBrowserClient()
    const {
      data: { session: activeSession },
      error,
    } = await supabase.auth.getSession()

    if (error) {
      setAuthError(error.message)
      return
    }

    setSession(activeSession)

    if (!activeSession) {
      setUser(null)
      return
    }

    try {
      const profile = await loadProfile(activeSession)
      setUser(profile)
      setAuthError(null)
    } catch (profileError) {
      console.error(profileError)
      setAuthError('Não foi possível carregar o perfil do usuário.')
    }
  }, [])

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setAuthError('Configure NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY para habilitar a autenticação.')
      setIsLoading(false)
      return
    }

    const supabase = getSupabaseBrowserClient()

    void refreshUser().finally(() => {
      setIsLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)

      if (!nextSession) {
        setUser(null)
        return
      }

      void loadProfile(nextSession)
        .then((profile) => {
          setUser(profile)
          setAuthError(null)
        })
        .catch((error) => {
          console.error(error)
          setAuthError('Não foi possível carregar o perfil do usuário.')
        })
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [refreshUser])

  const login = useCallback(async (email: string, password: string, role?: UserRole) => {
    if (!isSupabaseConfigured()) {
      setAuthError('Supabase não configurado.')
      return false
    }

    const supabase = getSupabaseBrowserClient()
    setAuthError(null)

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error || !data.session) {
      setAuthError(error?.message || 'Erro ao autenticar.')
      return false
    }

    const profile = await loadProfile(data.session)

    if (!profile) {
      await supabase.auth.signOut()
      setAuthError('Perfil de usuário não encontrado.')
      return false
    }

    if (role === 'admin' && profile.role !== 'admin') {
      await supabase.auth.signOut()
      setAuthError('Sua conta não possui acesso administrativo.')
      return false
    }

    setSession(data.session)
    setUser(profile)
    return true
  }, [])

  const register = useCallback(async ({ name, email, password }: RegisterInput): Promise<RegisterResult> => {
    if (!isSupabaseConfigured()) {
      const message = 'Supabase não configurado.'
      setAuthError(message)
      return { success: false, error: message }
    }

    const supabase = getSupabaseBrowserClient()
    setAuthError(null)

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    })

    if (error) {
      setAuthError(error.message)
      return { success: false, error: error.message }
    }

    const requiresEmailConfirmation = !data.session

    if (data.session) {
      const profile = await loadProfile(data.session)
      setSession(data.session)
      setUser(profile)
    }

    return { success: true, requiresEmailConfirmation }
  }, [])

  const logout = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      setUser(null)
      setSession(null)
      return
    }

    const supabase = getSupabaseBrowserClient()
    await supabase.auth.signOut()
    setUser(null)
    setSession(null)
  }, [])

  const value = useMemo(
    () => ({
      user,
      session,
      isAuthenticated: !!session && !!user,
      isAdmin: user?.role === 'admin',
      login,
      register,
      logout,
      isLoading,
      authError,
      refreshUser,
    }),
    [authError, isLoading, login, logout, refreshUser, register, session, user]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
