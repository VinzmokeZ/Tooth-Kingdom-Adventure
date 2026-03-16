using UnityEngine;
using System.Collections.Generic;

/**
 * SUGAR BUG INVASION - GAME LOGIC BLUEPRINT
 * Core Mechanic: Precision Tapping & Multiplier Management
 */
public class SugarBugInvasionLogic : MonoBehaviour {
    
    [Header("Game Settings")]
    public float gameDuration = 30f;
    public float spawnInterval = 0.8f;
    public int maxScore = 600;

    [Header("State")]
    private float timeLeft;
    private int score;
    private float multiplier = 1.0f;
    private float lastTapTime;
    private bool isPlaying = false;

    public struct Bug {
        public long id;
        public Vector2 position;
        public string type; // "sugar" or "plaque"
        public float speed;
    }

    private List<Bug> activeBugs = new List<Bug>();

    public void StartGame() {
        score = 0;
        timeLeft = gameDuration;
        isPlaying = true;
        InvokeRepeating("SpawnBug", 0f, spawnInterval);
    }

    void Update() {
        if (!isPlaying) return;

        // Timer Logic
        timeLeft -= Time.deltaTime;
        if (timeLeft <= 0) EndGame();

        // Bug Movement Logic
        for (int i = activeBugs.Count - 1; i >= 0; i--) {
            Bug bug = activeBugs[i];
            bug.position.y += bug.speed * Time.deltaTime; 
            activeBugs[i] = bug;

            // Remove if off screen
            if (bug.position.y > 100) activeBugs.RemoveAt(i);
        }
    }

    void SpawnBug() {
        Bug newBug = new Bug();
        newBug.id = System.DateTime.Now.Ticks;
        newBug.position = new Vector2(Random.Range(10, 90), -10);
        newBug.type = Random.value > 0.3f ? "sugar" : "plaque";
        newBug.speed = Random.Range(20f, 50f);
        activeBugs.Add(newBug);
    }

    public void OnTapBug(long bugId) {
        float now = Time.time;
        float timeDiff = now - lastTapTime;

        // Multiplier / Combo Logic
        if (timeDiff < 0.5f) {
            multiplier = Mathf.Min(multiplier + 0.5f, 5.0f);
        } else {
            multiplier = 1.0f;
        }
        lastTapTime = now;

        // Scoring Logic
        Bug tappedBug = activeBugs.Find(b => b.id == bugId);
        int basePoints = (tappedBug.type == "sugar") ? 10 : 20;
        score += Mathf.FloorToInt(basePoints * multiplier);
        score = Mathf.Min(score, maxScore);

        activeBugs.Remove(tappedBug);
    }

    void EndGame() {
        isPlaying = false;
        CancelInvoke("SpawnBug");
        int stars = CalculateStars(score);
        Debug.Log($"Game Over! Score: {score}, Stars: {stars}");
    }

    int CalculateStars(int finalScore) {
        if (finalScore >= 480) return 3;
        if (finalScore >= 300) return 2;
        if (finalScore > 0) return 1;
        return 0;
    }
}
