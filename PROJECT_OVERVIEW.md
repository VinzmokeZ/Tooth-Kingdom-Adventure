# Project Overview: Tooth Kingdom Adventure

This document provides a technical breakdown of the languages, frameworks, and architecture used in this project.

## 🚀 Core Technology Stack

| Category | Technology | Purpose |
| :--- | :--- | :--- |
| **Language** | **TypeScript (.tsx)** | Provides type safety and better developer experience. |
| **Frontend Framework** | **React 18** | Component-based UI library. |
| **Styling** | **Tailwind CSS** | Utility-first CSS for modern design. |
| **UI Components** | **Shadcn UI / Radix UI** | Accessible, high-quality components. |
| **Build Tool** | **Vite** | Fast modern build tool. |
| **Backend** | **Firebase** | Auth, Database, and Cloud Functions. |
| **Mobile Integration**| **Capacitor** | Native mobile bridge for Android/iOS. |

## �️ Game Development Prompts (v0.dev)

Use this **Master Template** in [v0.dev](https://v0.dev) to generate new games for your chapters:

> "Build a high-fidelity, interactive React mini-game for children called '[Game Name]'. 
> **Theme**: Kingdom/Fantasy/Dental Health. 
> **Tech Stack**: TypeScript, Tailwind CSS, Lucide-React icons, and Framer Motion. 
> **Requirements**:
> 1. Include a 'Start Screen', 'Gameplay Screen', and 'Victory Screen'.
> 2. Implement 3-star reward system based on score.
> 3. Add obstacles (sticky candy, plaque monsters).
> 4. Must accept an 'onComplete(score, stars)' callback prop."

### ⚔️ Chapter-Specific Themes:
1.  **Brushing**: "Enamel Castle Siege" (Brush away plaque monsters).
2.  **Bacteria**: "Sugar Bug Invasion" (Defense/Tapping game).
3.  **Flossing**: "The Royal Rope Rescue" (Precision navigation).
4.  **Nutrition**: "The King's Banquet" (Healthy vs Sugary sorting).
5.  **Mastery**: "The Wise Knight's Trial" (Interactive logic/trivia).

## 🛠️ Integration Guide
1.  Generate code in v0.dev.
2.  Create a file in `src/components/games/YourGameName.tsx`.
3.  Paste the code and import it into `GameEngine.tsx`.
