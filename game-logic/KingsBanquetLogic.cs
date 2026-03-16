using UnityEngine;
using System.Collections.Generic;

/**
 * THE KING'S BANQUET - GAME LOGIC BLUEPRINT
 * Core Mechanic: Categorical Sorting (Healthy vs Sugary)
 */
public class KingsBanquetLogic : MonoBehaviour {
    
    [Header("Game Settings")]
    public int totalFoods = 15;
    public float timeLimit = 45f;

    [Header("State")]
    private int score = 0;
    private int streak = 0;
    private int foodsProcessed = 0;
    private float timeLeft;
    private bool isPlaying = false;

    public struct FoodItem {
        public string name;
        public bool isHealthy;
    }

    private List<FoodItem> foodDatabase = new List<FoodItem>() {
        new FoodItem { name = "Apple", isHealthy = true },
        new FoodItem { name = "Candy", isHealthy = false },
        new FoodItem { name = "Cheese", isHealthy = true },
        new FoodItem { name = "Soda", isHealthy = false },
        // ... mapped from FOODS array in React
    };

    private FoodItem currentFood;

    public void StartGame() {
        score = 0;
        streak = 0;
        foodsProcessed = 0;
        timeLeft = timeLimit;
        isPlaying = true;
        NextRound();
    }

    void Update() {
        if (!isPlaying) return;

        timeLeft -= Time.deltaTime;
        if (timeLeft <= 0) EndGame();
    }

    void NextRound() {
        if (foodsProcessed >= totalFoods) {
            EndGame();
            return;
        }
        currentFood = foodDatabase[Random.Range(0, foodDatabase.Count)];
    }

    public void SubmitAnswer(bool userSaidIsHealthy) {
        if (!isPlaying) return;

        bool isCorrect = (userSaidIsHealthy == currentFood.isHealthy);
        
        if (isCorrect) {
            streak++;
            int bonus = Mathf.Min(streak * 5, 20);
            score += 25 + bonus;
        } else {
            streak = 0;
            // Negative feedback loop
        }

        foodsProcessed++;
        NextRound();
    }

    void EndGame() {
        isPlaying = false;
        Debug.Log($"Banquet Finished! Score: {score}, Average: {score/totalFoods}");
    }
}
