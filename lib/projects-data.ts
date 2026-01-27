// src/utils/projects-data.ts

export type GalleryItemType = {
  image: string;
  title: string;
  description: string;
};

export type ProjectType = {
  id: number;
  name: string;
  slug: string;
  role: string;
  year: number;
  location: string;
  shortDescription: string;
  description: string;
  timeline: string;
  src: string;
  stack: string[];
  tags: string[];
  features: string[];
  gallery: string[];
  galleryWithDescriptions?: GalleryItemType[];
  results: {
    title: string;
    description: string;
  }[];
  details: string;
  websiteUrl?: string;
  prevProject?: {
    name: string;
    slug: string;
  };
  nextProject?: {
    name: string;
    slug: string;
  };
};

export const projects: ProjectType[] = [
  {
    id: 1,
    name: "Bell Summer Games",
    slug: "bell-summer-games",
    role: "Front-end Developer | Creative Developer",
    year: 2022,
    location: "Canada",
    shortDescription: "An event-centric mobile game platform featuring real-time challenges, dynamic questions, participant leaderboards, and an intuitive admin interface.",
    description: `
      <p>Bell Summer Games is an innovative digital event platform designed to enhance engagement and interaction at Bell's corporate events. This comprehensive solution integrates several game modules including trivia challenges, texting games, and real-time leaderboards.</p>
      
      <p>My role as the Front-end Developer involved creating a responsive and engaging user interface that could seamlessly work across different devices. One of the key challenges was implementing real-time functionality that would allow participants to interact simultaneously while maintaining performance.</p>
      
      <p>The platform was built with a focus on scalability, allowing it to handle varying numbers of participants without performance degradation. The admin dashboard gives event facilitators complete control over the game flow, question management, and participant tracking.</p>
    `,
    timeline: "June 2022 - September 2022",
    src: "bell-summer-games.jpg",
    stack: [
      "React", 
      "Redux", 
      "SASS", 
      "Docker", 
      "AWS", 
      "Socket.io", 
      "WebSocket"
    ],
    tags: ["Front-end Development", "Game Platform", "Real-time Interactions"],
    features: [
      "Responsive interface for all device sizes",
      "Real-time trivia game with dynamic questions",
      "Interactive texting game with instant feedback",
      "Live participant leaderboards",
      "TV-optimized game board for large displays",
      "Admin dashboard for game management"
    ],
    gallery: [
      "quiz.jpg",
      "leaderboard.jpg",
      "admin-dashboard.jpg"
    ],
    galleryWithDescriptions: [
      {
        image: "quiz.jpg",
        title: "Interactive Quiz Interface",
        description: "The quiz interface was designed with user engagement as the primary focus. We implemented real-time feedback mechanisms and dynamic question rendering to create an immersive experience that adapts to the user's skill level and maintains high engagement throughout the event."
      },
      {
        image: "leaderboard.jpg",
        title: "Real-time Leaderboard",
        description: "One of the technical highlights was developing a real-time leaderboard system that updates instantly as participants complete challenges. Using WebSocket technology, we ensured that score updates and rankings appear seamlessly without page refreshes, creating healthy competition among participants."
      },
      {
        image: "admin-dashboard.jpg",
        title: "Admin Dashboard",
        description: "The comprehensive admin dashboard gives event facilitators complete control over the game flow. From managing questions to monitoring participant progress in real-time, the intuitive interface allows non-technical staff to run complex interactive events with minimal training."
      }
    ],
    results: [
      {
        title: "Enhanced User Experience",
        description: "Boosted event participation by over 30% compared to previous non-digital formats."
      },
      {
        title: "Seamless Integration",
        description: "Successfully integrated frontend with backend systems for efficient game management."
      },
      {
        title: "Performance Optimization",
        description: "Achieved significant reduction in response times through optimized real-time communications."
      }
    ],
    details: "Crafted 'Big Trivia Games' for Bell, an event-centric mobile game platform featuring real-time challenges, dynamic questions, participant leaderboards, and an intuitive admin interface for facilitators. Implemented a responsive front-end using React, enriched with fluid animations and synchronized real-time interactions.",
    nextProject: {
      name: "The Secret Life of Monster Website",
      slug: "secret-life-of-monsters"
    }
  },
  {
    id: 2,
    name: "The Secret Life of Monsters",
    slug: "secret-life-of-monsters",
    role: "Front-end Developer",
    year: 2023,
    location: "Canada",
    shortDescription: "A responsive interface for Montreal's Quartier des Spectacles' Monster series with immersive animations and bilingual support.",
    description: `
      <p>The Secret Life of Monsters website was developed for Montreal's Quartier des Spectacles to showcase their Monster series exhibition. The project required creating a visually stunning and immersive digital experience that would complement the physical exhibition.</p>
      
      <p>As the Front-end Developer, I focused on creating a responsive interface that would work flawlessly across various device sizes. The implementation of parallax animations and bilingual support (French/English) were key features that enhanced the user experience and accessibility.</p>
      
      <p>One of the technical challenges was optimizing the rendering of high-resolution images across diverse display sizes while maintaining performance and visual quality. Through careful implementation and testing, we achieved a 25% improvement in rendering efficiency.</p>
    `,
    timeline: "October 2022 - December 2022",
    src: "secret-life-of-monsters.jpg",
    stack: [
      "Next.js", 
      "Framer Motion", 
      "Bootstrap"
    ],
    tags: ["Front-end Development", "Interaction"],
    features: [
      "Responsive interface for all device sizes",
      "Parallax animations for immersive experience",
      "Bilingual support (French/English)",
      "Optimized high-resolution image rendering",
      "Interactive exhibition map"
    ],
    gallery: [
      "homepage.jpg",
      "exhibition.jpg",
      "monster-detail.jpg"
    ],
    galleryWithDescriptions: [
      {
        image: "homepage.jpg",
        title: "Immersive Homepage Experience",
        description: "The homepage was designed to immediately capture visitors' attention with interactive parallax animations that respond to scroll and mouse movements. We implemented custom WebGL effects to create an atmospheric entry point that reflects the exhibition's surreal and mysterious theme."
      },
      {
        image: "exhibition.jpg",
        title: "Interactive Exhibition Map",
        description: "The interactive exhibition map allows visitors to explore the physical space digitally before their visit. We developed a custom mapping system with hotspots that reveal content previews and provide wayfinding information, enhancing the overall visitor experience."
      },
      {
        image: "monster-detail.jpg",
        title: "Monster Detail Experience",
        description: "Each monster profile page features rich media content with smooth transitions and responsive layouts. We implemented advanced lazy-loading techniques and optimized image rendering to ensure fast load times while maintaining the high-quality visuals essential to showcase the artistic details."
      }
    ],
    results: [
      {
        title: "Enhanced User Experience",
        description: "Created an immersive digital extension of the physical exhibition."
      },
      {
        title: "Performance Optimization",
        description: "Achieved 25% improvement in rendering efficiency across diverse display sizes."
      },
      {
        title: "Accessibility",
        description: "Successfully implemented bilingual support increasing audience reach."
      }
    ],
    websiteUrl: "https://thesecretlifeofmonsters.com/",
    details: "Developed a responsive interface for Montreal's Quartier des Spectacles' Monster series, ensuring seamless performance across various device sizes. Implemented parallax animations and integrated bilingual translations, enhancing user engagement through immersive design.",
    prevProject: {
      name: "Bell Summer Games",
      slug: "bell-summer-games"
    },
    nextProject: {
      name: "College Jean-de-Brebeuf Touchscreen Wall",
      slug: "college-brebeuf-touchscreen"
    }
  },
  {
    id: 3,
    name: "College Brebeuf Touchscreen Wall",
    slug: "college-brebeuf-touchscreen",
    role: "Full-stack Developer",
    year: 2023,
    location: "Canada",
    shortDescription: "An interactive graduation photo display application for large-scale TVs with search functionality and administrative capabilities.",
    description: `
      <p>The College Jean-de-Brebeuf Touchscreen Wall project involved creating an interactive graduation photo display application for large-scale touchscreen TVs. The system features a carousel-style dynamic homepage with an advanced search engine, zoomable photo interface, and an administrative dashboard for content management.</p>
      
      <p>As the Full-stack Developer, I engineered a responsive carousel gallery with an animated search bar, enabling users to browse photos efficiently. The implementation of zoom functionality and optimized image rendering were critical for providing a smooth user experience on the large touchscreen displays.</p>
      
      <p>The project required careful consideration of performance optimization for handling large numbers of high-resolution images while maintaining responsive touch interactions. The administrative dashboard allows staff to easily manage and update the photo collection.</p>
    `,
    timeline: "January 2023 - March 2023",
    src: "college-brebeuf-touchscreen.jpg",
    stack: [
      "React", 
      "RESTful APIs", 
      "SASS", 
      "Ruby on Rails", 
      "Jest"
    ],
    tags: ["Full-stack Development", "Interactive Display", "Educational Institution"],
    features: [
      "Carousel-style dynamic homepage",
      "Advanced photo search engine",
      "Zoomable photo interface",
      "Administrative dashboard",
      "Touch-optimized interactions",
      "High-performance image rendering"
    ],
    gallery: [
      "carousel.jpg",
      "search.jpg",
      "photo-zoom.jpg"
    ],
    galleryWithDescriptions: [
      {
        image: "carousel.jpg",
        title: "Dynamic Carousel Gallery",
        description: "We engineered a high-performance carousel system optimized for large touchscreen displays. The interface uses hardware-accelerated animations and touch gesture recognition to create a fluid browsing experience even when navigating through thousands of high-resolution graduation photos."
      },
      {
        image: "search.jpg",
        title: "Advanced Search Functionality",
        description: "The search functionality incorporates predictive text algorithms and fuzzy matching to help users quickly find specific graduates. We implemented efficient indexing techniques to ensure search queries return results in under 100ms, even on the large touchscreen interface."
      },
      {
        image: "photo-zoom.jpg",
        title: "Multi-touch Zoom Interface",
        description: "The photo zoom feature utilizes advanced pinch-to-zoom capabilities with smooth, responsive scaling. We developed a custom caching system that pre-loads higher resolution versions of images when users begin a zoom action, ensuring crisp visuals at any magnification level."
      }
    ],
    results: [
      {
        title: "User Engagement",
        description: "Created an engaging interactive platform for browsing graduation photos."
      },
      {
        title: "Administrative Efficiency",
        description: "Provided intuitive tools for staff to manage and update content."
      },
      {
        title: "Performance Optimization",
        description: "Successfully optimized image rendering for high performance on large displays."
      }
    ],
    websiteUrl: "https://brebeuf-mosaic.wallrus.dev/",
    details: "Engineered an interactive graduation photo display application for large-scale TVs, featuring a carousel-style dynamic homepage with a search engine, zoomable photo interface, and an administrative dashboard. Developed a responsive carousel gallery with an animated search bar, enabling users to browse photos efficiently.",
    prevProject: {
      name: "The Secret Life of Monster Website",
      slug: "secret-life-of-monsters"
    }
  },
  
];