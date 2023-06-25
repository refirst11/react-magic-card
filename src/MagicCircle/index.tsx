import React, { useCallback, useEffect, useRef, useState } from 'react'
import { m } from 'framer-motion'
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
  data: ImageProperty[]
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
  data,
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
  const [hasDelayed, setHasDelayed] = useState(true)
  const [images, setImages] = useState(data)
  const [select, setSelect] = useState(start)
  const ref = useRef<HTMLDivElement>(null)

  const shiftRight = useCallback(() => {
    setImages(arr => {
      const lastElement = arr.pop() as ImageProperty
      arr.unshift(lastElement)
      setSelect(select == images.length - 1 ? 0 : select + 1)

      return arr
    })
  }, [images.length, select])

  const shiftLeft = useCallback(() => {
    setImages(arr => {
      const firstElement = arr.shift() as ImageProperty
      arr.push(firstElement)
      setSelect(select == 0 ? images.length - 1 : select - 1)

      return arr
    })
  }, [images.length, select])

  const centralAngle = ((2 * Math.PI) / images.length) * (180 / Math.PI)

  const controlRotation = useCallback(
    (e: WheelEvent) => {
      const delta = e.deltaY

      if (delta > 0) {
        setHasDelayed(false)
        for (let i = 0; i < images.length; i++) shiftRight()
        if (dynamic) return setCount(count - centralAngle)
      }
      if (delta < 0) {
        setHasDelayed(false)
        for (let i = 0; i < images.length; i++) shiftLeft()
        if (dynamic) return setCount(count + centralAngle)
      }
    },
    [dynamic, count, centralAngle, images.length, shiftRight, shiftLeft]
  )

  useEffect(() => {
    const range = ref.current
    const timeId = setTimeout(() => {
      setHasDelayed(true)
    }, wheelDelay)

    if (!range || !hasDelayed) return
    range.addEventListener('wheel', controlRotation, { passive: false })

    return () => {
      range.removeEventListener('wheel', controlRotation)
      clearTimeout(timeId)
    }
  }, [count, hasDelayed, controlRotation, wheelDelay])

  const enterControll = () => {
    document.body.style.overflow = 'hidden'
  }

  const leaveControll = () => {
    document.body.style.overflow = 'auto'
  }

  useEffect(() => {
    const range = ref.current
    if (!range) return

    range.addEventListener('mouseover', enterControll)
    range.addEventListener('mouseout', leaveControll)
    range.addEventListener('touchmove', leaveControll, { passive: false })

    return () => {
      range.removeEventListener('mouseover', enterControll)
      range.removeEventListener('mouseout', leaveControll)
      range.removeEventListener('touchmove', leaveControll)
    }
  }, [])

  // angle between images.
  const angle = parseFloat((2 * Math.PI).toFixed(15)) / data.length

  return (
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
                opacity: hasSelect ? animate?.selectOpacity : animate?.opacity,
                rotateX: hasSelect ? animate?.selectRotateX : animate?.rotateX,
                rotateY: hasSelect ? animate?.selectRotateY : animate?.rotateY,
                rotateZ: hasSelect ? animate?.selectRotateZ : animate?.rotateZ,

                rotate: -count
              }}
              initial={{
                scale: hasSelect ? initial?.selectScale : initial?.scale,
                opacity: hasSelect ? initial?.selectOpacity : initial?.opacity,
                rotateX: hasSelect ? initial?.selectRotateX : initial?.rotateX,
                rotateY: hasSelect ? initial?.selectRotateY : initial?.rotateY,
                rotateZ: hasSelect ? initial?.selectRotateZ : initial?.rotateZ,
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
                  radius * Math.cos(index * angle) + radius - width / 2 + 'px',
                top:
                  radius * Math.sin(index * angle) + radius - height / 2 + 'px'
              }}
            />
          )
        })}
      </div>
    </m.div>
  )
}
