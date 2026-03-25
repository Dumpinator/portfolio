import React, { useEffect, useRef, useState } from 'react';
import Badge from '../badge/Badge';
import gsap from 'gsap';

type Project = {
  id: string | number;
  title: string[];
  date: string;
  stack: string[];
  info: string;
}

type ProjectProps = {
  project: Project;
  darkMode?: boolean;
  isActive: boolean;
  onClick: (event: React.MouseEvent<HTMLDivElement>) => void;
  scrollToProject: (projectId: number) => void;
  scrollContainerRef?: React.RefObject<HTMLDivElement>;
  showFocusIndicator?: boolean;
  className?: string;
}

const ProjectItem: React.FC<ProjectProps> = ({ project, darkMode, isActive, onClick, scrollToProject }) => {
  const [hovered, setHovered] = useState<boolean>(false);
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const timerRef = useRef<number | null>(null);
  const autoScrollTimerRef = useRef<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const projectRef = useRef<HTMLDivElement>(null);
  
  // Détecter si c'est un écran mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  // Animation GSAP initiale 
  useEffect(() => {
    if (projectRef.current) {
      // Animation initiale - seul le premier projet est pleinement visible
      gsap.set(projectRef.current, { 
        opacity: project.id === 1 ? 1 : 0.15,
        scale: project.id === 1 ? 1 : 0.95,
        clearProps: "transform" // Permet à nos classes CSS de définir la transformation
      });
    }
  }, [project.id]);

  // Animation GSAP quand le statut actif change
  useEffect(() => {
    if (projectRef.current) {
      if (isActive) {
        gsap.to(projectRef.current, {
          opacity: 1,
          duration: 0.5,
          ease: "power2.out"
        });
      } else {
        // Si on est sur mobile, on garde toujours une certaine visibilité
        gsap.to(projectRef.current, {
          opacity: isMobile ? 0.5 : 0.15,
          duration: 0.5,
          ease: "power2.out"
        });
      }
    }
  }, [isActive, isMobile]);

  // Gérer le hover et les timers
  const handleMouseEnter = () => {
    setHovered(true);
    
    // Animation au survol
    if (projectRef.current && !isActive) {
      gsap.to(projectRef.current, {
        opacity: 0.8,
        duration: 0.3,
        ease: "power1.out"
      });
    }
    
    // Sur mobile, ne pas utiliser de délais
    if (isMobile) {
      if (isActive) {
        setShowDetails(true);
      }
      return;
    }
    
    if (isActive) {
      timerRef.current = window.setTimeout(() => {
        setShowDetails(true);
      }, 300);
    } else {
      autoScrollTimerRef.current = window.setTimeout(() => {
        scrollToProject(Number(project?.id));
      }, 800);
    }
  };

  const handleMouseLeave = () => {
    setHovered(false);
    
    // Animation quand on quitte le survol
    if (projectRef.current && !isActive) {
      gsap.to(projectRef.current, {
        opacity: isMobile ? 0.5 : 0.15,
        duration: 0.3,
        ease: "power1.out"
      });
    }
    
    // Sur mobile, garder les détails visibles pour le projet actif
    if (isMobile && isActive) {
      return;
    }
    
    setShowDetails(false);
    
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    if (autoScrollTimerRef.current) {
      clearTimeout(autoScrollTimerRef.current);
    }
  };

  // Montrer les détails automatiquement pour le projet actif en mode mobile
  useEffect(() => {
    if (isMobile && isActive) {
      setShowDetails(true);
    } else if (isMobile && !isActive) {
      setShowDetails(false);
    }
  }, [isMobile, isActive]);

  if (!project) {
    return null;
  }

  return (
    <div
      ref={projectRef}
      data-id={project.id}
      className={`project-item w-full max-w-xs mx-auto ${isMobile ? 'mb-8' : 'mb-16'} cursor-pointer snap-center transition-all duration-500
        ${(hovered && isActive && !isMobile) ? '-translate-x-2.5' : ''}
        ${isActive ? `${isMobile ? 'scale-100' : 'scale-105'}` : `${isMobile ? '' : 'scale-95'}`}
      `}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      <div className="mb-2">
        {project.title.map((line, index) => (
          <h2 className={`${isMobile ? 'text-5xl/12' : 'text-6xl/14'} font-normal tracking-tighter`} key={index}>{line}</h2>
        ))}
      </div>
      <p className="project-date !ml-1 text-sm">
        {project.date}
      </p>
      <div className="!ml-1 !mt-2 text-sm">
        <ul className='flex flex-wrap gap-1 w-full'>
          {project.stack.map((tag, index) => (
            <li key={index}>
              <Badge className={`text-${darkMode ? 'blue' : 'yellow'}-300/90`} darkMode={darkMode} isActive={isActive}>{tag}</Badge>
            </li>
          ))}
        </ul>
      </div>
      <div
        className={`overflow-hidden transition-all duration-300 ease-out
          ${(showDetails && isActive) || (isMobile && isActive) ? 'max-h-32 opacity-100 mt-2' : 'max-h-0 opacity-0'}
        `}
      >
        <p className="project-info !ml-1 text-sm mb-2">
          {project.info}
        </p>
      </div>
    </div>
  );
};

export default ProjectItem;