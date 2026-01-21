import type { CSSProperties } from 'react'
import styles from './Tokens.module.scss'

const typeScale = [
  { token: '--fs-hero', label: 'Hero', sample: 'Design Engineer', family: 'display' },
  { token: '--fs-h1', label: 'H1', sample: 'Portfolio Systems', family: 'display' },
  { token: '--fs-h2', label: 'H2', sample: 'Section Heading', family: 'display' },
  { token: '--fs-h3', label: 'H3', sample: 'Subheading', family: 'display' },
  {
    token: '--fs-body',
    label: 'Body',
    sample: 'The quick brown fox jumps over the lazy dog.',
    family: 'body',
  },
  { token: '--fs-small', label: 'Small', sample: 'Micro label text', family: 'body' },
  { token: '--fs-nav', label: 'Nav', sample: 'Navigation', family: 'body' },
]

const spacingScale = [
  { token: '--space-2xs', label: '2XS' },
  { token: '--space-xs', label: 'XS' },
  { token: '--space-sm', label: 'SM' },
  { token: '--space-md', label: 'MD' },
  { token: '--space-lg', label: 'LG' },
  { token: '--space-xl', label: 'XL' },
  { token: '--space-2xl', label: '2XL' },
  { token: '--gutter', label: 'Gutter' },
  { token: '--section-gap', label: 'Section gap' },
  { token: '--section-pad-y', label: 'Section pad Y' },
]

const borderScale = [
  { token: '--border-hairline', label: 'Hairline' },
  { token: '--border-thin', label: 'Thin' },
  { token: '--border-thick', label: 'Thick' },
]

const colorTokens = [
  { token: '--c-bg', label: 'Background' },
  { token: '--c-paper', label: 'Paper' },
  { token: '--c-ink', label: 'Ink' },
  { token: '--c-accent', label: 'Accent' },
  { token: '--c-green', label: 'Status' },
  { token: '--c-border', label: 'Border' },
]

const tokenSizeStyle = (token: string) =>
  ({ '--token-size': `var(${token})` } as CSSProperties)
const tokenBorderStyle = (token: string) =>
  ({ '--token-border': `var(${token})` } as CSSProperties)
const tokenColorStyle = (token: string) =>
  ({ '--swatch-color': `var(${token})` } as CSSProperties)

export default function TokensPage() {
  return (
    <main className={styles.tokens}>
      <header className={styles.tokens__header}>
        <h1 className={styles.tokens__title}>Token Preview</h1>
        <p className={styles.tokens__subtitle}>
          Live view of the global design tokens (fluid type, spacing, borders, and colors).
        </p>
      </header>

      <section className={styles.tokens__section}>
        <h2 className={styles.tokens__heading}>Type scale</h2>
        <div className={styles.tokens__stack}>
          {typeScale.map((item) => {
            const sampleClass =
              item.family === 'body'
                ? `${styles.tokens__typeSample} ${styles['tokens__typeSample--body']}`
                : styles.tokens__typeSample

            return (
              <div className={styles.tokens__typeItem} key={item.token}>
                <div className={styles.tokens__meta}>
                  <span className={styles.tokens__label}>{item.label}</span>
                  <span className={styles.tokens__token}>{item.token}</span>
                </div>
                <div className={sampleClass} style={{ fontSize: `var(${item.token})` }}>
                  {item.sample}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <section className={styles.tokens__section}>
        <h2 className={styles.tokens__heading}>Spacing</h2>
        <div className={styles.tokens__grid}>
          {spacingScale.map((item) => (
            <div
              className={styles.tokens__spacingItem}
              key={item.token}
              style={tokenSizeStyle(item.token)}
            >
              <div className={styles.tokens__spacingBox} />
              <div className={styles.tokens__meta}>
                <span className={styles.tokens__label}>{item.label}</span>
                <span className={styles.tokens__token}>{item.token}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.tokens__section}>
        <h2 className={styles.tokens__heading}>Borders</h2>
        <div className={styles.tokens__grid}>
          {borderScale.map((item) => (
            <div
              className={styles.tokens__borderItem}
              key={item.token}
              style={tokenBorderStyle(item.token)}
            >
              <div className={styles.tokens__borderLine} />
              <div className={styles.tokens__meta}>
                <span className={styles.tokens__label}>{item.label}</span>
                <span className={styles.tokens__token}>{item.token}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.tokens__section}>
        <h2 className={styles.tokens__heading}>Colors</h2>
        <div className={styles.tokens__grid}>
          {colorTokens.map((item) => (
            <div
              className={styles.tokens__colorItem}
              key={item.token}
              style={tokenColorStyle(item.token)}
            >
              <div className={styles.tokens__colorSwatch} />
              <div className={styles.tokens__meta}>
                <span className={styles.tokens__label}>{item.label}</span>
                <span className={styles.tokens__token}>{item.token}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
