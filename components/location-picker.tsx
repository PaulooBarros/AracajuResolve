'use client'

import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { MapPin, Crosshair } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { NEIGHBORHOODS } from '@/lib/types'

export interface ResolvedLocationDetails {
  neighborhood?: string
  street?: string
  referencePoint?: string
  fullAddress?: string
}

interface LocationPickerProps {
  onLocationSelect: (lat: number, lng: number, details?: ResolvedLocationDetails) => void
  initialLat?: number
  initialLng?: number
}

interface NominatimResponse {
  display_name?: string
  address?: {
    road?: string
    pedestrian?: string
    footway?: string
    path?: string
    suburb?: string
    neighbourhood?: string
    quarter?: string
    city_district?: string
    municipality?: string
    amenity?: string
    tourism?: string
    leisure?: string
    shop?: string
    building?: string
    office?: string
    house_number?: string
  }
  name?: string
}

function normalizeText(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

function matchNeighborhood(candidate?: string) {
  if (!candidate) return undefined

  const normalizedCandidate = normalizeText(candidate)

  return NEIGHBORHOODS.find((neighborhood) => {
    const normalizedNeighborhood = normalizeText(neighborhood)

    return (
      normalizedCandidate === normalizedNeighborhood ||
      normalizedCandidate.includes(normalizedNeighborhood) ||
      normalizedNeighborhood.includes(normalizedCandidate)
    )
  })
}

function extractLocationDetails(data: NominatimResponse): ResolvedLocationDetails {
  const address = data.address ?? {}
  const streetBase = address.road || address.pedestrian || address.footway || address.path
  const street = [streetBase, address.house_number].filter(Boolean).join(', ') || undefined
  const neighborhoodCandidate =
    address.suburb ||
    address.neighbourhood ||
    address.quarter ||
    address.city_district ||
    address.municipality

  const referencePoint =
    address.amenity ||
    address.tourism ||
    address.leisure ||
    address.shop ||
    address.building ||
    address.office ||
    data.name ||
    data.display_name?.split(',').slice(0, 2).join(', ').trim() ||
    undefined

  return {
    neighborhood: matchNeighborhood(neighborhoodCandidate),
    street,
    referencePoint,
    fullAddress: data.display_name,
  }
}

export default function LocationPicker({
  onLocationSelect,
  initialLat = -10.95,
  initialLng = -37.05,
}: LocationPickerProps) {
  const mapRef = useRef<L.Map | null>(null)
  const markerRef = useRef<L.Marker | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(
    initialLat && initialLng ? { lat: initialLat, lng: initialLng } : null
  )
  const [isResolvingAddress, setIsResolvingAddress] = useState(false)

  const buildCustomIcon = () =>
    L.divIcon({
      className: 'custom-location-marker',
      html: `
        <div style="
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #539FA2 0%, #72B1A4 100%);
          border: 3px solid white;
          border-radius: 50%;
          box-shadow: 0 4px 12px rgba(83, 159, 162, 0.4);
          animation: pulse 2s infinite;
        ">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 40],
    })

  const placeMarker = (lat: number, lng: number) => {
    if (!mapRef.current) return

    if (markerRef.current) {
      markerRef.current.remove()
    }

    markerRef.current = L.marker([lat, lng], { icon: buildCustomIcon() }).addTo(mapRef.current)
    setSelectedLocation({ lat, lng })
  }

  const resolveAddress = async (lat: number, lng: number) => {
    setIsResolvingAddress(true)

    try {
      const params = new URLSearchParams({
        format: 'jsonv2',
        lat: String(lat),
        lon: String(lng),
        zoom: '18',
        addressdetails: '1',
        'accept-language': 'pt-BR',
      })

      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?${params.toString()}`)
      if (!response.ok) {
        throw new Error(`Reverse geocoding failed with status ${response.status}`)
      }

      const data = (await response.json()) as NominatimResponse
      onLocationSelect(lat, lng, extractLocationDetails(data))
    } catch (error) {
      console.error('Error resolving address:', error)
      onLocationSelect(lat, lng)
    } finally {
      setIsResolvingAddress(false)
    }
  }

  useEffect(() => {
    if (!mapRef.current && containerRef.current) {
      mapRef.current = L.map(containerRef.current, {
        center: [initialLat, initialLng],
        zoom: 14,
        zoomControl: true,
      })

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(mapRef.current)

      mapRef.current.on('click', (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng
        placeMarker(lat, lng)
        void resolveAddress(lat, lng)
      })

      if (initialLat && initialLng && initialLat !== -10.95) {
        placeMarker(initialLat, initialLng)
      }

      requestAnimationFrame(() => {
        mapRef.current?.invalidateSize()
      })
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [initialLat, initialLng])

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocalização não suportada pelo seu navegador.')
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords

        if (mapRef.current) {
          mapRef.current.setView([latitude, longitude], 16, { animate: true })
          placeMarker(latitude, longitude)
          void resolveAddress(latitude, longitude)
        }
      },
      (error) => {
        console.error('Error getting location:', error)
        alert('Não foi possível obter sua localização. Verifique as permissões do navegador.')
      },
      { enableHighAccuracy: true }
    )
  }

  return (
    <div className="relative rounded-lg overflow-hidden border border-border">
      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `}</style>

      <div ref={containerRef} className="w-full h-[300px]" style={{ background: '#f0f0f0' }} />

      <div className="absolute top-3 right-3 z-[1000] flex flex-col gap-2">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={handleGetCurrentLocation}
          className="shadow-lg gap-2"
        >
          <Crosshair className="h-4 w-4" />
          Usar minha localização
        </Button>
      </div>

      {selectedLocation && (
        <div className="absolute bottom-3 left-3 right-3 z-[1000] bg-background/95 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-border">
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
            <span className="text-muted-foreground">Local selecionado:</span>
            <span className="font-medium truncate">
              {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
            </span>
          </div>
          {isResolvingAddress && (
            <p className="text-xs text-muted-foreground mt-2">
              Buscando endereço automaticamente...
            </p>
          )}
        </div>
      )}

      {!selectedLocation && (
        <div className="absolute bottom-3 left-3 right-3 z-[1000] bg-primary/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
          <p className="text-sm text-primary-foreground text-center font-medium">
            Clique no mapa para selecionar o local do problema
          </p>
        </div>
      )}
    </div>
  )
}
