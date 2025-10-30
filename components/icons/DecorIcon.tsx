import React from 'react';

export const DecorIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 5.52a2 2 0 0 1 2 2V12h-4V7.52a2 2 0 0 1 2-2z"/>
    <path d="M12 12v6.48a2 2 0 0 0 2 2h0a2 2 0 0 0 2-2V12H4v6.48a2 2 0 0 0 2 2h0a2 2 0 0 0 2-2V12h4z"/>
    <path d="M12 2v3.52"/>
    <path d="M18 12h3.52"/>
    <path d="M6 12H2.48"/>
  </svg>
);