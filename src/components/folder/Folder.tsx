import React, { useEffect, useRef, useState } from "react";
import Badge from "../badge/Badge";
import gsap from "gsap";
import { useIsMobile } from "../../hooks/useIsMobile";
import DecryptedText from "../animations/DecryptedText";
import ProjectModal from "./ProjectModal";

type Project = {
  id: string | number;
  title: string[];
  date: string;
  stack: string[];
  info: string;
  link?: string;
  company?: string;
  highlights?: string[];
  image?: string;
  details?: string;
};

type ProjectProps = {
  project: Project;
  isActive: boolean;
  onClick: (event: React.MouseEvent<HTMLDivElement>) => void;
  scrollContainerRef?: React.RefObject<HTMLDivElement>;
  showFocusIndicator?: boolean;
  className?: string;
};

const ProjectItem: React.FC<ProjectProps> = ({
  project,
  isActive,
  onClick,
}) => {
  const isMobile = useIsMobile();
  const projectRef = useRef<HTMLDivElement>(null);
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [showModal, setShowModal] = useState(false);

  const [activationKey, setActivationKey] = useState(0);
  const wasActive = useRef(false);

  useEffect(() => {
    if (isActive && !wasActive.current) {
      setActivationKey((k) => k + 1);
    }
    if (!isActive) {
      setShowModal(false);
      if (hoverTimerRef.current) {
        clearTimeout(hoverTimerRef.current);
        hoverTimerRef.current = null;
      }
    }
    wasActive.current = isActive;
  }, [isActive]);

  // Animation GSAP initiale
  useEffect(() => {
    if (projectRef.current) {
      gsap.set(projectRef.current, {
        opacity: project.id === 1 ? 1 : 0.15,
        scale: project.id === 1 ? 1 : 0.95,
        clearProps: "transform",
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
          ease: "power2.out",
        });
      } else {
        gsap.to(projectRef.current, {
          opacity: isMobile ? 0.5 : 0.15,
          duration: 0.5,
          ease: "power2.out",
        });
      }
    }
  }, [isActive, isMobile]);

  const handleMouseEnter = () => {
    if (projectRef.current && !isActive) {
      gsap.to(projectRef.current, {
        opacity: 0.8,
        duration: 0.3,
        ease: "power1.out",
      });
    }
    if (isActive && project.highlights && project.highlights.length > 0) {
      hoverTimerRef.current = setTimeout(() => {
        setShowModal(true);
      }, 600);
    }
  };

  const handleMouseLeave = () => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
    if (projectRef.current && !isActive) {
      gsap.to(projectRef.current, {
        opacity: isMobile ? 0.5 : 0.15,
        duration: 0.3,
        ease: "power1.out",
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
      className={`project-item w-full max-w-xs mx-auto ${isMobile ? "mb-8" : "mb-16"} cursor-pointer snap-center transition-all duration-500
        ${isActive ? `${isMobile ? "scale-100" : "scale-105"}` : `${isMobile ? "" : "scale-95"}`}
      `}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={(e) => {
        if (isActive && project.link) {
          window.open(project.link, "_blank", "noopener,noreferrer");
        } else {
          onClick(e);
        }
      }}
    >
      <div className="mb-2">
        {project.title.map((line, index) => (
          <h2
            className={`${isMobile ? "text-5xl/12" : "text-6xl/14"} font-normal tracking-tighter`}
            key={index}
          >
            {line}
          </h2>
        ))}
      </div>
      <div className="flex items-center gap-2 !ml-1">
        <p className="project-date text-sm">{project.date}</p>
        {project.company && (
          <span className="company-badge">
            {project.company}
          </span>
        )}
      </div>
      <div className="!ml-1 !mt-2 text-sm">
        <ul className="flex flex-wrap gap-1 w-full">
          {project.stack.map((tag, index) => (
            <li key={index}>
              <Badge>{tag}</Badge>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-2 h-16">
        <p
          className="transition-opacity duration-300 ease-out"
          style={{ opacity: isActive ? 1 : 0 }}
        >
          <DecryptedText
            text={project.info}
            duration={2000}
            delay={350}
            trigger={activationKey}
            direction="left-to-right"
          />
        </p>
      </div>

      {showModal && (
        <ProjectModal
          project={project}
          onClose={() => {
            setShowModal(false);
            if (hoverTimerRef.current) {
              clearTimeout(hoverTimerRef.current);
              hoverTimerRef.current = null;
            }
          }}
        />
      )}
    </div>
  );
};

export default ProjectItem;
