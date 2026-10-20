import { Canvas, useFrame } from '@react-three/fiber'
import {
  ContactShadows,
  Environment,
  Html,
  OrbitControls,
  useGLTF,
} from '@react-three/drei'
import { Suspense, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'

const works = [
  {
    title: 'Industrial Pitched-Roof Frame',
    type: 'STEEL STRUCTURE / ROOF TRUSS',
    model: '/models/01_industrial_pitched_roof_frame.glb',
    image: '/assets/tekla-pitched-roof-frame.jpg',
  },
  {
    title: 'Structural Design Status',
    type: 'STRUCTURAL DESIGN / PASS–FAIL',
    model: '/models/02_industrial_design_status_pass_fail.glb',
    image: '/assets/tekla-design-status.jpg',
  },
  {
    title: 'Multi-Storey Structural Frame',
    type: 'MULTI-STOREY / STEEL FRAME',
    model: '/models/03_multistorey_structural_frame.glb',
    image: '/assets/tekla-multistorey-model.jpg',
  },
  {
    title: 'Tall Tower Structural Frame',
    type: 'HIGH-RISE / STRUCTURAL MODELLING',
    model: '/models/04_tall_tower_dense_floor_frame.glb',
    image: '/assets/tekla-multistorey-model.jpg',
  },
  {
    title: 'Structural Analysis Results',
    type: 'STRUCTURAL ANALYSIS / RESULTS',
    model: '/models/05_structural_analysis_results_visual.glb',
    image: '/assets/tekla-analysis-results.jpg',
  },
] as const

type Work = (typeof works)[number]

function LoadedStructuralModel({ path }: { path: string }) {
  const { scene } = useGLTF(path)

  const { object, scale, position } = useMemo(() => {
    const object = scene.clone(true)
    const bounds = new THREE.Box3().setFromObject(object)
    const size = bounds.getSize(new THREE.Vector3())
    const center = bounds.getCenter(new THREE.Vector3())
    const largestDimension = Math.max(size.x, size.y, size.z, 0.001)
    const scale = 4.8 / largestDimension

    object.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true
        child.receiveShadow = true
      }
    })

    return {
      object,
      scale,
      position: [
        -center.x * scale,
        -center.y * scale,
        -center.z * scale,
      ] as [number, number, number],
    }
  }, [scene])

  return (
    <group position={position} scale={scale}>
      <primitive object={object} />
    </group>
  )
}

function Scene({ work }: { work: Work }) {
  const group = useRef<THREE.Group>(null)

  useFrame((state, delta) => {
    if (!group.current) return
    group.current.rotation.y += delta * 0.12
    group.current.rotation.y += state.pointer.x * delta * 0.1
  })

  return (
    <>
      <color attach="background" args={['#0b1520']} />
      <fog attach="fog" args={['#0b1520', 14, 28]} />

      <ambientLight intensity={1.6} />
      <directionalLight
        position={[6, 9, 7]}
        intensity={2.8}
        castShadow
      />
      <directionalLight
        position={[-5, 4, -6]}
        intensity={1.5}
        color="#5794b0"
      />
      <pointLight position={[0, 5, 4]} intensity={35} color="#e1c68f" />

      <gridHelper
        args={[16, 32, '#37576a', '#203746']}
        position={[0, -2.6, 0]}
      />

      <group ref={group} position={[0, 0, 0]}>
        <LoadedStructuralModel key={work.model} path={work.model} />
      </group>

      <ContactShadows
        position={[0, -2.55, 0]}
        opacity={0.45}
        scale={10}
        blur={2.5}
        far={5}
      />

      <Html fullscreen style={{ pointerEvents: 'none' }}>
        <div
          style={{
            position: 'absolute',
            top: 18,
            left: 18,
            color: '#d6b77a',
            fontSize: 10,
            letterSpacing: '0.18em',
            fontFamily: 'monospace',
          }}
        >
          LIVE STRUCTURAL MODEL
        </div>
        <div
          style={{
            position: 'absolute',
            right: 18,
            bottom: 52,
            color: '#91a8b6',
            fontSize: 9,
            letterSpacing: '0.13em',
            fontFamily: 'monospace',
          }}
        >
          GLB · INTERACTIVE 3D
        </div>
      </Html>

      <Environment preset="city" />
    </>
  )
}

export default function ProjectShowcase3D() {
  const [active, setActive] = useState(0)
  const work = works[active]

  const previous = () => {
    setActive((index) => (index - 1 + works.length) % works.length)
  }

  const next = () => {
    setActive((index) => (index + 1) % works.length)
  }

  return (
    <div className="bim-showcase">
      <div className="bim-showcase-heading">
        <span className="bim-showcase-kicker">
          STRUCTURAL ENGINEERING / 3D MODELS
        </span>
        <span className="bim-showcase-count">
          {String(active + 1).padStart(2, '0')} /{' '}
          {String(works.length).padStart(2, '0')}
        </span>
      </div>

      <div className="bim-showcase-canvas">
        <Canvas
          shadows
          dpr={[1, 1.5]}
          camera={{ position: [6, 4.2, 7], fov: 42 }}
          gl={{ antialias: true, powerPreference: 'high-performance' }}
        >
          <Suspense
            fallback={
              <Html center>
                <div style={{ color: '#d6b77a', fontSize: 12 }}>
                  Loading structural model…
                </div>
              </Html>
            }
          >
            <Scene work={work} />
          </Suspense>

          <OrbitControls
            makeDefault
            enablePan
            enableDamping
            dampingFactor={0.06}
            minDistance={3}
            maxDistance={16}
            maxPolarAngle={Math.PI * 0.88}
          />
        </Canvas>

        <button
          className="bim-showcase-arrow bim-showcase-previous"
          type="button"
          onClick={previous}
          aria-label="Previous structural model"
        >
          ←
        </button>

        <button
          className="bim-showcase-arrow bim-showcase-next"
          type="button"
          onClick={next}
          aria-label="Next structural model"
        >
          →
        </button>

        <div className="bim-showcase-hint">
          DRAG TO ROTATE · SCROLL TO ZOOM · ARROWS TO CHANGE MODEL
        </div>
      </div>

      <div className="bim-showcase-footer" aria-live="polite">
        <div className="bim-showcase-project-info">
          <span className="bim-showcase-category">{work.type}</span>
          <h3>{work.title}</h3>
          <p>
            Explore the interactive 3D structural model. Rotate and zoom to
            inspect its geometry and framing.
          </p>
          <a
            className="text-link"
            href={work.image}
            target="_blank"
            rel="noreferrer"
          >
            View project reference ↗
          </a>
        </div>

        <div className="bim-showcase-controls">
          <div className="bim-showcase-dots">
            {works.map((item, index) => (
              <button
                key={item.model}
                className={`bim-showcase-dot ${
                  index === active ? 'is-active' : ''
                }`}
                type="button"
                onClick={() => setActive(index)}
                aria-label={`Show ${item.title}`}
                aria-current={index === active ? 'true' : undefined}
              />
            ))}
          </div>
          <span className="bim-showcase-shortcut">
            EXPLORE {works.length} MODELS
          </span>
        </div>
      </div>
    </div>
  )
}
