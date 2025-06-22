import { useEffect } from 'react';

export function usePullToRefresh(ref: React.RefObject<HTMLElement>, onRefresh: () => void) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let startY: number | null = null;
    let isPulled = false;

    const handleTouchStart = (e: TouchEvent) => {
      if (el.scrollTop === 0) {
        startY = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (startY === null) return;
      const diff = e.touches[0].clientY - startY;
      if (diff > 70) {
        isPulled = true;
      }
    };

    const handleTouchEnd = () => {
      if (isPulled) onRefresh();
      startY = null;
      isPulled = false;
    };

    el.addEventListener('touchstart', handleTouchStart);
    el.addEventListener('touchmove', handleTouchMove);
    el.addEventListener('touchend', handleTouchEnd);
    return () => {
      el.removeEventListener('touchstart', handleTouchStart);
      el.removeEventListener('touchmove', handleTouchMove);
      el.removeEventListener('touchend', handleTouchEnd);
    };
  }, [ref, onRefresh]);
}
