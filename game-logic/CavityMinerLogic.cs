using UnityEngine;
using System.Collections.Generic;

/**
 * CAVITY MINERS ADVENTURE - GAME LOGIC BLUEPRINT (Unity/C# Style)
 * Core Mechanic: Grid-based Exploration & Resource Mining
 */
public class CavityMinerLogic : MonoBehaviour {
    
    [Header("Mining Config")]
    public int gridWidth = 10;
    public int gridHeight = 10;
    public float stepSpeed = 0.5f;

    [Header("Player State")]
    private Vector2Int playerPos = new Vector2Int(0, 0);
    private int cavitiesCollected = 0;
    private int moveCount = 0;
    private bool isGameOver = false;

    public struct Tile {
        public bool isDiggable;
        public bool hasCavity;
        public bool isExplored;
    }

    private Tile[,] mineGrid;

    public void GenerateMine() {
        mineGrid = new Tile[gridWidth, gridHeight];
        for (int x = 0; x < gridWidth; x++) {
            for (int y = 0; y < gridHeight; y++) {
                mineGrid[x, y] = new Tile {
                    isDiggable = true,
                    hasCavity = Random.value < 0.15f,
                    isExplored = false
                };
            }
        }
        playerPos = new Vector2Int(gridWidth / 2, gridHeight / 2);
        mineGrid[playerPos.x, playerPos.y].isExplored = true;
    }

    public void MovePlayer(Vector2Int direction) {
        if (isGameOver) return;

        Vector2Int target = playerPos + direction;

        // Boundary Check
        if (target.x < 0 || target.x >= gridWidth || target.y < 0 || target.y >= gridHeight) return;

        // Mining Logic
        Tile targetTile = mineGrid[target.x, target.y];
        if (targetTile.isDiggable) {
            if (targetTile.hasCavity) {
                cavitiesCollected++;
                Debug.Log("Cavity Found and Removed!");
            }
            
            // Mark as explored/dug
            targetTile.isExplored = true;
            targetTile.isDiggable = false; // Cannot dig same spot twice
            mineGrid[target.x, target.y] = targetTile;
            
            playerPos = target;
            moveCount++;
        }

        CheckGameStatus();
    }

    void CheckGameStatus() {
        if (cavitiesCollected >= 10 || moveCount >= 50) {
            EndGame();
        }
    }

    void EndGame() {
        isGameOver = true;
        Debug.Log($"Mining Session Complete. Cavities Cleared: {cavitiesCollected}");
    }
}
