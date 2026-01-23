import styles from './About.module.scss'
import { AboutTunnelIntro } from './AboutTunnelIntro'


export function About() {
  return (
    <section className={styles.about} data-section="about">
      <div className={styles.about__tunnel} aria-hidden="true">
        <AboutTunnelIntro />
      </div>
      <div className={styles.about__content} data-anim="about-content">
        <h2 className={styles.about__title}>About</h2>
        <p className={styles.about__text}>About section placeholder</p>
      </div>
    </section>
  )
}
