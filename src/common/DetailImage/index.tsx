import React from 'react'
import { m } from 'framer-motion'
import type { DetailImageProps } from '../../types'
import styles from './styles.module.css'

export const DetailImage = ({
  onClick,
  classDetail,
  hasDetail,
  detailRef,
  detailKey,
  src,
  alt,
  width,
  height,
  zIndex,
  white = true,
  alpha = 0.3,
  blur = 3,
  scale = 2.5,
  transition
}: DetailImageProps) => {
  const backdropFilter = hasDetail ? `blur(${blur}px)` : undefined
  const background = hasDetail
    ? white
      ? `rgba(255, 255, 255, ${alpha})`
      : `rgba(0, 0, 0, ${alpha})`
    : undefined

  return (
    <m.div
      role="button"
      onClick={onClick}
      ref={detailRef}
      className={styles.full_size}
      animate={{
        zIndex: zIndex,
        opacity: hasDetail ? 1 : 0,
        pointerEvents: hasDetail ? 'auto' : 'none'
      }}
      style={{ backdropFilter: backdropFilter, background: background }}
      transition={transition}
    >
      <m.img
        key={detailKey}
        className={classDetail + ' ' + styles.no_select}
        src={src}
        alt={alt}
        width={width}
        height={height}
        draggable={false}
        animate={{
          zIndex: zIndex + 1,
          scale: scale,
          opacity: hasDetail ? 1 : 0,
          x: 0
        }}
        initial={{ scale: 1, opacity: 0 }}
        transition={transition}
      />
    </m.div>
  )
}
