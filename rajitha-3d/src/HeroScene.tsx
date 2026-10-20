import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'

function BuildingModel() {
  const floors = 7
  const width = 2.5
  const depth = 2
  const height = 0.62

  return (
    <group rotation={[0.08, -0.35, 0]}>
      {Array.from({ length: floors }, (_, floor) => {
        const y = floor * height
        return (
          <group key={floor} position={[0, y, 0]}>
            {[-width / 2, width / 2].flatMap((x) =>
              [-depth / 2, depth / 2].map((z) => (
                <mesh key={`${x}-${z}`} position={[x, height / 2, z]}>
                  <boxGeometry args={[0.055, height, 0.055]} />
                  <meshStandardMaterial
                    color={floor === floors - 1 ? '#d3b57b' : '#80b5ce'}
                    metalness={0.45}
                    roughness={0.45}
                  />
                </mesh>
              ))
            )}
            {[-depth / 2, depth / 2].map((z) => (
              <mesh key={`front-${z}`} position={[0, height, z]}>
                <boxGeometry args={[width, 0.035, 0.035]} />
                <meshStandardMaterial color="#b4d6e5" roughness={0.45} />
              </mesh>
            ))}
            {[-width / 2, width / 2].map((x) => (
              <mesh key={`side-${x}`} position={[x, height, 0]}>
                <boxGeometry args={[0.035, 0.035, depth]} />
                <meshStandardMaterial color="#b4d6e5" roughness={0.45} />
              </mesh>
            ))}
          </group>
        )
      })}
      <mesh position={[0, -0.12, 0]}>
        <boxGeometry args={[3, 0.12, 2.5]} />
        <meshStandardMaterial color="#213746" wireframe roughness={0.7} />
      </mesh>
    </group>
  )
}

function HeroScene() {
  return (
    <Canvas
      frameloop="demand"
      dpr={[1, 1.25]}
      gl={{ antialias: false, alpha: true, powerPreference: 'low-power' }}
      camera={{ position: [5, 4.2, 6.7], fov: 34 }}
      fallback={
        <div className="scene-fallback">
          Interactive 3D model is unavailable in this browser.
        </div>
      }
    >
      <PerspectiveCamera makeDefault position={[5, 4.2, 6.7]} fov={34} />
      <ambientLight intensity={1.5} />
      <directionalLight position={[5, 7, 5]} intensity={1.5} />
      <pointLight position={[-4, 2, -3]} intensity={12} color="#4a9dc7" />
      <BuildingModel />
      <OrbitControls
        makeDefault
        enablePan={false}
        enableZoom={false}
        enableDamping
        dampingFactor={0.08}
        minPolarAngle={0.75}
        maxPolarAngle={1.85}
      />
    </Canvas>
  )
}


export default HeroScene
