import { ReactNode } from "react";
import PublicHeader from "./PublicHeader";
import PublicFooter from "./PublicFooter";

interface PublicLayoutProps {
  children: ReactNode;
  transparentHeader?: boolean;
}

export default function PublicLayout({ children, transparentHeader = false }: PublicLayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden flex flex-col">
      <PublicHeader transparent={transparentHeader} />
      
      {/* 
        Add padding-top to account for fixed header if not transparent.
        Header height is h-16 (64px) on mobile, h-20 (80px) on desktop.
        If transparent (like landing page), we rely on the hero section's padding.
      */}
      <main className={`flex-1 ${!transparentHeader ? 'pt-20 sm:pt-24' : ''}`}>
        {children}
      </main>
      
      <PublicFooter />
    </div>
  );
}
