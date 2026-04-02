import { lazy, Suspense, useEffect, useRef, useState } from "react";
import ProjectItem from "./folder/Folder";
import { gsap } from "gsap";
import SplitText from "./animations/SplitText.tsx";
import FuzzyText from "./animations/FuzzyText.tsx";
import DecryptedText from "./animations/DecryptedText.tsx";
import StatCounter from "./StatCounter.tsx";
import profilImage from "/profil.jpg";
import "./App.css";
import SocialIcons from "./socialIcons/SocialIcons.tsx";
import { useIsMobile } from "../hooks/useIsMobile";
const ParticleBackground = lazy(
  () => import("./particulesBackground/ParticleBackground.tsx"),
);

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
      highlights: [
        "Designed and built the full product from scratch, solo",
        "Built a REST API with Bun + Hono and a SQLite database",
        "Deployed on a VPS with Nginx, SSL and automated backups",
        "Implemented matching algorithm between candidates and job offers",
      ],
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
      highlights: [
        "Lead frontend development for a major financial client (AMUNDI)",
        "Built complex GraphQL data flows with Ramda for functional transformations",
        "Focused on accessibility and performance optimizations with Radix-UI and custom hooks",
        "Shipped in production with real beta users",
      ],
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
      highlights: [
        "Built an interactive graph visualization tool used by BNP Paribas analysts",
        "Integrated D3.js for dynamic force-directed graph rendering",
        "Managed complex client-side state with Zustand",
        "Migrated the project from CRA to Vite + React v19, added TypeScript and good development practices",
      ],
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
      highlights: [
        "Built an internal tool to automate tender document management",
        "Developed a Node.js scraping pipeline with Puppeteer",
        "Integrated TanStack Query for server state management",
        "Reduced manual processing time by an estimated 60%",
        "Deployed and maintained via Azure DevOps CI/CD pipeline",
      ],
    },
    {
      id: 5,
      title: ["ABLA"],
      date: " Mar 2023 - Dec 2024",
      company: "Startup",
      info: "AI transcription for UX Repository",
      stack: ["React", "React-DnD", "Chart.JS", "Chakra-UI", "GitHub"],
      link: "",
      highlights: [
        "Built a UX research repository with AI-powered transcription",
        "Implemented drag-and-drop interview organization with React-DnD",
        "Created data visualization dashboards with Chart.js",
        "Integrated a third-party AI transcription API and structured the output",
        "Delivered as the sole frontend developer on the project",
      ],
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
        scrollLockRef.current = true;
        setTimeout(() => {
          scrollLockRef.current = false;
        }, 400);
      }
    };

    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll);
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
    if (!initialScrollComplete.current && scrollContainerRef.current && !isMobile) {
      setTimeout(() => {
        const fasstProject = document.querySelector('.project-item[data-id="1"]');

        if (fasstProject) {
          const containerRect = scrollContainerRef.current?.getBoundingClientRect();
          if (!containerRect) return;
          const elementRect = fasstProject.getBoundingClientRect();

          const scrollTop =
            (scrollContainerRef.current?.scrollTop || 0) +
            elementRect.top -
            containerRect.top -
            containerRect.height / 2 +
            elementRect.height / 2;

          gsap.to(scrollContainerRef.current, {
            scrollTop: scrollTop,
            duration: 1,
            ease: "power2.out",
            onComplete: () => {
              initialScrollComplete.current = true;
              setActiveProjectId(1);
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
      <div className="w-full md:w-1/2 min-h-screen flex items-center justify-center overflow-hidden">
        <div className="flex flex-col w-full max-w-md px-4 sm:px-6 py-8 space-y-6">
          <div className="flex flex-col items-center sm:flex-row sm:items-stretch mb-8">
            <div className="flex flex-col items-center sm:items-start mr-4">
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
                    animationTo={{
                      opacity: 1,
                      transform: "translate3d(0,0,0)",
                    }}
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
                    animationTo={{
                      opacity: 1,
                      transform: "translate3d(0,0,0)",
                    }}
                    easing={gsap.parseEase("easeOutCubic")}
                    threshold={0.2}
                    rootMargin="-50px"
                    className="text-accent"
                  />
                </h1>
              </div>
              <div className="flex flex-col gap-1 items-center sm:items-start">
                <FuzzyText baseIntensity={0.1} fontSize="2rem">
                  Fullstack · JS
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
                text="Full-stack developer with 5+ years of experience, specialized in React, Node.js and TypeScript."
                duration={2000}
                direction="left-to-right"
              />
            </p>
            <p>
              <DecryptedText
                text="At Capgemini, I worked on large-scale production systems for major clients — building robust architectures, scalable APIs and modern interfaces used by real users at scale."
                duration={2000}
                direction="left-to-right"
              />
            </p>
            <p>
              <DecryptedText
                text="I now help companies turn ideas into fast, reliable web applications — from database design and API architecture to frontend delivery and production deployment."
                duration={2000}
                direction="left-to-right"
              />
            </p>
          </div>

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
                    text="React · TypeScript · Tailwind · Radix-UI"
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
                    text="Node/Bun · Express/Hono · API Gateway"
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
                    text="PostgreSQL · SQLite · MongoDB · Redis"
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
                    text="Debian · Docker · Git · CI/CD · Nginx"
                    duration={2500}
                    direction="left-to-right"
                  />
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-between sm:justify-start sm:gap-12 w-full max-w-md mx-auto sm:mx-0">
            <StatCounter
              target={5}
              suffix="+"
              label="Experience"
              decryptDelay={1500}
            />
            <StatCounter
              target={12}
              suffix="+"
              label="Projects"
              decryptDelay={1900}
            />
            <StatCounter
              target={8}
              suffix="k+"
              label="Hot Coffees"
              decryptDelay={2300}
            />
          </div>
        </div>
      </div>

      <div className="w-full md:w-1/2 h-screen relative">
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

      <div className="fixed bottom-8 left-8 text-xs opacity-60 z-20">
        © Jonathan
        <br />
        de BOISVILLIERS
      </div>

      <div className="flex flex-col text-xs items-end fixed bottom-8 right-8 z-50 gap-6">
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
