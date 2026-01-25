'use client'

import styles from './MenuToggle.module.scss'

interface MenuToggleProps {
  isOpen: boolean
  onToggle: () => void
}

export function MenuToggle({ isOpen, onToggle }: MenuToggleProps) {
  return (
    <button
      type="button"
      className={`${styles.menuToggle} ${isOpen ? styles['menuToggle--open'] : ''} `}
      aria-expanded={isOpen}
      aria-controls="crt-menu-panel"
      onClick={onToggle}
    >
      <span className={styles.menuToggle__glyph} aria-hidden="true">
        +
      </span>
      <span className={`${styles.menuToggle__label} u-linkBracketHover`} aria-hidden={isOpen}>
        <span>MENU</span>
      </span>
      <span className="u-visually-hidden">{isOpen ? 'Close menu' : 'Open menu'}</span>
    </button>
  )
}
