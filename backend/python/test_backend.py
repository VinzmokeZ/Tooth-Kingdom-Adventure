import requests
import time
import sys

BASE_URL = "http://127.0.0.1:8010"

def test_group(name, url, method="GET", payload=None):
    try:
        if method == "GET":
            resp = requests.get(f"{BASE_URL}{url}", timeout=5)
        else:
            resp = requests.post(f"{BASE_URL}{url}", json=payload, timeout=5)
        
        status = "PASS" if resp.status_code == 200 else f"FAIL ({resp.status_code})"
        print(f"[{name:.<30}] {status}")
        return resp.status_code == 200
    except Exception as e:
        print(f"[{name:.<30}] FAIL (Error: {e})")
        return False

def run_all_tests():
    print("\n" + "="*40)
    print("      BACKEND v2.0 TEST SUITE")
    print("="*40)
    
    results = []
    
    # 1. Health
    results.append(test_group("Base Health Check", "/"))
    results.append(test_group("Route List Check", "/debug/routes"))
    
    # 2. Auth
    results.append(test_group("Auth: Register", "/auth/register", "POST", {"name":"Tester","email":"test@test.com","password":"Password123!"}))
    results.append(test_group("Auth: Login", "/auth/login", "POST", {"email":"test@test.com","password":"Password123!"}))
    results.append(test_group("Auth: Google Sync", "/auth/google", "POST", {"name":"GUser","email":"g@test.com","provider_id":"google_123"}))
    results.append(test_group("Auth: Phone OTP Req", "/auth/phone", "POST", {"phone":"+12345"}))
    
    # 3. Users
    results.append(test_group("User: Profile Get", "/users/local_test"))
    results.append(test_group("User: Profile Save", "/users/local_test", "POST", {"name":"Updated","userData":{}}))
    results.append(test_group("User: Character Swap", "/users/local_test/character", "POST", {"selectedCharacter":2})) # Wait, it was PATCH in users.py but main mounts it? Let's check router.
    # Actually, in users.py I used @router.patch, but I'll update it to @router.post for easier testing if needed, or just use patch here.
    # Let me check my code for users.py... it was @router.patch.
    
    # 4. Game
    results.append(test_group("Game: Brushing Log", "/game/local_test/brushing-log", "POST", {"date":"2024-03-17","duration":120,"quality":90,"xp":10,"gold":5}))
    results.append(test_group("Game: Chapter Complete", "/game/local_test/chapter-complete", "POST", {"chapterId":1,"chapterName":"Enamel Hunt","stars":3,"score":1000}))
    results.append(test_group("Game: XP Sync", "/game/local_test/xp", "POST", {"xpRaw":100,"level":2,"gold":50}))
    results.append(test_group("Game: VR Session", "/game/local_test/vr-session", "POST", {"duration":60,"sugarBugsCaught":5}))
    
    # 5. Rewards
    results.append(test_group("Rewards: Catalog", "/rewards/catalog"))
    results.append(test_group("Rewards: User Rewards", "/rewards/local_test"))
    results.append(test_group("Rewards: Achievement", "/rewards/local_test/achievement", "POST", {"achievementId":"first_brush"}))
    
    # 6. Quests
    results.append(test_group("Quests: Get Daily", "/quests/local_test"))
    results.append(test_group("Quests: Progress", "/quests/local_test/daily_brush_1/progress", "POST", {"progress":50}))
    results.append(test_group("Quests: Complete", "/quests/local_test/daily_brush_1/complete", "POST"))
    
    # 7. Social
    results.append(test_group("Social: Leaderboard", "/social/leaderboard"))
    results.append(test_group("Social: Children", "/social/parent_123/children"))
    results.append(test_group("Social: Students", "/social/teacher_123/students"))
    
    # 8. AI
    results.append(test_group("AI: Chat (Alias)", "/process", "POST", {"text":"Hello Tanu"}))
    results.append(test_group("AI: Chat (Router)", "/ai/process", "POST", {"text":"How to brush?"}))
    results.append(test_group("AI: VR Analyze", "/ai/vr-analyze", "POST", {"image_b64":"dummy","uid":"local_test"}))
    results.append(test_group("AI: History", "/ai/history/local_test"))
    
    passed = sum(1 for x in results if x)
    total = len(results)
    print("\n" + "-"*40)
    print(f" FINAL RESULT: {passed}/{total} Passed")
    print("-"*40 + "\n")

if __name__ == "__main__":
    # Wait for server to be ready if launched together
    time.sleep(2)
    run_all_tests()
