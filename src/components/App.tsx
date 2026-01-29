import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import ProjectItem from './folder/Folder';
import { gsap } from 'gsap';
import SplitText from "./animations/SplitText.tsx";
import FuzzyText from './animations/FuzzyText.tsx';
import DecryptedText from './animations/DecryptedText.tsx';
import profilImage from '/profil.jpg'
import './App.css';
import SocialIcons from './socialIcons/SocialIcons.tsx';
const ParticleBackground = lazy(() => import('./particulesBackground/ParticleBackground.tsx'));

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [activeProjectId, setActiveProjectId] = useState<number | null>(null);
  const [showFocusIndicator, setShowFocusIndicator] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const focusIndicatorRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const initialScrollComplete = useRef(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Vérifier immédiatement
    checkIfMobile();

    // Ajouter un écouteur pour vérifier lors du redimensionnement
    window.addEventListener('resize', checkIfMobile);

    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  const projects = [
    {
      id: 1,
      title: ["Curcuma"],
      date: "Juil 2025 - Dec 2025",
      info: 'Centralizes your talent, optimizes your matching, and accelerates your placements.',
      stack: ['React', 'Bun', 'Sqlite', 'Tailwind', 'Daisy UI', 'Github']
    },
    {
      id: 2,
      title: ["FASST"],
      date: "Oct 2024 - Mars 2025",
      info: 'Sales path and Dashboard for AMUNDI distributors',
      stack: ['React', 'Node', 'GraphQL', 'Ramda', 'Tailwind', 'Radix-UI', 'GitLab']
    },
    {
      id: 3,
      title: ["PATHFINDER"],
      date: "Jun - Nov 2024",
      info: 'Graph Visualization Tool for BNP Paribas',
      stack: ['React', 'React Router', 'D3.JS', 'TypeScript', 'Vite', 'Zustand', 'GitLab']
    },
    {
      id: 4,
      title: ["LOAD AO"],
      date: "Oct 2023 - Fev 2025",
      info: 'Tool Managment for Sogeti',
      stack: ['React', 'TypeScript', 'MUI', 'TanStack', 'Puppeteer', 'Node', 'AzureDevOps']
    },
    {
      id: 5,
      title: ["ABLA"],
      date: " Mar 2023 - Dec 2024",
      info: 'AI transcription for repository Design',
      stack: ['React', 'React-DnD', 'Chart.JS', 'Chakra-UI', 'GitHub']
    }
  ];

  useEffect(() => {
    document.body.className = darkMode ? 'dark-theme' : 'light-theme';
  }, [darkMode]);

  useEffect(() => {
    const handleScroll = () => {
      if (!scrollContainerRef.current) return;

      const containerRect = scrollContainerRef.current?.getBoundingClientRect();
      if (!containerRect) return;
      const containerCenter = containerRect.top + containerRect.height / 2;

      let closestId: number | null = null;
      let closestDistance = Infinity;
      const projectsVisibility: Record<number, { distance: number; element: Element }> = {};

      const projectElements = scrollContainerRef.current.querySelectorAll('.project-item');

      projectElements.forEach(element => {
        const rect = element.getBoundingClientRect();
        const distance = Math.abs(rect.top + rect.height / 2 - containerCenter);
        const id = parseInt((element as HTMLElement).dataset.id || '0');

        projectsVisibility[id] = { distance, element };

        if (distance < closestDistance) {
          closestDistance = distance;
          closestId = id;
        }
      });

      setActiveProjectId(closestId);

      Object.entries(projectsVisibility).forEach(([id, { element }]) => {
        const numId = parseInt(id);

        if (numId === closestId) {
          // Projet actif - 100% d'opacité
          (element as HTMLElement).style.opacity = "1";
          (element as HTMLElement).style.pointerEvents = "auto";
        } else if (closestId !== null && (numId === closestId - 1 || numId === closestId + 1)) {
          // Projets adjacents - 50% d'opacité
          (element as HTMLElement).style.opacity = "0.5";
          (element as HTMLElement).style.pointerEvents = "auto";
        } else {
          // Tous les autres projets - invisibles et non interactifs
          (element as HTMLElement).style.opacity = "0";
          (element as HTMLElement).style.pointerEvents = "none";
        }
      });
    };

    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
      // Force running the handleScroll immediately and after a short delay
      handleScroll();
      setTimeout(handleScroll, 500);
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  useEffect(() => {
    if (!initialScrollComplete.current && scrollContainerRef.current && !isMobile) {
      // Petit délai pour s'assurer que le DOM est complètement chargé
      setTimeout(() => {
        // Trouver l'élément FASST
        const fasstProject = document.querySelector('.project-item[data-id="1"]');

        if (fasstProject) {
          // Calcul de la position de défilement
          const containerRect = scrollContainerRef.current?.getBoundingClientRect();
          if (!containerRect) return;
          const elementRect = fasstProject.getBoundingClientRect();

          const scrollTop = (scrollContainerRef.current?.scrollTop || 0) + elementRect.top -
            containerRect.top - (containerRect.height / 2) + (elementRect.height / 2);

          // Animation fluide avec GSAP
          gsap.to(scrollContainerRef.current, {
            scrollTop: scrollTop,
            duration: 1,
            ease: "power2.out",
            onComplete: () => {
              // Marquer comme terminé pour ne pas répéter
              initialScrollComplete.current = true;
              // Mettre à jour le projet actif
              setActiveProjectId(1);
              // Afficher l'indicateur de focus
              setShowFocusIndicator(true);
              setTimeout(() => {
                setShowFocusIndicator(false);
              }, 1000);
            }
          });
        }
      }, 300);
    }
  }, [isMobile]);

  const scrollToProject = (id: number) => {

    if (isMobile) {
      setActiveProjectId(id);
      return;
    }

    const element = document.querySelector(`.project-item[data-id="${id}"]`);
    if (element && scrollContainerRef.current) {
      const containerRect = scrollContainerRef.current.getBoundingClientRect();
      const elementRect = element.getBoundingClientRect();

      const scrollTop = scrollContainerRef.current.scrollTop + elementRect.top -
        containerRect.top - (containerRect.height / 2) + (elementRect.height / 2);

      scrollContainerRef.current.scrollTo({
        top: scrollTop,
        behavior: 'smooth'
      });

      // Force update activeProjectId après scroll
      setTimeout(() => {
        setActiveProjectId(id);
        setShowFocusIndicator(true);
        setTimeout(() => {
          setShowFocusIndicator(false);
        }, 1000);
      }, 500);
    }
  };

  return (
    <div className={`flex flex-col md:flex-row min-h-[100vh] w-full overflow-hidden  ${darkMode ? 'dark-theme' : 'light-theme'}`}>
      {/* Section gauche - Présentation */}
      <div className="w-full md:w-1/2 min-h-screen flex items-center justify-center overflow-hidden">
        <div className="flex flex-col w-full max-w-md px-4 sm:px-6 py-8 space-y-6">
          {/* Section photo + texte avec responsive */}
          <div className="flex flex-col items-center sm:flex-row sm:items-start mb-8">
            <div className="flex flex-col items-center sm:items-start mr-2.5">
              {/* Image de profil */}
              <div className={`rounded-full overflow-hidden w-24 h-24 border-2 ${darkMode ? 'border-green-300/80' : 'border-blue-400/50'} shadow-lg flex-shrink-0 mb-4 sm:mb-0`}>
                <img
                  src={profilImage}
                  srcSet={`${profilImage} 2x`}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  loading="lazy"
                  decoding="async"
                  alt="Jonathan de BOISVILLIERS"
                  className="w-full h-full object-cover scale-x-[-1]"
                />
              </div>
              <div className="w-fit h-12 flex items-center justify-center">
                <SocialIcons darkMode={darkMode} />
              </div>
            </div>

            <div className="text-center sm:text-left">
              <h1 className="text-4xl font-bold tracking-tighter mb-2 pl-2">
                <SplitText
                  text="JONATHAN"
                  delay={100}
                  animationFrom={{ opacity: 0, transform: 'translate3d(0,50px,0)' }}
                  animationTo={{ opacity: 1, transform: 'translate3d(0,0,0)' }}
                  easing={gsap.parseEase("easeOutCubic")}
                  threshold={0.2}
                  rootMargin="-50px"
                  className={darkMode ? 'text-green-300/80' : 'text-blue-400/50'}
                />
                <br />
                <SplitText
                  text="DE BOISVILLIERS"
                  delay={200}
                  animationFrom={{ opacity: 0, transform: 'translate3d(0,50px,0)' }}
                  animationTo={{ opacity: 1, transform: 'translate3d(0,0,0)' }}
                  easing={gsap.parseEase("easeOutCubic")}
                  threshold={0.2}
                  rootMargin="-50px"
                  className={darkMode ? 'text-green-300/80' : 'text-blue-400/50'}
                />
              </h1>
              <div className='flex flex-wrap items-center'>
                <FuzzyText
                  baseIntensity={0.1}
                  fontSize="2rem"
                  color={darkMode ? '#fff' : '#aaa'}
                >
                  FullStack JS
                </FuzzyText>
                <FuzzyText
                  baseIntensity={0.1}
                  fontSize="2rem"
                  color={darkMode ? '#fff' : '#aaa'}
                >
                  Developer
                </FuzzyText>
              </div>
            </div>
          </div>

          <div className="text-base mb-8 opacity-75 max-w-md mx-auto sm:mx-0 text-left">
            <p className="mb-4">
              <DecryptedText
                text="Fullstack JS developer with 5+ years of experience, combining technical expertise and creative approach to design performant and intuitive interfaces:"
                duration={2000}
                direction="left-to-right"
              />
            </p>
            <ul className="list-disc pl-5 mb-4 space-y-2">
              <li>
                <DecryptedText
                  text="Deep mastery of React ecosystems, particularly in state management (Zustand) and data flow optimization (GraphQL)"
                  duration={2000}
                  direction="left-to-right"
                />
              </li>
              <li>
                <DecryptedText
                  text="Proficiency in data visualization (D3.JS, Chart.JS), transforming complex information into readable interfaces"
                  duration={2000}
                  direction="left-to-right"
                />
              </li>
              <li>
                <DecryptedText
                  text="UI/UX expertise with modern frameworks (Tailwind, Radix-UI, Chakra-UI, MUI) ensuring accessibility and polished aesthetics"
                  duration={2000}
                  direction="left-to-right"
                />
              </li>
              <li>
                <DecryptedText
                  text="Solid fullstack skills (Node, TypeScript) complemented by automation tools (Puppeteer) and continuous integration"
                  duration={2000}
                  direction="left-to-right"
                />
              </li>
            </ul>
            <p>
              <DecryptedText
                text="I strive to create responsive applications that combine technical performance with intuitive user experience."
                duration={2000}
                direction="left-to-right"
              />
            </p>
          </div>

          {/* Stats avec flex-wrap */}
          <div className="flex flex-wrap justify-center sm:justify-start gap-4 sm:gap-8 w-fit space-y-4 sm:space-y-8">
            <div className="flex-1 text-center sm:text-left">
              <p className={`text-4xl font-bold ${darkMode ? 'text-green-300/80' : 'text-blue-400/50'}`}>5+</p>
              <p className="text-sm opacity-75">Years of Experience</p>
            </div>
            <div className="flex-1 text-center sm:text-left">
              <p className={`text-4xl font-bold ${darkMode ? 'text-green-300/80' : 'text-blue-400/50'}`}>12+</p>
              <p className="text-sm opacity-75">Completed Projects</p>
            </div>
            <div className="flex-1 text-center sm:text-left">
              <p className={`text-4xl font-bold ${darkMode ? 'text-green-300/80' : 'text-blue-400/50'}`}>10k+</p>
              <p className="text-sm opacity-75">Downed Coffees</p>
            </div>
          </div>
        </div>
      </div>

      {/* Section droite - Projets */}
      <div className="w-full md:w-1/2 h-screen relative">
        {/* Sur mobile: Vue de tous les projets sans défilement, avec un simple padding */}
        {isMobile ? (
          <div className="w-full py-8 px-4 mt-8 flex flex-col gap-12">
            {projects.map(project => (
              <ProjectItem
                key={project.id}
                project={project}
                darkMode={darkMode}
                isActive={project.id === activeProjectId}
                onClick={() => setActiveProjectId(Number(project.id))}
                scrollToProject={scrollToProject}
              />
            ))}
          </div>
        ) : (
          // Sur desktop: Vue avec défilement
          <div className="w-full h-full flex flex-col relative">
            <div className="absolute top-0 left-0 w-full h-16 bg-gradient-to-b from-background to-transparent z-10 pointer-events-none"></div>

            {showFocusIndicator && (
              <div
                ref={focusIndicatorRef}
                className={`absolute left-1/2 top-1/2 w-8 h-8 -translate-x-1/2 -translate-y-1/2 rounded-full 
                ${darkMode ? 'bg-blue-500/30' : 'bg-yellow-500/30'} 
                z-50 pointer-events-none animate-pulse`}
                style={{
                  boxShadow: `0 0 20px 10px ${darkMode ? 'rgba(59, 130, 246, 0.4)' : 'rgba(234, 179, 8, 0.4)'}`
                }}
              ></div>
            )}

            <div
              ref={scrollContainerRef}
              className="pt-2 h-full overflow-y-auto overflow-x-hidden snap-y snap-mandatory"
              style={{ scrollPaddingTop: 'calc(50vh - 100px)', scrollPaddingBottom: 'calc(50vh - 100px)' }}
            >
              <div className="h-[30vh]"></div>

              {projects.map(project => (
                <ProjectItem
                  key={project.id}
                  project={project}
                  darkMode={darkMode}
                  isActive={project.id === activeProjectId}
                  onClick={() => scrollToProject(Number(project.id))}
                  scrollToProject={scrollToProject}
                />
              ))}

              <div className="h-[30vh]"></div>
            </div>

            <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none"></div>
          </div>
        )}
      </div>

      {/* Copyright flottant */}
      <div className="fixed bottom-8 left-8 text-xs opacity-60 z-20">
        © Jonathan
        <br />
        de BOISVILLIERS
      </div>

      {/* Version améliorée avec effet de hover par lettre */}
      <div className="flex flex-col text-xs items-end fixed bottom-8 right-8 z-50 gap-6">
        {/* Bouton DARK */}
        <div
          className={`flex flex-col items-center cursor-pointer ${darkMode ? 'opacity-100' : 'opacity-40'}`}
          onClick={() => setDarkMode(true)}
        >
          {'DARK'.split('').map((letter, index) => (
            <div
              key={`dark-${index}`}
              className="my-1 hover:scale-110 transition-transform"
            >
              <FuzzyText
                baseIntensity={darkMode ? 0.15 : 0.1}
                hoverIntensity={0.25}
                fontSize="1rem"
                color={darkMode ? '#fff' : '#aaa'}
                enableHover={true}
              >
                {letter}
              </FuzzyText>
            </div>
          ))}
        </div>

        {/* Bouton LIGHT */}
        <div
          className={`flex flex-col items-center cursor-pointer ${!darkMode ? 'opacity-100' : 'opacity-40'}`}
          onClick={() => setDarkMode(false)}
        >
          {'LIGHT'.split('').map((letter, index) => (
            <div
              key={`light-${index}`}
              className="my-1 hover:scale-110 transition-transform"
            >
              <FuzzyText
                baseIntensity={!darkMode ? 0.15 : 0.1}
                hoverIntensity={0.25}
                fontSize="1rem"
                color={!darkMode ? '#000' : '#aaa'}
                enableHover={true}
              >
                {letter}
              </FuzzyText>
            </div>
          ))}
        </div>
      </div>
      <Suspense fallback={<div className="fixed inset-0 z-0"></div>}>
        <ParticleBackground darkMode={darkMode} />
      </Suspense>
    </div>
  )
}

export default App