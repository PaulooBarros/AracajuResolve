'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Complaint, ComplaintCategory, ComplaintStatus, ComplaintPriority } from './types'
import { mockComplaints } from './mock-data'

const STORAGE_KEY = 'aracaju-resolve-complaints'
const STORAGE_VERSION_KEY = 'aracaju-resolve-version'
const CURRENT_VERSION = '2' // Increment when mock data structure changes

// Initialize localStorage with mock data if empty or outdated
function getInitialComplaints(): Complaint[] {
  if (typeof window === 'undefined') return mockComplaints
  
  const storedVersion = localStorage.getItem(STORAGE_VERSION_KEY)
  const stored = localStorage.getItem(STORAGE_KEY)
  
  // If version mismatch, reset to new mock data
  if (storedVersion !== CURRENT_VERSION) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockComplaints))
    localStorage.setItem(STORAGE_VERSION_KEY, CURRENT_VERSION)
    return mockComplaints
  }
  
  if (stored) {
    try {
      const parsed = JSON.parse(stored)
      return parsed.map((c: Complaint) => ({
        ...c,
        createdAt: new Date(c.createdAt),
        updatedAt: new Date(c.updatedAt),
      }))
    } catch {
      return mockComplaints
    }
  }
  
  // Initialize with mock data
  localStorage.setItem(STORAGE_KEY, JSON.stringify(mockComplaints))
  localStorage.setItem(STORAGE_VERSION_KEY, CURRENT_VERSION)
  return mockComplaints
}

function saveComplaints(complaints: Complaint[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(complaints))
}

export function useComplaints() {
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setComplaints(getInitialComplaints())
    setIsLoading(false)
  }, [])

  const addComplaint = useCallback((complaintData: {
    title: string
    description: string
    category: ComplaintCategory
    neighborhood: string
    responsibleOrgan: string
    imageUrl?: string
    latitude: number
    longitude: number
    userId: string
    userName: string
  }) => {
    const newComplaint: Complaint = {
      id: `user-${Date.now()}`,
      ...complaintData,
      status: 'aberta' as ComplaintStatus,
      priority: 'media' as ComplaintPriority,
      confirmations: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    setComplaints(prev => {
      const updated = [newComplaint, ...prev]
      saveComplaints(updated)
      return updated
    })

    return newComplaint
  }, [])

  const updateComplaint = useCallback((id: string, updates: Partial<Complaint>) => {
    setComplaints(prev => {
      const updated = prev.map(c => 
        c.id === id ? { ...c, ...updates, updatedAt: new Date() } : c
      )
      saveComplaints(updated)
      return updated
    })
  }, [])

  const confirmComplaint = useCallback((id: string) => {
    setComplaints(prev => {
      const updated = prev.map(c => 
        c.id === id ? { ...c, confirmations: c.confirmations + 1, updatedAt: new Date() } : c
      )
      saveComplaints(updated)
      return updated
    })
  }, [])

  const markAsResolved = useCallback((id: string) => {
    setComplaints(prev => {
      const updated = prev.map(c => 
        c.id === id ? { ...c, status: 'resolvida' as ComplaintStatus, updatedAt: new Date() } : c
      )
      saveComplaints(updated)
      return updated
    })
  }, [])

  const getComplaintById = useCallback((id: string) => {
    return complaints.find(c => c.id === id)
  }, [complaints])

  const getUserComplaints = useCallback((userId: string) => {
    return complaints.filter(c => c.userId === userId)
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
  }
}
