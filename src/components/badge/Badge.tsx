import React from "react";
import "./index.css";

type BadgeProps = {
  children: React.ReactNode;
  className?: string;
};

const Badge: React.FC<BadgeProps> = ({ children }) => {
  return (
    <div className="badge-pill">
      {children}
    </div>
  );
};

export default Badge;
