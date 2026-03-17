import requests
import json
import time

API_URL = "http://127.0.0.1:8010"
TEST_PHONE = f"+1555{int(time.time())}"

def test_phone_auth():
    print(f"--- Testing Phone Auth for {TEST_PHONE} ---")
    
    # 1. Debug Log
    try:
        log_resp = requests.post(f"{API_URL}/debug/log", json={"message": f"Test phone: {TEST_PHONE}"})
        print(f"Debug Log Status: {log_resp.status_code}")
    except Exception as e:
        print(f"FAILED to reach debug log: {e}")

    # 2. Phone Auth
    try:
        auth_resp = requests.post(f"{API_URL}/auth/phone", json={"phone": TEST_PHONE})
        print(f"Phone Auth Status: {auth_resp.status_code}")
        auth_data = auth_resp.json()
        print(f"Phone Auth Response: {json.dumps(auth_data, indent=2)}")
        
        if not auth_data.get("success") or auth_data.get("user", {}).get("phone") != TEST_PHONE:
            print("FAILED: Phone auth response verification failed")
            return
            
        print("SUCCESS: Phone auth flow verified.")
        
    except Exception as e:
        print(f"ERROR: Could not reach backend.\n{e}")

if __name__ == "__main__":
    test_phone_auth()
