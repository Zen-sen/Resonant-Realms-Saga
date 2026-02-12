const Matter = require('matter-js');

// 1. Setup the Physics Engine
const engine = Matter.Engine.create();
const world = engine.world;

// Tribal Constants (Mirroring our Universal Logic)
const TRIBES = {
    KHOE_SAN: { id: 0, mass: 2.0, frictionAir: 0.01 }, // Heavy Foundation
    STANDARD: { id: 1, mass: 1.0, frictionAir: 0.05 },
    SYNTHESIS: { id: 12, mass: 0.5, frictionAir: 0.2 } // Buoyant Bridge
};

/**
 * Simulates a "Google Gravity" scatter effect for a set of Sage/Bunny tiles
 */
function simulateCollapse(tiles) {
    const bodies = tiles.map(tile => {
        const profile = getTribalPhysics(tile.tribeId);
        
        return Matter.Bodies.rectangle(tile.x, tile.y, 50, 50, {
            mass: profile.mass,
            frictionAir: profile.frictionAir,
            label: `Bunny-${tile.id}`
        });
    });

    // Add a "Floor" so they don't fall into the abyss
    const ground = Matter.Bodies.rectangle(400, 600, 810, 60, { isStatic: true });
    
    Matter.World.add(world, [...bodies, ground]);

    // Run the simulation for 120 frames (approx 2 seconds)
    for (let i = 0; i < 120; i++) {
        Matter.Engine.update(engine, 1000 / 60);
    }

    // Extract the final resting positions to sync with the Diamond
    return bodies.map(body => ({
        id: body.label.split('-')[1],
        x: Math.round(body.position.x),
        y: Math.round(body.position.y),
        isFloating: body.frictionAir > 0.1 // Synthesis check
    }));
}

function getTribalPhysics(tribeId) {
    if (tribeId == 0) return TRIBES.KHOE_SAN;
    if (tribeId == 12) return TRIBES.SYNTHESIS;
    return TRIBES.STANDARD;
}

console.log("🌌 Physics Engine Initialized: Ready for Anti-Gravity Sync.");