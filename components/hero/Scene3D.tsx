'use client';

/**
 * "The Opportunity Gap" — a stylized, fully procedural 3D scene.
 * No external models, fonts or textures: every mesh is original
 * geometry with standard materials, lit cinematically.
 *
 * Stage 0 (confusion):  the hiring manager stands behind a wall of
 *                       requirements; the student is buried in papers.
 * Stage 1 (the bridge): OpportunityKit's bridge rises between them
 *                       and papers begin to organize.
 * Stage 2 (clarity):    the bridge glows and the three status
 *                       results float above it.
 */
import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, Float } from '@react-three/drei';
import * as THREE from 'three';

/* ---------- characters ---------- */

function Character({
  variant,
  position,
}: {
  variant: 'manager' | 'student';
  position: [number, number, number];
}) {
  const group = useRef<THREE.Group>(null!);
  const isManager = variant === 'manager';
  const body = isManager ? '#2dd4bf' : '#ff6b5e';
  const hair = isManager ? '#1e293b' : '#f59e0b';
  const phase = isManager ? 0 : 1.6;

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    group.current.position.y = position[1] + Math.sin(t * 1.1 + phase) * 0.035;
    group.current.rotation.y = Math.sin(t * 0.4 + phase) * 0.06;
  });

  return (
    <group ref={group} position={position}>
      {/* body */}
      <mesh position={[0, 0.72, 0]}>
        <capsuleGeometry args={[0.34, 0.55, 8, 20]} />
        <meshStandardMaterial color={body} roughness={0.55} />
      </mesh>
      {/* head */}
      <mesh position={[0, 1.58, 0]}>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial color="#f2c9a0" roughness={0.55} />
      </mesh>
      {/* hair */}
      <mesh position={[0, 1.74, -0.05]} scale={[1.06, 0.68, 1.06]}>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial color={hair} roughness={0.85} />
      </mesh>
      {/* eyes */}
      <mesh position={[-0.11, 1.6, 0.26]}>
        <sphereGeometry args={[0.035, 12, 12]} />
        <meshStandardMaterial color="#0f172a" roughness={0.3} />
      </mesh>
      <mesh position={[0.11, 1.6, 0.26]}>
        <sphereGeometry args={[0.035, 12, 12]} />
        <meshStandardMaterial color="#0f172a" roughness={0.3} />
      </mesh>
      {isManager ? (
        /* comically long checklist */
        <group position={[0.5, 1.05, 0.15]} rotation={[0, -0.35, -0.08]}>
          <mesh>
            <boxGeometry args={[0.36, 0.5, 0.02]} />
            <meshStandardMaterial color="#fbf8f3" roughness={0.9} />
          </mesh>
          {[-0.16, -0.06, 0.04, 0.14].map((y) => (
            <mesh key={y} position={[0, y, 0.012]}>
              <boxGeometry args={[0.24, 0.016, 0.006]} />
              <meshStandardMaterial color="#94a3b8" roughness={0.8} />
            </mesh>
          ))}
        </group>
      ) : (
        /* laptop + a couple of loose papers */
        <group position={[0, 1.02, 0.3]} rotation={[-0.18, 0, 0]}>
          <mesh>
            <boxGeometry args={[0.44, 0.02, 0.32]} />
            <meshStandardMaterial color="#1e293b" roughness={0.6} />
          </mesh>
          <mesh position={[0, 0.03, -0.15]} rotation={[-0.25, 0, 0]}>
            <boxGeometry args={[0.44, 0.3, 0.015]} />
            <meshStandardMaterial color="#38bdf8" emissive="#0ea5e9" emissiveIntensity={0.4} roughness={0.4} />
          </mesh>
        </group>
      )}
    </group>
  );
}

/* ---------- desk with paper stack (manager) ---------- */

