---
title: MABULIG AR Biodiversity — Web Prototype
version: 2.0.0
status: refined
last_updated: 2026-06-22
agent_notes: |
  This file is the complete plan for the web prototype.
  The mobile prototype has its own separate PLAN.md in ../mobile-app-3d-model-integration-demo/PLAN.md
  
  An AI agent implementing this plan should:
  1. Read all sections top-to-bottom before writing any code.
  2. Follow tasks in order — each task depends on the previous.
  3. Use the code snippets verbatim; they are copy-paste ready.
  4. Check acceptance_criteria after completing each feature.
  5. The folder_structure section defines every file that must be created.
tags: [next.js, react-three-fiber, augmented-reality, biodiversity, webxr]
---

# MABULIG AR Biodiversity — Web Prototype

## Project Goal

Develop a web prototype demonstrating how a 3D biodiversity model can be integrated
into a web application for future Augmented Reality (AR) experiences.

### Objectives

- Display a 3D butterfly model (`.glb`)
- Present species metadata alongside the viewer
- Support user interaction: rotate and zoom
- Demonstrate architecture for future AR integration
- Provide a responsive web prototype (desktop + mobile browser)

---

## Technology Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 15, React 19, TypeScript |
| 3D Rendering | Three.js, React Three Fiber, @react-three/drei |
| Styling | Tailwind CSS |
| Deployment | Vercel |

---

## Architecture

```
butterfly.glb
      │
      ▼
React Three Fiber (useGLTF + Canvas)
      │
      ▼
Next.js 15 Web Application
      │
 ┌────┴────┐
 ▼         ▼
Desktop   Mobile Browser (responsive)

── Future Extension ──────────────────────
WebXR Integration
      │
      ▼
ARCore (Android) / ARKit (iOS) / Vision Pro
```

---

## Folder Structure

> **Agent note:** Create every file listed here. Files marked `← new` were
> added in the refinement pass to address loading states, error handling,
> and accessibility.

```
src/
├── app/
│   └── page.tsx                        # Responsive homepage
│
├── components/
│   ├── ButterflyViewer.tsx             # 3D canvas + controls
│   ├── ModelErrorBoundary.tsx          # ← new: error fallback
│   ├── SpeciesInfo.tsx                 # Metadata panel
│   └── ARInfoModal.tsx                 # AR explanation modal
│
├── data/
│   └── species.ts                      # Static species metadata
│
├── hooks/
│   └── usePrefersReducedMotion.ts      # ← new: a11y hook
│
└── types/
    └── species.ts                      # Species TypeScript type

public/
└── models/
    └── butterfly.glb                   # 3D model (sourced separately)
```

---

## GLB Model Sourcing

> **Agent note:** `butterfly.glb` must exist at `public/models/butterfly.glb`
> before the viewer component will work. Source it from one of the options
> below, then run the optimization command.

### Free Sources

| Source | License | URL |
|--------|---------|-----|
| Sketchfab | CC BY or CC0 | https://sketchfab.com — search "butterfly", filter by license |
| Three.js examples | MIT | https://github.com/mrdoob/three.js/tree/dev/examples/models |
| Meshy.ai | Free tier | https://meshy.ai — generate from text prompt |
| Luma AI | Free tier | https://lumalabs.ai — photogrammetry from phone video |

### Optimization

```bash
npm install -g gltf-pipeline
gltf-pipeline -i butterfly.glb -o butterfly-optimized.glb --draco.compressionLevel 7
```

Validate before deploying: https://gltf.report

---

## Features

### Feature 1: 3D Butterfly Viewer

**Requirements:**
- Load `butterfly.glb` from `public/models/`
- Render inside a Three.js `<Canvas>`
- Auto-rotate (disabled when `prefers-reduced-motion: reduce` is active)
- Allow user rotation via `OrbitControls`
- Allow zoom via `OrbitControls`
- Show a loading indicator while the GLB fetches
- Show a 3D error fallback if the model fails to load

**Acceptance criteria:**
- [ ] Model loads successfully
- [ ] Loading spinner is visible during fetch
- [ ] Error boundary renders a gray cube on failure — no white screen
- [ ] User can rotate the model by dragging
- [ ] User can zoom with scroll / pinch
- [ ] Auto-rotate stops when `prefers-reduced-motion` is active
- [ ] No console errors

#### Implementation: `src/components/ButterflyViewer.tsx`

