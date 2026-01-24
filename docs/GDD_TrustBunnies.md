# Game Design Document: TrustBunnies

## 🐰 Core Loop
1. **Mint/Adopt**: Players receive their first Bunny (e.g., HopChain).
2. **Tribe Alignment**: Players join tribes (Ancestral Heritage) using Ubuntu Points.
3. **Breeding**: Combine genes with a 24-hour cooldown.
4. **Resonance**: Match-3 mechanics (to be implemented) influence bunny evolution.

## 🧬 Gene Mechanics
- **Mixer**: Logic resides in `AncestralUtils.sol`.
- **Cooldown**: Managed by `cooldownEndTime` in `AppStorage`.

## 💎 Economy (Ubuntu Points)
- Earned through mentorship and node validation.
- Spent on breeding and tribe upgrades.

## 🧬 Ancestral Math (v1.0)
- Uses bitwise crossover (Matron-High/Sire-Low).
- 1% Random mutation chance using block entropy.
