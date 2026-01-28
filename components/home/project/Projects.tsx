'use client'

import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { projects } from '@/lib/projects-data'
import Image from 'next/image'
import { initProjectsAnim } from './project.anim'
import styles from './Projects.module.scss'

export function Projects() {
  const rootRef = useRef<HTMLElement | null>(null)

  useLayoutEffect(() => {
    if (!rootRef.current) return
    let cleanup: (() => void) | undefined

    const ctx = gsap.context(() => {
      cleanup = initProjectsAnim(rootRef.current!)
    }, rootRef)

    return () => {
      cleanup?.()
      ctx.revert()
    }
  }, [])

  return (
    <section className={styles.projects} data-section="projects" ref={rootRef}>
     
     <header className={styles.projects__header} data-projects-header>
        <div
          className={styles.projects__headerFrame}
          data-frame="title"
        >
          <img
            src="/title-frame.svg"
            className={styles.projects__headerSvg}
            alt=""
            aria-hidden="true"
          />
        </div>
        <h2
          className={styles.projects__headerTitle}
          data-text="title"
          data-crt-text="PROJECTS"
        >
          PROJECTS
        </h2>
      </header>


        <div className={styles.projects__list}>
          {projects.map((project, index) => {
            const overview = project.shortDescription
            const imageSrc = `/projects/${project.src}`
            const projectHref = project.websiteUrl ?? `/projects/${project.slug}`
            const isExternal = Boolean(project.websiteUrl)
            const projectIndex = String(index + 1).padStart(2, '0')

            return (
              <article
                key={project.id}
                className={styles.projects__card}
                data-project-card
              >
              <div className={styles.projects__cardInner}>
                <div className={styles.projects__imageContainer}>
                    <div className={styles.projects__imageFrame} data-frame="image">
                      <img
                        src="/project-image-frame.svg"
                        className={styles.projects__frameSvg}
                        alt=""
                        aria-hidden="true"
                      />
                    </div>
                    <div className={styles.projects__imageWrap} data-project-image>
                      <Image
                        src={imageSrc}
                        alt={project.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 42vw"
                        className={styles.projects__imageMedia}
                      />
                    </div>
                  </div>
                  <div className={styles.projects__contentContainer}>

                  <span className={`${styles.projects__index} u-linkBracketHover`}>
                      <span>{projectIndex}</span>
                    </span>
                  <a
                    className={`${styles.projects__contentLink}`}
                    href={projectHref}
                    target={isExternal ? '_blank' : undefined}
                    rel={isExternal ? 'noopener noreferrer' : undefined}
                    aria-label={`View ${project.name}`}
                  >
                   
                    <div className={styles.projects__cardFrame} data-frame="project">
                      <img
                        src="/project-frame.svg"
                        className={styles.projects__frameSvg}
                        alt=""
                        aria-hidden="true"
                      />
                    </div>
                    <div className={styles.projects__titleWrapper}>
                      <h3
                        className={`${styles.projects__titleText} ${styles['projects__titleText--card']}`}
                        data-text="title"
                        data-crt-text={project.name}
                      >
                        {project.name}
                      </h3>
                      <div className={styles.projects__titleLine} data-title-line></div>
                    </div>

                    <div className={styles.projects__detailContainer}>
                    <div className={styles.projects__detailRow}>
                      <span className={styles.projects__detailLabel}>
                        ROLES::
                      </span>
                      <p
                        className={styles.projects__roles}
                        data-text="roles"
                        data-crt-text={project.role}
                      >
                        {project.role}
                      </p>
                    </div>
                    <div className={styles.projects__detailRow}>
                      <span className={styles.projects__detailLabel}>
                        OVERVIEW::
                      </span>
                      <p
                        className={styles.projects__overview}
                        data-text="overview"
                        data-crt-text={overview}
                      >
                        {overview}
                      </p>
                    </div>
                    </div>

                   

                    <div className={styles.projects__cta}>
                      <span
                        className={`${styles.projects__ctaText} u-linkBracketHover`}
                        data-text="viewcase"
                        data-crt-text="View case"
                      >
                        View case
                      </span>
                    </div>
                  </a>

                  </div>
                </div>
              </article>
            )
          })}
        </div>
    
    </section>
  )
}
