// Hexagon math utilities for flat-top hexagons

import { HEX_RADIUS } from './config.js';

/**
 * Convert axial hex coordinates to pixel position (3D world space)
 * @param {number} q - Axial Q coordinate
 * @param {number} r - Axial R coordinate
 * @param {number} hexRadius - Hex radius (optional, defaults to HEX_RADIUS)
 * @returns {{x: number, z: number}} - World position
 */
export function axialToPixel(q, r, hexRadius = HEX_RADIUS) {
    const x = hexRadius * (3 / 2 * q);
    const z = hexRadius * (Math.sqrt(3) / 2 * q + Math.sqrt(3) * r);
    return { x, z };
}

/**
 * Convert pixel position to nearest axial hex coordinates
 * @param {number} x - World X position
 * @param {number} z - World Z position
 * @param {number} hexRadius - Hex radius (optional)
 * @returns {{q: number, r: number}} - Axial coordinates
 */
export function pixelToAxial(x, z, hexRadius = HEX_RADIUS) {
    const q = (2 / 3 * x) / hexRadius;
    const r = (-1 / 3 * x + Math.sqrt(3) / 3 * z) / hexRadius;
    return axialRound(q, r);
}

/**
 * Round fractional axial coordinates to nearest hex
 * @param {number} q - Fractional Q
 * @param {number} r - Fractional R
 * @returns {{q: number, r: number}} - Rounded coordinates
 */
function axialRound(q, r) {
    // Convert to cube coordinates
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
 * Get the 6 corner positions of a flat-top hexagon
 * @param {number} hexRadius - Hex radius
 * @returns {Array<{x: number, y: number}>} - Array of 6 corner positions
 */
export function getHexCorners(hexRadius = HEX_RADIUS) {
    const corners = [];
    for (let i = 0; i < 6; i++) {
        const angleDeg = 60 * i;
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
 * @param {number} q - Axial Q coordinate
 * @param {number} r - Axial R coordinate
 * @returns {Array<{q: number, r: number}>} - Array of 6 neighbors
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
 * @param {number} q - Axial Q coordinate
 * @param {number} r - Axial R coordinate
 * @returns {string} - Unique key
 */
export function hexKey(q, r) {
    return `${q},${r}`;
}
