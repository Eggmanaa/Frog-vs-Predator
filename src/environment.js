// Environment setup - camera, lighting, table, decorations

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

/**
 * Setup orthographic camera for tabletop view
 */
export function setupCamera(aspect) {
    const frustumSize = 500;
    const camera = new THREE.OrthographicCamera(
        -frustumSize * aspect / 2,
        frustumSize * aspect / 2,
        frustumSize / 2,
        -frustumSize / 2,
        1,
        2000
    );
    
    // Isometric view angle
    camera.position.set(250, 350, 250);
    camera.lookAt(0, 0, 0);
    
    return camera;
}

/**
 * Setup orbit controls for tabletop manipulation
 */
export function setupControls(camera, canvas) {
    const controls = new OrbitControls(camera, canvas);
    controls.target.set(0, 0, 0);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.minZoom = 0.4;
    controls.maxZoom = 2.5;
    controls.maxPolarAngle = Math.PI / 2.2; // Prevent going under table
    controls.minPolarAngle = Math.PI / 6;   // Prevent too top-down
    controls.enablePan = true;
    controls.panSpeed = 0.8;
    controls.rotateSpeed = 0.6;
    
    // Only rotate with right mouse button
    controls.mouseButtons = {
        LEFT: null,
        MIDDLE: THREE.MOUSE.DOLLY,
        RIGHT: THREE.MOUSE.ROTATE
    };
    
    return controls;
}

/**
 * Setup lighting
 */
export function setupLighting(scene) {
    // Soft ambient light
    const ambientLight = new THREE.AmbientLight(0xFFF5E1, 0.6);
    scene.add(ambientLight);
    
    // Hemisphere light for natural outdoor feel
    const hemiLight = new THREE.HemisphereLight(0xE8F4F8, 0xB8956C, 0.4);
    scene.add(hemiLight);
    
    // Main directional light (sun)
    const dirLight = new THREE.DirectionalLight(0xFFFFFF, 1.0);
    dirLight.position.set(200, 400, 150);
    dirLight.castShadow = true;
    
    // Shadow quality
    dirLight.shadow.camera.left = -500;
    dirLight.shadow.camera.right = 500;
    dirLight.shadow.camera.top = 500;
    dirLight.shadow.camera.bottom = -500;
    dirLight.shadow.camera.near = 1;
    dirLight.shadow.camera.far = 1000;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.bias = -0.0002;
    
    scene.add(dirLight);
    
    // Fill light from opposite side
    const fillLight = new THREE.DirectionalLight(0xE8E8FF, 0.3);
    fillLight.position.set(-200, 200, -150);
    scene.add(fillLight);
}

/**
 * Create wooden table surface
 */
export function createTableSurface(scene) {
    // Table top
    const tableGeometry = new THREE.BoxGeometry(1400, 30, 1000);
    
    // Create wood-like material
    const tableMaterial = new THREE.MeshStandardMaterial({
        color: 0x8B5A2B,
        roughness: 0.75,
        metalness: 0.05
    });
    
    const table = new THREE.Mesh(tableGeometry, tableMaterial);
    table.position.y = -30;
    table.receiveShadow = true;
    
    scene.add(table);
    
    // Add wood grain texture effect with subtle lines
    const grainGeometry = new THREE.PlaneGeometry(1400, 1000);
    const grainCanvas = createWoodGrainTexture();
    const grainTexture = new THREE.CanvasTexture(grainCanvas);
    grainTexture.wrapS = THREE.RepeatWrapping;
    grainTexture.wrapT = THREE.RepeatWrapping;
    
    const grainMaterial = new THREE.MeshBasicMaterial({
        map: grainTexture,
        transparent: true,
        opacity: 0.15
    });
    
    const grain = new THREE.Mesh(grainGeometry, grainMaterial);
    grain.rotation.x = -Math.PI / 2;
    grain.position.y = -14;
    
    scene.add(grain);
}

/**
 * Create wood grain texture
 */
function createWoodGrainTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    
    ctx.fillStyle = 'transparent';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw wood grain lines
    ctx.strokeStyle = '#5D4037';
    ctx.lineWidth = 1;
    
    for (let i = 0; i < 100; i++) {
        ctx.beginPath();
        const y = Math.random() * canvas.height;
        ctx.moveTo(0, y);
        
        for (let x = 0; x < canvas.width; x += 20) {
            ctx.lineTo(x, y + (Math.random() - 0.5) * 10);
        }
        
        ctx.globalAlpha = 0.1 + Math.random() * 0.2;
        ctx.stroke();
    }
    
    return canvas;
}

/**
 * Create decorative elements around the board
 */
export function createDecorations(scene) {
    // No decorations needed - pieces include trees, sun, clouds, etc.
}

/**
 * Create sky background
 */
export function createBackground(scene) {
    // Soft gradient sky
    const topColor = new THREE.Color(0x87CEEB);
    const bottomColor = new THREE.Color(0xE8F4F8);
    
    scene.background = new THREE.Color(0xE8F4F8);
    
    // Light fog for depth
    scene.fog = new THREE.Fog(0xF5F5F5, 600, 2000);
}

/**
 * Reset camera to default position
 */
export function resetCamera(camera, controls) {
    camera.position.set(250, 350, 250);
    camera.zoom = 1;
    camera.updateProjectionMatrix();
    controls.target.set(0, 0, 0);
    controls.update();
}
