export interface NavSectionItem {
  id: string
  posIndex: string
  posLabel: string
}

export interface NavPageItem {
  id: string
  navIndex: string
  navLabel: string
  topLabel: string
  route: string
  sectionItems: NavSectionItem[]
}

export const NAV_PAGES: NavPageItem[] = [
  {
    id: 'home',
    navIndex: '00',
    navLabel: 'Home',
    topLabel: 'HOME',
    route: '/',
    sectionItems: [
      { id: 'hero', posIndex: 'I', posLabel: 'HERO' },
      { id: 'about', posIndex: 'II', posLabel: 'ABOUT' },
      { id: 'projects', posIndex: 'III', posLabel: 'PROJECTS' },
      { id: 'blogs', posIndex: 'IV', posLabel: 'BLOGS' },
      { id: 'cta', posIndex: 'V', posLabel: 'CONNECT' },
    ],
  },
  {
    id: 'about',
    navIndex: '01',
    navLabel: 'About',
    topLabel: 'ABOUT',
    route: '/about',
    sectionItems: [
      { id: 'about-intro', posIndex: 'I', posLabel: 'INTRO' },
      { id: 'about-timeline', posIndex: 'II', posLabel: 'TIMELINE' },
      { id: 'about-skills', posIndex: 'III', posLabel: 'SKILLS' },
    ],
  },
  {
    id: 'projects',
    navIndex: '02',
    navLabel: 'Projects',
    topLabel: 'PROJECTS',
    route: '/projects',
    sectionItems: [
      { id: 'projects-featured', posIndex: 'I', posLabel: 'FEATURED' },
      { id: 'projects-case-studies', posIndex: 'II', posLabel: 'CASE STUDIES' },
      { id: 'projects-archive', posIndex: 'III', posLabel: 'ARCHIVE' },
    ],
  },
  {
    id: 'blogs',
    navIndex: '03',
    navLabel: 'Blogs',
    topLabel: 'BLOGS',
    route: '/blogs',
    sectionItems: [
      { id: 'blogs-latest', posIndex: 'I', posLabel: 'LATEST' },
      { id: 'blogs-topics', posIndex: 'II', posLabel: 'TOPICS' },
      { id: 'blogs-archive', posIndex: 'III', posLabel: 'ARCHIVE' },
    ],
  },
  {
    id: 'contact',
    navIndex: '04',
    navLabel: 'Contact',
    topLabel: 'CONNECT',
    route: '/contact',
    sectionItems: [
      { id: 'contact-intro', posIndex: 'I', posLabel: 'INTRO' },
      { id: 'contact-form', posIndex: 'II', posLabel: 'FORM' },
      { id: 'contact-social', posIndex: 'III', posLabel: 'SOCIAL' },
    ],
  },
]
