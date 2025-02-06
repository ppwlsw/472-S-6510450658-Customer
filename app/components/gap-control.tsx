import { ReactNode } from "react";

interface GapControllerProps {
  children: ReactNode;
  gap?: Number;
}

function GapController({ children, gap }: GapControllerProps) {
  return <div className={`flex flex-col`} style={{ gap: `${gap}px` }}>{children}</div>;
}

export default GapController;
