# Foundation Rule: Tribe 0 Invariance
- **Philosophical Goal:** The Coloured Tribe is the "Integration Layer." Neutrality is mandatory.
- **Technical Guardrail:** During any genetic crossover in `AncestralUtils.sol`, Bit 0 (Tribe 0) must remain IMMUTABLE.
- **Constraint:** Use bitmask `0xFFFE` for all noise/jitter operations to shield the foundation bit.
- **FORCE_MASK:** `0xFFFE` must be applied to all inheritance logic in any new Facet added to the Diamond Stone.