import os
from dotenv import load_dotenv
load_dotenv()

from moonshot import Moonshot

client = Moonshot(api_key=os.getenv("KIMI_API_KEY"))

try:
    response = client.chat.completions.create(
        model="kimi-latest",
        messages=[{"role": "user", "content": "test"}]
    )
    print("SUCCESS!")
    print(response)
except Exception as e:
    print(f"ERROR: {e}")
