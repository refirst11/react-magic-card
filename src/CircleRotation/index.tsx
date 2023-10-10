import React, {
  KeyboardEventHandler,
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react'
import { m, LazyMotion, domAnimation } from 'framer-motion'
import type { CircleRotationProps } from '../types'
import styles from './styles.module.css'
import { DetailImage } from '../common/DetailImage'

export const CircleRotation = ({
  images,
  start,
  height,
  width,
  radius,
  controller,
  offsetIndex = 0,
  reverseIndex = true,
  className,
  classImages,
  classImageSelect,
  classImageUnique,
  animate,
  initial,
  transition,
  detail = true,
  detailProperty,
  detailTransition,
  loading = 'lazy',
  initialFadeRange = 1,
  initialFadeTime = 0.2
}: CircleRotationProps) => {
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
  const [hasDelayed, setHasDelayed] = useState(true)
  const [select, setSelect] = useState(start)
  const [hasDetail, setHasDetail] = useState(false)

  const refOuter = useRef<HTMLDivElement>(null)
  const refDetail = useRef<HTMLDivElement>(null)

  const centralAngle = ((2 * Math.PI) / images.length) * (180 / Math.PI)

  // Functions of the rotation and select and delay.
  // turn left
  const shiftLeft = useCallback(() => {
    setSelect(select == 0 ? images.length - 1 : select - 1)
    setHasDelayed(false)
    setCount(count + centralAngle)
  }, [centralAngle, count, images.length, select])

  // turn right
  const shiftRight = useCallback(() => {
    setSelect(select == images.length - 1 ? 0 : select + 1)
    setHasDelayed(false)
    setCount(count - centralAngle)
  }, [centralAngle, count, images.length, select])

  // Function of the desktop.
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
      if (hasDetail) return
      setIsDragging(true)
      setInitialX(e.clientX)
      setInitialY(e.clientY)
    },
    [hasDetail]
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
    const detail = refDetail.current as HTMLDivElement

    const timeId = setTimeout(() => {
      setHasDelayed(true)
    }, ((transition?.duration as number) / 2) * 1000)

    // Add handle event when component mount and deps update.
    document.addEventListener('mouseup', handleMouseUp)
    if (!hasDelayed) return
    detail.addEventListener('mousedown', handleMouseDown)
    outer.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('mousemove', handleMouseMove)

    outer.addEventListener('wheel', handleScroll)
    outer.addEventListener('touchstart', handleTouchStart)
    outer.addEventListener('touchmove', handleTouchMove)

    detail.addEventListener('wheel', handleScroll)
    detail.addEventListener('touchstart', handleTouchStart)
    detail.addEventListener('touchmove', handleTouchMove)

    // Clean up event and timeId when component is unmount.
    return () => {
      clearTimeout(timeId)

      document.removeEventListener('mouseup', handleMouseUp)
      detail.removeEventListener('mousedown', handleMouseDown)
      outer.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('mousemove', handleMouseMove)

      outer.removeEventListener('wheel', handleScroll)
      outer.removeEventListener('touchstart', handleTouchStart)
      outer.removeEventListener('touchmove', handleTouchMove)

      detail.removeEventListener('wheel', handleScroll)
      detail.removeEventListener('touchstart', handleTouchStart)
      detail.removeEventListener('touchmove', handleTouchMove)
    }
  }, [
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleTouchMove,
    handleScroll,
    hasDelayed,
    transition?.duration
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
    const detail = refDetail.current as HTMLDivElement

    // Add event.
    outer.addEventListener('mouseover', enterControl, { passive: false })
    outer.addEventListener('mouseout', leaveControl)
    outer.addEventListener('touchmove', enterControl, { passive: false })
    outer.addEventListener('touchend', leaveControl)

    detail.addEventListener('mouseover', enterControl, { passive: false })
    detail.addEventListener('mouseout', leaveControl)
    detail.addEventListener('touchmove', enterControl, { passive: false })
    detail.addEventListener('touchend', leaveControl)

    // Clean up event when component is unmount.
    return () => {
      outer.removeEventListener('mouseover', enterControl)
      outer.removeEventListener('mouseout', leaveControl)
      outer.removeEventListener('touchmove', enterControl)
      outer.removeEventListener('touchend', leaveControl)

      detail.removeEventListener('mouseover', enterControl)
      detail.removeEventListener('mouseout', leaveControl)
      detail.removeEventListener('touchmove', enterControl)
      detail.removeEventListener('touchend', leaveControl)

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
    e.key === 'Enter' && setHasDetail(true)
    e.key === 'Escape' && setHasDetail(false)
  }

  // has after Lazy loading fade transition.
  const [isLoaded, setIsLoaded] = useState(false)
  useEffect(() => {
    setIsLoaded(true)
  }, [])

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
                  role={'button'}
                  aria-label="click and scale image"
                  src={image.src}
                  alt={image.alt}
                  draggable={false}
                  loading={loading}
                  animate={{
                    rotate: -count - (animate?.rotate ? animate?.rotate : 0),
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
                      ? hasDetail
                        ? 0
                        : animate?.selectOpacity
                      : animate?.opacity
                  }}
                  initial={{
                    rotate: -count - (initial?.rotate ? initial?.rotate : 0),
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
                  onPointerDown={() => setSelect(index)}
                  onClick={() =>
                    hasSelect && detail && !hasMove && setHasDetail(true)
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
                      'px',
                    filter:
                      initialFadeRange && isLoaded
                        ? ''
                        : `blur(${initialFadeRange}px)`,
                    transition: initialFadeTime
                      ? `filter ${initialFadeTime}s ease-in-out`
                      : ''
                  }}
                />
              )
            })}
          </div>
        </m.div>
      </div>
      <DetailImage
        detailRef={refDetail}
        detailKey={select}
        hasDetail={hasDetail}
        onClick={() => {
          setHasDetail(false)
        }}
        classDetail={detailProperty?.classDetail}
        src={images[select].src}
        alt={images[select].alt}
        width={width}
        height={height}
        white={detailProperty?.white}
        alpha={detailProperty?.alpha}
        blur={detailProperty?.blur}
        scale={detailProperty?.scale}
        rotate={detailProperty?.rotate}
        transition={detailTransition}
        zIndex={frontImage}
      />
    </LazyMotion>
  )
}
