import { useEffect } from 'react'

/**
 * Suppress THREE.js deprecation warnings that haven't yet been fixed upstream.
 * Specifically suppresses the THREE.Clock -> THREE.Timer deprecation warning
 * which is caused by react-three-fiber's internal use of Clock.
 * 
 * This can be removed once react-three-fiber updates to use THREE.Timer.
 */
export function useSuppressThreeWarnings() {
  useEffect(() => {
    // Suppress THREE.Clock deprecation warning
    const originalWarn = console.warn
    console.warn = (...args) => {
      const message = args[0]?.toString?.() || String(args[0])
      
      // Suppress specific THREE.js warnings
      if (
        message.includes('THREE.Clock') &&
        message.includes('deprecated') &&
        message.includes('THREE.Timer')
      ) {
        return
      }
      
      originalWarn.apply(console, args)
    }
    
    return () => {
      console.warn = originalWarn
    }
  }, [])
}
