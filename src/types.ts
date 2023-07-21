import type { Ref, MouseEventHandler } from 'react'

type ImageProperty = {
  src: string
  alt: string
}

type AnimationProperty = {
  scale?: number
  rotateY?: number
  rotateX?: number
  rotateZ?: number
  opacity?: number
  selectScale?: number
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
      velocity?: number
      restSpeed?: number
      restDelta?: number
    }

type PickProperty = {
  classPick?: string
  white?: boolean
  alpha?: number
  blur?: number
  scale?: number
  offset?: number
}

type CommonProperty = {
  images: ImageProperty[]
  height: number
  width: number
  start: number
  controller: number
  delay: number
  offsetIndex?: number
  reverseIndex?: boolean
  loading?: 'eager' | 'lazy'
  className?: string
  classImages?: string
  classImageSelect?: string
  classImageUnique?: string
  animate?: AnimationProperty
  initial?: AnimationProperty
  transition?: TransitionProperty
}

type OffPick = {
  pickScale?: true
  pickProperty: PickProperty
  pickTransition: TransitionProperty
}

type OnPick = {
  pickScale?: false
  pickProperty?: undefined
  pickTransition?: undefined
}

type MagicProperty = CommonProperty & (OffPick | OnPick)

export type MagicCircleProps = MagicProperty & {
  radius: number
  dynamic?: boolean
  clockwise?: boolean
}

export type MagicStraightProps = MagicProperty & {
  vertical?: boolean
  margin?: number
  selectOffsetX?: number
  selectOffsetY?: number
}

export type PickImageProps = {
  onClick: MouseEventHandler<HTMLDivElement>
  classPick?: string
  hasPick: boolean
  hasShift: boolean
  argRef: Ref<HTMLDivElement>
  argKey: number
  src: string
  alt: string
  width: number
  height: number
  zIndex: number
  white?: boolean
  alpha?: number
  blur?: number
  scale?: number
  offset?: number
  transition?: TransitionProperty
}
