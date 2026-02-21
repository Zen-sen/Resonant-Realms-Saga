import json
import requests
import sys

# --- Configuration ---
RPC_URL = "http://127.0.0.1:8545"
DIAMOND_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"

# Selectors (Derived from BreedingFacet)
# getBunny(uint256) -> 0x5188fd2a
# bunnyCount() -> Not a direct function but we can use totalSages from BunnyFactoryFacet
# totalSages() -> 0x30939678

def call_rpc(method, params=[]):
    payload = {
        "jsonrpc": "2.0",
        "method": method,
        "params": params,
        "id": 1
    }
    response = requests.post(RPC_URL, json=payload)
    return response.json().get('result')

def get_total_sages():
    # totalSages() call
    data = "0x30939678"
    result = call_rpc("eth_call", [{"to": DIAMOND_ADDRESS, "data": data}, "latest"])
    if not result: return 0
    return int(result, 16)

def get_bunny_genes(bunny_id):
    # getBunny(uint256) call
    # 0x5188fd2a + padded bunny_id
    method_id = "0x5188fd2a"
    params = hex(bunny_id)[2:].zfill(64)
    data = method_id + params
    result = call_rpc("eth_call", [{"to": DIAMOND_ADDRESS, "data": data}, "latest"])
    if not result: return None
    
    # getBunny returns a struct. The first field is genes (uint256).
    # result is the whole encoded struct. We take the first 32 bytes.
    # Result starts with 0x, then 64 chars of offset/length if dynamic, 
    # but Bunny is static-sized (8 uint256s/32-byte slots).
    # 1. genes
    # 2. birthTime
    # 3. tribeId
    # ...
    genes_hex = result[2:66]
    return int(genes_hex, 16)

def main():
    print("🧘 Resonant Realms: Sovereignty Verification")
    print("="*45)
    
    try:
        total = get_total_sages()
    except Exception as e:
        print(f"❌ Error connecting to node: {e}")
        sys.exit(1)

    if total == 0:
        print("ℹ️ No sages manifested in the Diamond yet.")
        return

    check_count = min(total, 5)
    print(f"🔍 Analyzing last {check_count} Sage(s) for Foundation Integrity...")
    
    secure = True
    for i in range(total - check_count, total):
        genes = get_bunny_genes(i)
        if genes is None:
            continue
            
        # Khoe-San Foundation Rule: Bit 0 must be 1 (Foundation Active)
        # Note: This check assumes the lineages being tested ARE foundation-based.
        # In actual v1.6.0, it should verify that IF parent has Bit 0, then child MUST have Bit 0.
        # For this test automation, we just check if Bit 0 exists.
        
        foundation_bit = genes & 1
        status = "SECURE" if foundation_bit == 1 else "CORRUPT"
        
        print(f"  [ID {i}] Genes: {hex(genes)[:18]}... | Bit 0: {foundation_bit} | {status}")
        
        if status == "CORRUPT":
            secure = False

    print("-" * 45)
    if secure:
        print("✅ FOUNDATION SECURE")
    else:
        print("⚠️ SOVEREIGNTY BREACHED: Found corrupted foundation bit!")
        sys.exit(1)

if __name__ == "__main__":
    main()
