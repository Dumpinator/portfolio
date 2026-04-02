import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import "../../index.css";

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

type ProjectModalProps = {
  project: Project;
  onClose: () => void;
};

const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timeout = requestAnimationFrame(() => {
      if (modalRef.current) {
        modalRef.current.classList.add("modal-visible");
      }
    });
    return () => cancelAnimationFrame(timeout);
  }, []);

  const handleClose = () => {
    if (modalRef.current) {
      modalRef.current.classList.remove("modal-visible");
      setTimeout(onClose, 250);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (e.target === e.currentTarget) handleClose();
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  return createPortal(
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div ref={modalRef} className="modal-panel">
        {project.image ? (
          <div className="modal-image-wrapper">
            <img
              src={project.image}
              alt={project.title.join(" ")}
              className="modal-image"
            />
            <button className="modal-close-btn" onClick={(e) => { e.stopPropagation(); handleClose(); }}>
              ✕
            </button>
          </div>
        ) : (
          <div className="modal-image-wrapper">
            <div className="modal-image-placeholder">
              <span className="modal-placeholder-title">
                {project.title.join(" ")}
              </span>
            </div>
            <button className="modal-close-btn" onClick={(e) => { e.stopPropagation(); handleClose(); }}>
              ✕
            </button>
          </div>
        )}

        <div className="modal-content">
          <div className="modal-header">
            <h2 className="modal-title">{project.title.join(" ")}</h2>
            <div className="modal-meta">
              <span className="modal-date">{project.date}</span>
              {project.company && (
                <span className="company-badge">{project.company}</span>
              )}
            </div>
          </div>

          <p className="modal-description">{project.details}</p>

          {project.highlights && project.highlights.length > 0 && (
            <ul className="modal-highlights">
              {project.highlights.map((item, i) => (
                <li key={i} className="modal-highlight-item">
                  <span className="modal-bullet">▹</span>
                  {item}
                </li>
              ))}
            </ul>
          )}

          {project.link && project.link.length > 0 && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="modal-link"
            >
              View project →
            </a>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ProjectModal;