```tsx
import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF, Html, Center } from '@react-three/drei'
import ModelErrorBoundary from './ModelErrorBoundary'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

function ButterflyModel() {
  const { scene } = useGLTF('/models/butterfly.glb')
  return <primitive object={scene} />
}

function LoadingFallback() {
  return (
    <Html center>
      <p className="text-sm text-gray-400 animate-pulse">Loading model…</p>
    </Html>
  )
}

export default function ButterflyViewer() {
  const reducedMotion = usePrefersReducedMotion()

  return (
    <Canvas camera={{ position: [0, 0, 3] }}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <ModelErrorBoundary>
        <Suspense fallback={<LoadingFallback />}>
          <Center>
            <ButterflyModel />
          </Center>
        </Suspense>
      </ModelErrorBoundary>
      <OrbitControls
        autoRotate={!reducedMotion}
        autoRotateSpeed={1.5}
        enableZoom
      />
    </Canvas>
  )
}
```

#### Implementation: `src/components/ModelErrorBoundary.tsx`

```tsx
import { Component, ReactNode } from 'react'

interface Props { children: ReactNode }
interface State { hasError: boolean }

export default class ModelErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="gray" />
        </mesh>
      )
    }
    return this.props.children
  }
}
```

---

### Feature 2: Species Information Panel

**Requirements:**
- Display all metadata fields
- Typed via `Species` interface from `src/types/species.ts`

**Acceptance criteria:**
- [ ] All six fields render correctly
- [ ] Component accepts a `Species` prop — no hardcoded strings inside JSX

#### Type: `src/types/species.ts`

```ts
export interface Species {
  commonName: string
  scientificName: string
  family: string
  order: string
  habitat: string
  conservationStatus: 'Least Concern' | 'Near Threatened' | 'Vulnerable' | 'Endangered' | 'Critically Endangered'
}
```

#### Data: `src/data/species.ts`

```ts
import { Species } from '../types/species'

export const butterflyData: Species = {
  commonName: 'Lime Swallowtail',
  scientificName: 'Papilio demoleus',
  family: 'Papilionidae',
  order: 'Lepidoptera',
  habitat: 'Tropical forests, gardens, and citrus orchards',
  conservationStatus: 'Least Concern',
}
```

---

### Feature 3: Responsive Layout

**Requirements:**
- Desktop: 3D viewer left, metadata panel right (CSS Grid two-column)
- Mobile: 3D viewer top, metadata below (single column)
- No layout overflow at any viewport width

**Acceptance criteria:**
- [ ] Desktop layout renders two columns at `md` breakpoint and above
- [ ] Mobile layout stacks vertically below `md`
- [ ] No horizontal scroll at 375px viewport width

#### Layout sketch

Desktop (`md` and above):
```
┌──────────────────┬─────────────┐
│                  │             │
│   ButterflyViewer│ SpeciesInfo │
│   (3D canvas)    │ (metadata)  │
│                  │             │
└──────────────────┴─────────────┘
```

Mobile (below `md`):
```
┌──────────────────┐
│  ButterflyViewer │
│  (3D canvas)     │
└──────────────────┘
┌──────────────────┐
│  SpeciesInfo     │
│  (metadata)      │
└──────────────────┘
```

#### Tailwind classes for `page.tsx`

```tsx
<main className="min-h-screen flex flex-col md:flex-row">
  <div className="w-full md:w-1/2 h-[50vh] md:h-screen">
    <ButterflyViewer />
  </div>
  <div className="w-full md:w-1/2 overflow-y-auto p-6">
    <SpeciesInfo species={butterflyData} />
  </div>
</main>
```

---

### Feature 3a: Accessibility — Reduced Motion

**Requirements:**
- Disable `autoRotate` when the OS `prefers-reduced-motion: reduce` setting is active
- Hook must be SSR-safe (no `window` access during server render)

**Acceptance criteria:**
- [ ] `autoRotate` is `false` when OS reduced motion is enabled
- [ ] No SSR errors from `window.matchMedia`

#### Implementation: `src/hooks/usePrefersReducedMotion.ts`

```ts
import { useEffect, useState } from 'react'

export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    // Guard: window is not available during SSR
    if (typeof window === 'undefined') return

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)

    const handler = (e: MediaQueryListEvent) => setReduced(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  return reduced
}
```

---

### Feature 4: AR Information Modal

**Requirements:**
- "View in AR" button visible in the header or above the viewer
- Clicking opens a modal — no page navigation
- Modal explains WebXR, ARCore, and ARKit compatibility
- Modal is dismissible via a close button or overlay click

