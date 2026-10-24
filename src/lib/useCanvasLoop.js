import { useEffect, useRef } from 'react'

/**
 * Runs `draw(ctx, width, height, timeSeconds)` on a HiDPI canvas.
 * The loop pauses while the canvas is off-screen or the tab is hidden, and draws a
 * single static frame when the user prefers reduced motion.
 */
export function useCanvasLoop(draw) {
  const ref = useRef(null)
  const drawRef = useRef(draw)
  drawRef.current = draw

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let w = 0
    let h = 0
    let raf = 0
    let visible = true
    const start = performance.now()

    const frame = (now) => {
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const dpr = canvas.width / Math.max(1, w)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      drawRef.current(ctx, w, h, reduced ? 4 : (now - start) / 1000)
    }
    const loop = (now) => {
      frame(now)
      raf = requestAnimationFrame(loop)
    }
    const run = () => {
      cancelAnimationFrame(raf)
      if (reduced) frame(performance.now())
      else if (visible && !document.hidden) raf = requestAnimationFrame(loop)
    }

    const ro = new ResizeObserver(([entry]) => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = entry.contentRect.width
      h = entry.contentRect.height
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      frame(performance.now())
    })
    ro.observe(canvas)
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      run()
    })
    io.observe(canvas)
    document.addEventListener('visibilitychange', run)
    run()
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      document.removeEventListener('visibilitychange', run)
    }
  }, [])

  return ref
}
