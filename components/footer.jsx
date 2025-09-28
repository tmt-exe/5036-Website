/**
 * @name Footer
 * @description Footer component for the website
 * @returns {JSX.Element} Footer component
 */

'use client';

import { useState, useEffect } from 'react';
import { SocialIcon } from 'react-social-icons';

export default function Footer() {
  const [year, setYear] = useState(2025);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="dark:text-white">
      <small className="flex items-center justify-between">
        <span>
          Team 5036: The Robo Devils. © <time>{year}</time>
        </span>
        
        <div className="flex items-center space-x-2.5">
          <SocialIcon 
            url="https://www.facebook.com/Team5036/" 
            style={{width: "30px", height: "30px"}}
          />
          <SocialIcon 
            url="https://x.com/team5036" 
            style={{width: "30px", height: "30px"}}
          />
          <SocialIcon 
            url="https://www.instagram.com/frc5036" 
            style={{width: "30px", height: "30px"}}
          />
        </div>
      </small>
    </footer>
  );
}
