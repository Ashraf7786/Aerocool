import React from 'react';

const Skeleton = ({ className, width, height, borderRadius, circle, style }) => {
  const baseStyles = {
    width: width || '100%',
    height: height || '1em',
    borderRadius: circle ? '50%' : borderRadius || '8px',
    ...style
  };

  return (
    <div 
      className={`skeleton ${className || ''}`} 
      style={baseStyles}
    />
  );
};

export default Skeleton;
