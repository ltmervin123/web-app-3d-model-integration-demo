'use client'

import { useEffect } from 'react'

interface ARInfoModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function ARInfoModal({ isOpen, onClose }: ARInfoModalProps) {
  // Close modal on Escape key
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-900 rounded-lg max-w-md w-full shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Augmented Reality
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            aria-label="Close modal"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-gray-700 dark:text-gray-300">
            This prototype uses a GLB model fully compatible with WebXR, ARCore,
            and ARKit. Future versions of MABULIG will place biodiversity models
            directly into real-world environments — letting students observe
            species in their natural habitat context through augmented reality.
          </p>

          <div className="pt-4 space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <p>
              <strong>WebXR:</strong> Web standard for immersive experiences
            </p>
            <p>
              <strong>ARCore:</strong> Google's AR platform for Android devices
            </p>
            <p>
              <strong>ARKit:</strong> Apple's AR framework for iOS devices
            </p>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  )
}
