export interface Shop {
    id: number;
    name: string;
    logoUrl: string;
    slug: string;
    verified?: boolean;
}

export interface FeaturedShopsGridProps {
    categorySlug: string;
    maxItems?: number;
    className?: string; 
}

export const getShopsForCategory = (slug: string, max: number = 8): Shop[] => {
    const allShops: Shop[] = [
        { id: 1, name: 'COOLMATE', logoUrl: '/shops/coolmate.png', slug: 'coolmate', verified: true },
        { id: 2, name: 'BUZARO', logoUrl: '/shops/buzaro.png', slug: 'buzaro', verified: true },
        { id: 3, name: 'JBAGY', logoUrl: '/shops/jbagy.png', slug: 'jbagy', verified: true },
        { id: 4, name: 'ROWAY', logoUrl: '/shops/roway.png', slug: 'roway', verified: true },
        { id: 5, name: 'THE BAD GOD', logoUrl: '/shops/thebadgod.png', slug: 'thebadgod', verified: true },
        { id: 6, name: 'ON+OFF', logoUrl: '/shops/onoff.png', slug: 'onoff', verified: true },
        { id: 7, name: 'TORANO', logoUrl: '/shops/torano.png', slug: 'torano', verified: true },
        { id: 8, name: 'LADOS', logoUrl: '/shops/lados.png', slug: 'lados', verified: true },
    ];
    return allShops.slice(0, max);
};

export const brandColors = [
    'from-blue-500 to-indigo-600',
    'from-purple-500 to-pink-600',
    'from-green-500 to-emerald-600',
    'from-orange-500 to-red-600',
    'from-cyan-500 to-blue-600',
    'from-rose-500 to-pink-600',
    'from-amber-500 to-orange-600',
    'from-violet-500 to-purple-600',
];