**Acceptance criteria:**
- [ ] Button is visible on both desktop and mobile
- [ ] Modal opens on click
- [ ] Modal closes on button click or outside click
- [ ] Modal content mentions WebXR, ARCore, and ARKit

**Modal copy:**

> This prototype uses a GLB model fully compatible with WebXR, ARCore, and ARKit.
> Future versions of MABULIG will place biodiversity models directly into
> real-world environments — letting students observe species in their natural
> habitat context through augmented reality.

---

## Implementation Tasks

> **Agent note:** Complete tasks in order. Each task depends on the previous.

### Task 1 — Initialise project

```bash
npx create-next-app@latest . \
  --typescript \
  --tailwind \
  --app \
  --src-dir \
  --import-alias "@/*"
```

Done when: `npm run dev` serves the default Next.js page without errors.

---

### Task 2 — Install dependencies

```bash
npm install three @react-three/fiber @react-three/drei
npm install --save-dev @types/three
```

Done when: `npm run build` completes with no TypeScript errors.

---

### Task 3 — Source and place GLB model

1. Download a butterfly GLB from one of the sources in [GLB Model Sourcing](#glb-model-sourcing).
2. Optimize: `gltf-pipeline -i butterfly.glb -o butterfly-optimized.glb --draco.compressionLevel 7`
3. Place at `public/models/butterfly.glb`.

Done when: `http://localhost:3000/models/butterfly.glb` returns the file (HTTP 200).

---

### Task 4 — Create types and data

Create `src/types/species.ts` and `src/data/species.ts` using the snippets in Feature 2.

Done when: TypeScript compiles without errors.

---

### Task 5 — Create `usePrefersReducedMotion` hook

Create `src/hooks/usePrefersReducedMotion.ts` using the snippet in Feature 3a.

Done when: Hook exports correctly and TypeScript is satisfied.

---

### Task 6 — Create `ModelErrorBoundary`

Create `src/components/ModelErrorBoundary.tsx` using the snippet in Feature 1.

Done when: Component renders a gray cube when `hasError` is `true`.

---

### Task 7 — Create `ButterflyViewer`

Create `src/components/ButterflyViewer.tsx` using the snippet in Feature 1.

Done when: Model loads in the browser, OrbitControls work, and the loading
fallback is visible briefly before the model appears.

---

### Task 8 — Create `SpeciesInfo`

Create `src/components/SpeciesInfo.tsx`. It must:
- Accept a `species: Species` prop
- Render all fields from the `Species` type
- Use Tailwind for styling

Done when: All metadata fields render in the browser.

---

### Task 9 — Create `ARInfoModal`

Create `src/components/ARInfoModal.tsx`. It must:
- Accept `isOpen: boolean` and `onClose: () => void` props
- Render the modal copy from Feature 4
- Close on overlay click and close button click

Done when: Modal opens and closes correctly on both desktop and mobile.

---

### Task 10 — Assemble `page.tsx`

Wire all components together in `src/app/page.tsx` using the Tailwind layout
from Feature 3. Import `butterflyData` from `src/data/species.ts`.

Done when: Full page renders with 3D viewer + metadata + AR button working.

---

### Task 11 — Deploy to Vercel

```bash
npx vercel --prod
```

Copy the production URL and share it with the mobile team. Done when: The production URL loads the app without errors and the GLB model is served from the Vercel CDN.

---

## Deliverables

- [x] Prototype plan (this file)
- [ ] Next.js web application (deployed to Vercel)
- [ ] `butterfly.glb` (sourced, optimized, validated)
- [ ] Species metadata panel
- [ ] Loading states and error boundaries
- [ ] Responsive layout (desktop + mobile browser)
- [ ] Accessibility (reduced motion support)
- [ ] AR information modal

---

## Success Criteria

| # | Criterion |
|---|-----------|
| 1 | 3D model integrates into the web app with loading and error states |
| 2 | Metadata displays correctly alongside the viewer |
| 3 | Accessibility: reduced motion preference respected |
| 4 | Responsive layout works on desktop (1920px) and mobile (375px) |
| 5 | Future AR architecture clearly communicated via modal |
| 6 | Engineering practices: error boundaries, TypeScript types, clean folder structure |

---

## Next Steps

1. Deploy this web prototype to Vercel.
2. Share the production URL with the mobile team in `../mobile-app-3d-model-integration-demo/PLAN.md`.
3. Mobile team uses that URL in their `App.tsx` `VERCEL_URL` constant to load this prototype in a `react-native-webview`.
