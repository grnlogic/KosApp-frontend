/**
 * Utility functions for performance optimization
 */

/**
 * Detects if the current device is a mobile device
 */
export const isMobileDevice = (): boolean => {
  return (
    window.innerWidth < 768 ||
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )
  );
};

/**
 * Creates a debounced version of a function that delays execution
 * @param func The function to debounce
 * @param wait Delay in milliseconds
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return function (...args: Parameters<T>): void {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
};

/**
 * Optimized version of RAF for animations
 * @param callback Animation callback
 */
export const optimizedRAF = (callback: FrameRequestCallback): number => {
  // On mobile devices, we might want to throttle animations
  if (isMobileDevice()) {
    // Run at half the frame rate on mobile
    return Math.random() > 0.5 ? requestAnimationFrame(callback) : -1;
  }

  // Normal RAF for desktop
  return requestAnimationFrame(callback);
};
