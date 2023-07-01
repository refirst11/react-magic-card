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
  return (
    <m.div
      role="button"
      onClick={onClick}
      ref={argRef}
      className={styles.full_size}
      animate={{
        zIndex: zIndex,
        background: white
          ? `rgba(255, 255, 255, ${alpha})`
          : `rgba(0, 0, 0, ${alpha})`,
        backdropFilter: `blur(${blur}px)`,
        opacity: hasPick ? 1 : 0,
        pointerEvents: hasPick ? 'auto' : 'none'
      }}
      initial={{ background: 'none' }}
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
