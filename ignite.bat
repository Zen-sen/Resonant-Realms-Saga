@echo off
TITLE Resonant Realms Saga - Forge Ignite
echo 🔥 Starting the Forge Ritual...

echo 🧹 Step 1: Cleaning the Astral Plane...
call npx hardhat clean

echo ⚒️ Step 2: Compiling the 7 Stones...
call npx hardhat compile --force

echo 🚀 Step 3: Deploying the Trust Node to the Local Network...
call npx hardhat run scripts/deploy.js

echo ✅ Ritual Complete. The Diamond is set.
pause