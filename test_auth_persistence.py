import requests
import json
import random

API_URL = "http://127.0.0.1:8010"
TEST_EMAIL = f"test_{random.randint(1000, 9999)}@example.com"
TEST_PASS = "password123"

def test_auth():
    print(f"--- Testing Auth for {TEST_EMAIL} ---")
    
    # 1. Register
    reg_payload = {
        "name": "Test Hero",
        "email": TEST_EMAIL,
        "password": TEST_PASS,
        "dob": "2015-05-05",
        "role": "child"
    }
    try:
        reg_resp = requests.post(f"{API_URL}/auth/register", json=reg_payload)
        print(f"Register Status: {reg_resp.status_code}")
        reg_data = reg_resp.json()
        print(f"Register Response: {json.dumps(reg_data, indent=2)}")
        
        if not reg_data.get("success") or "email" not in reg_data.get("user", {}):
            print("FAILED: Email missing from registration response")
            return
            
        print("SUCCESS: Registration response verified.")
        
        # 2. Login
        login_payload = {
            "email": TEST_EMAIL,
            "password": TEST_PASS
        }
        login_resp = requests.post(f"{API_URL}/auth/login", json=login_payload)
        print(f"Login Status: {login_resp.status_code}")
        login_data = login_resp.json()
        print(f"Login Response: {json.dumps(login_data, indent=2)}")
        
        if not login_data.get("success") or "email" not in login_data.get("user", {}):
            print("FAILED: Email missing from login response")
            return

        print("SUCCESS: Login response verified.")
        
    except Exception as e:
        print(f"ERROR: Could not reach backend. Is LIVE_DEV.bat running?\n{e}")

if __name__ == "__main__":
    test_auth()
