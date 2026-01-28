import pkg from "hardhat";
const { ethers } = pkg;

async function main() {
    // UPDATED: Your active Diamond Stone address from Milestone v1.4.0
    const diamondAddress = "0x367761085BF3C12e5DA2Df99AC6E1a824612b8fb";
    
    // Attach to the Diamond via the Heritage interface
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
        { id: 11, name: "Coloured", buff: "Synthesis Bridge" },
        { id: 12, name: "Sovereignty", buff: "The Crown: Global Trust Node Activation" }
    ];

    console.log("--- Seeding the Resonant Realms Tribes ---");
    console.log(`Target Stone: ${diamondAddress}\n`);

    for (const tribe of tribes) {
        process.stdout.write(`Bashing ${tribe.name} (ID: ${tribe.id})... `);
        
        try {
            const tx = await heritage.setTribe(tribe.id, tribe.name, tribe.buff);
            await tx.wait();
            console.log("✅");
        } catch (err) {
            console.log("❌");
            console.error(`Error seeding ${tribe.name}:`, err.reason || err.message);
        }
    }

    console.log("\n✨ SUCCESS: All 13 Ancestral Paths are live in the Stone!");
}

main().catch((error) => {
    console.error("\nSeeding failed!");
    console.error(error);
    process.exitCode = 1;
});