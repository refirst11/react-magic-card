import React, {
  KeyboardEventHandler,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState
} from 'react'
import { m, LazyMotion, domAnimation } from 'framer-motion'
import type { StraightInfinityProps } from '../types'
import styles from './styles.module.css'
import { DetailImage } from '../common/DetailImage'

export const StraightInfinity = ({
  images,
  start,
  height,
  width,
  vertical = false,
  margin = 0,
  controller = 0,
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
}: StraightInfinityProps) => {
  // array out of range adjusting.
  start = Math.max(0, start)
  start = Math.min(start, images.length - 1)

  const [touchStartY, setTouchStartY] = useState(0)
  const [touchStartX, setTouchStartX] = useState(0)
  const [initialX, setInitialX] = useState(0)
  const [initialY, setInitialY] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [hasMove, setHasMove] = useState(false)
  const [hasShift, setHasShift] = useState(false)
  const [hasDelayed, setHasDelayed] = useState(true)
  const [select, setSelect] = useState(start)
  const [edge, setEdge] = useState(images.length)
  const [hasDetail, setHasDetail] = useState(false)
  const refOuter = useRef<HTMLDivElement>(null)
  const refDetail = useRef<HTMLDivElement>(null)
  const [count, setCount] = useState(0)

  // Functions of the swipe and wheel a shifting.
  // turn left
  const shiftLeft = useCallback(async () => {
    edge !== 0 && setSelect(select === 0 ? images.length - 1 : select - 1)
    setEdge(edge === 0 ? images.length : edge - 1)
    setHasShift(false)
    setHasDelayed(false)
    setCount(edge === 0 ? 5 : count + width + margin * 2)
    return
  }, [count, images.length, margin, select, edge, width])

  // turn right
  const shiftRight = useCallback(async () => {
    edge !== 5 && setSelect(select === images.length - 1 ? 0 : select + 1)
    setEdge(edge === images.length ? 0 : edge + 1)
    setHasShift(true)
    setHasDelayed(false)
    setCount(edge === 5 ? 0 : count - (width + margin * 2))
    return
  }, [count, images.length, margin, select, edge, width])

  // Wheel function of the desktop.
  const handleScroll = useCallback(
    async (e: WheelEvent) => {
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
      const delta = hasDetail
        ? touch.clientX
        : !vertical
        ? touch.clientX
        : touch.clientY

      if (
        hasDetail
          ? delta < touchStartX
          : !vertical
          ? delta < touchStartX
          : delta < touchStartY
      )
        shiftLeft()
      if (
        hasDetail
          ? delta > touchStartX
          : !vertical
          ? delta > touchStartX
          : delta > touchStartY
      )
        shiftRight()

      hasDetail
        ? setTouchStartX(delta)
        : !vertical
        ? setTouchStartX(delta)
        : setTouchStartY(delta)
    },
    [hasDetail, shiftLeft, shiftRight, touchStartX, touchStartY, vertical]
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
        setHasMove(true)
      }
    },
    [initialX, initialY, isDragging, shiftLeft, shiftRight, vertical]
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

      outer.removeEventListener('wheel', handleScroll)
      outer.removeEventListener('touchstart', handleTouchStart)
      outer.removeEventListener('touchmove', handleTouchMove)

      document.removeEventListener('mouseup', handleMouseUp)
      detail.removeEventListener('mousedown', handleMouseDown)
      outer.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('mousemove', handleMouseMove)

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

  // selected image.
  const frontImage = offsetIndex + images.length + 1

  // keyboard control.
  const handleKeyPress: KeyboardEventHandler<HTMLDivElement> = e => {
    e.key === 'ArrowLeft' && shiftLeft()
    e.key === 'ArrowUp' && shiftLeft()
    e.key === 'ArrowRight' && shiftRight()
    e.key === 'ArrowDown' && shiftRight()
    e.key === 'Enter' && setHasDetail(true)
    e.key === 'Escape' && setHasDetail(false)
  }

  // has after Lazy loading fade transition.
  const [isLoaded, setIsLoaded] = useState(false)
  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const [offsetWide, setOffsetWide] = useState(0)
  const [offsetHeight, setOffsetHeight] = useState(0)

  useLayoutEffect(() => {
    if (edge === 0 && hasShift == true) {
      if (!vertical)
        setOffsetWide(images.length * width + images.length * (margin * 2))
      if (vertical)
        setOffsetHeight(images.length * height + images.length * (margin * 2))
    }
    if (edge === 5 && hasShift == false) {
      if (!vertical) setOffsetWide(0)
      if (vertical) setOffsetHeight(0)
    }
  }, [
    hasDelayed,
    hasShift,
    height,
    images.length,
    margin,
    edge,
    vertical,
    width
  ])

  useLayoutEffect(() => {
    if (edge === 0 && hasShift == false) {
      shiftLeft()
    }
    if (edge === 0 && hasShift == true) {
      shiftRight()
    }
  }, [hasDelayed, hasShift, shiftLeft, shiftRight, edge])

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
            width: !vertical
              ? images.length * (width + margin * 2) * 6 + controller + 'px'
              : width + controller,
            height: vertical
              ? images.length * (height + margin * 2) * 6 + controller + 'px'
              : height + controller,
            flexDirection: vertical ? 'column' : 'row'
          }}
          animate={{
            x: !vertical ? count + offsetWide : 0,
            y: vertical ? count + offsetHeight : 0
          }}
          transition={transition}
        >
          {images.map((image, index) => {
            const hasSelect = images[select] == images[index]
            const hasEdge = () => {
              for (let i = edge; i <= images.length - 1; i++) {
                if (images[i] === images[index]) {
                  return true
                }
              }
              return false
            }

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
                role={'button'}
                aria-label="click and scale image"
                draggable={false}
                loading={loading}
                animate={{
                  x:
                    !vertical && hasEdge()
                      ? -(images.length * width + images.length * (margin * 2))
                      : 0,
                  y:
                    vertical && hasEdge()
                      ? -(images.length * height + images.length * (margin * 2))
                      : 0,
                  scale: hasSelect ? animate?.selectScale : animate?.scale,
                  rotate: hasSelect ? animate?.selectRotate : animate?.rotate,
                  rotateY: hasSelect
                    ? animate?.selectRotateY
                    : animate?.rotateY,
                  rotateX: hasSelect
                    ? animate?.selectRotateX
                    : animate?.rotateX,
                  rotateZ: hasSelect
                    ? animate?.selectRotateZ
                    : animate?.rotateZ,
                  opacity:
                    images[
                      images[edge] === images[images.length] ? 0 : edge
                    ] === images[index] || images[edge - 1] === images[index]
                      ? 0
                      : hasSelect
                      ? hasDetail
                        ? 0
                        : animate?.selectOpacity
                      : animate?.opacity
                }}
                initial={{
                  scale: hasSelect ? initial?.selectScale : initial?.scale,
                  rotate: hasSelect ? animate?.selectRotate : animate?.rotate,
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
                  hasSelect && detail && !hasMove && setHasDetail(true)
                  if (!hasDelayed) return
                  images[select - 1] === images[index] ||
                  (select === 0 && images[images.length - 1] === images[index])
                    ? shiftLeft()
                    : images[select + 1] === images[index] ||
                      (select === images.length - 1 &&
                        images[0] === images[index])
                    ? shiftRight()
                    : null
                }}
                style={{
                  zIndex: hasSelect ? frontImage : zIndex,
                  width: width + 'px',
                  height: height + 'px',
                  margin: vertical
                    ? margin + 'px' + ' 0'
                    : '0 ' + margin + 'px',
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
        </m.div>
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
          transition={detailTransition}
          zIndex={frontImage}
        />
        <>{select}</>
      </div>
    </LazyMotion>
  )
}
