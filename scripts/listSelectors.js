const fs = require('fs');
const path = require('path');
const { ethers } = require('ethers'); // Ensure ethers is installed

const baseDir = './artifacts/contracts/facets';

console.log("\n🔍 --- Resonant Realms: ABI-to-Selector Manifest --- 🔍");

if (!fs.existsSync(baseDir)) {
    console.log("❌ Error: Compile first!");
    process.exit(1);
}

const folders = fs.readdirSync(baseDir);
folders.forEach(folder => {
    const folderPath = path.join(baseDir, folder);
    const files = fs.readdirSync(folderPath);
    files.forEach(file => {
        if (file.endsWith('.json') && !file.endsWith('.dbg.json')) {
            const artifact = JSON.parse(fs.readFileSync(path.join(folderPath, file), 'utf8'));
            console.log(`\n📄 Contract: ${artifact.contractName}`);
            
            if (artifact.abi && artifact.abi.length > 0) {
                // We create an interface to extract selectors manually
                const iface = new ethers.Interface(artifact.abi);
                iface.forEachFunction((func) => {
                    console.log(`   [${func.selector}] : ${func.format()}`);
                });
            } else {
                console.log("   ⚠️ No ABI found. Body present but silent.");
            }
        }
    });
});