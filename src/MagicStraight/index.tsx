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
  height,
  width,
  vertical = true,
  margin = 0,
  selectOffsetX = 0,
  selectOffsetY = 0,
  start,
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
  const [touchStartY, setTouchStartY] = useState(0)
  const [touchStartX, setTouchStartX] = useState(0)
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
  const handleWheel = useCallback(
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

  // Main functional, exit function if ref and hasDelayed does not exist.
  useEffect(() => {
    const outer = refOuter.current as HTMLDivElement
    const picker = refPicker.current as HTMLDivElement

    const timeId = setTimeout(() => {
      setHasDelayed(true)
    }, delay)

    // Add handle event when component mount and deps update.
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

    // leave ref area.
    const leaveControll = () => {
      document.body.style.overflow = 'auto'
    }
    const outer = refOuter.current as HTMLDivElement
    const picker = refPicker.current as HTMLDivElement

    // add evenet.
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
      picker.removeEventListener('mopickerseout', leaveControll)
      picker.removeEventListener('touchmove', enterControll)
      picker.removeEventListener('touchend', leaveControll)
    }
  }, [])

  // average calculation.
  let total = 0
  for (let i = 1; i < images.length; i++) total += i
  const average = total / images.length

  // selected image.
  const frontImage = offsetIndex + images.length + 1

  // keyboard controll.
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
                  hasSelect && pickScale && setHasPick(true)
                }}
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
