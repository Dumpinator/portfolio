import React, { useEffect, useRef, useState } from 'react';
import Badge from '../badge/Badge';
import gsap from 'gsap';
import { useIsMobile } from '../../hooks/useIsMobile';
import DecryptedText from '../animations/DecryptedText';

type Project = {
  id: string | number;
  title: string[];
  date: string;
  stack: string[];
  info: string;
  link?: string;
}

type ProjectProps = {
  project: Project;
  darkMode?: boolean;
  isActive: boolean;
  onClick: (event: React.MouseEvent<HTMLDivElement>) => void;
  scrollContainerRef?: React.RefObject<HTMLDivElement>;
  showFocusIndicator?: boolean;
  className?: string;
}

const ProjectItem: React.FC<ProjectProps> = ({ project, darkMode, isActive, onClick }) => {
  const isMobile = useIsMobile();
  const projectRef = useRef<HTMLDivElement>(null);
  
  // Track activations to replay DecryptedText animation
  const [activationKey, setActivationKey] = useState(0);
  const wasActive = useRef(false);

  useEffect(() => {
    if (isActive && !wasActive.current) {
      setActivationKey(k => k + 1);
    }
    wasActive.current = isActive;
  }, [isActive]);

  // Animation GSAP initiale 
  useEffect(() => {
    if (projectRef.current) {
      gsap.set(projectRef.current, { 
        opacity: project.id === 1 ? 1 : 0.15,
        scale: project.id === 1 ? 1 : 0.95,
        clearProps: "transform"
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
        gsap.to(projectRef.current, {
          opacity: isMobile ? 0.5 : 0.15,
          duration: 0.5,
          ease: "power2.out"
        });
      }
    }
  }, [isActive, isMobile]);

  const handleMouseEnter = () => {
    if (projectRef.current && !isActive) {
      gsap.to(projectRef.current, {
        opacity: 0.8,
        duration: 0.3,
        ease: "power1.out"
      });
    }
  };

  const handleMouseLeave = () => {
    if (projectRef.current && !isActive) {
      gsap.to(projectRef.current, {
        opacity: isMobile ? 0.5 : 0.15,
        duration: 0.3,
        ease: "power1.out"
      });
    }
  };

  if (!project) {
    return null;
  }

  return (
    <div
      ref={projectRef}
      data-id={project.id}
      className={`project-item w-full max-w-xs mx-auto ${isMobile ? 'mb-8' : 'mb-16'} cursor-pointer snap-center transition-all duration-500
        ${isActive ? `${isMobile ? 'scale-100' : 'scale-105'}` : `${isMobile ? '' : 'scale-95'}`}
      `}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={(e) => {
        if (isActive && project.link) {
          window.open(project.link, '_blank', 'noopener,noreferrer');
        } else {
          onClick(e);
        }
      }}
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
              <Badge darkMode={darkMode}>{tag}</Badge>
            </li>
          ))}
        </ul>
      </div>
      <div
        className={`overflow-hidden transition-all duration-300 ease-out
          ${isActive ? 'max-h-32 opacity-100 mt-2' : 'max-h-0 opacity-0'}
        `}
      >
      <p>
        <DecryptedText
          text={project.info}
          duration={2000}
          delay={350}
          trigger={activationKey}
          direction="left-to-right"
        />
      </p>
      </div>
    </div>
  );
};

export default ProjectItem;