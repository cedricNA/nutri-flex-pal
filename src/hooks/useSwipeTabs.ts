import { useEffect } from 'react';

export function useSwipeTabs(ref: React.RefObject<HTMLElement>, onSwipe: (dir: 'left' | 'right') => void) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let startX: number | null = null;

    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
    };
    const handleTouchEnd = (e: TouchEvent) => {
      if (startX === null) return;
      const diff = e.changedTouches[0].clientX - startX;
      if (Math.abs(diff) > 50) {
        onSwipe(diff < 0 ? 'left' : 'right');
      }
      startX = null;
    };

    el.addEventListener('touchstart', handleTouchStart);
    el.addEventListener('touchend', handleTouchEnd);
    return () => {
      el.removeEventListener('touchstart', handleTouchStart);
      el.removeEventListener('touchend', handleTouchEnd);
    };
  }, [ref, onSwipe]);
}
