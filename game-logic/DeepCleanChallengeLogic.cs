using UnityEngine;
using System.Collections.Generic;

/**
 * DEEP CLEAN CHALLENGE - GAME LOGIC BLUEPRINT
 * Core Mechanic: Surface Interaction & Iterative Cleanup
 */
public class DeepCleanChallengeLogic : MonoBehaviour {
    
    [Header("Cleaning Settings")]
    public int totalDirtPatches = 15;
    public float cleaningRadius = 10f;
    public float cleaningPower = 5f;

    [Header("State")]
    private float cleanlinessPercent = 0f;
    private bool isCleaningActive = false;
    private int score = 0;

    public struct DirtPatch {
        public int id;
        public Vector2 position;
        public float health;
    }

    private List<DirtPatch> activePatches = new List<DirtPatch>();

    public void InitializeKingdom() {
        activePatches.Clear();
        for (int i = 0; i < totalDirtPatches; i++) {
            DirtPatch p = new DirtPatch();
            p.id = i;
            p.position = new Vector2(Random.Range(15, 85), Random.Range(20, 80));
            p.health = 100f;
            activePatches.Add(p);
        }
        cleanlinessPercent = 0;
    }

    public void OnPointerInput(Vector2 cursorCoord, bool isDown) {
        if (!isDown) return;

        // Iterative Cleaning Logic
        for (int i = activePatches.Count - 1; i >= 0; i--) {
            DirtPatch p = activePatches[i];
            float dist = Vector2.Distance(p.position, cursorCoord);

            if (dist < cleaningRadius) {
                p.health -= cleaningPower;
                
                if (p.health <= 0) {
                    activePatches.RemoveAt(i);
                    UpdateCleanliness();
                } else {
                    activePatches[i] = p;
                }
            }
        }
    }

    void UpdateCleanliness() {
        int cleanedCount = totalDirtPatches - activePatches.Count;
        cleanlinessPercent = ((float)cleanedCount / totalDirtPatches) * 100f;

        if (cleanlinessPercent >= 100) {
            EndGame();
        }
    }

    void EndGame() {
        score = 500; // Perfect clean!
        Debug.Log("Castle Restored! Maximum Cleanliness Reached.");
    }
}
