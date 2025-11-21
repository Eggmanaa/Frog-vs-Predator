// Environment setup - camera, lighting, decorations

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

/**
 * Setup orthographic camera for isometric view
 * @param {number} aspect - Aspect ratio
 * @returns {THREE.OrthographicCamera}
 */
export function setupCamera(aspect) {
    const frustumSize = 600;
    const camera = new THREE.OrthographicCamera(
        -frustumSize * aspect / 2,
        frustumSize * aspect / 2,
        frustumSize / 2,
        -frustumSize / 2,
        1,
        2000
    );

    // Position for isometric 45° view
    camera.position.set(300, 400, 300);
    camera.lookAt(0, 0, 0);

    return camera;
}

/**
 * Setup orbit controls
 * @param {THREE.Camera} camera - Camera
 * @param {HTMLCanvasElement} canvas - Canvas element
 * @returns {OrbitControls}
 */
export function setupControls(camera, canvas) {
    const controls = new OrbitControls(camera, canvas);
    controls.target.set(0, 0, 0);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minZoom = 0.5;
    controls.maxZoom = 2;
    controls.maxPolarAngle = Math.PI / 2 - 0.1; // Prevent going below ground
    controls.enablePan = false;

    return controls;
}

/**
 * Setup lighting with soft shadows
 * @param {THREE.Scene} scene - Scene
 */
export function setupLighting(scene) {
    // Hemisphere light for ambient
    const hemiLight = new THREE.HemisphereLight(0xE8F4F8, 0xC9A486, 0.7);
    scene.add(hemiLight);

    // Directional light with soft shadows
    const dirLight = new THREE.DirectionalLight(0xFFFFFF, 1.0);
    dirLight.position.set(150, 250, 150);
    dirLight.castShadow = true;

    // Shadow settings for quality
    dirLight.shadow.camera.left = -600;
    dirLight.shadow.camera.right = 600;
    dirLight.shadow.camera.top = 600;
    dirLight.shadow.camera.bottom = -600;
    dirLight.shadow.camera.near = 1;
    dirLight.shadow.camera.far = 1000;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.bias = -0.0001;

    scene.add(dirLight);

    // Ambient fill light
    const ambientLight = new THREE.AmbientLight(0xFFF5E1, 0.5);
    scene.add(ambientLight);
}

/**
 * Create wooden table surface
 * @param {THREE.Scene} scene - Scene
 */
export function createTableSurface(scene) {
    const tableSize = 2000;
    const tableHeight = 50;

    const geometry = new THREE.BoxGeometry(tableSize, tableHeight, tableSize);
    const material = new THREE.MeshStandardMaterial({
        color: 0x8B4513,
        roughness: 0.7,
        metalness: 0
    });

    const table = new THREE.Mesh(geometry, material);
    table.position.y = -50;
    table.receiveShadow = true;

    scene.add(table);
}

/**
 * Create decorative elements - sun, clouds, trees
 * @param {THREE.Scene} scene - Scene
 */
export function createDecorations(scene) {
    // Sun in top-left corner
    const sunGeometry = new THREE.SphereGeometry(40, 16, 16);
    const sunMaterial = new THREE.MeshBasicMaterial({
        color: 0xFDB813,
        emissive: 0xFDB813,
        emissiveIntensity: 0.8
    });
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    sun.position.set(-400, 300, -300);
    scene.add(sun);

    // Sun rays (simple spikes)
    const rayGeometry = new THREE.ConeGeometry(5, 60, 4);
    const rayMaterial = new THREE.MeshBasicMaterial({
        color: 0xFDB813,
        emissive: 0xFDB813,
        emissiveIntensity: 0.5
    });

    for (let i = 0; i < 8; i++) {
        const ray = new THREE.Mesh(rayGeometry, rayMaterial);
        const angle = (i / 8) * Math.PI * 2;
        ray.position.set(
            sun.position.x + Math.cos(angle) * 60,
            sun.position.y + Math.sin(angle) * 60,
            sun.position.z
        );
        ray.rotation.z = angle;
        scene.add(ray);
    }

    // Clouds (groups of white spheres)
    const cloudMaterial = new THREE.MeshStandardMaterial({
        color: 0xFFFFFF,
        roughness: 0.8
    });

    const cloudPositions = [
        { x: 200, y: 250, z: -400 },
        { x: -200, y: 280, z: 200 },
        { x: 400, y: 260, z: 100 }
    ];

    cloudPositions.forEach(pos => {
        const cloud = new THREE.Group();

        // 3-5 spheres per cloud
        for (let i = 0; i < 4; i++) {
            const sphereGeom = new THREE.SphereGeometry(20 + Math.random() * 15, 12, 12);
            const sphere = new THREE.Mesh(sphereGeom, cloudMaterial);
            sphere.position.set(
                (Math.random() - 0.5) * 60,
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 40
            );
            cloud.add(sphere);
        }

        cloud.position.set(pos.x, pos.y, pos.z);
        scene.add(cloud);
    });

    // Trees in corners (simplified)
    const treePositions = [
        { x: -350, z: -350 },
        { x: 350, z: -350 },
        { x: -350, z: 350 },
        { x: 350, z: 350 }
    ];

    const trunkMaterial = new THREE.MeshStandardMaterial({
        color: 0x8B4513,
        roughness: 0.9
    });

    const foliageMaterial = new THREE.MeshStandardMaterial({
        color: 0x2ECC71,
        roughness: 0.8
    });

    treePositions.forEach(pos => {
        const tree = new THREE.Group();

        // Trunk
        const trunkGeom = new THREE.CylinderGeometry(10, 12, 60, 8);
        const trunk = new THREE.Mesh(trunkGeom, trunkMaterial);
        trunk.position.y = 30;
        trunk.castShadow = true;
        tree.add(trunk);

        // Foliage (sphere)
        const foliageGeom = new THREE.SphereGeometry(40, 12, 12);
        const foliage = new THREE.Mesh(foliageGeom, foliageMaterial);
        foliage.position.y = 70;
        foliage.castShadow = true;
        tree.add(foliage);

        tree.position.set(pos.x, -25, pos.z);
        scene.add(tree);
    });
}

/**
 * Create background gradient
 * @param {THREE.Scene} scene - Scene
 */
export function createBackground(scene) {
    // Soft gradient sky
    scene.background = new THREE.Color(0x87CEEB);

    // Add fog for depth
    scene.fog = new THREE.Fog(0xE8F4F8, 500, 2000);
}

/**
 * Reset camera to default position
 * @param {THREE.Camera} camera - Camera
 * @param {OrbitControls} controls - Orbit controls
 */
export function resetCamera(camera, controls) {
    camera.position.set(300, 400, 300);
    camera.zoom = 1;
    camera.updateProjectionMatrix();
    controls.target.set(0, 0, 0);
    controls.update();
}
