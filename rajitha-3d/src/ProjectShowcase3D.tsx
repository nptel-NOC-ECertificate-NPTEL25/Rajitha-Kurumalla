import { Canvas, useFrame } from '@react-three/fiber'
import { ContactShadows, Environment, OrbitControls, Html } from '@react-three/drei'
import { Suspense, useRef, useState } from 'react'
import * as THREE from 'three'

const works = [
  { title: 'Multi-Storey Building', type: 'RCC / STEEL FRAME', model: 'building' },
  { title: 'Industrial Steel Structure', type: 'PORTAL FRAME / ROOF TRUSS', model: 'shed' },
  { title: 'Foundation System', type: 'ISOLATED FOOTINGS / COLUMNS', model: 'foundation' },
  { title: 'Structural Analysis Model', type: 'BEAM / COLUMN ANALYSIS', model: 'analysis' },
  { title: 'BIM Coordination Model', type: 'STRUCTURAL GRID / BRACING', model: 'bim' },
  { title: 'Structural Member Detail', type: 'STEEL CONNECTION / MEMBER', model: 'member' },
] as const

type Work = (typeof works)[number]

const steel = '#8ca9b8'
const darkSteel = '#354e5e'
const concrete = '#9ca9af'
const gold = '#d4b477'

function Beam({
  a, b, radius = 0.035, color = steel,
}: {
  a: [number, number, number]
  b: [number, number, number]
  radius?: number
  color?: string
}) {
  const start = new THREE.Vector3(...a)
  const end = new THREE.Vector3(...b)
  const direction = end.clone().sub(start)
  const center = start.clone().add(end).multiplyScalar(0.5)
  const quaternion = new THREE.Quaternion().setFromUnitVectors(
    new THREE.Vector3(0, 1, 0), direction.clone().normalize(),
  )

  return (
    <mesh position={center} quaternion={quaternion} castShadow receiveShadow>
      <cylinderGeometry args={[radius, radius, direction.length(), 8]} />
      <meshStandardMaterial color={color} metalness={0.65} roughness={0.32} />
    </mesh>
  )
}

function Column({ x, z, height, color = darkSteel }: {
  x: number; z: number; height: number; color?: string
}) {
  return (
    <group position={[x, height / 2, z]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.15, height, 0.15]} />
        <meshStandardMaterial color={color} metalness={0.55} roughness={0.38} />
      </mesh>
      <mesh position={[0, -height / 2 + 0.045, 0]} castShadow>
        <boxGeometry args={[0.3, 0.09, 0.3]} />
        <meshStandardMaterial color={gold} metalness={0.7} roughness={0.3} />
      </mesh>
    </group>
  )
}

function BeamX({ x1, x2, y, z, color = steel, depth = 0.085 }: {
  x1: number; x2: number; y: number; z: number; color?: string; depth?: number
}) {
  return (
    <mesh position={[(x1 + x2) / 2, y, z]} castShadow receiveShadow>
      <boxGeometry args={[Math.abs(x2 - x1), depth, depth]} />
      <meshStandardMaterial color={color} metalness={0.62} roughness={0.3} />
    </mesh>
  )
}

function BeamZ({ x, y, z1, z2, color = steel, depth = 0.075 }: {
  x: number; y: number; z1: number; z2: number; color?: string; depth?: number
}) {
  return (
    <mesh position={[x, y, (z1 + z2) / 2]} castShadow receiveShadow>
      <boxGeometry args={[depth, depth, Math.abs(z2 - z1)]} />
      <meshStandardMaterial color={color} metalness={0.62} roughness={0.3} />
    </mesh>
  )
}

function FloorSlab({ y, width = 3.6, depth = 2.4 }: {
  y: number; width?: number; depth?: number
}) {
  return (
    <mesh position={[0, y, 0]} receiveShadow castShadow>
      <boxGeometry args={[width, 0.075, depth]} />
      <meshStandardMaterial
        color={concrete}
        roughness={0.8}
        metalness={0.05}
        transparent
        opacity={0.72}
      />
    </mesh>
  )
}

