import { InteractiveGif } from '@/components/media/InteractiveGif/InteractiveGifClient'
import styles from './Projects.module.scss'

export function Projects() {
  return (
    <section className={styles.projects} data-section="projects">
      <div className={styles.projects__content}>
        <h2 className={styles.projects__title}>Projects</h2>
        <p className={styles.projects__text}>Projects section placeholder</p>
        {/* Add enough content to make it scrollable > 100vh */}
        <div className={styles.projects__spacer}>
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className={styles.projects__item}>
              <p>Project item {i + 1}</p>
            </div>
          ))}
        </div>
        <div className={styles.projects__gifWrap}>
          <InteractiveGif
            className={styles.projects__gif}
            fill
            sourceType="video"
            src="/ascii-art.webm"
          />
        </div>
      </div>
    </section>
  )
}
