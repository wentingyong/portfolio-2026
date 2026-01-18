import styles from './Blogs.module.scss'

export function Blogs() {
  return (
    <section className={styles.blogs} data-section="blogs">
      <div className={styles.blogs__content}>
        <h2 className={styles.blogs__title}>Blogs</h2>
        <p className={styles.blogs__text}>Blogs section placeholder</p>
        <div className={styles.blogs__spacer}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className={styles.blogs__item}>
              <p>Blog post {i + 1}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
