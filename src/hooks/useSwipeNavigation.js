import { useEffect } from 'react';

export function useSwipeNavigation(onSwipeLeft, onSwipeRight) {
  useEffect(() => {
    let touchStartX = 0;
    let touchStartY = 0;
    const minSwipeDistance = 50;
    const maxVerticalDelta = 100;

    function handleTouchStart(e) {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }

    function handleTouchEnd(e) {
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      const dx = touchEndX - touchStartX;
      const dy = Math.abs(touchEndY - touchStartY);

      if (dy > maxVerticalDelta) return;

      if (dx > minSwipeDistance && onSwipeRight) {
        onSwipeRight();
      } else if (dx < -minSwipeDistance && onSwipeLeft) {
        onSwipeLeft();
      }
    }

    document.addEventListener('touchstart', handleTouchStart, false);
    document.addEventListener('touchend', handleTouchEnd, false);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [onSwipeLeft, onSwipeRight]);
}
