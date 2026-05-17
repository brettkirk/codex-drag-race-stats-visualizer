declare module 'react-simple-maps' {
  import type { ComponentType, ReactNode, SVGProps } from 'react'

  type Coordinate = [number, number]

  export type ComposableMapProps = SVGProps<SVGSVGElement> & {
    projection?: string
    projectionConfig?: Record<string, unknown>
    width?: number
    height?: number
    children?: ReactNode
  }

  export type ZoomableGroupProps = SVGProps<SVGGElement> & {
    center?: Coordinate
    zoom?: number
    minZoom?: number
    maxZoom?: number
    children?: ReactNode
  }

  export type GeographiesProps = {
    geography: string | Record<string, unknown>
    children: (props: { geographies: unknown[] }) => ReactNode
  }

  export type GeographyProps = SVGProps<SVGPathElement> & {
    geography: unknown
  }

  export type MarkerProps = SVGProps<SVGGElement> & {
    coordinates: Coordinate
    children?: ReactNode
  }

  export const ComposableMap: ComponentType<ComposableMapProps>
  export const ZoomableGroup: ComponentType<ZoomableGroupProps>
  export const Geographies: ComponentType<GeographiesProps>
  export const Geography: ComponentType<GeographyProps>
  export const Marker: ComponentType<MarkerProps>
}
