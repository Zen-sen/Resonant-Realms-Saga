import os
from dotenv import load_dotenv
load_dotenv()

from openai import OpenAI

# EXACT copy of how we're initializing
api_key = os.getenv("KIMI_API_KEY")
base_url = "https://api.moonshot.cn/v1"

print("=== DEBUG INFO ===")
print(f"API Key: {api_key[:15]}... (length: {len(api_key)})")
print(f"Base URL: {base_url}")
print("==================")

client = OpenAI(api_key=api_key, base_url=base_url)

try:
    response = client.chat.completions.create(
        model="kimi-latest", 
        messages=[{"role": "user", "content": "test"}]
    )
    print("SUCCESS!")
except Exception as e:
    print(f"ERROR: {type(e).__name__}: {e}")
