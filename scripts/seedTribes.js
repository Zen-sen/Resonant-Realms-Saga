import pkg from "hardhat";
const { ethers } = pkg;

async function main() {
    // scripts/seedTribes.js
const diamondAddress = "0xc6e7DF5E7b4f2A278906862b61205850344D4e7d";
    
    // 2. Use the Factory to attach (This bypasses the resolveName error)
    const HeritageFacet = await ethers.getContractFactory("AncestralHeritageFacet");
    const heritage = HeritageFacet.attach(diamondAddress);

    const tribes = [
        { id: 0, name: "Khoe-San", buff: "Ancestral Foundation" },
        { id: 1, name: "isiXhosa", buff: "Resilience" },
        { id: 2, name: "isiZulu", buff: "Valor" },
        { id: 3, name: "Sesotho", buff: "Steadfastness" },
        { id: 4, name: "Setswana", buff: "Diplomacy" },
        { id: 5, name: "Sepedi", buff: "Harmony" },
        { id: 6, name: "Xitonga", buff: "Xibelani Spin" },
        { id: 7, name: "Tshivenda", buff: "Sonic Counter" },
        { id: 8, name: "siSwati", buff: "Resource Doubling" },
        { id: 9, name: "isiNdebele", buff: "Combo Preservation" },
        { id: 10, name: "Afrikaaners", buff: "Trek Resilience" },
        { id: 11, name: "Coloured", buff: "Synthesis Bridge" }
    ];

    console.log("--- Seeding the Resonant Realms Tribes ---");

    for (const tribe of tribes) {
        process.stdout.write(`Bashing ${tribe.name} (ID: ${tribe.id})... `);
        
        // This calls the setTribe function we just fused into the Diamond
        const tx = await heritage.setTribe(tribe.id, tribe.name, tribe.buff);
        await tx.wait();
        
        console.log("✅");
    }

    console.log("\n✨ SUCCESS: All 12 Ancestral Paths are live in the Stone!");
}

main().catch((error) => {
    console.error("\nSeeding failed!");
    console.error(error);
    process.exitCode = 1;
});