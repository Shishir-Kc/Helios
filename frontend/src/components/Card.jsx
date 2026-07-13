import React from 'react';
import './Card.css';

export const Card = ({ variant = 'standard', children, className = '', ...props }) => {
  return (
    <div className={`card card-${variant} ${className}`} {...props}>
      {children}
    </div>
  );
};
