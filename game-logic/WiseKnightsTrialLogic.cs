using UnityEngine;
using System.Collections.Generic;

/**
 * WISE KNIGHT'S TRIAL - GAME LOGIC BLUEPRINT
 * Core Mechanic: Trivia, Brain Reflex & Knowledge Scaling
 */
public class WiseKnightsTrialLogic : MonoBehaviour {
    
    [Header("Trial Settings")]
    public int totalQuestions = 8;
    public float questionTimeLimit = 15f;

    [Header("Trial State")]
    private int score = 0;
    private int streak = 0;
    private int currentQuestionIndex = 0;
    private float timeLeft;
    private bool isWaitingForInput = false;

    public struct Question {
        public string query;
        public string[] options;
        public int correctIndex;
    }

    private List<Question> activeRound = new List<Question>();

    public void StartTrial(List<Question> bank) {
        // Shuffle and take subset
        activeRound = bank.GetRange(0, totalQuestions); // Simplification of shuffle logic
        currentQuestionIndex = 0;
        score = 0;
        streak = 0;
        NextQuestion();
    }

    void Update() {
        if (!isWaitingForInput) return;

        timeLeft -= Time.deltaTime;
        if (timeLeft <= 0) {
            OnAnswerSelected(-1); // Timeout penalty
        }
    }

    void NextQuestion() {
        if (currentQuestionIndex >= totalQuestions) {
            EndTrial();
            return;
        }
        
        timeLeft = questionTimeLimit;
        isWaitingForInput = true;
    }

    public void OnAnswerSelected(int index) {
        if (!isWaitingForInput) return;
        isWaitingForInput = false;

        Question q = activeRound[currentQuestionIndex];
        bool isCorrect = (index == q.correctIndex);

        if (isCorrect) {
            streak++;
            int timeBonus = Mathf.FloorToInt(timeLeft * 2);
            int streakBonus = Mathf.Min(streak * 10, 30);
            score += 40 + timeBonus + streakBonus;
        } else {
            streak = 0;
        }

        currentQuestionIndex++;
        Invoke("NextQuestion", 1.2f); // Short delay for user to see result
    }

    void EndTrial() {
        Debug.Log($"Trial Complete! Score: {score}. Stars: {CalculateStars(score)}");
    }

    int CalculateStars(int s) {
        if (s >= 400) return 3;
        if (s >= 250) return 2;
        return (s > 0) ? 1 : 0;
    }
}
