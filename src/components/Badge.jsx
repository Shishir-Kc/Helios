import React from 'react';
import './Badge.css';

export const Badge = ({ variant = 'neutral', children, className = '', ...props }) => {
  return (
    <span className={`badge badge-${variant} ${className}`} {...props}>
      {children}
    </span>
  );
};
