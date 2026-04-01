'use client'

import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { cn } from '@/lib/utils'
import type { Complaint, ComplaintStatus } from '@/lib/types'

interface MapComponentProps {
  complaints: Complaint[]
  onSelectComplaint?: (id: string | null) => void
  selectedComplaintId?: string | null
  className?: string
  interactive?: boolean
  initialZoom?: number
}

const statusColors: Record<ComplaintStatus, string> = {
  aberta: '#f59e0b',
  em_andamento: '#3b82f6',
  resolvida: '#22c55e',
  arquivada: '#6b7280',
}

export default function MapComponent({
  complaints,
  onSelectComplaint,
  selectedComplaintId,
  className,
  interactive = true,
  initialZoom = 13,
}: MapComponentProps) {
  const mapRef = useRef<L.Map | null>(null)
  const markersRef = useRef<L.LayerGroup | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const markerInstancesRef = useRef<Map<string, L.Marker>>(new Map())

  useEffect(() => {
    if (!mapRef.current && containerRef.current) {
      mapRef.current = L.map(containerRef.current, {
        center: [-10.95, -37.05],
        zoom: initialZoom,
        zoomControl: interactive,
        dragging: interactive,
        scrollWheelZoom: interactive,
        doubleClickZoom: interactive,
        boxZoom: interactive,
        keyboard: interactive,
        touchZoom: interactive,
        attributionControl: interactive,
      })

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(mapRef.current)

      markersRef.current = L.layerGroup().addTo(mapRef.current)

      requestAnimationFrame(() => {
        mapRef.current?.invalidateSize()
      })
    }

    const handleResize = () => {
      mapRef.current?.invalidateSize()
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
      markerInstancesRef.current.clear()
    }
  }, [initialZoom, interactive])

  useEffect(() => {
    if (!mapRef.current || !markersRef.current) return

    markersRef.current.clearLayers()
    markerInstancesRef.current.clear()

    const validComplaints = complaints.filter((complaint) => (
      Number.isFinite(complaint.latitude) &&
      Number.isFinite(complaint.longitude)
    ))

    validComplaints.forEach((complaint) => {
      const color = statusColors[complaint.status]

      const icon = L.divIcon({
        className: 'custom-marker',
        html: `
          <div style="
            width: 24px;
            height: 24px;
            background-color: ${color};
            border: 3px solid white;
            border-radius: 50%;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            ${selectedComplaintId === complaint.id ? 'transform: scale(1.3);' : ''}
          "></div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      })

      const marker = L.marker([complaint.latitude, complaint.longitude], { icon })
        .addTo(markersRef.current!)
        .on('click', () => {
          onSelectComplaint?.(complaint.id)
        })

      marker.bindPopup(`
        <div style="min-width: 200px; font-family: system-ui;">
          <h3 style="font-weight: 600; margin: 0 0 8px 0; font-size: 14px;">${complaint.title}</h3>
          <p style="margin: 0 0 8px 0; font-size: 12px; color: #666; line-height: 1.4;">
            ${complaint.description.slice(0, 100)}${complaint.description.length > 100 ? '...' : ''}
          </p>
          <div style="display: flex; gap: 8px; align-items: center; font-size: 11px;">
            <span style="
              padding: 2px 8px;
              border-radius: 9999px;
              background-color: ${color}20;
              color: ${color};
              font-weight: 500;
            ">${complaint.status.replace('_', ' ')}</span>
            <span style="color: #888;">${complaint.neighborhood}</span>
          </div>
        </div>
      `)

      markerInstancesRef.current.set(complaint.id, marker)
    })

    if (selectedComplaintId) {
      const selected = validComplaints.find((complaint) => complaint.id === selectedComplaintId)
      if (selected) {
        mapRef.current.setView([selected.latitude, selected.longitude], 15, {
          animate: true,
        })

        markerInstancesRef.current.get(selected.id)?.openPopup()
      }
      return
    }

    if (validComplaints.length === 1) {
      const [complaint] = validComplaints
      mapRef.current.setView([complaint.latitude, complaint.longitude], Math.max(initialZoom, 15), {
        animate: false,
      })
    }

    if (validComplaints.length > 1) {
      const bounds = L.latLngBounds(
        validComplaints.map((complaint) => [complaint.latitude, complaint.longitude] as L.LatLngTuple)
      )

      mapRef.current.fitBounds(bounds, {
        padding: [40, 40],
        maxZoom: 15,
      })
    }

    requestAnimationFrame(() => {
      mapRef.current?.invalidateSize()
    })
  }, [complaints, initialZoom, selectedComplaintId, onSelectComplaint])

  return (
    <div
      ref={containerRef}
      className={cn('w-full h-full', className)}
      style={{ background: '#f0f0f0' }}
    />
  )
}
