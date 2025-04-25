import { useState, useEffect } from 'react';

/**
 * Custom hook for detecting media query changes
 * @param query - The media query to match (e.g. '(min-width: 768px)')
 * @returns boolean indicating if the media query matches
 */
export function useMediaQuery(query: string): boolean {
  // Default to false for SSR
  const [matches, setMatches] = useState<boolean>(false);

  useEffect(() => {
    // Check if window is available (client-side)
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia(query);
      
      // Set initial value
      setMatches(mediaQuery.matches);

      // Define listener
      const handleChange = (event: MediaQueryListEvent) => {
        setMatches(event.matches);
      };

      // Add listener
      mediaQuery.addEventListener('change', handleChange);
      
      // Clean up
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
    
    return undefined;
  }, [query]);

  return matches;
} 