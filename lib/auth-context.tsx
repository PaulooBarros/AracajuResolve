'use client'

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import type { User, UserRole } from './types'
import { mockUsers } from './mock-data'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isAdmin: boolean
  login: (email: string, password: string, role?: UserRole) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const STORAGE_KEY = 'aracaju-resolve-user'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setUser({
          ...parsed,
          createdAt: new Date(parsed.createdAt),
        })
      } catch {
        localStorage.removeItem(STORAGE_KEY)
      }
    }
    setIsLoading(false)
  }, [])

  const login = useCallback(async (email: string, _password: string, role?: UserRole): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // For demo: if role is admin, use admin user
    if (role === 'admin' && email.includes('admin')) {
      const adminUser = mockUsers.find(u => u.role === 'admin')
      if (adminUser) {
        setUser(adminUser)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(adminUser))
        return true
      }
    }
    
    // For demo: accept any email/password for regular user
    const newUser: User = {
      id: crypto.randomUUID(),
      name: email.split('@')[0],
      email,
      role: 'user',
      createdAt: new Date(),
      complaintsCount: 0,
    }
    setUser(newUser)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser))
    return true
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        login,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
