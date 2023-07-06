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
  className,
  classImages,
  classImageSelect,
  classImageUnique,
  animate,
  initial,
  transition,
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
    const elm1Div = div1Ref.current
    const elm2Div = div2Ref.current
    const elms = [elm1Div, elm2Div]
    const timeId = setTimeout(() => {
      setHasDelayed(true)
    }, delay)

    // Add handle event when component mount and deps update.
    elms.forEach(elm => {
      if (!elm || !hasDelayed) return
      elm.addEventListener('wheel', handleWheel, { passive: true })
      elm.addEventListener('touchstart', handleTouchStart, { passive: true })
      elm.addEventListener('touchmove', handleTouchMove, { passive: true })
    })

    // Clean up event and timeId when component is unmount.
    return () => {
      elms.forEach(elm => {
        if (!elm) return
        elm.removeEventListener('wheel', handleWheel)
        elm.removeEventListener('touchstart', handleTouchStart)
        elm.removeEventListener('touchmove', handleTouchMove)
      })
      clearTimeout(timeId)
    }
  }, [handleTouchMove, handleWheel, hasDelayed, delay])

  // Functions of the area controller.
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
    const elm1Div = div1Ref.current
    const elm2Div = div2Ref.current
    const elms = [elm1Div, elm2Div]

    // Add event.
    elms.forEach(elm => {
      if (!elm) return
      elm.addEventListener('mouseover', enterControll, { passive: false })
      elm.addEventListener('mouseout', leaveControll)
      elm.addEventListener('touchmove', enterControll, { passive: false })
      elm.addEventListener('touchend', leaveControll)
    })

    // Clean up event when component is unmount.
    return () => {
      elms.forEach(elm => {
        if (!elm) return
        elm.removeEventListener('mouseover', enterControll)
        elm.removeEventListener('mouseout', leaveControll)
        elm.removeEventListener('touchmove', enterControll)
        elm.removeEventListener('touchend', leaveControll)
      })
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
      <div
        ref={div1Ref}
        tabIndex={offsetIndex <= 0 ? 0 : offsetIndex - 1}
        onKeyDown={handleKeyPress}
        className={className + ' ' + styles.outer}
        style={{
          zIndex: offsetIndex - 1,
          width: !vertical
            ? images.length * (width + margin * 2) + 'px'
            : 'fit-content',
          height: vertical
            ? images.length * (height + margin * 2) + 'px'
            : 'fit-content',
          padding: vertical
            ? controller + 'px ' + controller / 2 + 'px'
            : controller / 2 + 'px ' + controller + 'px',
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
        onClick={() => {
          leaveControll()
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
        argRef={div2Ref}
        argKey={select}
        src={images[select].src}
        alt={images[select].alt}
        width={width}
        height={height}
        transition={pickTransition}
        zIndex={frontImage}
      />
    </LazyMotion>
  )
}
