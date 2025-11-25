// Animation system for smooth piece movement

import * as THREE from 'three';
import { ANIMATION_CONFIG } from './config.js';

// Track floating animations
let floatStartTime = 0;

/**
 * Animate piece hop up (when picked up)
 */
export function animateHopUp(piece, onComplete) {
    const startY = piece.position.y;
    const targetY = startY + ANIMATION_CONFIG.hopUp.height;
    const startTime = performance.now();
    const duration = ANIMATION_CONFIG.hopUp.duration;
    
    function animate() {
        const elapsed = performance.now() - startTime;
        const t = Math.min(elapsed / duration, 1);
        
        // Ease out cubic
        const eased = 1 - Math.pow(1 - t, 3);
        
        piece.position.y = startY + (targetY - startY) * eased;
        piece.scale.setScalar(1 + ANIMATION_CONFIG.hopUp.scaleIncrease * eased);
        
        // Add glow effect
        piece.traverse(child => {
            if (child.isMesh && child.material && child.material.emissive) {
                child.material.emissive.copy(child.material.color);
                child.material.emissiveIntensity = 0.25 * eased;
            }
        });
        
        if (t < 1) {
            requestAnimationFrame(animate);
        } else {
            floatStartTime = performance.now();
            if (onComplete) onComplete();
        }
    }
    
    animate();
}

/**
 * Animate piece hop down (when dropped)
 */
export function animateHopDown(piece, targetY, onComplete) {
    const startY = piece.position.y;
    const startTime = performance.now();
    const duration = ANIMATION_CONFIG.hopDown.duration;
    
    function animate() {
        const elapsed = performance.now() - startTime;
        const t = Math.min(elapsed / duration, 1);
        
        // Bounce easing
        let eased;
        if (t < 0.6) {
            // Fall down
            eased = 1 - Math.pow(1 - t / 0.6, 2);
        } else {
            // Bounce
            const bounceT = (t - 0.6) / 0.4;
            const bounce = Math.sin(bounceT * Math.PI * 1.5) * Math.pow(1 - bounceT, 2) * 0.3;
            eased = 1 + bounce;
        }
        
        piece.position.y = startY + (targetY - startY) * Math.min(eased, 1.1);
        
        // Scale back to normal
        const scaleT = Math.min(t * 1.5, 1);
        piece.scale.setScalar(1 + ANIMATION_CONFIG.hopUp.scaleIncrease * (1 - scaleT));
        
        // Fade glow
        piece.traverse(child => {
            if (child.isMesh && child.material && child.material.emissive) {
                child.material.emissiveIntensity = 0.25 * (1 - scaleT);
            }
        });
        
        if (t < 1) {
            requestAnimationFrame(animate);
        } else {
            // Reset to final values
            piece.position.y = targetY;
            piece.scale.setScalar(1);
            piece.rotation.y = 0;
            
            piece.traverse(child => {
                if (child.isMesh && child.material && child.material.emissive) {
                    child.material.emissiveIntensity = 0;
                }
            });
            
            if (onComplete) onComplete();
        }
    }
    
    animate();
}

/**
 * Update floating animation (while dragging)
 */
export function updateFloatAnimation(piece, baseY) {
    if (!floatStartTime) floatStartTime = performance.now();
    
    const elapsed = performance.now() - floatStartTime;
    const period = ANIMATION_CONFIG.float.period;
    const t = (elapsed % period) / period;
    const angle = t * Math.PI * 2;
    
    // Gentle bob
    const bob = Math.sin(angle) * ANIMATION_CONFIG.float.amplitude;
    piece.position.y = baseY + bob;
    
    // Subtle tilt
    const wobbleRad = (ANIMATION_CONFIG.float.wobbleAngle * Math.PI) / 180;
    const tilt = Math.sin(angle * 1.5) * wobbleRad * 0.3;
    piece.rotation.z = tilt;
    piece.rotation.x = Math.cos(angle * 1.2) * wobbleRad * 0.2;
}

/**
 * Stop floating animation
 */
export function stopFloatAnimation(piece) {
    floatStartTime = 0;
    piece.rotation.z = 0;
    piece.rotation.x = 0;
}

/**
 * Smoothly interpolate piece position
 */
export function lerpPiecePosition(piece, targetX, targetZ) {
    const factor = ANIMATION_CONFIG.follow.lerpFactor;
    piece.position.x += (targetX - piece.position.x) * factor;
    piece.position.z += (targetZ - piece.position.z) * factor;
}

/**
 * Create a particle effect (for captures, etc.)
 */
export function createParticleEffect(scene, position, color, count = 20) {
    const particles = [];
    const particleGeometry = new THREE.SphereGeometry(1, 6, 6);
    const particleMaterial = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 1
    });
    
    for (let i = 0; i < count; i++) {
        const particle = new THREE.Mesh(particleGeometry, particleMaterial.clone());
        particle.position.copy(position);
        
        // Random velocity
        particle.userData.velocity = new THREE.Vector3(
            (Math.random() - 0.5) * 3,
            Math.random() * 4 + 2,
            (Math.random() - 0.5) * 3
        );
        
        scene.add(particle);
        particles.push(particle);
    }
    
    const startTime = performance.now();
    
    function animateParticles() {
        const elapsed = performance.now() - startTime;
        const t = elapsed / 1000; // seconds
        
        particles.forEach(particle => {
            // Update position with gravity
            particle.position.add(particle.userData.velocity.clone().multiplyScalar(0.016));
            particle.userData.velocity.y -= 0.15; // gravity
            
            // Fade out
            particle.material.opacity = Math.max(0, 1 - t);
            particle.scale.setScalar(Math.max(0.1, 1 - t * 0.5));
        });
        
        if (t < 1.5) {
            requestAnimationFrame(animateParticles);
        } else {
            // Remove particles
            particles.forEach(particle => {
                scene.remove(particle);
                particle.geometry.dispose();
                particle.material.dispose();
            });
        }
    }
    
    animateParticles();
}
