import React from 'react'
import { m } from 'framer-motion'
import type { ScaleFilterImageProps } from '../../types'
import styles from './styles.module.css'

const PickImage = ({
  onClick,
  classPick,
  hasPick,
  hasShift,
  argRef,
  argKey,
  src,
  alt,
  width,
  height,
  zIndex,
  white = true,
  alpha = 0.4,
  blur = 4,
  scale = 2,
  offset = 200,
  transition
}: ScaleFilterImageProps) => {
  const backdropFilter = hasPick ? `blur(${blur}px)` : undefined
  const background = hasPick
    ? white
      ? `rgba(255, 255, 255, ${alpha})`
      : `rgba(0, 0, 0, ${alpha})`
    : undefined

  return (
    <m.div
      role="button"
      onClick={onClick}
      ref={argRef}
      className={styles.full_size}
      animate={{
        zIndex: zIndex,
        opacity: hasPick ? 1 : 0,
        pointerEvents: hasPick ? 'auto' : 'none'
      }}
      style={{ backdropFilter: backdropFilter, background: background }}
      transition={transition}
    >
      <m.img
        className={classPick}
        onClick={e => e.stopPropagation()}
        key={argKey}
        src={src}
        alt={alt}
        width={width}
        height={height}
        animate={{
          zIndex: zIndex + 1,
          scale: scale,
          opacity: hasPick ? 1 : 0,
          x: 0
        }}
        initial={{ scale: 1, opacity: 0, x: hasShift ? offset : -offset }}
        transition={transition}
      />
    </m.div>
  )
}

export default PickImage