function MultiStoreyBuilding() {
  const xs = [-1.65, -0.55, 0.55, 1.65]
  const zs = [-1.05, 1.05]
  const levels = [0, 1.05, 2.1, 3.15]

  return (
    <group>
      {xs.map(x => zs.map(z => (
        <Column key={`${x}-${z}`} x={x} z={z} height={3.2} />
      )))}
      {levels.map((y, i) => (
        <group key={y}>
          {xs.slice(0, -1).map(x => zs.map(z => (
            <BeamX key={`${x}-${z}`} x1={x} x2={x + 1.1} y={y} z={z} />
          )))}
          {xs.map(x => (
            <BeamZ key={x} x={x} y={y} z1={-1.05} z2={1.05} />
          ))}
          {i > 0 && <FloorSlab y={y - 0.06} />}
        </group>
      ))}
      {levels.slice(0, -1).map((y, i) => (
        <group key={y}>
          <Beam a={[-1.65, y, -1.05]} b={[-0.55, y + 1.05, -1.05]} color={gold} radius={0.025} />
          <Beam a={[-0.55, y + 1.05, -1.05]} b={[0.55, y, -1.05]} color={gold} radius={0.025} />
          {i === 2 && (
            <>
              <Beam a={[0.55, y, -1.05]} b={[1.65, y + 1.05, -1.05]} color={gold} radius={0.025} />
              <Beam a={[1.65, y + 1.05, -1.05]} b={[1.65, y, -1.05]} color={gold} radius={0.025} />
            </>
          )}
        </group>
      ))}
      {xs.map(x => zs.map(z => (
        <mesh key={`${x}-${z}`} position={[x, 0.025, z]}>
          <boxGeometry args={[0.36, 0.12, 0.36]} />
          <meshStandardMaterial color={gold} metalness={0.65} roughness={0.3} />
        </mesh>
      )))}
    </group>
  )
}

function IndustrialShed() {
  const bays = [-1.8, -0.6, 0.6, 1.8]
  const eaves = 1.8
  const ridge = 2.55

  return (
    <group>
      {bays.map(x => (
        <group key={x}>
          <Column x={x} z={-1} height={eaves} />
          <Column x={x} z={1} height={eaves} />
          <Beam a={[x, eaves, -1]} b={[x, ridge, 0]} color={gold} radius={0.045} />
          <Beam a={[x, ridge, 0]} b={[x, eaves, 1]} color={gold} radius={0.045} />
          <BeamZ x={x} y={eaves} z1={-1} z2={1} />
        </group>
      ))}
      {bays.slice(0, -1).map(x => (
        <group key={x}>
          <Beam a={[x, eaves, -1]} b={[x + 1.2, ridge, 0]} radius={0.025} />
          <Beam a={[x + 1.2, ridge, 0]} b={[x, eaves, 1]} radius={0.025} />
          <Beam a={[x, eaves, 1]} b={[x + 1.2, eaves, 1]} />
          <Beam a={[x, eaves, -1]} b={[x + 1.2, eaves, -1]} />
        </group>
      ))}
      {[-0.5, 0, 0.5].map(z => (
        <Beam key={z} a={[-1.8, z === 0 ? ridge : 2.15, z]} b={[1.8, z === 0 ? ridge : 2.15, z]} color={gold} radius={0.035} />
      ))}
      {bays.map(x => (
        <group key={x}>
          <Beam a={[x, eaves, -1]} b={[x + 0.55, eaves + 0.35, -1]} color={gold} radius={0.02} />
          <Beam a={[x, eaves, 1]} b={[x + 0.55, eaves + 0.35, 1]} color={gold} radius={0.02} />
        </group>
      ))}
    </group>
  )
}

function FoundationSystem() {
  const locations: [number, number][] = [
    [-1.25, -0.75], [0, -0.75], [1.25, -0.75],
    [-1.25, 0.75], [0, 0.75], [1.25, 0.75],
  ]

  return (
    <group>
      {locations.map(([x, z]) => (
        <group key={`${x}-${z}`}>
          <mesh position={[x, 0.08, z]} castShadow receiveShadow>
            <boxGeometry args={[0.82, 0.2, 0.72]} />
            <meshStandardMaterial color="#9aabb2" roughness={0.8} />
          </mesh>
          <mesh position={[x, 0.22, z]} castShadow>
            <boxGeometry args={[0.5, 0.12, 0.45]} />
            <meshStandardMaterial color="#b4c0c5" roughness={0.8} />
          </mesh>
          <Column x={x} z={z} height={1.55} />
          {[-0.12, 0.12].map(offset => (
            <Beam key={offset} a={[x + offset, 0.28, z - 0.15]} b={[x + offset, 1.5, z - 0.15]} color={gold} radius={0.012} />
          ))}
        </group>
      ))}
      {[-0.75, 0.75].map(z => (
        <BeamX key={z} x1={-1.25} x2={1.25} y={1.55} z={z} color={gold} />
      ))}
      {[-1.25, 0, 1.25].map(x => (
        <BeamZ key={x} x={x} y={1.55} z1={-0.75} z2={0.75} color={gold} />
      ))}
    </group>
  )
}

