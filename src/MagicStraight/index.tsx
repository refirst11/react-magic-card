import React, {
  KeyboardEventHandler,
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react'
import { m, LazyMotion, domAnimation } from 'framer-motion'
import type { MagicStraightProps } from '../types'
import styles from './styles.module.css'
import PickImage from '../common/PickImage'

export const MagicStraight = ({
  images,
  start,
  height,
  width,
  vertical = true,
  margin = 0,
  selectOffsetX = 0,
  selectOffsetY = 0,
  controller,
  delay = 20,
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
}: MagicStraightProps) => {
  // array out of range adjusting.
  start = Math.max(0, start)
  start = Math.min(start, images.length - 1)

  const [touchStartY, setTouchStartY] = useState(0)
  const [touchStartX, setTouchStartX] = useState(0)
  const [initialX, setInitialX] = useState(0)
  const [initialY, setInitialY] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [hasShift, setHasShift] = useState(false)
  const [hasDelayed, setHasDelayed] = useState(true)
  const [select, setSelect] = useState(start)
  const [hasPick, setHasPick] = useState(false)
  const refOuter = useRef<HTMLDivElement>(null)
  const refPicker = useRef<HTMLDivElement>(null)

  // Functions of the swipe and wheel a shifting.
  // turn left
  const shiftLeft = useCallback(() => {
    setSelect(select == 0 ? images.length - 1 : select - 1)
    setHasShift(false)
    setHasDelayed(false)
  }, [images.length, select])

  // turn right
  const shiftRight = useCallback(() => {
    setSelect(select == images.length - 1 ? 0 : select + 1)
    setHasShift(true)
    setHasDelayed(false)
  }, [images.length, select])

  // Wheel function of the desktop.
  const handleScroll = useCallback(
    (e: WheelEvent) => {
      const delta = e.deltaY
      if (delta < 0) shiftLeft()
      if (delta > 0) shiftRight()
    },
    [shiftLeft, shiftRight]
  )

  // Get a start y and x position in touchStart Y and X.
  const handleTouchStart = (e: TouchEvent) => {
    const touch = e.touches[0]
    setTouchStartY(touch.clientY)
    setTouchStartX(touch.clientX)
  }

  // Swipe Function of the mobile.
  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      const touch = e.touches[0]
      const delta = hasPick
        ? touch.clientX
        : !vertical
        ? touch.clientX
        : touch.clientY

      if (
        hasPick
          ? delta < touchStartX
          : !vertical
          ? delta < touchStartX
          : delta < touchStartY
      )
        shiftLeft()
      if (
        hasPick
          ? delta > touchStartX
          : !vertical
          ? delta > touchStartX
          : delta > touchStartY
      )
        shiftRight()

      hasPick
        ? setTouchStartX(delta)
        : !vertical
        ? setTouchStartX(delta)
        : setTouchStartY(delta)
    },
    [hasPick, shiftLeft, shiftRight, touchStartX, touchStartY, vertical]
  )

  const handleMouseDown = useCallback((e: MouseEvent) => {
    setIsDragging(true)
    setInitialX(e.clientX)
    setInitialY(e.clientY)
  }, [])

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isDragging) {
        const deltaX = e.clientX - initialX
        const deltaY = e.clientY - initialY

        if (!vertical ? deltaX < 0 : deltaY < 0) shiftLeft()
        if (!vertical ? deltaX > 0 : deltaY > 0) shiftRight()

        !vertical ? setInitialX(e.clientX) : setInitialY(e.clientY)
      }
    },
    [initialX, initialY, isDragging, shiftLeft, shiftRight, vertical]
  )

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
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

      outer.removeEventListener('wheel', handleScroll)
      outer.removeEventListener('touchstart', handleTouchStart)
      outer.removeEventListener('touchmove', handleTouchMove)

      document.removeEventListener('mouseup', handleMouseUp)
      picker.removeEventListener('mousedown', handleMouseDown)
      outer.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('mousemove', handleMouseMove)

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

  // average calculation.
  let total = 0
  for (let i = 1; i < images.length; i++) total += i
  const average = total / images.length

  // selected image.
  const frontImage = offsetIndex + images.length + 1

  // keyboard control.
  const handleKeyPress: KeyboardEventHandler<HTMLDivElement> = e => {
    e.key === 'ArrowLeft' && shiftLeft()
    e.key === 'ArrowUp' && shiftLeft()
    e.key === 'ArrowRight' && shiftRight()
    e.key === 'ArrowDown' && shiftRight()
    e.key === 'Enter' && setHasPick(true)
    e.key === 'Escape' && setHasPick(false)
  }

  return (
    <LazyMotion features={domAnimation}>
      <div className={className}>
        <div
          className={styles.outer}
          ref={refOuter}
          tabIndex={offsetIndex <= 0 ? 0 : offsetIndex - 1}
          onKeyDown={handleKeyPress}
          style={{
            zIndex: offsetIndex - 1,
            width: !vertical
              ? images.length * (width + margin * 2) + controller + 'px'
              : width + controller,
            height: vertical
              ? images.length * (height + margin * 2) + controller + 'px'
              : height + controller,
            flexDirection: vertical ? 'column' : 'row'
          }}
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
                  index
                }
                src={image.src}
                alt={image.alt}
                role="button"
                draggable={false}
                loading={loading}
                animate={{
                  y: hasSelect
                    ? vertical
                      ? (average - index) * height +
                        (average - index) * (margin * 2) +
                        selectOffsetY
                      : selectOffsetY
                    : 0,
                  x: hasSelect
                    ? !vertical
                      ? (average - index) * width +
                        (average - index) * (margin * 2) +
                        selectOffsetX
                      : selectOffsetX
                    : 0,
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
                  opacity: hasSelect ? initial?.selectOpacity : initial?.opacity
                }}
                transition={transition}
                onClick={() => {
                  setSelect(index)
                  hasSelect && pickScale && !isDragging && setHasPick(true)
                }}
                style={{
                  zIndex: hasSelect ? frontImage : zIndex,
                  width: width + 'px',
                  height: height + 'px',
                  margin: vertical ? margin + 'px' + ' 0' : '0 ' + margin + 'px'
                }}
              />
            )
          })}
        </div>
        <PickImage
          classPick={pickProperty?.classPick}
          argRef={refPicker}
          onClick={() => {
            setHasPick(false)
          }}
          hasPick={hasPick}
          white={pickProperty?.white}
          alpha={pickProperty?.alpha}
          blur={pickProperty?.blur}
          scale={pickProperty?.scale}
          offset={pickProperty?.offset}
          hasShift={hasShift}
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
