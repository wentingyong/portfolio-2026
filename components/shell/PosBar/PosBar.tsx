'use client'

import styles from './PosBar.module.scss'

interface PosSectionItem {
  id: string
  posIndex: string
  posLabel: string
}

interface PosBarProps {
  pageIndex: string
  pageLabel: string
  sections: PosSectionItem[]
  activeSectionId: string
  onNavigate: (id: string) => void
}

export function PosBar({
  pageIndex,
  pageLabel,
  sections,
  activeSectionId,
  onNavigate,
}: PosBarProps) {
  return (
    <nav className={styles.pos} aria-label="Position status">
      <span className={styles.pos__label}>POS:</span>
      <span className={styles.pos__location}>
        {pageIndex} {pageLabel}
      </span>
      {sections.length > 0 && (
        <>
          <span className={styles.pos__divider}>/</span>
          <ul className={styles.pos__list}>
            {sections.map((item, index) => {
              const isActive = item.id === activeSectionId
              return (
                <li key={item.id} className={styles.pos__item}>
                  <button
                    type="button"
                    className={`${styles.pos__link} ${isActive ? styles['pos__link--active'] : ''}`}
                    onClick={() => onNavigate(item.id)}
                    aria-current={isActive ? 'location' : undefined}
                  >
                    {isActive && (
                      <span className={`${styles.pos__cursor} cursor u-cursorBreath`} aria-hidden="true">
                          ▶
                      </span>
                    )}
                    <span
                      className={`${styles.pos__linkText} u-linkBracketHover ${
                        isActive ? 'u-cursorBreath' : ''
                      }`}
                    >
                      {item.posIndex} {item.posLabel}
                    </span>
                  </button>
                  {index < sections.length - 1 && (
                    <span className={styles.pos__separator} aria-hidden="true">
                      |
                    </span>
                  )}
                </li>
              )
            })}
          </ul>
        </>
      )}
    </nav>
  )
}
