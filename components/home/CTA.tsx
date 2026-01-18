import styles from './CTA.module.scss'

export function CTA() {
  return (
    <section className={styles.cta} data-section="cta">
      <div className={styles.cta__content}>
        <h2 className={styles.cta__title}>CTA</h2>
        <p className={styles.cta__text}>CTA section placeholder</p>
      </div>
    </section>
  )
}
