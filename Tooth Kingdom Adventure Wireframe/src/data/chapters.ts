export interface Chapter {
    id: number;
    title: string;
    description: string;
    lessons: number;
    stars: number;
    completed: boolean;
    locked: boolean;
    color: string;
    illustration: string;
    gameType?: string; // Identifier for the mini-game
    gameConfig?: any; // Specific config for the game
}

export const chapters: Chapter[] = [
    {
        id: 1,
        title: 'The Brushing Basics Adventure',
        description: 'Join our hero at the gates of the Enamel Castle. Learn why we brush and master the ancient circular technique to defeat the Plaque Monsters!',
        lessons: 5,
        stars: 15,
        completed: true,
        locked: false,
        color: 'from-purple-100 to-purple-50',
        illustration: 'https://images.unsplash.com/photo-1649293823459-094749e377d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXJ0b29uJTIwY2FzdGxlJTIwZmFudGFzeSUyMGNoaWxkcmVufGVufDF8fHx8MTc2OTE1MDk3Nnww&ixlib=rb-4.1.0&q=80&w=1080',
        gameType: 'brushing-fantasy',
        gameConfig: { plaqueAmount: 10, timeLimit: 30 }
    },
    {
        id: 2,
        title: 'The Sugar Bugs Attack',
        description: 'Discover how to fight cavity-causing bacteria and protect your tooth kingdom from the sugar bug invasion!',
        lessons: 6,
        stars: 18,
        completed: true,
        locked: false,
        color: 'from-blue-100 to-blue-50',
        illustration: 'https://images.unsplash.com/photo-1563802287254-0b0a9943d36f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXJ0b29uJTIwYnVncyUyMG1vbnN0ZXJzJTIwY3JlYXR1cmVzfGVufDF8fHx8MTc2OTE1MDk3Nnww&ixlib=rb-4.1.0&q=80&w=1080',
        gameType: 'germs-fantasy',
        gameConfig: { germSpeed: 1.5, spawnRate: 1000 }
    },
    {
        id: 3,
        title: 'Flossing Adventures',
        description: 'Master the art of flossing between your teeth and unlock secret passages in the Tooth Kingdom!',
        lessons: 5,
        stars: 15,
        completed: false,
        locked: false,
        color: 'from-pink-100 to-pink-50',
        illustration: 'https://images.unsplash.com/photo-1766156555244-572b9757433b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYW50YXN5JTIwYWR2ZW50dXJlJTIwbWFnaWNhbCUyMGtpbmdkb218ZW58MXx8fHwxNzY5MTUwOTc3fDA&ixlib=rb-4.1.0&q=80&w=1080',
        gameType: 'flossing-fantasy',
        gameConfig: {}
    },
    {
        id: 4,
        title: 'Healthy Eating Habits',
        description: 'Learn which foods help keep your teeth strong and which ones to avoid in your quest!',
        lessons: 7,
        stars: 21,
        completed: false,
        locked: true,
        color: 'from-green-100 to-green-50',
        illustration: 'https://images.unsplash.com/photo-1568477070631-5bfef06fdf44?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGh5JTIwZnJ1aXRzJTIwdmVnZXRhYmxlcyUyMGNvbG9yZnVsfGVufDF8fHx8MTc2OTE1MDk3N3ww&ixlib=rb-4.1.0&q=80&w=1080',
        gameType: 'food-sort-fantasy',
        gameConfig: {}
    },
    {
        id: 5,
        title: 'Tooth Kingdom Master',
        description: 'Become the ultimate dental health champion and earn your crown in the Tooth Kingdom!',
        lessons: 8,
        stars: 24,
        completed: false,
        locked: true,
        color: 'from-amber-100 to-amber-50',
        illustration: 'https://images.unsplash.com/photo-1739323980445-b76a6e459d0b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcm93biUyMHRyb3BoeSUyMGFjaGlldmVtZW50JTIwZ29sZHxlbnwxfHx8fDE3NjkxNTA5ODB8MA&ixlib=rb-4.1.0&q=80&w=1080',
        gameType: 'quiz-master-fantasy',
        gameConfig: {}
    },
];
