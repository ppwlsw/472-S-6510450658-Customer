import React, { type ReactNode } from "react";

interface GapControllerProps {
    children: ReactNode;
    gap?: number;
}

function XAxisSlide({ children, gap = 18 }: GapControllerProps) {
    return (
      <div
        className="flex flex-row overflow-x-scroll whitespace-nowrap hide-scrollbar"
        style={{ 
          gap: `${gap}px`,
          paddingRight: '24px' // Add padding to ensure the last item is fully visible and scrollable
        }}
      >
        {React.Children.map(children, (child) => (
          <div style={{ flexShrink: 0 }}>
            {child}
          </div>
        ))}
      </div>
    );
  }
  
  export default XAxisSlide;