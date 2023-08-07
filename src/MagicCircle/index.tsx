import React, {
  KeyboardEventHandler,
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react'
import { m, LazyMotion, domAnimation } from 'framer-motion'
import type { MagicCircleProps } from '../types'
import styles from './styles.module.css'
import PickImage from '../common/PickImage'

export const MagicCircle = ({
  images,
  height,
  width,
  dynamic = true,
  clockwise = true,
  radius,
  start,
  delay = 100,
  controller,
  offsetIndex = 0,
  reverseIndex = true,
  loading,
  className,
  classImages,
  classImageSelect,
  classImageUnique,
  animate,
  initial,
  transition,
  pickScale = true,
  pickProperty,
  pickTransition
}: MagicCircleProps) => {
  const [count, setCount] = useState(0)
  const [touchStartY, setTouchStartY] = useState(0)
  const [touchStartX, setTouchStartX] = useState(0)
  const [hasShift, setHasShift] = useState(false)
  const [hasDelayed, setHasDelayed] = useState(true)
  const [select, setSelect] = useState(start)
  const [hasPick, setHasPick] = useState(false)
  const refOuter = useRef<HTMLDivElement>(null)
  const refPicker = useRef<HTMLDivElement>(null)

  const centralAngle = ((2 * Math.PI) / images.length) * (180 / Math.PI)

  // Functions of the rotation and select and delay.
  // turn left
  const shiftLeft = useCallback(() => {
    setSelect(select == 0 ? images.length - 1 : select - 1)
    setHasShift(false)
    setHasDelayed(false)
    if (dynamic) return setCount(count + centralAngle)
  }, [centralAngle, count, dynamic, images.length, select])

  // turn right
  const shiftRight = useCallback(() => {
    setSelect(select == images.length - 1 ? 0 : select + 1)
    setHasShift(true)
    setHasDelayed(false)
    if (dynamic) return setCount(count - centralAngle)
  }, [centralAngle, count, dynamic, images.length, select])

  // Function of the desktop.
  const handleWheel = useCallback(
    (e: WheelEvent) => {
      const delta = e.deltaY
      if (delta < 0) clockwise ? shiftLeft() : shiftRight()
      if (delta > 0) clockwise ? shiftRight() : shiftLeft()
    },
    [clockwise, shiftLeft, shiftRight]
  )

  // Get a start y and x position in touchStart Y and X.
  const handleTouchStart = (e: TouchEvent) => {
    const touch = e.touches[0]
    setTouchStartY(touch.clientY)
    setTouchStartX(touch.clientX)
  }
  // Function of the mobile.
  const handleTouchMove = useCallback(
    (event: TouchEvent) => {
      const touch = event.touches[0]
      const delta = hasPick ? touch.clientX : touch.clientY

      if (hasPick ? delta < touchStartX : delta < touchStartY)
        clockwise ? shiftLeft() : shiftRight()
      if (hasPick ? delta > touchStartX : delta > touchStartY)
        clockwise ? shiftRight() : shiftLeft()

      hasPick ? setTouchStartX(delta) : setTouchStartY(delta)
    },
    [clockwise, hasPick, shiftLeft, shiftRight, touchStartX, touchStartY]
  )

  // Main functional, exit function if ref and hasDelayed does not exist.
  useEffect(() => {
    const outer = refOuter.current as HTMLDivElement
    const picker = refPicker.current as HTMLDivElement
    ;``
    const timeId = setTimeout(() => {
      setHasDelayed(true)
    }, delay)

    // Add handle event when component mount and deps update.
    if (!hasDelayed) return
    outer.addEventListener('wheel', handleWheel, { passive: true })
    outer.addEventListener('touchstart', handleTouchStart, { passive: true })
    outer.addEventListener('touchmove', handleTouchMove, { passive: true })

    picker.addEventListener('wheel', handleWheel, { passive: true })
    picker.addEventListener('touchstart', handleTouchStart, { passive: true })
    picker.addEventListener('touchmove', handleTouchMove, { passive: true })

    // Clean up event and timeId when component is unmount.
    return () => {
      outer.removeEventListener('wheel', handleWheel)
      outer.removeEventListener('touchstart', handleTouchStart)
      outer.removeEventListener('touchmove', handleTouchMove)

      picker.removeEventListener('wheel', handleWheel)
      picker.removeEventListener('touchstart', handleTouchStart)
      picker.removeEventListener('touchmove', handleTouchMove)

      clearTimeout(timeId)
    }
  }, [handleTouchMove, handleWheel, hasDelayed, delay])

  // The controll start or end.
  // Added event when component is mounted.
  useEffect(() => {
    const enterControll = (e: Event) => {
      e.preventDefault()
      document.body.style.overflow = 'hidden'
    }

    const leaveControll = () => {
      document.body.style.overflow = 'auto'
    }

    const outer = refOuter.current as HTMLDivElement
    const picker = refPicker.current as HTMLDivElement

    // Add event.
    outer.addEventListener('mouseover', enterControll, { passive: false })
    outer.addEventListener('mouseout', leaveControll)
    outer.addEventListener('touchmove', enterControll, { passive: false })
    outer.addEventListener('touchend', leaveControll)

    picker.addEventListener('mouseover', enterControll, { passive: false })
    picker.addEventListener('mouseout', leaveControll)
    picker.addEventListener('touchmove', enterControll, { passive: false })
    picker.addEventListener('touchend', leaveControll)

    // Clean up event when component is unmount.
    return () => {
      outer.removeEventListener('mouseover', enterControll)
      outer.removeEventListener('mouseout', leaveControll)
      outer.removeEventListener('touchmove', enterControll)
      outer.removeEventListener('touchend', leaveControll)

      picker.removeEventListener('mouseover', enterControll)
      picker.removeEventListener('mouseout', leaveControll)
      picker.removeEventListener('touchmove', enterControll)
      picker.removeEventListener('touchend', leaveControll)
    }
  }, [])

  // angle between.
  const angle = parseFloat((2 * Math.PI).toFixed(15)) / images.length

  // selected image.
  const frontImage = offsetIndex + images.length + 1

  // keyboard controll.
  const handleKeyPress: KeyboardEventHandler<HTMLDivElement> = e => {
    e.key === 'ArrowUp' && shiftLeft()
    e.key === 'ArrowRight' && shiftLeft()
    e.key === 'ArrowDown' && shiftRight()
    e.key === 'ArrowLeft' && shiftRight()
    e.key === 'Enter' && setHasPick(true)
    e.key === 'Escape' && setHasPick(false)
  }

  return (
    <LazyMotion features={domAnimation}>
      <div className={className}>
        <m.div
          className={styles.outer}
          ref={refOuter}
          tabIndex={offsetIndex <= 0 ? 0 : offsetIndex - 1}
          onKeyDown={handleKeyPress}
          style={{
            zIndex: offsetIndex - 1,
            width: radius * 2 + controller + 'px',
            height: radius * 2 + controller + 'px'
          }}
          animate={{ rotate: count }}
          transition={{ duration: transition?.duration }}
        >
          <div
            className={styles.inner}
            style={{ width: radius * 2 + 'px', height: radius * 2 + 'px' }}
          >
            {images.map((image, index) => {
              const hasSelect = images[select] == images[index]
              const zIndex = reverseIndex
                ? offsetIndex + images.length - 1 - index
                : offsetIndex + index
              return (
                <m.img
                  key={zIndex}
                  loading={loading}
                  animate={{
                    rotate: -count,
                    scale: hasSelect ? animate?.selectScale : animate?.scale,
                    rotateY: hasSelect
                      ? animate?.selectRotateY
                      : animate?.rotateY,
                    rotateX: hasSelect
                      ? animate?.selectRotateX
                      : animate?.rotateX,
                    rotateZ: hasSelect
                      ? animate?.selectRotateZ
                      : animate?.rotateZ,
                    opacity: hasSelect
                      ? hasPick
                        ? 0
                        : animate?.selectOpacity
                      : animate?.opacity
                  }}
                  initial={{
                    rotate: -count,
                    scale: hasSelect ? initial?.selectScale : initial?.scale,
                    rotateY: hasSelect
                      ? initial?.selectRotateY
                      : initial?.rotateY,
                    rotateX: hasSelect
                      ? initial?.selectRotateX
                      : initial?.rotateX,
                    rotateZ: hasSelect
                      ? initial?.selectRotateZ
                      : initial?.rotateZ,
                    opacity: hasSelect
                      ? initial?.selectOpacity
                      : initial?.opacity
                  }}
                  transition={transition}
                  onClick={() => {
                    setSelect(index)
                    hasSelect && pickScale && setHasPick(true)
                  }}
                  className={
                    classImages +
                    ' ' +
                    (hasSelect && classImageSelect) +
                    ' ' +
                    classImageUnique +
                    zIndex
                  }
                  src={image.src}
                  alt={image.alt}
                  style={{
                    zIndex: hasSelect ? frontImage : zIndex,
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
        <PickImage
          onClick={() => {
            setHasPick(false)
          }}
          hasPick={hasPick}
          classPick={pickProperty?.classPick}
          white={pickProperty?.white}
          alpha={pickProperty?.alpha}
          blur={pickProperty?.blur}
          scale={pickProperty?.scale}
          offset={pickProperty?.offset}
          hasShift={hasShift}
          argRef={refPicker}
          argKey={select}
          src={images[select].src}
          alt={images[select].alt}
          width={width}
          height={height}
          transition={pickTransition}
          zIndex={frontImage}
        />
      </div>
    </LazyMotion>
  )
}
