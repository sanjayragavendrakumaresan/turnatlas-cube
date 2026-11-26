import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { applySequence, FACE_COLORS, type Cubie, type Face, type Normal, solvedCube } from "../cube/cube";

const MATERIAL_NORMALS: Normal[] = ["x+", "x-", "y+", "y-", "z+", "z-"];
const DARK_PLASTIC = "#10131e";

function buildState(sequence: string): Cubie[] {
  return applySequence(solvedCube(), sequence);
}

function createCubieMesh(cubie: Cubie): THREE.Mesh {
  const geometry = new THREE.BoxGeometry(0.94, 0.94, 0.94);
  const materials = MATERIAL_NORMALS.map(normal => {
    const face = cubie.stickers[normal] as Face | undefined;
    return new THREE.MeshStandardMaterial({ color: face ? FACE_COLORS[face] : DARK_PLASTIC, roughness: 0.55, metalness: 0.02 });
  });
  const mesh = new THREE.Mesh(geometry, materials);
  mesh.position.set(cubie.position[0] * 0.98, cubie.position[1] * 0.98, cubie.position[2] * 0.98);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

export default function CubeScene({ sequence = "", cameraMode = "cuber", compact = false }: { sequence?: string; cameraMode?: "cuber" | "orbit"; compact?: boolean }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const cubeGroupRef = useRef<THREE.Group | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
    camera.position.set(5.3, 4.2, 6.4);
    cameraRef.current = camera;
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "low-power" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(host.clientWidth, host.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;
    host.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.enablePan = false;
    controls.minDistance = 5.5;
    controls.maxDistance = 11;
    controlsRef.current = controls;
    scene.add(new THREE.AmbientLight(0xffffff, 2.2));
    const key = new THREE.DirectionalLight(0xffffff, 3.1);
    key.position.set(4, 7, 6);
    scene.add(key);
    const fill = new THREE.PointLight(0x8372ff, 32, 18);
    fill.position.set(-4, 1.5, -3);
    scene.add(fill);
    const cubeGroup = new THREE.Group();
    scene.add(cubeGroup);
    cubeGroupRef.current = cubeGroup;

    const resize = () => {
      const width = Math.max(host.clientWidth, 1);
      const height = Math.max(host.clientHeight, 1);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    const observer = new ResizeObserver(resize);
    observer.observe(host);
    const render = () => {
      controls.update();
      renderer.render(scene, camera);
      frameRef.current = window.requestAnimationFrame(render);
    };
    render();
    return () => {
      window.cancelAnimationFrame(frameRef.current);
      observer.disconnect();
      controls.dispose();
      cubeGroup.traverse(object => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          (Array.isArray(object.material) ? object.material : [object.material]).forEach(material => material.dispose());
        }
      });
      renderer.dispose();
      renderer.domElement.remove();
      controlsRef.current = null;
      rendererRef.current = null;
      cubeGroupRef.current = null;
      cameraRef.current = null;
    };
  }, []);

  useEffect(() => {
    const group = cubeGroupRef.current;
    if (!group) return;
    while (group.children.length) {
      const object = group.children[group.children.length - 1];
      group.remove(object);
      if (object instanceof THREE.Mesh) {
        object.geometry.dispose();
        (Array.isArray(object.material) ? object.material : [object.material]).forEach(material => material.dispose());
      }
    }
    try {
      for (const cubie of buildState(sequence)) group.add(createCubieMesh(cubie));
    } catch {
      for (const cubie of solvedCube()) group.add(createCubieMesh(cubie));
    }
  }, [sequence]);

  useEffect(() => {
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!camera || !controls) return;
    if (cameraMode === "cuber") camera.position.set(5.3, 4.2, 6.4);
    else camera.position.set(6.8, 2.8, 2.8);
    controls.update();
  }, [cameraMode]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const controls = controlsRef.current;
    if (!controls) return;
    const angle = Math.PI / 18;
    if (event.key === "ArrowLeft") controls.rotateLeft(angle);
    else if (event.key === "ArrowRight") controls.rotateLeft(-angle);
    else if (event.key === "ArrowUp") controls.rotateUp(angle);
    else if (event.key === "ArrowDown") controls.rotateUp(-angle);
    else return;
    event.preventDefault();
    controls.update();
  };

  return <div className={`cube-scene ${compact ? "cube-scene--compact" : ""}`} ref={hostRef} aria-label="Interactive 3D Rubik’s Cube. Focus and use arrow keys to rotate, or drag with a pointer." role="group" tabIndex={0} onKeyDown={handleKeyDown} />;
}
