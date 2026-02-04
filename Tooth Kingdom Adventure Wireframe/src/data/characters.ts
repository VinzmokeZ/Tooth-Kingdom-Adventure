import heroLuna from '../assets/CHIBI 1.svg';
import heroMax from '../assets/CHIBI 2.svg';
import heroMia from '../assets/CHIBI 3.svg';
import heroZara from '../assets/CHIBI 4.svg';
import heroKai from '../assets/CHIBI 5.svg';

export interface Character {
    id: number;
    name: string;
    color: string;
    image: string;
    description: string;
}

export const characters: Character[] = [
    {
        id: 1,
        name: 'Luna',
        color: 'from-purple-400 to-pink-400',
        image: heroLuna,
        description: 'Brave and kind, Luna loves to explore the Tooth Kingdom!'
    },
    {
        id: 2,
        name: 'Max',
        color: 'from-blue-400 to-cyan-400',
        image: heroMax,
        description: 'Smart and energetic, Max is always ready for a challenge!'
    },
    {
        id: 3,
        name: 'Mia',
        color: 'from-pink-400 to-rose-400',
        image: heroMia,
        description: 'Creative and caring, Mia makes brushing fun for everyone!'
    },
    {
        id: 4,
        name: 'Zara',
        color: 'from-amber-400 to-orange-400',
        image: heroZara,
        description: 'Fast and fearless, Zara zips through plaque in no time!'
    },
    {
        id: 5,
        name: 'Kai',
        color: 'from-indigo-400 to-purple-400',
        image: heroKai,
        description: 'Strong and steady, Kai protects teeth with all his might!'
    },
];

export const getCharacter = (id: number | null) => {
    return characters.find(c => c.id === id);
};
