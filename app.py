from flask import Flask
import requests

app = Flask(__name__)

@app.route('/')
def hello():
    # Test that requests is working
    try:
        response = requests.get('https://httpbin.org/get')
        return f"Hello from Flask! API call status: {response.status_code}"
    except Exception as e:
        return f"Hello from Flask! Error: {e}"

if __name__ == '__main__':
    app.run(debug=True)
