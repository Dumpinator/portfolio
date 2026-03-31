import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

function useCountUp(target: number, duration = 2000) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  const animate = useCallback(() => {
    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setValue(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, duration]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          animate();
        }
      },
      { threshold: 0.5 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [animate]);

  return { value, ref };
}
import ProjectItem from "./folder/Folder";
import { gsap } from "gsap";
import SplitText from "./animations/SplitText.tsx";
import FuzzyText from "./animations/FuzzyText.tsx";
import DecryptedText from "./animations/DecryptedText.tsx";
import profilImage from "/profil.jpg";
import "./App.css";
import SocialIcons from "./socialIcons/SocialIcons.tsx";
import { useIsMobile } from "../hooks/useIsMobile";
const ParticleBackground = lazy(
  () => import("./particulesBackground/ParticleBackground.tsx"),
);

function StatCounter({
  target,
  suffix,
  label,
  decryptDelay = 0,
}: {
  target: number;
  suffix: string;
  label: string;
  decryptDelay?: number;
}) {
  const { value, ref } = useCountUp(target, 1800);
  return (
    <div className="flex-1 text-center sm:text-left">
      <p
        className="text-4xl font-bold"
        style={{ color: "var(--accent-muted)" }}
      >
        <span ref={ref}>{value}</span>
        {suffix}
      </p>
      <p className="text-sm opacity-75">
        <DecryptedText
          text={label}
          duration={1500}
          delay={decryptDelay}
          direction="left-to-right"
        />
      </p>
    </div>
  );
}

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [activeProjectId, setActiveProjectId] = useState<number | null>(null);
  const [showFocusIndicator, setShowFocusIndicator] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const focusIndicatorRef = useRef(null);
  const isMobile = useIsMobile();
  const initialScrollComplete = useRef(false);
  const scrollLockRef = useRef(false);
  const activeProjectIdRef = useRef<number | null>(null);

  const projects = [
    {
      id: 1,
      title: ["Curcuma"],
      date: "Juil 2025 - Dec 2025",
      company: "Startup",
      info: "Centralizes your talent, optimizes your matching, and accelerates your placements.",
      stack: ["React", "TypeScript", "Bun", "SQLite", "Tailwind", "Nginx"],
      link: "https://beta.curcuma.ovh/",
    },
    {
      id: 2,
      title: ["FASST"],
      date: "Oct 2024 - Mars 2025",
      company: "Capgemini",
      info: "Sales path and Dashboard for AMUNDI distributors",
      stack: [
        "React",
        "Node",
        "GraphQL",
        "Ramda",
        "Tailwind",
        "Radix-UI",
        "GitLab",
      ],
      link: "https://fasst.io/",
    },
    {
      id: 3,
      title: ["PATHFINDER"],
      date: "Jun - Nov 2024",
      company: "BNP Paribas",
      info: "Graph Visualization Tool for BNP Paribas",
      stack: [
        "React",
        "React Router",
        "D3.JS",
        "TypeScript",
        "Vite",
        "Zustand",
        "GitLab",
      ],
      link: "",
    },
    {
      id: 4,
      title: ["LOAD AO"],
      date: "Oct 2023 - Fev 2025",
      company: "Sogeti",
      info: "Tool Managment for Sogeti",
      stack: [
        "React",
        "TypeScript",
        "MUI",
        "TanStack",
        "Puppeteer",
        "Node",
        "AzureDevOps",
      ],
      link: "",
    },
    {
      id: 5,
      title: ["ABLA"],
      date: " Mar 2023 - Dec 2024",
      company: "Startup",
      info: "AI transcription for UX Repository",
      stack: ["React", "React-DnD", "Chart.JS", "Chakra-UI", "GitHub"],
      link: "",
    },
  ];

  useEffect(() => {
    document.body.className = darkMode ? "dark-theme" : "light-theme";
  }, [darkMode]);

  useEffect(() => {
    const handleScroll = () => {
      if (!scrollContainerRef.current || scrollLockRef.current) return;

      const containerRect = scrollContainerRef.current?.getBoundingClientRect();
      if (!containerRect) return;
      const containerCenter = containerRect.top + containerRect.height / 2;

      let closestId: number | null = null;
      let closestDistance = Infinity;

      const projectElements =
        scrollContainerRef.current.querySelectorAll(".project-item");

      projectElements.forEach((element) => {
        const rect = element.getBoundingClientRect();
        const distance = Math.abs(rect.top + rect.height / 2 - containerCenter);
        const id = parseInt((element as HTMLElement).dataset.id || "0");

        if (distance < closestDistance) {
          closestDistance = distance;
          closestId = id;
        }
      });

      if (closestId !== null && closestId !== activeProjectIdRef.current) {
        activeProjectIdRef.current = closestId;
        setActiveProjectId(closestId);
        // Lock scroll detection while the info panel opens (300ms transition)
        scrollLockRef.current = true;
        setTimeout(() => {
          scrollLockRef.current = false;
        }, 400);
      }
    };

    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll);
      // Force running the handleScroll immediately and after a short delay
      handleScroll();
      setTimeout(handleScroll, 500);
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  useEffect(() => {
    if (
      !initialScrollComplete.current &&
      scrollContainerRef.current &&
      !isMobile
    ) {
      // Petit délai pour s'assurer que le DOM est complètement chargé
      setTimeout(() => {
        // Trouver l'élément FASST
        const fasstProject = document.querySelector(
          '.project-item[data-id="1"]',
        );

        if (fasstProject) {
          // Calcul de la position de défilement
          const containerRect =
            scrollContainerRef.current?.getBoundingClientRect();
          if (!containerRect) return;
          const elementRect = fasstProject.getBoundingClientRect();

          const scrollTop =
            (scrollContainerRef.current?.scrollTop || 0) +
            elementRect.top -
            containerRect.top -
            containerRect.height / 2 +
            elementRect.height / 2;

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
            },
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

      const scrollTop =
        scrollContainerRef.current.scrollTop +
        elementRect.top -
        containerRect.top -
        containerRect.height / 2 +
        elementRect.height / 2;

      scrollContainerRef.current.scrollTo({
        top: scrollTop,
        behavior: "smooth",
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
    <div
      className={`flex flex-col md:flex-row min-h-[100vh] w-full ${darkMode ? "dark-theme" : "light-theme"}`}
    >
      {/* Section gauche - Présentation */}
      <div className="w-full md:w-1/2 min-h-screen flex items-center justify-center overflow-hidden">
        <div className="flex flex-col w-full max-w-md px-4 sm:px-6 py-8 space-y-6">
          {/* Section photo + nom + titre */}
          <div className="flex flex-col items-center sm:flex-row sm:items-stretch mb-8">
            <div className="flex flex-col items-center sm:items-start mr-4">
              {/* Image de profil */}
              <div
                className="rounded-full overflow-hidden w-28 h-28 border-2 shadow-lg flex-shrink-0 mb-4 sm:mb-0"
                style={{ borderColor: "var(--img-border)" }}
              >
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
              <div className="w-full flex items-center justify-center mt-2">
                <SocialIcons />
              </div>
            </div>

            <div className="flex flex-col items-center sm:items-start sm:justify-between text-center sm:text-left">
              <div>
                <h1 className="text-2xl font-bold tracking-tighter pl-2">
                  <SplitText
                    text="JONATHAN"
                    delay={100}
                    animationFrom={{
                      opacity: 0,
                      transform: "translate3d(0,50px,0)",
                    }}
                    animationTo={{ opacity: 1, transform: "translate3d(0,0,0)" }}
                    easing={gsap.parseEase("easeOutCubic")}
                    threshold={0.2}
                    rootMargin="-50px"
                    className="text-accent"
                  />
                </h1>
                <h1 className="text-2xl font-bold tracking-tighter pl-2">
                  <SplitText
                    text="DE BOISVILLIERS"
                    delay={200}
                    animationFrom={{
                      opacity: 0,
                      transform: "translate3d(0,50px,0)",
                    }}
                    animationTo={{ opacity: 1, transform: "translate3d(0,0,0)" }}
                    easing={gsap.parseEase("easeOutCubic")}
                    threshold={0.2}
                    rootMargin="-50px"
                    className="text-accent"
                  />
                </h1>
              </div>
              <div className="flex flex-col gap-1 items-center sm:items-start">
                <FuzzyText baseIntensity={0.1} fontSize="2rem">
                  JS · Fullstack
                </FuzzyText>
                <FuzzyText baseIntensity={0.1} fontSize="1.4rem" color="white">
                  Node & React
                </FuzzyText>
              </div>
            </div>
          </div>

          <div className="text-base mb-6 opacity-75 max-w-md mx-auto sm:mx-0 text-left space-y-3">
            <p>
              <DecryptedText
                text="Full-stack developer working with React, Node.js and TypeScript."
                duration={2000}
                direction="left-to-right"
              />
            </p>
            <p>
              <DecryptedText
                text="I build SaaS products, APIs and modern interfaces with a focus on performance, clarity and maintainability."
                duration={2000}
                direction="left-to-right"
              />
            </p>
            <p>
              <DecryptedText
                text="I enjoy keeping up with the ecosystem, whether that means working with Bun.js, refining database design, or improving deployment setups with Nginx."
                duration={2000}
                direction="left-to-right"
              />
            </p>
          </div>

          {/* Tech Stack */}
          <div className="mb-6 max-w-md mx-auto sm:mx-0">
            <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm opacity-75">
              <div>
                <p
                  className="text-xs font-semibold mb-1 tracking-widest uppercase"
                  style={{ color: "var(--accent-muted)" }}
                >
                  Frontend
                </p>
                <p>
                  <DecryptedText
                    text="React · TypeScript · Tailwind"
                    duration={2500}
                    direction="left-to-right"
                  />
                </p>
              </div>
              <div>
                <p
                  className="text-xs font-semibold mb-1 tracking-widest uppercase"
                  style={{ color: "var(--accent-muted)" }}
                >
                  Backend
                </p>
                <p>
                  <DecryptedText
                    text="Node.js · Bun.js · Hono · REST APIs"
                    duration={2500}
                    direction="left-to-right"
                  />
                </p>
              </div>
              <div>
                <p
                  className="text-xs font-semibold mb-1 tracking-widest uppercase"
                  style={{ color: "var(--accent-muted)" }}
                >
                  Databases
                </p>
                <p>
                  <DecryptedText
                    text="PostgreSQL · SQLite"
                    duration={2500}
                    direction="left-to-right"
                  />
                </p>
              </div>
              <div>
                <p
                  className="text-xs font-semibold mb-1 tracking-widest uppercase"
                  style={{ color: "var(--accent-muted)" }}
                >
                  Infrastructure
                </p>
                <p>
                  <DecryptedText
                    text="Nginx · Linux · Git / CI"
                    duration={2500}
                    direction="left-to-right"
                  />
                </p>
              </div>
            </div>
          </div>

          {/* Stats avec flex-wrap */}
          <div className="flex flex-wrap justify-center sm:justify-start gap-4 sm:gap-8 w-fit space-y-4 sm:space-y-8">
            <StatCounter
              target={5}
              suffix="+"
              label="Years of Experience"
              decryptDelay={1500}
            />
            <StatCounter
              target={12}
              suffix="+"
              label="Completed Projects"
              decryptDelay={1900}
            />
            <StatCounter
              target={10}
              suffix="k+"
              label="Downed Hot Coffees"
              decryptDelay={2300}
            />
          </div>
        </div>
      </div>

      {/* Section droite - Projets */}
      <div className="w-full md:w-1/2 h-screen relative">
        {/* Sur mobile: Vue de tous les projets sans défilement, avec un simple padding */}
        {isMobile ? (
          <div className="w-full py-8 px-4 mt-8 flex flex-col gap-12">
            {projects.map((project) => (
              <ProjectItem
                key={project.id}
                project={project}
                isActive={project.id === activeProjectId}
                onClick={() => setActiveProjectId(Number(project.id))}
              />
            ))}
          </div>
        ) : (
          // Sur desktop: Vue avec défilement
          <div className="w-full h-full flex flex-col relative">
            <div
              className="absolute top-0 left-0 w-full h-16 z-10 pointer-events-none"
              style={{
                background:
                  "linear-gradient(to bottom, var(--bg), transparent)",
              }}
            ></div>

            {showFocusIndicator && (
              <div
                ref={focusIndicatorRef}
                className="absolute left-1/2 top-1/2 w-8 h-8 -translate-x-1/2 -translate-y-1/2 rounded-full z-50 pointer-events-none animate-pulse"
                style={{
                  backgroundColor: "var(--focus-bg)",
                  boxShadow: `0 0 20px 10px var(--focus-glow)`,
                }}
              ></div>
            )}

            <div
              ref={scrollContainerRef}
              className="pt-2 h-full overflow-y-auto overflow-x-hidden snap-y snap-mandatory"
              style={{
                scrollPaddingTop: "calc(50vh - 100px)",
                scrollPaddingBottom: "calc(50vh - 100px)",
              }}
            >
              <div className="h-[30vh]"></div>

              {projects.map((project) => (
                <ProjectItem
                  key={project.id}
                  project={project}
                  isActive={project.id === activeProjectId}
                  onClick={() => scrollToProject(Number(project.id))}
                />
              ))}

              <div className="h-[30vh]"></div>
            </div>

            <div
              className="absolute bottom-0 left-0 w-full h-16 z-10 pointer-events-none"
              style={{
                background: "linear-gradient(to top, var(--bg), transparent)",
              }}
            ></div>
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
        {/* Bouton CYBER */}
        <div
          className={`flex flex-col items-center cursor-pointer ${darkMode ? "opacity-100" : "opacity-40"}`}
          onClick={() => setDarkMode(true)}
        >
          {"CYBER".split("").map((letter, index) => (
            <div
              key={`cyber-${index}`}
              className="my-1 hover:scale-110 transition-transform"
            >
              <FuzzyText
                baseIntensity={darkMode ? 0.15 : 0.1}
                hoverIntensity={0.25}
                fontSize="1rem"
                enableHover={true}
              >
                {letter}
              </FuzzyText>
            </div>
          ))}
        </div>

        {/* Bouton WINTER */}
        <div
          className={`flex flex-col items-center cursor-pointer ${!darkMode ? "opacity-100" : "opacity-40"}`}
          onClick={() => setDarkMode(false)}
        >
          {"WINTER".split("").map((letter, index) => (
            <div
              key={`winter-${index}`}
              className="my-1 hover:scale-110 transition-transform"
            >
              <FuzzyText
                baseIntensity={!darkMode ? 0.15 : 0.1}
                hoverIntensity={0.25}
                fontSize="1rem"
                enableHover={true}
                color="var(--text)"
              >
                {letter}
              </FuzzyText>
            </div>
          ))}
        </div>
      </div>
      <Suspense fallback={<div className="fixed inset-0 z-0"></div>}>
        <ParticleBackground />
      </Suspense>
    </div>
  );
}

export default App;
