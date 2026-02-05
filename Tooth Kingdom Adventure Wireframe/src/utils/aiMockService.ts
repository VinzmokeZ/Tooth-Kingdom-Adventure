
import { UserData } from '../components/screens/types';

// Knowledge base for the Dental AI Chatbot
const DENTAL_KNOWLEDGE_BASE = [
    {
        keywords: ['brush', 'how to', 'technique'],
        responses: [
            "Great question! specific_user! To brush like a pro, maintain a 45-degree angle against the gums. Use gentle circular motions—don't scrub too hard! 🦷✨",
            "Imagine you're massaging your teeth! Gentle circles are the key. Don't forget the back teeth—they like to hide sugar bugs! 🦠",
            "Two minutes is the magic number! Try singing 'Happy Birthday' twice while you brush. That's about the right time! 🎵"
        ]
    },
    {
        keywords: ['floss', 'string'],
        responses: [
            "Flossing is like a secret agent mission! You need to get between the teeth where the brush can't reach. Once a day keeps the dentist away! 🕵️‍♀️",
            "Did you know your toothbrush misses 35% of your tooth surfaces? That's why we floss! It cleans the tight spots between teeth.",
            "Gentle is the way! Slide the floss up and down against the side of each tooth. Don't snap it on your gums—ouch! 🚫"
        ]
    },
    {
        keywords: ['sugar', 'candy', 'sweet', 'chocolate'],
        responses: [
            "Sugar bugs throw a party when you eat sweets! 🍬 If you have a treat, drink lots of water or brush afterwards to send them home.",
            "Sugar turns into acid that can hurt your teeth. It's okay to have treats sometimes, just make sure to clean your teeth right after! 🍭",
            "Healthy snacks like apples and carrots are actually nature's toothbrush! They help clean your teeth while you eat. 🍎"
        ]
    },
    {
        keywords: ['pain', 'hurt', 'ache', 'ouch'],
        responses: [
            "Oh no! If your tooth hurts, it's really important to tell a grown-up so they can take you to the dentist. They are tooth superheroes! 🦸‍♂️",
            "Tooth pain is a sign that a sugar bug might have made a house in your tooth. The dentist can help fix it and make it feel better! 🏥",
            "Don't worry! Dentists are friends who help stop the ouchies. Make sure to point to exactly where it hurts."
        ]
    },
    {
        keywords: ['scared', 'afraid', 'fear'],
        responses: [
            "It's okay to be nervous! But guess what? The dentist's chair is actually a spaceship! 🚀 And the dentist is the pilot helping you keep your smile bright.",
            "Dentists are super nice! They have cool gadgets and sometimes even give you a prize for being brave! 🎁",
            "You are a Tooth Kingdom Champion! Champions are brave. Taking deep breaths helps a lot! 😤"
        ]
    }
];

const DEFAULT_RESPONSES = [
    "That's interesting! Tell me more about your teeth! 🦷",
    "I'm learning more about dental health every day. Remember to brush twice a day! ✨",
    "You're doing great! Keep asking questions. Smart kids have healthy smiles! 🧠",
    "I'm not sure about that one, but I know that water is the best drink for your teeth! 💧"
];

// Helper to get a random item from an array
const getRandom = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

export const getAIChatResponse = (input: string, userName: string = 'Champion'): string => {
    const lowerInput = input.toLowerCase();

    for (const topic of DENTAL_KNOWLEDGE_BASE) {
        if (topic.keywords.some(k => lowerInput.includes(k))) {
            const response = getRandom(topic.responses);
            return response.replace('specific_user', userName);
        }
    }

    return getRandom(DEFAULT_RESPONSES);
};

// Personality traits for the report
const REPORT_PERSONALITIES = [
    { style: 'Encouraging', emojis: ['🌟', '💪', '🦷'] },
    { style: 'Scientific', emojis: ['🧪', '📊', '🔍'] },
    { style: 'Playful', emojis: ['🎉', '👾', '🎈'] }
];

export const generateAIProgressReport = (userData: UserData): string => {
    const logs = userData.brushingLogs || {};
    const totalBrushes = Object.values(logs).reduce((acc: number, log: { morning: boolean; evening: boolean }) => acc + (log.morning ? 1 : 0) + (log.evening ? 1 : 0), 0);
    const streak = userData.currentStreak;
    const stars = userData.totalStars;

    const personality = REPORT_PERSONALITIES[Math.floor(Math.random() * REPORT_PERSONALITIES.length)];
    const date = new Date().toLocaleDateString();

    let analysis = "";
    let recommendation = "";

    // Dynamic Analysis based on stats
    if (streak > 3) {
        analysis = `Your consistency is amazing! A ${streak}-day streak proves you are a dedicated Tooth Defender.`;
    } else if (streak > 0) {
        analysis = `You've started a great streak! Keep it up to build a super-habit.`;
    } else {
        analysis = `It looks like we missed a few sessions. That's okay! Today is a perfect day to restart your streak.`;
    }

    // Dynamic Recommendation
    if (totalBrushes % 2 !== 0) {
        recommendation = "Try to balance your morning and evening brushing. Nighttime brushing is super important to fight sugar bugs while you sleep!";
    } else if (stars > 50) {
        recommendation = "You have lots of stars! Maybe challenge yourself to floss every night this week for bonus XP?";
    } else {
        recommendation = "Focus on hitting both morning and evening goals to earn more stars faster!";
    }

    return `
 **AI Progress Analysis ${personality.emojis[0]}**
 Date: ${date}
 
 **Style:** ${personality.style} Analysis
 
 **Overview:**
 ${analysis}
 
 **Stat Highlight:**
 - Total Sessions: ${totalBrushes} ${personality.emojis[1]}
 - Current Streak: ${streak} days ${personality.emojis[2]}
 - Star Power: ${stars} ⭐
 
 **Coach's Tip:**
 ${recommendation}
 
 Keep smiling!
  `.trim();
};
