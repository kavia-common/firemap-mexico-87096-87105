/// <reference types="vite/client" />

// Minimal Google Maps type augmentation for the global google namespace used in this app.
declare global {
  interface Window {
    google: typeof google
  }

  namespace google {
    export namespace maps {
      type LatLngLiteral = { lat: number; lng: number }
      type MapOptions = {
        center?: LatLngLiteral
        zoom?: number
        mapId?: string
        streetViewControl?: boolean
        mapTypeControl?: boolean
        fullscreenControl?: boolean
      }
      class Map {
        constructor(el: HTMLElement, opts?: MapOptions)
        setCenter(latLng: LatLngLiteral): void
        setZoom(z: number): void
      }
      class InfoWindow {
        constructor(opts?: { content?: string | HTMLElement })
        setContent(content: string | HTMLElement): void
        open(opts: { anchor?: object; map?: Map }): void
      }
    }
    export namespace maps.marker {
      type AdvancedMarkerOptions = {
        map?: maps.Map
        position: maps.LatLngLiteral
        content?: HTMLElement
        title?: string
      }
      class AdvancedMarkerElement {
        map?: maps.Map
        position: maps.LatLngLiteral
        content?: HTMLElement
        title?: string
        constructor(opts?: AdvancedMarkerOptions)
        addListener(eventName: string, handler: () => void): void
      }
    }
  }
}
export {}
