import type { Ref, MouseEventHandler } from 'react'

type ImageProperty = {
  src: string
  alt: string
}

type AnimationProperty = {
  scale?: number
  rotate?: number
  rotateY?: number
  rotateX?: number
  rotateZ?: number
  opacity?: number
  selectScale?: number
  selectRotate?: number
  selectRotateY?: number
  selectRotateX?: number
  selectRotateZ?: number
  selectOpacity?: number
}

type TransitionProperty =
  | {
      duration?: number
      type: undefined
      ease:
        | number[]
        | 'linear'
        | 'easeIn'
        | 'easeOut'
        | 'easeInOut'
        | 'circIn'
        | 'circOut'
        | 'circInOut'
        | 'backIn'
        | 'backOut'
        | 'backInOut'
        | 'anticipate'
    }
  | {
      duration?: number
      type?: 'spring'
      bounce?: number
      damping?: number
      mass?: number
      stiffness?: number
    }

type DetailProperty = {
  classDetail?: string
  white?: boolean
  alpha?: number
  blur?: number
  scale?: number
  offset?: number
}

type CommonProperty = {
  images: ImageProperty[]
  start: number
  height: number
  width: number
  controller: number
  offsetIndex?: number
  reverseIndex?: boolean
  className?: string
  classImages?: string
  classImageSelect?: string
  classImageUnique?: string
  animate?: AnimationProperty
  initial?: AnimationProperty
  transition?: TransitionProperty
  loading?: 'eager' | 'lazy'
  initialFadeRange?: number
  initialFadeTime?: number
}

type DetailOn = {
  detail?: true
  detailProperty: DetailProperty
  detailTransition: TransitionProperty
}

type DetailOff = {
  detail?: false
  detailProperty?: undefined
  detailTransition?: undefined
}

type MagicProperty = CommonProperty & (DetailOn | DetailOff)

export type CircleRotationProps = MagicProperty & {
  radius: number
}

export type StraightInfinityProps = MagicProperty & {
  vertical?: boolean
  margin?: number
  selectOffsetX?: number
  selectOffsetY?: number
}

export type DetailImageProps = {
  onClick: MouseEventHandler<HTMLDivElement>
  classDetail?: string
  hasDetail: boolean
  detailRef: Ref<HTMLDivElement>
  detailKey: number
  src: string
  alt: string
  width: number
  height: number
  zIndex: number
  white?: boolean
  alpha?: number
  blur?: number
  scale?: number
  transition?: TransitionProperty
}
