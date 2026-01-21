import Link from 'next/link'
import styles from './Nav.module.scss'

export function Nav() {
  return (
    <nav className={styles.nav} aria-label="Primary">
      <span className={styles.nav__label}>Nav:</span>
      <ul className={styles.nav__list}>
        <li>
          <Link className={styles.nav__link} href="/">
            [00 Home]
          </Link>
        </li>
        <li>
          <Link className={styles.nav__link} href="/about">
            01 About
          </Link>
        </li>
        <li>
          <Link className={styles.nav__link} href="/projects">
            02 Projects
          </Link>
        </li>
        <li>
          <Link className={styles.nav__link} href="/contact">
            03 Contact
          </Link>
        </li>
      </ul>
    </nav>
  )
}
