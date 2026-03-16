using UnityEngine;
using System.Collections.Generic;

/**
 * ROYAL ROPE RESCUE - GAME LOGIC BLUEPRINT
 * Core Mechanic: Physics-based Obstacle Navigation (Flappy Style)
 */
public class RoyalRopeRescueLogic : MonoBehaviour {
    
    [Header("Game Settings")]
    public float gravity = -9.8f;
    public float flapStrength = 5.0f;
    public float scrollSpeed = 2.0f;
    public int maxLives = 3;

    [Header("State")]
    private float flossY = 50f;
    private int score = 0;
    private int lives;
    private bool isPlaying = false;
    private bool isInvincible = false;

    public struct Gap {
        public long id;
        public float x;
        public float gapY;
        public float gapHeight;
        public bool passed;
    }

    private List<Gap> activeGaps = new List<Gap>();

    public void StartGame() {
        lives = maxLives;
        score = 0;
        flossY = 50f;
        isPlaying = true;
        InvokeRepeating("SpawnGap", 0f, 2.0f);
    }

    void Update() {
        if (!isPlaying) return;

        // "Physics" Logic
        // In the original, it's spring-based, here we simulate core runner movement
        // flapStrength handles the Y adjustment

        // Move Gaps & Collision Detection
        for (int i = activeGaps.Count - 1; i >= 0; i--) {
            Gap gap = activeGaps[i];
            gap.x -= scrollSpeed * Time.deltaTime * 50; 
            
            // Horizontal check (if pipe is at player's X position)
            if (!gap.passed && gap.x <= 26 && gap.x >= -2) {
                bool inGap = (flossY >= gap.gapY && flossY <= gap.gapY + gap.gapHeight);

                if (inGap && gap.x <= 14) {
                    // Success!
                    bool isPerfect = Mathf.Abs(flossY - (gap.gapY + gap.gapHeight/2)) < 4;
                    score += isPerfect ? 30 : 20;
                    gap.passed = true;
                } else if (!inGap && !isInvincible) {
                    // Hit!
                    lives--;
                    StartCoroutine(InvincibilityFrames());
                    if (lives <= 0) EndGame();
                    gap.passed = true;
                }
            }
            
            activeGaps[i] = gap;
            if (gap.x < -10) activeGaps.RemoveAt(i);
        }
    }

    public void OnFlap(string direction) {
        if (direction == "up") flossY = Mathf.Max(10, flossY - 8);
        else flossY = Mathf.Min(90, flossY + 8);
    }

    System.Collections.IEnumerator InvincibilityFrames() {
        isInvincible = true;
        yield return new WaitForSeconds(0.9f);
        isInvincible = false;
    }

    void SpawnGap() {
        Gap newGap = new Gap();
        newGap.id = System.DateTime.Now.Ticks;
        newGap.x = 110f;
        newGap.gapY = Random.Range(25f, 75f);
        newGap.gapHeight = 25f;
        newGap.passed = false;
        activeGaps.Add(newGap);
    }

    void EndGame() {
        isPlaying = false;
        CancelInvoke("SpawnGap");
        Debug.Log($"Rescue Over! Final Score: {score}");
    }
}
