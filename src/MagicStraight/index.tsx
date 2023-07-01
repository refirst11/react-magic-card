import React, { useCallback, useEffect, useRef, useState } from 'react'
import { m, LazyMotion, domAnimation } from 'framer-motion'
import type { MagicStraightProps } from '../types'
import styles from './styles.module.css'
import PickImage from '../common/PickImage'

export const MagicStraight = ({
  images,
  height,
  width,
  start,
  controller,
  wheelDelay,
  vertical,
  className,
  classImage,
  classImageUnique,
  animate,
  initial,
  transition,
  margin = 0,
  selectOffsetX = 0,
  selectOffsetY = 0,
  selectCursor = 'pointer',
  pickProperty,
  pickTransition
}: MagicStraightProps) => {
  const [touchStartY, setTouchStartY] = useState(0)
  const [touchStartX, setTouchStartX] = useState(0)
  const [hasShift, setHasShift] = useState(false)
  const [hasDelayed, setHasDelayed] = useState(true)
  const [select, setSelect] = useState(start)
  const [hasPick, setHasPick] = useState(false)
  const div1Ref = useRef<HTMLDivElement>(null)
  const div2Ref = useRef<HTMLDivElement>(null)

  const shiftRight = useCallback(() => {
    setSelect(select == images.length - 1 ? 0 : select + 1)
    setHasShift(true)
    setHasDelayed(false)
  }, [images.length, select])

  const shiftLeft = useCallback(() => {
    setSelect(select == 0 ? images.length - 1 : select - 1)
    setHasShift(false)
    setHasDelayed(false)
  }, [images.length, select])

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      const delta = e.deltaY
      if (delta > 0) shiftRight()
      if (delta < 0) shiftLeft()
    },
    [shiftLeft, shiftRight]
  )

  const handleTouchStart = (event: TouchEvent) => {
    const touch = event.touches[0]
    setTouchStartY(touch.clientY)
    setTouchStartX(touch.clientX)
  }

  const handleTouchMove = useCallback(
    (event: TouchEvent) => {
      const touch = event.touches[0]
      const delta = hasPick
        ? touch.clientX - touchStartX
        : vertical
        ? touch.clientY - touchStartY
        : touch.clientX - touchStartX
      if (delta > 0) shiftRight()
      if (delta < 0) shiftLeft()
    },
    [hasPick, shiftLeft, shiftRight, touchStartX, touchStartY, vertical]
  )

  useEffect(() => {
    const elm1Div = div1Ref.current
    const elm2Div = div2Ref.current
    const elms = [elm1Div, elm2Div]
    const timeId = setTimeout(() => {
      setHasDelayed(true)
    }, wheelDelay)

    elms.forEach(elm => {
      if (!elm || !hasDelayed) return
      elm.addEventListener('wheel', handleWheel, { passive: true })
      elm.addEventListener('touchstart', handleTouchStart, { passive: true })
      elm.addEventListener('touchmove', handleTouchMove, { passive: true })
    })

    return () => {
      elms.forEach(elm => {
        if (!elm) return
        elm.removeEventListener('wheel', handleWheel)
        elm.removeEventListener('touchstart', handleTouchStart)
        elm.removeEventListener('touchmove', handleTouchMove)
      })
      clearTimeout(timeId)
    }
  }, [handleTouchMove, handleWheel, hasDelayed, wheelDelay])

  const enterControll = (e: Event) => {
    e.preventDefault()
    document.body.style.overflow = 'hidden'
  }

  const leaveControll = () => {
    document.body.style.overflow = 'auto'
  }

  useEffect(() => {
    const elm1Div = div1Ref.current
    const elm2Div = div2Ref.current
    const elms = [elm1Div, elm2Div]

    elms.forEach(elm => {
      if (!elm) return
      elm.addEventListener('mouseover', enterControll)
      elm.addEventListener('mouseout', leaveControll)
      elm.addEventListener('touchmove', enterControll)
      elm.addEventListener('touchend', leaveControll)
    })
    return () => {
      elms.forEach(elm => {
        if (!elm) return
        elm.removeEventListener('mouseover', enterControll)
        elm.removeEventListener('mouseout', leaveControll)
        elm.removeEventListener('touchmove', enterControll)
        elm.addEventListener('touchend', leaveControll)
      })
    }
  }, [])

  let total = 0
  for (let i = 1; i < images.length; i++) total += i
  const Total = total / images.length

  const clasess = className + ' ' + styles.outer

  return (
    <LazyMotion features={domAnimation}>
      <div
        ref={div1Ref}
        className={clasess}
        style={{
          width: !vertical ? height + controller + 'px' : 'fit-content',
          height: vertical ? width + controller + 'px' : 'fit-content',
          padding: vertical
            ? controller + 'px' + ' ' + controller / 2 + 'px'
            : controller / 2 + 'px' + ' ' + controller + 'px',
          flexDirection: vertical ? 'column' : 'row'
        }}
      >
        {images.map((image, index) => {
          const hasSelect = images[select] == images[index]
          const reverseIndex = images.length - 1 - index
          return (
            <m.img
              key={index}
              animate={{
                y: hasSelect
                  ? vertical
                    ? (Total - index) * height +
                      (Total - index) * (margin * 2) +
                      selectOffsetY
                    : selectOffsetY
                  : 0,
                x: hasSelect
                  ? !vertical
                    ? (Total - index) * width +
                      (Total - index) * (margin * 2) +
                      selectOffsetX
                    : selectOffsetX
                  : 0,
                scale: hasSelect
                  ? hasPick
                    ? 0
                    : animate?.selectScale
                  : animate?.scale,
                rotateY: hasSelect ? animate?.selectRotateY : animate?.rotateY,
                rotateX: hasSelect ? animate?.selectRotateX : animate?.rotateX,
                rotateZ: hasSelect ? animate?.selectRotateZ : animate?.rotateZ,
                opacity: hasSelect
                  ? hasPick
                    ? 0
                    : animate?.selectOpacity
                  : animate?.opacity
              }}
              initial={{
                scale: hasSelect ? initial?.selectScale : initial?.scale,
                rotateY: hasSelect ? initial?.selectRotateY : initial?.rotateY,
                rotateX: hasSelect ? initial?.selectRotateX : initial?.rotateX,
                rotateZ: hasSelect ? initial?.selectRotateZ : initial?.rotateZ,
                opacity: hasSelect ? initial?.selectOpacity : initial?.opacity
              }}
              transition={transition}
              onClick={() => {
                setSelect(index)
                hasSelect && setHasPick(true)
              }}
              className={classImage + ' ' + classImageUnique + index}
              src={image.src}
              alt={image.alt}
              role="button"
              style={{
                zIndex: hasSelect
                  ? hasPick
                    ? 0
                    : images.length + 1
                  : reverseIndex,
                cursor: hasSelect ? selectCursor : 'default',
                width: width + 'px',
                height: height + 'px',
                margin: vertical ? margin + 'px' + ' 0' : '0 ' + margin + 'px'
              }}
            />
          )
        })}
      </div>
      <button onClick={() => shiftRight()}>{hasPick ? 'true' : 'false'}</button>
      <PickImage
        onClick={() => setHasPick(false)}
        hasPick={hasPick}
        classPick={pickProperty?.classPick}
        white={pickProperty?.white}
        alpha={pickProperty?.alpha}
        blur={pickProperty?.blur}
        scale={pickProperty?.scale}
        offset={pickProperty?.offset}
        hasShift={hasShift}
        argRef={div2Ref}
        argKey={select}
        src={images[select].src}
        alt={images[select].alt}
        width={width}
        height={height}
        transition={pickTransition}
        zIndex={images.length + 1}
      />
    </LazyMotion>
  )
}