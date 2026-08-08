'use client';

import useCanvasCursor from '@/hooks/use-canvasCursor';
import { useEffect, useState } from 'react';

const CursorCore = () => {
  useCanvasCursor();
  return <canvas className="pointer-events-none fixed inset-0 z-50" id="canvas" />;
};

const CanvasCursor = () => {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkScreen = () => {
      // 768px matches Tailwind's 'md' breakpoint
      setIsDesktop(window.innerWidth >= 768);
    };
    
    checkScreen();
    window.addEventListener('resize', checkScreen);
    
    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  if (!isDesktop) return null;

  return <CursorCore />;
};

export default CanvasCursor;
