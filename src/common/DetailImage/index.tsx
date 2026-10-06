import React from 'react'
import { m, type Target } from 'framer-motion'
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
  rotate = 0,
  transition
}: DetailImageProps) => {
  const backdropFilter = `blur(${hasDetail ? blur : 0}px)`
  const color = white ? '255, 255, 255' : '0, 0, 0'
  const backgroundColor = `rgba(${color}, ${hasDetail ? alpha : 0})`

  return (
    <m.div
      role="button"
      onClick={onClick}
      ref={detailRef}
      className={styles.full_size}
      animate={{
        zIndex: zIndex,
        backdropFilter: backdropFilter,
        ...({ WebkitBackdropFilter: backdropFilter } as Target),
        backgroundColor: backgroundColor,
        pointerEvents: hasDetail ? 'auto' : 'none'
      }}
      initial={false}
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
          rotate: rotate
        }}
        initial={{ scale: 1, opacity: 0 }}
        transition={transition}
      />
    </m.div>
  )
}
