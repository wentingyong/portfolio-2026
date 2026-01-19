import styles from './Nav.module.scss'

export function Nav() {
  return (
    <nav className={styles.nav} aria-label="Primary">
      <span className={styles.nav__label}>Nav:</span>
      <ul className={styles.nav__list}>
        <li>
          <a className={styles.nav__link} href="/">
            [00 Home]
          </a>
        </li>
        <li>
          <a className={styles.nav__link} href="/about">
            01 About
          </a>
        </li>
        <li>
          <a className={styles.nav__link} href="/projects">
            02 Projects
          </a>
        </li>
        <li>
          <a className={styles.nav__link} href="/contact">
            03 Contact
          </a>
        </li>
      </ul>
    </nav>
  )
}
