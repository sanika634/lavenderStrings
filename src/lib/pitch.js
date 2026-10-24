/**
 * Autocorrelation pitch detector (time-domain). Returns frequency in Hz or -1 when
 * the signal is too quiet or has no clear periodicity.
 */
export function detectPitch(buf, sampleRate) {
  let size = buf.length
  let rms = 0
  for (let i = 0; i < size; i++) rms += buf[i] * buf[i]
  rms = Math.sqrt(rms / size)
  if (rms < 0.012) return -1

  // Trim quiet edges to reduce artefacts.
  let r1 = 0
  let r2 = size - 1
  const thres = 0.2
  for (let i = 0; i < size / 2; i++) if (Math.abs(buf[i]) < thres) { r1 = i; break }
  for (let i = 1; i < size / 2; i++) if (Math.abs(buf[size - i]) < thres) { r2 = size - i; break }
  const b = buf.slice(r1, r2)
  size = b.length

  const c = new Float32Array(size)
  for (let lag = 0; lag < size; lag++) {
    let sum = 0
    for (let j = 0; j < size - lag; j++) sum += b[j] * b[j + lag]
    c[lag] = sum
  }
  let d = 0
  while (d < size - 1 && c[d] > c[d + 1]) d++
  let maxVal = -1
  let maxPos = -1
  for (let i = d; i < size; i++) {
    if (c[i] > maxVal) {
      maxVal = c[i]
      maxPos = i
    }
  }
  if (maxPos <= 0) return -1
  let t0 = maxPos
  const x1 = c[t0 - 1]
  const x2 = c[t0]
  const x3 = c[t0 + 1] ?? x2
  const a = (x1 + x3 - 2 * x2) / 2
  const bb = (x3 - x1) / 2
  if (a) t0 -= bb / (2 * a)
  const freq = sampleRate / t0
  return freq > 40 && freq < 1400 ? freq : -1
}
