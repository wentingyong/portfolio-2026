import { gsap } from 'gsap'

import styles from './crtTypewriter.module.scss'

type TypeCrtOptions = {
  speed?: number
  scrambleFrames?: number
  scrambleChars?: string
  caret?: boolean
}

const DEFAULT_SCRAMBLE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%&*+-=?'

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

const randomChars = (length: number, alphabet: string) => {
  const count = Math.max(1, length)
  let output = ''
  for (let i = 0; i < count; i += 1) {
    output += alphabet[Math.floor(Math.random() * alphabet.length)]
  }
  return output
}

export const typeCrt = (el: HTMLElement, options: TypeCrtOptions = {}) => {
  const original =
    el.getAttribute('data-crt-text') ?? el.textContent ?? ''
  const text = original.trimEnd()

  el.setAttribute('data-crt-text', text)
  el.setAttribute('aria-label', text)
  el.classList.add(styles.crt)

  const tl = gsap.timeline()

  if (prefersReducedMotion()) {
    tl.add(() => {
      el.textContent = text
    })
    return tl
  }

  const scrambleFrames = Math.max(0, options.scrambleFrames ?? 2)
  const speed = Math.max(0.012, options.speed ?? 0.028)
  const alphabet = options.scrambleChars ?? DEFAULT_SCRAMBLE
  const enableCaret = options.caret !== false
  let textNode: HTMLSpanElement | null = null

  const ensureNodes = () => {
    el.textContent = ''
    textNode = document.createElement('span')
    textNode.setAttribute('data-crt-inner', 'true')
    el.appendChild(textNode)

    if (enableCaret) {
      const caretNode = document.createElement('span')
      caretNode.className = styles.crtCaret
      caretNode.setAttribute('data-crt-caret', 'true')
      caretNode.setAttribute('aria-hidden', 'true')
      el.appendChild(caretNode)
    }
  }

  const chars = text.split('')

  tl.add(() => {
    if (!textNode) {
      ensureNodes()
    }
    el.setAttribute('data-crt-typing', 'true')
  })

  for (let i = 0; i < scrambleFrames; i += 1) {
    tl.add(() => {
      if (!textNode) return
      textNode.textContent = randomChars(Math.min(6, chars.length || 6), alphabet)
    })
    tl.to({}, { duration: 0.03 })
  }

  chars.forEach((char, index) => {
    tl.add(() => {
      if (!textNode) return
      textNode.textContent = chars.slice(0, index + 1).join('')
    })
    tl.to({}, { duration: char === ' ' ? speed * 0.6 : speed })
  })

  tl.add(() => {
    el.removeAttribute('data-crt-typing')
  })

  return tl
}
