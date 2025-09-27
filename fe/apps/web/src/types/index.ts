import { SVGProps } from 'react'

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number
}

export type Location = {
  tid: number
  name: string
  latitude: number
  longitude: number
  country?: string
  city?: string
}

export type Blog = {
  nid: number
  title: string
  description: string
  imagePath: string
  location?: Location
  publishDate: string
}
