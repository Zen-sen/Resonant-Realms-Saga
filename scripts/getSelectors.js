const fs = require('fs');
const path = require('path');

const artifactsPath = './artifacts/contracts';

function scanArtifacts(dir) {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            scanArtifacts(fullPath);
        } else if (file.endsWith('.json') && !file.endsWith('.dbg.json')) {
            const content = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
            if (content.methodIdentifiers) {
                console.log(`\n--- Contract: ${content.contractName} ---`);
                Object.entries(content.methodIdentifiers).forEach(([method, id]) => {
                    console.log(`[0x${id}] : ${method}`);
                });
            }
        }
    });
}

console.log("🔍 Scanning artifacts for Method Identifiers...");
scanArtifacts(artifactsPath);