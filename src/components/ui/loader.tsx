
import React from 'react';
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface LoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'spinner' | 'dots' | 'pulse' | 'infinity';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  centered?: boolean;
}

const Loader = ({ 
  variant = 'spinner', 
  size = 'md', 
  className, 
  centered = false,
  ...props 
}: LoaderProps) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
    xl: "h-16 w-16"
  };

  const containerClasses = cn(
    "flex items-center justify-center",
    centered && "absolute inset-0 z-50",
    className
  );

  if (variant === 'spinner') {
    // Map size to actual SVG dimensions
    const svgSizes = {
      sm: { width: 60, height: 30 },
      md: { width: 120, height: 60 },
      lg: { width: 200, height: 100 },
      xl: { width: 300, height: 150 }
    };
    
    const { width, height } = svgSizes[size];
    
    return (
      <div className={containerClasses} {...props}>
          {/* Custom SVG Infinity Loader from Uiverse.io by shadowfax29 */}
        <div className="loading">
          <svg 
            viewBox="0 0 187.3 93.7" 
            className="svgbox" 
            style={{ width: `${width}px`, height: `${height}px` }}
          >
            <defs>
              <linearGradient y2="0%" x2="100%" y1="0%" x1="0%" id="gradient">
                <stop stopColor="pink" offset="0%"></stop>
                <stop stopColor="blue" offset="100%"></stop>
              </linearGradient>
            </defs>
            <path stroke="url(#gradient)" d="M93.9,46.4c9.3,9.5,13.8,17.9,23.5,17.9s17.5-7.8,17.5-17.5s-7.8-17.6-17.5-17.5c-9.7,0.1-13.3,7.2-22.1,17.1c-8.9,8.8-15.7,17.9-25.4,17.9s-17.5-7.8-17.5-17.5s7.8-17.5,17.5-17.5S86.2,38.6,93.9,46.4z"></path>
          </svg>
        </div>
      </div>
    );
  }

  if (variant === 'dots') {
    const dotSize = {
      sm: "h-1 w-1",
      md: "h-2 w-2",
      lg: "h-3 w-3",
      xl: "h-4 w-4"
    };
    return (
      <div className={cn(containerClasses, "gap-1")} {...props}>
        <div className={cn("bg-primary rounded-full animate-bounce [animation-delay:-0.3s]", dotSize[size])} />
        <div className={cn("bg-primary rounded-full animate-bounce [animation-delay:-0.15s]", dotSize[size])} />
        <div className={cn("bg-primary rounded-full animate-bounce", dotSize[size])} />
      </div>
    );
  }

  if (variant === 'pulse') {
     return (
      <div className={containerClasses} {...props}>
        <div className={cn("relative flex items-center justify-center", sizeClasses[size])}>
          <div className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/75 opacity-75"></div>
          <div className="relative inline-flex h-2/3 w-2/3 rounded-full bg-primary"></div>
        </div>
      </div>
    );
  }

  if (variant === 'infinity') {
    // Map size to actual SVG dimensions
    const svgSizes = {
      sm: { width: 60, height: 30 },
      md: { width: 120, height: 60 },
      lg: { width: 200, height: 100 },
      xl: { width: 300, height: 150 }
    };
    
    const { width, height } = svgSizes[size];
    
    return (
      <div className={containerClasses} {...props}>
          {/* Custom SVG Infinity Loader from Uiverse.io by shadowfax29 */}
        <div className="loading">
          <svg 
            viewBox="0 0 187.3 93.7" 
            className="svgbox" 
            style={{ width: `${width}px`, height: `${height}px` }}
          >
            <defs>
              <linearGradient y2="0%" x2="100%" y1="0%" x1="0%" id="gradient">
                <stop stopColor="pink" offset="0%"></stop>
                <stop stopColor="blue" offset="100%"></stop>
              </linearGradient>
            </defs>
            <path stroke="url(#gradient)" d="M93.9,46.4c9.3,9.5,13.8,17.9,23.5,17.9s17.5-7.8,17.5-17.5s-7.8-17.6-17.5-17.5c-9.7,0.1-13.3,7.2-22.1,17.1c-8.9,8.8-15.7,17.9-25.4,17.9s-17.5-7.8-17.5-17.5s7.8-17.5,17.5-17.5S86.2,38.6,93.9,46.4z"></path>
          </svg>
        </div>
      </div>
    );
  }

  // Default fallback
  const svgSizes = {
    sm: { width: 60, height: 30 },
    md: { width: 120, height: 60 },
    lg: { width: 200, height: 100 },
    xl: { width: 300, height: 150 }
  };
  
  const { width, height } = svgSizes[size];
  
  return (
    <div className={containerClasses} {...props}>
         {/* Custom SVG Infinity Loader from Uiverse.io by shadowfax29 */}
        <div className="loading">
          <svg 
            viewBox="0 0 187.3 93.7" 
            className="svgbox" 
            style={{ width: `${width}px`, height: `${height}px` }}
          >
            <defs>
              <linearGradient y2="0%" x2="100%" y1="0%" x1="0%" id="gradient">
                <stop stopColor="pink" offset="0%"></stop>
                <stop stopColor="blue" offset="100%"></stop>
              </linearGradient>
            </defs>
            <path stroke="url(#gradient)" d="M93.9,46.4c9.3,9.5,13.8,17.9,23.5,17.9s17.5-7.8,17.5-17.5s-7.8-17.6-17.5-17.5c-9.7,0.1-13.3,7.2-22.1,17.1c-8.9,8.8-15.7,17.9-25.4,17.9s-17.5-7.8-17.5-17.5s7.8-17.5,17.5-17.5S86.2,38.6,93.9,46.4z"></path>
          </svg>
        </div>
    </div>
  );
};

export default Loader;