function AnalysisFrame() {
  const heights = [1.1, 1.55, 1.9, 1.45, 1.05]
  const xs = [-1.6, -0.8, 0, 0.8, 1.6]

  return (
    <group>
      {xs.map((x, i) => (
        <group key={x}>
          <Column x={x} z={0} height={heights[i]} color={i % 2 ? '#438ba8' : '#d6b477'} />
          <BeamX
            x1={x - 0.4}
            x2={x + 0.4}
            y={heights[i]}
            z={0}
            color={i % 2 ? '#5ea8c3' : '#d6b477'}
          />
        </group>
      ))}
      {xs.slice(0, -1).map((x, i) => (
        <group key={x}>
          <Beam
            a={[x, heights[i], 0]}
            b={[x + 0.8, heights[i + 1], 0]}
            color="#e4c57d"
            radius={0.022}
          />
          <Beam
            a={[x, 0.05, 0]}
            b={[x + 0.8, heights[i + 1], 0]}
            color="#487c95"
            radius={0.02}
          />
        </group>
      ))}
      <mesh position={[0, -0.03, 0]}>
        <boxGeometry args={[4, 0.08, 0.6]} />
        <meshStandardMaterial color="#354e5e" />
      </mesh>
    </group>
  )
}

function BIMFrame() {
  const xs = [-1.5, -0.5, 0.5, 1.5]
  const zs = [-0.9, 0.9]
  const ys = [0, 1.1, 2.2]

  return (
    <group>
      {xs.map(x => zs.map(z => (
        <Column key={`${x}-${z}`} x={x} z={z} height={2.2} />
      )))}
      {ys.map(y => (
        <group key={y}>
          {xs.slice(0, -1).map(x => zs.map(z => (
            <BeamX key={`${x}-${z}`} x1={x} x2={x + 1} y={y} z={z} />
          )))}
          {xs.map(x => <BeamZ key={x} x={x} y={y} z1={-0.9} z2={0.9} />)}
        </group>
      ))}
      {[-0.9, 0.9].map(z => (
        <group key={z}>
          <Beam a={[-1.5, 0, z]} b={[-0.5, 1.1, z]} color={gold} radius={0.03} />
          <Beam a={[-0.5, 1.1, z]} b={[0.5, 0, z]} color={gold} radius={0.03} />
          <Beam a={[0.5, 0, z]} b={[1.5, 1.1, z]} color={gold} radius={0.03} />
          <Beam a={[1.5, 1.1, z]} b={[1.5, 2.2, z]} color={gold} radius={0.03} />
        </group>
      ))}
      <FloorSlab y={1.08} width={3.25} depth={1.9} />
    </group>
  )
}

function MemberDetail() {
  return (
    <group>
      <mesh position={[0, 0.95, 0]} castShadow>
        <boxGeometry args={[2.8, 0.18, 0.2]} />
        <meshStandardMaterial color={steel} metalness={0.7} roughness={0.25} />
      </mesh>
      <mesh position={[0, 0.45, 0]} castShadow>
        <boxGeometry args={[0.18, 1.2, 0.2]} />
        <meshStandardMaterial color={gold} metalness={0.7} roughness={0.25} />
      </mesh>
      <mesh position={[0, 0.83, 0.13]}>
        <boxGeometry args={[0.52, 0.62, 0.05]} />
        <meshStandardMaterial color="#496d80" metalness={0.6} roughness={0.35} />
      </mesh>
      {[-0.16, 0, 0.16].map(x => [-0.16, 0, 0.16].map(y => (
        <mesh key={`${x}-${y}`} position={[x, 0.83 + y, 0.17]}>
          <cylinderGeometry args={[0.035, 0.035, 0.04, 12]} />
          <meshStandardMaterial color={gold} metalness={0.85} roughness={0.2} />
        </mesh>
      )))}
      <Beam a={[-1.5, 0.85, 0]} b={[-1.5, -0.35, 0]} color={steel} radius={0.075} />
      <Beam a={[1.5, 0.85, 0]} b={[1.5, -0.35, 0]} color={steel} radius={0.075} />
      <mesh position={[0, -0.3, 0]}>
        <boxGeometry args={[3.5, 0.08, 0.5]} />
        <meshStandardMaterial color={darkSteel} metalness={0.55} roughness={0.3} />
      </mesh>
    </group>
  )
}

