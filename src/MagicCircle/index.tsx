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
  start,
  height,
  width,
  dynamic = true,
  scrollDirection = true,
  radius,
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
  // array out of range adjusting.
  start = Math.max(0, start)
  start = Math.min(start, images.length - 1)

  const [count, setCount] = useState(0)
  const [touchStartY, setTouchStartY] = useState(0)
  const [touchStartX, setTouchStartX] = useState(0)
  const [initialX, setInitialX] = useState(0)
  const [initialY, setInitialY] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [hasMove, setHasMove] = useState(false)
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
  const handleScroll = useCallback(
    (e: WheelEvent) => {
      const delta = e.deltaY
      if (delta < 0) scrollDirection ? shiftLeft() : shiftRight()
      if (delta > 0) scrollDirection ? shiftRight() : shiftLeft()
    },
    [scrollDirection, shiftLeft, shiftRight]
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
      const outer = refOuter.current as HTMLDivElement
      const outerHalfWidth = outer.clientWidth / 2
      const outerHalfHeight = outer.clientHeight / 2
      const outerRect = outer.getBoundingClientRect()
      const boundarX = touch.clientX - outerRect.left
      const boundarY = touch.clientY - outerRect.top

      const deltaX = touch.clientX
      const deltaY = touch.clientY
      const absDistanceX = Math.abs(deltaX - touchStartX)
      const absDistanceY = Math.abs(deltaY - touchStartY)

      if (absDistanceX > absDistanceY) {
        if (boundarY > outerHalfHeight) {
          if (deltaX < touchStartX) shiftLeft()
          if (deltaX > touchStartX) shiftRight()
        } else {
          if (deltaX > touchStartX) shiftLeft()
          if (deltaX < touchStartX) shiftRight()
        }
      } else if (boundarX > outerHalfWidth) {
        if (deltaY > touchStartY) shiftLeft()
        if (deltaY < touchStartY) shiftRight()
      } else {
        if (deltaY < touchStartY) shiftLeft()
        if (deltaY > touchStartY) shiftRight()
      }

      setTouchStartX(deltaX)
      setTouchStartY(deltaY)
    },
    [shiftLeft, shiftRight, touchStartX, touchStartY]
  )

  const handleMouseDown = useCallback(
    (e: MouseEvent) => {
      if (hasPick) return
      setIsDragging(true)
      setInitialX(e.clientX)
      setInitialY(e.clientY)
    },
    [hasPick]
  )

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isDragging) {
        const outer = refOuter.current as HTMLDivElement
        const outerHalfWidth = outer.clientWidth / 2
        const outerHalfHeight = outer.clientHeight / 2
        const outerRect = outer.getBoundingClientRect()
        const boundarX = e.clientX - outerRect.left
        const boundarY = e.clientY - outerRect.top

        const deltaX = e.clientX - initialX
        const deltaY = e.clientY - initialY
        const absDistanceX = Math.abs(deltaX)
        const absDistanceY = Math.abs(deltaY)

        if (absDistanceX > absDistanceY) {
          if (boundarY > outerHalfHeight) {
            if (deltaX < 0) shiftLeft()
            if (deltaX > 0) shiftRight()
          } else {
            if (deltaX > 0) shiftLeft()
            if (deltaX < 0) shiftRight()
          }
        } else if (boundarX > outerHalfWidth) {
          if (deltaY > 0) shiftLeft()
          if (deltaY < 0) shiftRight()
        } else {
          if (deltaY < 0) shiftLeft()
          if (deltaY > 0) shiftRight()
        }

        setInitialX(e.clientX)
        setInitialY(e.clientY)
        setHasMove(true)
      }
    },
    [initialX, initialY, isDragging, shiftLeft, shiftRight]
  )

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
    setHasMove(false)
  }, [])

  // Main functional, exit function if ref and hasDelayed does not exist.
  useEffect(() => {
    const outer = refOuter.current as HTMLDivElement
    const picker = refPicker.current as HTMLDivElement

    const timeId = setTimeout(() => {
      setHasDelayed(true)
    }, delay)

    // Add handle event when component mount and deps update.
    document.addEventListener('mouseup', handleMouseUp)
    if (!hasDelayed) return
    picker.addEventListener('mousedown', handleMouseDown)
    outer.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('mousemove', handleMouseMove)

    outer.addEventListener('wheel', handleScroll)
    outer.addEventListener('touchstart', handleTouchStart)
    outer.addEventListener('touchmove', handleTouchMove)

    picker.addEventListener('wheel', handleScroll)
    picker.addEventListener('touchstart', handleTouchStart)
    picker.addEventListener('touchmove', handleTouchMove)

    // Clean up event and timeId when component is unmount.
    return () => {
      clearTimeout(timeId)

      document.removeEventListener('mouseup', handleMouseUp)
      picker.removeEventListener('mousedown', handleMouseDown)
      outer.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('mousemove', handleMouseMove)

      outer.removeEventListener('wheel', handleScroll)
      outer.removeEventListener('touchstart', handleTouchStart)
      outer.removeEventListener('touchmove', handleTouchMove)

      picker.removeEventListener('wheel', handleScroll)
      picker.removeEventListener('touchstart', handleTouchStart)
      picker.removeEventListener('touchmove', handleTouchMove)
    }
  }, [
    delay,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleTouchMove,
    handleScroll,
    hasDelayed
  ])

  // The controll start or end.
  // Added event when component is mounted.
  useEffect(() => {
    const enterControl = (e: Event) => {
      e.preventDefault()
      document.body.style.overflow = 'hidden'
    }

    const leaveControl = () => {
      document.body.style.overflow = 'auto'
    }

    const outer = refOuter.current as HTMLDivElement
    const picker = refPicker.current as HTMLDivElement

    // Add event.
    outer.addEventListener('mouseover', enterControl, { passive: false })
    outer.addEventListener('mouseout', leaveControl)
    outer.addEventListener('touchmove', enterControl, { passive: false })
    outer.addEventListener('touchend', leaveControl)

    picker.addEventListener('mouseover', enterControl, { passive: false })
    picker.addEventListener('mouseout', leaveControl)
    picker.addEventListener('touchmove', enterControl, { passive: false })
    picker.addEventListener('touchend', leaveControl)

    // Clean up event when component is unmount.
    return () => {
      outer.removeEventListener('mouseover', enterControl)
      outer.removeEventListener('mouseout', leaveControl)
      outer.removeEventListener('touchmove', enterControl)
      outer.removeEventListener('touchend', leaveControl)

      picker.removeEventListener('mouseover', enterControl)
      picker.removeEventListener('mouseout', leaveControl)
      picker.removeEventListener('touchmove', enterControl)
      picker.removeEventListener('touchend', leaveControl)

      // page unmount with leave control.
      leaveControl()
    }
  }, [])

  // angle between.
  const angle = parseFloat((2 * Math.PI).toFixed(15)) / images.length

  // selected image.
  const frontImage = offsetIndex + images.length + 1

  // keyboard control.
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
          transition={transition}
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
                  role="button"
                  draggable={false}
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
                  onMouseDown={() => setSelect(index)}
                  onPointerDown={() => setSelect(index)}
                  onClick={() =>
                    hasSelect && pickScale && !hasMove && setHasPick(true)
                  }
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
