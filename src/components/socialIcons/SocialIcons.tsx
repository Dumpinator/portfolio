import React, { useState } from 'react';
import { Linkedin, Github, Mail } from 'lucide-react';

const SocialIcons: React.FC = () => {
  const [emailCopied, setEmailCopied] = useState(false);
  const email = 'j.deboisvilliers@gmail.com';

  const handleEmailCopy = () => {
    navigator.clipboard.writeText(email).then(() => {
      setEmailCopied(true);
      setTimeout(() => setEmailCopied(false), 2000);
    });
  };

  return (
    <div className="flex justify-center space-x-4 mt-2">
      {/* LinkedIn */}
      <a 
        href="https://www.linkedin.com/in/jdeboisvilliers/" 
        target="_blank" 
        rel="noopener noreferrer"
        className="hover:scale-110 transition-transform"
      >
        <Linkedin className="social-icon" size={12} />
      </a>

      {/* GitHub */}
      <a 
        href="https://github.com/Dumpinator" 
        target="_blank" 
        rel="noopener noreferrer"
        className="hover:scale-110 transition-transform"
      >
        <Github className="social-icon" size={12} />
      </a>

      {/* Email */}
      <button 
        onClick={handleEmailCopy}
        className="hover:scale-110 transition-transform relative"
      >
        <Mail className="social-icon" size={12} />
        {emailCopied && (
            <span 
            className="absolute -top-8 left-1/2 -translate-x-1/2 text-white text-xs px-2 py-1 rounded"
            style={{ backgroundColor: "var(--copied-bg)" }}
          >
            Copié !
          </span>
        )}
      </button>
    </div>
  );
};

export default SocialIcons;