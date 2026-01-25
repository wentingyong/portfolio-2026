'use client'

import { forwardRef } from 'react'
import Link from 'next/link'
import type { CSSProperties } from 'react'
import styles from './MenuPanel.module.scss'

interface MenuItem {
  id: string
  index: string
  label: string
  href: string
}

interface MenuPanelProps {
  isOpen: boolean
  navItems: MenuItem[]
  activeId: string
}

const commsItems = [
  { id: 'email', label: 'EMAIL', href: 'mailto:ywtzoe@gmail.com' },
  { id: 'linkedin', label: 'LINKEDIN', href: 'https://linkedin.com' },
  { id: 'github', label: 'GITHUB', href: 'https://github.com' },
  { id: 'x', label: 'X', href: 'https://x.com' },
]

export const MenuPanel = forwardRef<HTMLElement, MenuPanelProps>(
  ({ isOpen, navItems, activeId }, ref) => {
    return (
      <nav
        ref={ref}
        id="crt-menu-panel"
        className={`${styles.panel} crt-frame`}
        data-open={isOpen}
        aria-hidden={!isOpen}
        aria-label="Menu panel"
      >
      <div className={`${styles.panel__line} crt-frame__line`} aria-hidden="true" />
      <div className={styles.panel__content}>
        <div className={styles.panel__block}>
         
            <span className={styles.panel__title}>NAV:</span>
            <ul className={styles.panel__list}>
            {navItems.map((item) => {
              const isActive = activeId === item.id
              return (
                <li key={item.id} className={styles.panel__item}>
                  <Link
                    className={`${styles.panel__link} ${isActive ? styles['panel__link--active'] : ''}`}
                    href={item.href}
                    aria-current={isActive ? 'page' : undefined}
                    tabIndex={isOpen ? 0 : -1}
                  >
                    {isActive && (
                      <span className={`${styles.panel__cursor} cursor u-cursorBreath`} aria-hidden="true">
                         ▶
                      </span>
                    )}
                    <span className={`${styles.panel__linkText} u-linkBracketHover`}>
                      <span
                        className={`${styles.panel__linkTextInner} ${
                          isActive ? ' u-cursorBreath' : ''
                        }`}
                      >
                        {item.index} {item.label.toUpperCase()}
                      </span>
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>
      
          
        </div>

        <div className={styles.panel__block}>
          <span className={styles.panel__title}>COMMS:</span>
          <ul className={styles.panel__list}>
            {commsItems.map((item) => (
              <li key={item.id} className={styles.panel__item}>
                <a
                  className={`${styles.panel__link} ${styles['panel__link--plain']} u-linkBracketHover`}
                  href={item.href}
                  target={item.href.startsWith('http') ? '_blank' : undefined}
                  rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  tabIndex={isOpen ? 0 : -1}
                >
                  <span className={styles.panel__linkText}>{item.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* <div className={styles.panel__download}>
          <a
            className={`${styles.panel__downloadLink} u-linkBracketHover`}
            href="/cv/wenting-yong-cv.pdf"
            download
            tabIndex={isOpen ? 0 : -1}
          >
            <span>DOWNLOAD CV</span>
            <span className={styles.panel__chevrons} aria-hidden="true">
              {Array.from({ length: 4 }).map((_, index) => (
                <span key={index} className={styles.panel__chevron} style={{ '--i': index } as CSSProperties}>
                  &gt;
                </span>
              ))}
            </span>
          </a>
        </div> */}
      </div>
    </nav>
  )
  },
)

MenuPanel.displayName = 'MenuPanel'