function Desk({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.52, 0]}>
        <boxGeometry args={[1.7, 0.1, 0.95]} />
        <meshStandardMaterial color="#1e2d63" roughness={0.7} />
      </mesh>
      {[-0.7, 0.7].map((x) =>
        [-0.35, 0.35].map((z) => (
          <mesh key={`${x}${z}`} position={[x, 0.26, z]}>
            <boxGeometry args={[0.08, 0.52, 0.08]} />
            <meshStandardMaterial color="#16224d" roughness={0.8} />
          </mesh>
        ))
      )}
      {Array.from({ length: 6 }).map((_, i) => (
        <mesh key={i} position={[0.12, 0.585 + i * 0.013, 0]} rotation={[0, (i % 3) * 0.09, 0]}>
          <boxGeometry args={[0.72, 0.013, 0.92]} />
          <meshStandardMaterial color={i % 4 === 0 ? '#fde68a' : '#fbf8f3'} roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}

/* ---------- the wall of confusing requirements (manager) ---------- */

function RequirementWall({ stage }: { stage: number }) {
  const ref = useRef<THREE.Group>(null!);
  useFrame((_, delta) => {
    const target = stage === 0 ? 1 : stage === 1 ? 0.5 : 0.3;
    ref.current.scale.y = THREE.MathUtils.damp(ref.current.scale.y, target, 5, delta);
  });
  return (
    <group ref={ref} position={[-3.6, 0, -1.7]}>
      {Array.from({ length: 14 }).map((_, i) => (
        <mesh
          key={i}
          position={[((i % 3) - 1) * 0.58, 0.55 + Math.floor(i / 3) * 0.27, ((i % 2) - 0.5) * 0.12]}
          rotation={[0, ((i % 3) - 1) * 0.14, 0]}
        >
          <boxGeometry args={[0.52, 0.25, 0.02]} />
          <meshStandardMaterial color={i % 5 === 0 ? '#fde68a' : '#fbf8f3'} roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}

/* ---------- scattered papers that organize as the story advances ---------- */

function PaperScatter({ stage, dense }: { stage: number; dense: boolean }) {
  const papers = useMemo(() => {
    const n = dense ? 14 : 8;
    return Array.from({ length: n }, (_, i) => {
      const side = i % 2 === 0 ? -1 : 1;
      return {
        key: i,
        scatter: [side * (2.1 + Math.random() * 2.4), 0.35 + Math.random() * 1.9, -0.4 + Math.random() * 1.8] as [number, number, number],
        stack: [side * 3.55 + ((i % 3) - 1) * 0.14, 0.64 + i * 0.005, -0.15] as [number, number, number],
        rot: (Math.random() - 0.5) * 1.1,
      };
    });
  }, [dense]);

  const refs = useRef<THREE.Mesh[]>([]);
  const scatterV = useMemo(() => papers.map((p) => new THREE.Vector3(...p.scatter)), [papers]);
  const stackV = useMemo(() => papers.map((p) => new THREE.Vector3(...p.stack)), [papers]);
  const target = useMemo(() => new THREE.Vector3(), []);

  useFrame((_, delta) => {
    const t = stage === 0 ? 0 : stage === 1 ? 0.55 : 1;
    papers.forEach((p, i) => {
      const m = refs.current[i];
      if (!m) return;
      target.copy(scatterV[i]).lerp(stackV[i], t);
      m.position.lerp(target, 1 - Math.exp(-4 * delta));
      m.rotation.y += (p.rot * (1 - t) - m.rotation.y) * (1 - Math.exp(-4 * delta));
      m.rotation.z += (0 - m.rotation.z) * (1 - Math.exp(-4 * delta)) * t;
    });
  });

  return (
    <group>
      {papers.map((p, i) => (
        <mesh
          key={p.key}
          ref={(el) => {
            if (el) refs.current[i] = el;
          }}
          position={p.scatter}
          rotation={[0.4, p.rot, 0.2]}
        >
          <boxGeometry args={[0.52, 0.012, 0.68]} />
          <meshStandardMaterial color={i % 5 === 0 ? '#fde68a' : '#fbf8f3'} roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}

/* ---------- OpportunityKit: the glowing bridge centerpiece ---------- */

function Bridge({ stage }: { stage: number }) {
  const ref = useRef<THREE.Group>(null!);
  const glow = useRef<THREE.Mesh>(null!);
  useFrame((state, delta) => {
    const target = stage >= 1 ? 1 : 0.001;
    ref.current.scale.setScalar(THREE.MathUtils.damp(ref.current.scale.x, target, 5, delta));
    const mat = glow.current.material as THREE.MeshStandardMaterial;
    const pulse = stage >= 2 ? 0.85 + Math.sin(state.clock.elapsedTime * 2) * 0.3 : 0.3;
    mat.emissiveIntensity = THREE.MathUtils.damp(mat.emissiveIntensity, pulse, 5, delta);
  });
  return (
    <group ref={ref} position={[0, 0, -0.7]}>
      {Array.from({ length: 9 }).map((_, i) => {
        const t = i / 8;
        return (
          <mesh key={i} position={[THREE.MathUtils.lerp(-2.3, 2.3, t), 0.12 + Math.sin(t * Math.PI) * 0.85, 0]}>
            <boxGeometry args={[0.34, 0.34, 0.1]} />
            <meshStandardMaterial color="#14b8a6" roughness={0.45} />
          </mesh>
        );
      })}
      <mesh ref={glow} position={[0, 1.18, 0]}>
        <octahedronGeometry args={[0.24]} />
        <meshStandardMaterial color="#5eead4" emissive="#2dd4bf" emissiveIntensity={0.5} roughness={0.2} />
      </mesh>
      {/* the clear path forward */}
      <mesh position={[0, 0.06, 0.9]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[5.2, 0.5]} />
        <meshStandardMaterial color="#2dd4bf" transparent opacity={stage >= 2 ? 0.35 : 0.08} roughness={0.6} />
      </mesh>
    </group>
  );
}

/* ---------- floating three-state results (stage 2) ---------- */

function StatusFloaters({ stage }: { stage: number }) {
  const ref = useRef<THREE.Group>(null!);
  useFrame((_, delta) => {
    const target = stage >= 2 ? 1 : 0.001;
    ref.current.scale.setScalar(THREE.MathUtils.damp(ref.current.scale.x, target, 5, delta));
  });
  const cards: Array<[string, number]> = [
    ['#10b981', -1.05],
    ['#f43f5e', 0],
    ['#f59e0b', 1.05],
  ];
  return (
    <group ref={ref} position={[0, 2.55, -0.7]}>
      {cards.map(([color, x]) => (
        <Float key={color} speed={1.4} rotationIntensity={0.15} floatIntensity={0.7}>
          <mesh position={[x, 0, 0]}>
            <boxGeometry args={[0.52, 0.68, 0.05]} />
            <meshStandardMaterial color={color} roughness={0.45} />
          </mesh>
          <mesh position={[x, 0, 0.035]}>
            <boxGeometry args={[0.34, 0.05, 0.01]} />
            <meshStandardMaterial color="#fbf8f3" roughness={0.8} />
          </mesh>
          <mesh position={[x, -0.14, 0.035]}>
            <boxGeometry args={[0.26, 0.04, 0.01]} />
            <meshStandardMaterial color="#fbf8f3" roughness={0.8} />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

/* ---------- drifting skill / requirement tags ---------- */

function FloatingTags({ dense }: { dense: boolean }) {
  const tags = useMemo(
    () =>
      dense
        ? ['Python', 'CGPA 7.5+', 'B.Tech', 'React', '6 months', 'Resume', 'Transcript', 'Relocate?']
        : ['Python', 'CGPA 7.5+', 'B.Tech', '6 months'],
    [dense]
  );
  return (
    <group>
      {tags.map((tag, i) => (
        <Float key={tag} speed={1.1 + (i % 3) * 0.5} rotationIntensity={0.12} floatIntensity={0.8} position={[-4.6 + (i % 4) * 3.1, 2.1 + (i % 2) * 0.8, -1.2 + (i % 3) * 0.6]}>
          <mesh>
            <boxGeometry args={[0.66, 0.3, 0.04]} />
            <meshStandardMaterial color={i % 2 ? '#f59e0b' : '#5eead4'} roughness={0.5} />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

/* ---------- the assembled scene ---------- */

export default function Scene3D({
  stage,
  pointer,
  dense,
}: {
  stage: number;
  pointer: { x: number; y: number };
  dense: boolean;
}) {
  const rig = useRef<THREE.Group>(null!);
  useFrame((_, delta) => {
    rig.current.rotation.y = THREE.MathUtils.damp(rig.current.rotation.y, pointer.x * 0.1, 4, delta);
    rig.current.rotation.x = THREE.MathUtils.damp(rig.current.rotation.x, pointer.y * 0.05, 4, delta);
  });

  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight position={[6, 9, 6]} intensity={1.15} />
      <pointLight position={[0, 3.4, 1.6]} color="#2dd4bf" intensity={0.9} distance={13} />
      <pointLight position={[-5.5, 2.6, 2.2]} color="#ff6b5e" intensity={0.55} distance={11} />
      <fog attach="fog" args={['#0a1128', 14, 30]} />

      <group ref={rig}>
        {/* floor */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}>
          <circleGeometry args={[18, 48]} />
          <meshStandardMaterial color="#101a3a" roughness={1} />
        </mesh>

        <Character variant="manager" position={[-3.6, 0, 0.55]} />
        <Character variant="student" position={[3.6, 0, 0.55]} />
        <Desk position={[-3.6, 0, -0.55]} />
        <RequirementWall stage={stage} />
        <PaperScatter stage={stage} dense={dense} />
        <Bridge stage={stage} />
        <StatusFloaters stage={stage} />
        <FloatingTags dense={dense} />

        <ContactShadows position={[0, 0.005, 0]} opacity={0.55} scale={15} blur={2.6} far={9} />
      </group>
    </>
  );
}

export function HeroCanvas({
  stage,
  pointer,
  dense,
}: {
  stage: number;
  pointer: { x: number; y: number };
  dense: boolean;
}) {
  return (
    <Canvas
      camera={{ position: [0, 2.6, 12.5], fov: 42 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true }}
      aria-label="3D scene: an overwhelmed hiring manager beside a wall of requirements, a student with scattered documents, and OpportunityKit's glowing bridge between them"
      role="img"
    >
      <Scene3D stage={stage} pointer={pointer} dense={dense} />
    </Canvas>
  );
}
