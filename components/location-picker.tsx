'use client'

import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { MapPin, Crosshair } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface LocationPickerProps {
  onLocationSelect: (lat: number, lng: number) => void
  initialLat?: number
  initialLng?: number
}

export default function LocationPicker({ 
  onLocationSelect, 
  initialLat = -10.95, 
  initialLng = -37.05 
}: LocationPickerProps) {
  const mapRef = useRef<L.Map | null>(null)
  const markerRef = useRef<L.Marker | null>(null)
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(
    initialLat && initialLng ? { lat: initialLat, lng: initialLng } : null
  )

  useEffect(() => {
    // Initialize map
    if (!mapRef.current) {
      mapRef.current = L.map('location-picker-map', {
        center: [initialLat, initialLng],
        zoom: 14,
        zoomControl: true,
      })

      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(mapRef.current)

      // Create custom marker icon
      const customIcon = L.divIcon({
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

      // Handle map click
      mapRef.current.on('click', (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng

        // Remove existing marker
        if (markerRef.current) {
          markerRef.current.remove()
        }

        // Add new marker
        markerRef.current = L.marker([lat, lng], { icon: customIcon })
          .addTo(mapRef.current!)

        setSelectedLocation({ lat, lng })
        onLocationSelect(lat, lng)
      })

      // Add initial marker if coordinates provided
      if (initialLat && initialLng && initialLat !== -10.95) {
        markerRef.current = L.marker([initialLat, initialLng], { icon: customIcon })
          .addTo(mapRef.current)
      }
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [])

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          
          if (mapRef.current) {
            mapRef.current.setView([latitude, longitude], 16, { animate: true })

            // Create custom marker icon
            const customIcon = L.divIcon({
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

            // Remove existing marker
            if (markerRef.current) {
              markerRef.current.remove()
            }

            // Add new marker
            markerRef.current = L.marker([latitude, longitude], { icon: customIcon })
              .addTo(mapRef.current)

            setSelectedLocation({ lat: latitude, lng: longitude })
            onLocationSelect(latitude, longitude)
          }
        },
        (error) => {
          console.error('Error getting location:', error)
          alert('Não foi possível obter sua localização. Verifique as permissões do navegador.')
        },
        { enableHighAccuracy: true }
      )
    } else {
      alert('Geolocalização não suportada pelo seu navegador.')
    }
  }

  return (
    <div className="relative rounded-lg overflow-hidden border border-border">
      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `}</style>
      
      <div id="location-picker-map" className="w-full h-[300px]" style={{ background: '#f0f0f0' }} />
      
      {/* Controls overlay */}
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

      {/* Selected location indicator */}
      {selectedLocation && (
        <div className="absolute bottom-3 left-3 right-3 z-[1000] bg-background/95 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-border">
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
            <span className="text-muted-foreground">Local selecionado:</span>
            <span className="font-medium truncate">
              {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
            </span>
          </div>
        </div>
      )}

      {/* Instructions overlay */}
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
