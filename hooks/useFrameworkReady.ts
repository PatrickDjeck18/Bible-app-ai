import { useEffect, useState } from 'react';

export function useFrameworkReady() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Simulate framework readiness. In a real app, you might listen for an event.
    setIsReady(true);
  }, []);

  return isReady;
}
