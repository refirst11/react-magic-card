import React, { useCallback, useEffect, useRef, useState } from 'react'
import { m, LazyMotion, domAnimation } from 'framer-motion'
import './main.css'

type ImageProperty = {
  src: string
  alt: string
}

type AnimationProperty = {
  scale?: number
  opacity?: number
  rotateY?: number
  rotateX?: number
  rotateZ?: number
  selectScale?: number
  selectOpacity?: number
  selectRotateY?: number
  selectRotateX?: number
  selectRotateZ?: number
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

type MagicCircleProps = {
  images: ImageProperty[]
  width: number
  height: number
  radius: number
  controller: number
  start: number
  dynamic: boolean
  wheelDelay: number
  animate?: AnimationProperty
  initial?: AnimationProperty
  transition?: TransitionProperty
  className?: string
  classImage?: string
  classImageUnique?: string
}

export const MagicCircle = ({
  images,
  width,
  height,
  radius,
  controller,
  start,
  dynamic,
  wheelDelay,
  animate,
  initial,
  transition,
  className,
  classImage,
  classImageUnique
}: MagicCircleProps) => {
  const [count, setCount] = useState(0)
  const [touchStartY, setTouchStartY] = useState(0)
  const [hasDelayed, setHasDelayed] = useState(true)
  const [select, setSelect] = useState(start)
  const ref = useRef<HTMLDivElement>(null)

  const centralAngle = ((2 * Math.PI) / images.length) * (180 / Math.PI)

  // Functions of the rotation and select and delay.
  // turn left
  const shiftLeft = useCallback(() => {
    setHasDelayed(false)
    setSelect(select == images.length - 1 ? 0 : select + 1)
    if (dynamic) return setCount(count - centralAngle)
  }, [centralAngle, count, dynamic, images.length, select])
  // turn right
  const shiftRight = useCallback(() => {
    setHasDelayed(false)
    setSelect(select == 0 ? images.length - 1 : select - 1)
    if (dynamic) return setCount(count + centralAngle)
  }, [centralAngle, count, dynamic, images.length, select])

  // Function of the desktop.
  const handleWheel = useCallback(
    (e: WheelEvent) => {
      const delta = e.deltaY
      if (delta > 0) shiftLeft()
      if (delta < 0) shiftRight()
    },
    [shiftLeft, shiftRight]
  )

  // Get a start y position in touchStartY.
  const handleTouchStart = (event: TouchEvent) => {
    const touch = event.touches[0]
    setTouchStartY(touch.clientY)
  }
  // Function of the mobile.
  const handleTouchMove = useCallback(
    (event: TouchEvent) => {
      const touch = event.touches[0]
      const deltaY = touch.clientY - touchStartY
      if (deltaY > 0) shiftLeft()
      if (deltaY < 0) shiftRight()
    },
    [shiftLeft, shiftRight, touchStartY]
  )

  // Main functional, exit function if ref and hasDelayed does not exist.
  useEffect(() => {
    const range = ref.current
    const timeId = setTimeout(() => {
      setHasDelayed(true)
    }, wheelDelay)
    if (!range || !hasDelayed) return

    // Add handle event when component mount and deps update.
    range.addEventListener('wheel', handleWheel)
    range.addEventListener('touchstart', handleTouchStart)
    range.addEventListener('touchmove', handleTouchMove)

    // Clean up event and timeId when component is unmount.
    return () => {
      range.removeEventListener('wheel', handleWheel)
      range.removeEventListener('touchstart', handleTouchStart)
      range.removeEventListener('touchmove', handleTouchMove)
      clearTimeout(timeId)
    }
  }, [handleTouchMove, handleWheel, hasDelayed, wheelDelay])

  // Functions of the controller.
  // entry ref area.
  const enterControll = (e: Event) => {
    e.preventDefault()
    document.body.style.overflow = 'hidden'
  }
  // leave ref area.
  const leaveControll = () => {
    document.body.style.overflow = 'auto'
  }

  // Added event when component is mounted.
  useEffect(() => {
    const range = ref.current
    if (!range) return

    // Add event.
    range.addEventListener('mouseover', enterControll, { passive: false })
    range.addEventListener('mouseout', leaveControll)
    range.addEventListener('touchstart', enterControll, { passive: false })
    range.addEventListener('touchend', leaveControll)

    // Clean up event when component is unmount.
    return () => {
      range.removeEventListener('mouseover', enterControll)
      range.removeEventListener('mouseout', leaveControll)
      range.removeEventListener('touchstart', enterControll)
      range.removeEventListener('touchend', leaveControll)
    }
  }, [])

  // angle between images.
  const angle = parseFloat((2 * Math.PI).toFixed(15)) / images.length

  return (
    <LazyMotion features={domAnimation}>
      <m.div
        ref={ref}
        className={className + ' ' + 'outer'}
        style={{
          width: radius * 2 + controller + 'px',
          height: radius * 2 + controller + 'px'
        }}
        animate={{ rotate: count }}
        transition={{ duration: transition?.duration }}
      >
        <div
          className="inner"
          style={{ width: radius * 2 + 'px', height: radius * 2 + 'px' }}
        >
          {images.map((image, index) => {
            const hasSelect = images[select] == images[index]
            return (
              <m.img
                key={index}
                animate={{
                  scale: hasSelect ? animate?.selectScale : animate?.scale,
                  opacity: hasSelect
                    ? animate?.selectOpacity
                    : animate?.opacity,
                  rotateX: hasSelect
                    ? animate?.selectRotateX
                    : animate?.rotateX,
                  rotateY: hasSelect
                    ? animate?.selectRotateY
                    : animate?.rotateY,
                  rotateZ: hasSelect
                    ? animate?.selectRotateZ
                    : animate?.rotateZ,

                  rotate: -count
                }}
                initial={{
                  scale: hasSelect ? initial?.selectScale : initial?.scale,
                  opacity: hasSelect
                    ? initial?.selectOpacity
                    : initial?.opacity,
                  rotateX: hasSelect
                    ? initial?.selectRotateX
                    : initial?.rotateX,
                  rotateY: hasSelect
                    ? initial?.selectRotateY
                    : initial?.rotateY,
                  rotateZ: hasSelect
                    ? initial?.selectRotateZ
                    : initial?.rotateZ,
                  rotate: -count
                }}
                transition={transition}
                onClick={() => setSelect(index)}
                className={classImage + ' ' + classImageUnique + index}
                src={image.src}
                alt={image.alt}
                style={{
                  width: width + 'px',
                  height: height + 'px',
                  left:
                    radius * Math.cos(index * angle) +
                    radius -
                    width / 2 +
                    'px',
                  top:
                    radius * Math.sin(index * angle) +
                    radius -
                    height / 2 +
                    'px'
                }}
              />
            )
          })}
        </div>
      </m.div>
    </LazyMotion>
  )
}
