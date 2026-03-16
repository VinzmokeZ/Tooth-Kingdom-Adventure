using UnityEngine;
using System.Collections.Generic;

/**
 * ENAMEL CASTLE SIEGE - GAME LOGIC BLUEPRINT
 * Core Mechanic: Side-Scrolling Lane Defense & Combat
 */
public class EnamelCastleSiegeLogic : MonoBehaviour {
    
    [Header("Defense Settings")]
    public int startHealth = 100;
    public float monsterSpawnRate = 1.2f;
    public float monsterSpeed = 2.0f;

    [Header("Player State")]
    private int castleHealth;
    private int score;
    private int combo;
    private float playerLaneY = 50f; // 0-100 range
    private bool isAttacking = false;

    public struct Enemy {
        public long id;
        public Vector2 position;
        public string type;
    }

    private List<Enemy> enemies = new List<Enemy>();

    public void StartGame() {
        castleHealth = startHealth;
        score = 0;
        combo = 0;
        InvokeRepeating("SpawnEnemy", 0f, monsterSpawnRate);
    }

    void Update() {
        // Monster Movement & Castle Damage
        for (int i = enemies.Count - 1; i >= 0; i--) {
            Enemy e = enemies[i];
            e.position.x -= monsterSpeed * Time.deltaTime * 50; 
            
            if (e.position.x <= 15) {
                castleHealth -= 10;
                combo = 0;
                enemies.RemoveAt(i);
                continue;
            }
            
            enemies[i] = e;
        }

        if (castleHealth <= 0) EndGame();
    }

    public void PlayerMove(string direction) {
        if (direction == "up") playerLaneY = Mathf.Max(15, playerLaneY - 12);
        else playerLaneY = Mathf.Min(85, playerLaneY + 12);
    }

    public void ExecuteAttack() {
        if (isAttacking) return;
        isAttacking = true;

        // Hit Detection within Attack Range
        bool foundHit = false;
        for (int i = enemies.Count - 1; i >= 0; i--) {
            Enemy e = enemies[i];
            
            // Range check: x (20-45) and y (within 25 units of player)
            bool isInRange = (e.position.x >= 20 && e.position.x <= 45);
            bool isInLane = Mathf.Abs(e.position.y - playerLaneY) < 25;

            if (isInRange && isInLane) {
                float points = 10 * (1 + combo * 0.1f);
                score += Mathf.FloorToInt(points);
                combo++;
                enemies.RemoveAt(i);
                foundHit = true;
            }
        }

        if (!foundHit) combo = 0;
        
        // Reset attack state after cooldown
        Invoke("ResetAttack", 0.2f);
    }

    void ResetAttack() { isAttacking = false; }

    void SpawnEnemy() {
        Enemy e = new Enemy();
        e.id = System.DateTime.Now.Ticks;
        e.position = new Vector2(100, Random.Range(20, 80));
        enemies.Add(e);
    }

    void EndGame() {
        CancelInvoke("SpawnEnemy");
        Debug.Log("Castle has fallen or Time is up!");
    }
}
