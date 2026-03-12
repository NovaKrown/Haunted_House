import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";

/**
 * Base
 */
// Debug
const gui = new GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const groundAlpha = await textureLoader.loadAsync("./floor/alpha.jpg");

/**
 * House
 */

// Ground
const groundMeasurements = {
  width: 20,
  length: 20,
};
const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(groundMeasurements.width, groundMeasurements.length),
  new THREE.MeshStandardMaterial({
    transparent: true,
    alphaMap: groundAlpha,
  }),
);
ground.rotation.x = -Math.PI * 0.5;
scene.add(ground);

// House
const house = new THREE.Group();
scene.add(house);

// House Variables
const houseMeasurements = {
  houseLength: 4,
  houseHeight: 2.5,
  houseLength: 4,
  roofRadius: 3.5,
  roofHeight: 1.5,
  roofSegments: 4,
  doorWidth: 2.2,
  doorHeight: 2.2,
};

// Walls
const walls = new THREE.Mesh(
  new THREE.BoxGeometry(houseMeasurements.houseLength, houseMeasurements.houseHeight, houseMeasurements.houseLength),
  new THREE.MeshStandardMaterial(),
);
walls.position.y = houseMeasurements.houseHeight * 0.5;
house.add(walls);

// Roof
const roof = new THREE.Mesh(
  new THREE.ConeGeometry(houseMeasurements.roofRadius, houseMeasurements.roofHeight, houseMeasurements.roofSegments),
  new THREE.MeshStandardMaterial(),
);
roof.position.y = houseMeasurements.houseHeight + houseMeasurements.roofHeight * 0.5;
roof.rotation.y = Math.PI * 1.25;
house.add(roof);

// Door
const door = new THREE.Mesh(
  new THREE.PlaneGeometry(houseMeasurements.doorWidth, houseMeasurements.doorHeight),
  new THREE.MeshStandardMaterial(),
);
door.position.y = houseMeasurements.doorHeight * 0.5;
door.position.z = houseMeasurements.houseLength * 0.5 + 0.01;

house.add(door);

// Bushes
const bushGeometry = new THREE.SphereGeometry(1, 10, 10);
const bushMaterial = new THREE.MeshStandardMaterial();

const bush1 = new THREE.Mesh(bushGeometry, bushMaterial);
bush1.scale.set(0.5, 0.5, 0.5);
bush1.position.set(0.8, 0.2, 2.2);

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial);
bush2.scale.set(0.25, 0.25, 0.25);
bush2.position.set(1.4, 0.1, 2.1);

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial);
bush3.scale.set(0.5, 0.5, 0.5);
bush3.position.set(-0.8, 0.1, 2.2);

const bush4 = new THREE.Mesh(bushGeometry, bushMaterial);
bush4.scale.set(0.15, 0.15, 0.15);
bush4.position.set(-1, 0.05, 2.6);

house.add(bush1, bush2, bush3, bush4);

// Graves
const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2);
const graveMaterial = new THREE.MeshStandardMaterial();

const graves = new THREE.Group();
scene.add(graves);

for (let i = 0; i < 30; i++) {
  // Mesh
  const grave = new THREE.Mesh(graveGeometry, graveMaterial);

  const angle = Math.random() * Math.PI * 2;
  const radius = 3 + Math.random() * 4;
  const height = Math.random() * 0.4;

  grave.position.x = Math.sin(angle) * radius;
  grave.position.z = Math.cos(angle) * radius;
  grave.position.y = height;
  grave.rotation.x = (Math.random() - 0.5) * 0.5;
  grave.rotation.y = (Math.random() - 0.5) * 0.5;
  grave.rotation.z = (Math.random() - 0.5) * 0.5;

  // Add to graves group
  graves.add(grave);
}

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight("#ffffff", 0.5);
scene.add(ambientLight);

// Directional light
const directionalLight = new THREE.DirectionalLight("#ffffff", 1.5);
directionalLight.position.set(3, 2, -8);
scene.add(directionalLight);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.x = 4;
camera.position.y = 2;
camera.position.z = 5;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const timer = new THREE.Timer();
timer.connect(document);

const tick = () => {
  // Timer
  timer.update();
  const elapsedTime = timer.getElapsed();

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
