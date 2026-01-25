
'use client'

import styles from './AboutTunnelIntro.module.scss'

type AboutTunnelIntroProps = {
  motionEnabled?: boolean
}

export function AboutTunnelIntro({ motionEnabled = true }: AboutTunnelIntroProps) {
  return (
    <div
      className={styles['about-tunnel']}
      data-about-tunnel
      data-motion={motionEnabled ? 'on' : 'off'}
    >
      <div className={styles['about-tunnel__bg']}>
        <div
          className={`${styles['about-tunnel__layer']} ${styles['about-tunnel__layer--structure']}`}
          data-tunnel-structure
        >
          <img
            className={styles['about-tunnel__img']}
            src="/about/tunnel-structure.svg"
            alt=""
          />
        </div>
        <div
          className={`${styles['about-tunnel__layer']} ${styles['about-tunnel__layer--grid']}`}
          data-tunnel-grid
        >
          <img
            className={styles['about-tunnel__img']}
            src="/about/tunnel-grid.svg"
            alt=""
          />
        </div>
      </div>

      <div className={styles['about-tunnel__screenWrap']} data-about-screen>
        <div className={styles['about-tunnel__screen']}>
          <h2 className={styles['about-tunnel__screenTitle']}>ABOUT</h2>
        </div>
      </div>
    </div>
  )
}
