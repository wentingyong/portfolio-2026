'use client'

import { useCallback, useLayoutEffect, useRef, useState } from 'react'
import Image from 'next/image'

import { useCurrentTime } from '@/lib/hooks/useCurrentTime'
import { GlitchedImage } from '@/components/media/GlitchedImage/GlitchedImageClient'
import styles from './Hero.module.scss'

export function Hero() {
  const { timeString, timezone } = useCurrentTime()
  const heroRef = useRef<HTMLElement | null>(null)
  const [mouthReady, setMouthReady] = useState(false)
  const [eyesReady, setEyesReady] = useState(false)

  const handleMouthReady = useCallback(() => setMouthReady(true), [])
  const handleEyesReady = useCallback(() => setEyesReady(true), [])

  useLayoutEffect(() => {
    const heroEl = heroRef.current
    if (!heroEl) return

    const updateStripWidths = () => {
      const rows = Array.from(
        heroEl.querySelectorAll('[data-hero-row]'),
      ) as HTMLElement[]

      rows.forEach((row) => {
        const text = row.querySelector('[data-hero-row-text]') as HTMLElement | null
        const strip = row.querySelector('[data-hero-row-strip]') as HTMLElement | null
        if (!text || !strip) return
        const width = Math.ceil(text.getBoundingClientRect().width)
        strip.style.setProperty('--hero-row-text-width', `${width}px`)
      })
    }

    updateStripWidths()

    const textNodes = Array.from(
      heroEl.querySelectorAll('[data-hero-row-text]'),
    ) as HTMLElement[]

    if (textNodes.length === 0) return

    const resizeObserver = new ResizeObserver(() => {
      updateStripWidths()
    })

    textNodes.forEach((node) => resizeObserver.observe(node))
    window.addEventListener('resize', updateStripWidths)

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener('resize', updateStripWidths)
    }
  }, [])

  return (
    <section className={styles.hero} data-section="hero" ref={heroRef}>
      <div className={styles.hero__frame} data-hero-rest>
        <header className={styles.hero__top} data-hero-fade>
          <h3 className={styles.hero__mark}>WY</h3>
          <div className={styles.hero__status}>
            <span className={styles.hero__statusDot} aria-hidden="true" />
            <small className={styles.hero__statusText}>Available for work</small>
          </div>
        </header>

        <div className={styles.hero__content}>
          <div className={styles.hero__contentInner}>
            <div className={styles.hero__stripWrapper}>
              <div className={styles.hero__row}>
                <h1 className={styles.hero__title} data-hero-fade>
                  <span className={styles.hero__titleText}>Design</span>
                </h1>
                <div className={styles.hero__imageContainer} data-hero-eyes-origin>
                  <Image
                    className={`${styles.hero__image} ${styles.hero__imageBase} ${
                      eyesReady ? styles['hero__imageBase--hidden'] : ''
                    }`}
                    src="/hero-eyes.png"
                    alt=""
                    fill
                    sizes="(max-width: 768px) 100vw, 60vw"
                    priority
                  />
                  <GlitchedImage
                    src="/hero-eyes.png"
                    trigger="hover"
                    clickImpulse
                    preset="medium"
                    baseline={0.6}
                    maxBoost={0.95}
                    hoverBoost={2}
                    swapBaselineBoost
                    fill
                    onReady={handleEyesReady}
                  />
                </div>
              </div>

              <div className={styles.hero__row} data-hero-row>
                <div
                  className={styles.hero__imageContainer}
                  data-hero-row-strip
                  data-hero-fade
                >
                  <Image
                    className={`${styles.hero__image} ${styles.hero__imageBase} ${
                      mouthReady ? styles['hero__imageBase--hidden'] : ''
                    }`}
                    src="/hero-mouth.png"
                    alt=""
                    fill
                    sizes="(max-width: 768px) 100vw, 60vw"
                    priority
                  />
                  <GlitchedImage
                    src="/hero-mouth.png"
                    trigger="hover"
                    clickImpulse
                    preset="medium"
                    baseline={0.6}
                    maxBoost={0.95}
                    hoverBoost={2}
                    swapBaselineBoost
                    fill
                    onReady={handleMouthReady}
                  />
                </div>
                <h1 className={styles.hero__title} data-hero-fade data-hero-row-text>
                  <span className={styles.hero__titleText}>Engineer</span>
                </h1>
              </div>
            </div>

            <div className={styles.hero__row} data-hero-fade>
              <h1 className={styles.hero__title}>
                <span className={styles.hero__titleText}>Wenting</span>
              </h1>
              <span className={styles.hero__atSymbol}>@</span>
              <h1 className={styles.hero__title}>
                <span className={styles.hero__titleText}>Yong</span>
              </h1>
            </div>
          </div>

          <h2 className={styles.hero__subtitle} data-hero-fade>
            Crafting immersive web experiences & digital interfaces
          </h2>
        </div>

        <div className={styles.hero__bottom} data-hero-fade>
          <div className={styles.hero__meta}>
            <small className={styles.hero__metaItem}>
              Comm links:{' '}
              <a
                className={`${styles.hero__metaLink} u-linkBracketHover`}
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>GitHub</span>
              </a>{' '}
              |{' '}
              <a
                className={`${styles.hero__metaLink} u-linkBracketHover`}
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>LinkedIn</span>
              </a>{' '}
              |{' '}
              <a
                className={`${styles.hero__metaLink} u-linkBracketHover`}
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>X</span>
              </a>
              
            </small>
          </div>
            <small className={styles.hero__bottomText}>Version: ©2026</small>
            <small className={styles.hero__bottomText}>
              Location: Canada/{timezone} {timeString}
            </small>
        </div>
      </div>
      <div className={styles.hero__composeLayer} data-hero-compose aria-hidden="true">
        <div className={styles.hero__composeStack} data-hero-compose-stack>
          <div className={styles.hero__strip} data-hero-eyes>
            <Image
              className={styles.hero__stripImage}
              src="/hero-eyes.png"
              alt=""
              fill
              sizes="(max-width: 768px) 90vw, 960px"
              priority
            />
              <GlitchedImage
                src="/hero-eyes.png"
                trigger="hover"
                clickImpulse
                preset="medium"
                baseline={0.6}
                maxBoost={0.95}
                hoverBoost={1.4}
                swapBaselineBoost
                fill
              />
          </div>
        </div>
      </div>
    </section>
  )
}
