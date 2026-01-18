import styles from './Hero.module.scss'

export function Hero() {
  return (
    <section className={styles.hero} data-section="hero">
      <div className={styles.hero__content}>
        <h1 className={styles.hero__title}>Hero</h1>
        <p className={styles.hero__text}>Hero section placeholder</p>
      </div>
    </section>
  )
}