function StructuralModel({ work }: { work: Work }) {
  switch (work.model) {
    case 'building': return <MultiStoreyBuilding />
    case 'shed': return <IndustrialShed />
    case 'foundation': return <FoundationSystem />
    case 'analysis': return <AnalysisFrame />
    case 'bim': return <BIMFrame />
    case 'member': return <MemberDetail />
  }
}

function Scene({ work }: { work: Work }) {
  const group = useRef<THREE.Group>(null)

  useFrame((state, delta) => {
    if (!group.current) return
    group.current.rotation.y += delta * 0.07
    group.current.rotation.y += state.pointer.x * delta * 0.12
  })

  return (
    <>
      <color attach="background" args={['#0b1520']} />
      <fog attach="fog" args={['#0b1520', 10, 20]} />
      <ambientLight intensity={1.25} />
      <directionalLight position={[5, 8, 6]} intensity={2.6} castShadow />
      <directionalLight position={[-5, 3, -4]} intensity={1.2} color="#5794b0" />
      <pointLight position={[0, 4, 3]} intensity={30} color="#e1c68f" />
      <gridHelper args={[14, 28, '#37576a', '#203746']} position={[0, -0.12, 0]} />
      <group ref={group} position={[0, -0.25, 0]}>
        <StructuralModel work={work} />
      </group>
      <ContactShadows position={[0, -0.13, 0]} opacity={0.5} scale={9} blur={2.5} far={4} />
      <Html fullscreen style={{ pointerEvents: 'none' }}>
        <div style={{
          position: 'absolute', top: 18, left: 18, color: '#d6b77a',
          fontSize: 10, letterSpacing: '0.18em', fontFamily: 'monospace',
        }}>
          LIVE STRUCTURAL MODEL
        </div>
      </Html>
      <Environment preset="city" />
    </>
  )
}

export default function ProjectShowcase3D() {
  const [active, setActive] = useState(0)
  const work = works[active]

  return (
    <div className="bim-showcase">
      <div className="bim-showcase-heading">
        <span className="bim-showcase-kicker">STRUCTURAL ENGINEERING / 3D MODELS</span>
        <span className="bim-showcase-count">
          {String(active + 1).padStart(2, '0')} / {String(works.length).padStart(2, '0')}
        </span>
      </div>

      <div className="bim-showcase-canvas">
        <Canvas
          shadows
          dpr={[1, 1.5]}
          camera={{ position: [5, 3.5, 7], fov: 42 }}
          gl={{ antialias: true, powerPreference: 'high-performance' }}
        >
          <Suspense fallback={null}>
            <Scene work={work} />
          </Suspense>
          <OrbitControls
            enablePan
            enableDamping
            dampingFactor={0.06}
            minDistance={3.5}
            maxDistance={12}
            maxPolarAngle={Math.PI / 2 + 0.05}
          />
        </Canvas>

        <button
          className="bim-showcase-arrow bim-showcase-previous"
          type="button"
          onClick={() => setActive(i => (i - 1 + works.length) % works.length)}
          aria-label="Previous structural model"
        >←</button>
        <button
          className="bim-showcase-arrow bim-showcase-next"
          type="button"
          onClick={() => setActive(i => (i + 1) % works.length)}
          aria-label="Next structural model"
        >→</button>
        <div className="bim-showcase-hint">DRAG TO ROTATE · SCROLL TO ZOOM · ARROWS TO CHANGE MODEL</div>
      </div>

      <div className="bim-showcase-footer" aria-live="polite">
        <div className="bim-showcase-project-info">
          <span className="bim-showcase-category">{work.type}</span>
          <h3>{work.title}</h3>
          <p>Interactive three-dimensional structural representation. Rotate and zoom to explore the framing and connections.</p>
        </div>
        <div className="bim-showcase-controls">
          <div className="bim-showcase-dots">
            {works.map((item, i) => (
              <button
                key={item.model}
                className={`bim-showcase-dot ${i === active ? 'is-active' : ''}`}
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Show ${item.title}`}
                aria-current={i === active ? 'true' : undefined}
              />
            ))}
          </div>
          <span className="bim-showcase-shortcut">EXPLORE 6 MODELS</span>
        </div>
      </div>
    </div>
  )
}
