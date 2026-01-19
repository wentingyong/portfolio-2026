'use client'

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
          <div className={styles.hero__row}>
            <h1 className={styles.hero__title}>Design</h1>
            <div className={styles.hero__imageContainer}>
              <img
                className={styles.hero__image}
                src="/hero-eyes.png"
                alt=""
                loading="eager"
                decoding="async"
              />
            </div>
          </div>

          <div className={styles.hero__row}>
            <div className={styles.hero__imageContainer}>
              <img
                className={styles.hero__image}
                src="/hero-mouth.png"
                alt=""
                loading="eager"
                decoding="async"
              />
            </div>
            <h1 className={styles.hero__title}>Engineer</h1>
          </div>

          <div className={styles.hero__row}>
            <h1 className={styles.hero__title}>Wenting</h1>
            <span className={styles.hero__atSymbol}>@</span>
            <h1 className={styles.hero__title}>Yong</h1>
          </div>
        </div>

        <h2 className={styles.hero__subtitle}>
          Crafting immersive web experiences & digital interfaces
        </h2>

        <div className={styles.hero__bottom}>
          <Nav />
          <div className={styles.hero__meta}>
            <small className={styles.hero__metaItem}>
              Comm links:{' '}
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
            </small>
            <small className={styles.hero__metaItem}>Version: ©2025</small>
            <small className={styles.hero__metaItem}>
              Location: Canada/{timezone} {timeString}
            </small>
          </div>
        </div>
      </div>
    </section>
  )
}
