// Hexagon math utilities for pointy-top hexagons

import { HEX_RADIUS } from './config.js';

/**
 * Convert axial hex coordinates to pixel position (3D world space)
 * Using pointy-top orientation
 */
export function axialToPixel(q, r, hexRadius = HEX_RADIUS) {
    const x = hexRadius * (Math.sqrt(3) * q + Math.sqrt(3) / 2 * r);
    const z = hexRadius * (3 / 2 * r);
    return { x, z };
}

/**
 * Convert pixel position to nearest axial hex coordinates
 */
export function pixelToAxial(x, z, hexRadius = HEX_RADIUS) {
    const q = (Math.sqrt(3) / 3 * x - 1 / 3 * z) / hexRadius;
    const r = (2 / 3 * z) / hexRadius;
    return axialRound(q, r);
}

/**
 * Round fractional axial coordinates to nearest hex
 */
function axialRound(q, r) {
    const s = -q - r;
    
    let rq = Math.round(q);
    let rr = Math.round(r);
    let rs = Math.round(s);
    
    const qDiff = Math.abs(rq - q);
    const rDiff = Math.abs(rr - r);
    const sDiff = Math.abs(rs - s);
    
    if (qDiff > rDiff && qDiff > sDiff) {
        rq = -rr - rs;
    } else if (rDiff > sDiff) {
        rr = -rq - rs;
    }
    
    return { q: rq, r: rr };
}

/**
 * Get the 6 corner positions of a pointy-top hexagon
 */
export function getHexCorners(hexRadius = HEX_RADIUS) {
    const corners = [];
    for (let i = 0; i < 6; i++) {
        const angleDeg = 60 * i - 30; // -30 offset for pointy-top
        const angleRad = Math.PI / 180 * angleDeg;
        corners.push({
            x: hexRadius * Math.cos(angleRad),
            y: hexRadius * Math.sin(angleRad)
        });
    }
    return corners;
}

/**
 * Get the 6 neighboring hex coordinates
 */
export function getHexNeighbors(q, r) {
    const directions = [
        { q: 1, r: 0 }, { q: 1, r: -1 }, { q: 0, r: -1 },
        { q: -1, r: 0 }, { q: -1, r: 1 }, { q: 0, r: 1 }
    ];
    return directions.map(dir => ({
        q: q + dir.q,
        r: r + dir.r
    }));
}

/**
 * Create a unique key for a hex coordinate
 */
export function hexKey(q, r) {
    return `${q},${r}`;
}

/**
 * Get hex distance from center
 */
export function hexDistance(q, r) {
    return Math.max(Math.abs(q), Math.abs(r), Math.abs(-q - r));
}

/**
 * Linear interpolation
 */
export function lerp(start, end, t) {
    return start + (end - start) * t;
}

/**
 * Ease out cubic
 */
export function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
}

/**
 * Ease out bounce
 */
export function easeOutBounce(t) {
    const n1 = 7.5625;
    const d1 = 2.75;
    
    if (t < 1 / d1) {
        return n1 * t * t;
    } else if (t < 2 / d1) {
        return n1 * (t -= 1.5 / d1) * t + 0.75;
    } else if (t < 2.5 / d1) {
        return n1 * (t -= 2.25 / d1) * t + 0.9375;
    } else {
        return n1 * (t -= 2.625 / d1) * t + 0.984375;
    }
}
