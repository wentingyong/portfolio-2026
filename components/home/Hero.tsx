'use client'

import Image from 'next/image'
import { Nav } from '@/components/shell/Nav'
import { useCurrentTime } from '@/lib/hooks/useCurrentTime'
import styles from './Hero.module.scss'

export function Hero() {
  const { timeString, timezone } = useCurrentTime()

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
                className={styles.hero__image}
                src="/hero-eyes.png"
                alt=""
                fill
                sizes="(max-width: 768px) 100vw, 60vw"
                priority
              />
            </div>
          </div>

          <div className={styles.hero__row}>
            <div className={styles.hero__imageContainer}>
              <Image
                className={styles.hero__image}
                src="/hero-mouth.png"
                alt=""
                fill
                sizes="(max-width: 768px) 100vw, 60vw"
                priority
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
          <Nav />
        <div className={styles.hero__bottom}>
          <div className={styles.hero__meta}>
            <small className={styles.hero__metaItem}>
              [Comm links:{' '}
              <a
                className={styles.hero__metaLink}
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>{' '}
              |{' '}
              <a
                className={styles.hero__metaLink}
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn
              </a>{' '}
              |{' '}
              <a
                className={styles.hero__metaLink}
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                X
              </a>
              ]
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
