'use client'

import { useCallback, useState } from 'react'
import Image from 'next/image'

import { useCurrentTime } from '@/lib/hooks/useCurrentTime'
import { GlitchedImage } from '@/src/components/media/GlitchedImage/GlitchedImageClient'
import styles from './Hero.module.scss'

export function Hero() {
  const { timeString, timezone } = useCurrentTime()
  const [mouthReady, setMouthReady] = useState(false)
  const [eyesReady, setEyesReady] = useState(false)

  const handleMouthReady = useCallback(() => setMouthReady(true), [])
  const handleEyesReady = useCallback(() => setEyesReady(true), [])

  return (
    <section className={styles.hero} data-section="hero">
      <div className={styles.hero__frame}>
        <header className={styles.hero__top}>
          <h3 className={styles.hero__mark}>WY</h3>
          <div className={styles.hero__status}>
            <span className={styles.hero__statusDot} aria-hidden="true" />
            <small className={styles.hero__statusText}>Available for work</small>
          </div>
        </header>

        <div className={styles.hero__content}>
          <div className={styles.hero__contentInner}>
          <div className={styles.hero__row}>
            <h1 className={styles.hero__title}>
              <span className={styles.hero__titleText}>Design</span>
            </h1>
            <div className={styles.hero__imageContainer}>
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
                hoverBoost={1.4}
                swapBaselineBoost
                fill
                onReady={handleEyesReady}
              />
            </div>
          </div>

          <div className={styles.hero__row}>
            <div className={styles.hero__imageContainer}>
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
                hoverBoost={1.4}
                swapBaselineBoost
                fill
                onReady={handleMouthReady}
              />
            </div>
            <h1 className={styles.hero__title}>
              <span className={styles.hero__titleText}>Engineer</span>
            </h1>
          </div>

          <div className={styles.hero__row}>
            <h1 className={styles.hero__title}>
              <span className={styles.hero__titleText}>Wenting</span>
            </h1>
            <span className={styles.hero__atSymbol}>@</span>
            <h1 className={styles.hero__title}>
              <span className={styles.hero__titleText}>Yong</span>
            </h1>
          </div>
          </div>
        
        <h2 className={styles.hero__subtitle}>
          Crafting immersive web experiences & digital interfaces
        </h2>
        </div>
   
        <div className={styles.hero__bottom}>
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
    </section>
  )
}
