export const REJECTED_KEYWORDS = ['repurpose', 'loan', 'violet', 'functionalities', 'consultant', 'visualize', 'international'];
export const CURATED_KEYWORDS = [
    'thời trang', 'điện thoại', 'phụ kiện', 'thiết bị', 'máy tính', 'laptop', 
    'máy ảnh', 'đồng hồ', 'giày', 'thiết bị gia dụng', 'thể thao', 'mẹ',
    'bé', 'nhà', 'làm đẹp', 'sức khỏe', 'sách', 'xe', 'điện tử', 'gia dụng', 'tạp hóa',
];
export const categoryIcons: Record<string, string> = {
    'electronics': '📱', 'electronic': '📱', 'tech': '💻', 'technology': '💻',
    'computer': '💻', 'laptop': '💻', 'phone': '📱', 'mobile': '📱',
    'circuit': '🔌', 'circuits': '🔌',
    'máy tính': '💻', 
    'điện thoại': '📱', 
    'điện tử': '💻', 
    'fashion': '👕', 'clothes': '👕', 'clothing': '👕', 'apparel': '👕',
    'thời trang nam': '🤵', 
    'thời trang nữ': '👗',  
    'fashion nam': '🤵',
    'fashion nữ': '👗',
    'shoes': '👟', 'footwear': '👟', 'sneakers': '👟',
    'giày': '👟',
    'accessories': '👜', 'bag': '👜', 'bags': '👜',
    'phụ kiện': '👜', 
    'home': '🏠', 'house': '🏠', 'furniture': '🛋️', 'decor': '🖼️',
    'nhà': '🏠', 'nội thất': '🛋️', 'gia dụng': '🍳',
    'kitchen': '🍳', 'bedroom': '🛏️', 'bathroom': '🚿',
    'sports': '⚽', 'sport': '⚽', 'fitness': '💪', 'gym': '💪',
    'thể thao': '⚽',
    'books': '📚', 'book': '📚', 'education': '📖', 'learning': '📖',
    'sách': '📚',
    'beauty': '💄', 'cosmetics': '💄', 'makeup': '💄', 'skincare': '🧴',
    'sắc đẹp': '💄', 'sức khỏe': '💊', 'health': '💊', 'medical': '🏥',
    'personal': '🧴', 'care': '🧴',
    'toys': '🧸', 'toy': '🧸', 'games': '🎮', 'gaming': '🎮',
    'bé': '🧸', 'mẹ & bé': '🧸',
    'automotive': '🚗', 'car': '🚗', 'vehicle': '🚗', 'auto': '🚗',
    'xe máy': '🚗', 'ô tô': '🚗',
    'food': '🍔', 'beverage': '🥤', 'drink': '🥤', 'restaurant': '🍽️',
    'thực phẩm': '🍔', 'tạp hóa': '🍔',
    'visualize': '👁️', 'consultant': '💼', 'overriding': '⚙️',
    'bedfordshire': '🏛️', 'functionalities': '🔧',
    'bách hóa': '🛒',
    'grocery': '🛒',
    'văn phòng phẩm': '📝',
    'stationery': '📝',
    'thú cưng': '🐾',
    'pets': '🐾',
    'thủ công': '🎨',
    'art': '🎨',
    'mỹ nghệ': '🏺',
    'tao test': '🧪',
};


export const ICON_BG_COLORS: Record<string, { bg: string; text: string }> = {
    'máy tính': { bg: 'bg-indigo-100/70', text: 'text-indigo-600' }, 
    'điện thoại': { bg: 'bg-blue-100/70', text: 'text-blue-600' },
    'thực phẩm': { bg: 'bg-orange-100/70', text: 'text-orange-600' },
    'sắc đẹp': { bg: 'bg-pink-100/70', text: 'text-pink-600' },
    'sức khỏe': { bg: 'bg-red-100/70', text: 'text-red-600' },
    'mẹ & bé': { bg: 'bg-yellow-100/70', text: 'text-yellow-600' },
    'nhà': { bg: 'bg-green-100/70', text: 'text-green-600' },
    'thời trang': { bg: 'bg-purple-100/70', text: 'text-purple-600' },
    'văn phòng': { bg: 'bg-cyan-100/70', text: 'text-cyan-600' },
    'gia dụng': { bg: 'bg-fuchsia-100/70', text: 'text-fuchsia-600' },
    'xe': { bg: 'bg-lime-100/70', text: 'text-lime-600' },
    'thú cưng': { bg: 'bg-gray-200/70', text: 'text-gray-600' },
    'bách hóa': { bg: 'bg-teal-100/70', text: 'text-teal-600' },
    'default': { bg: 'bg-gray-100/70', text: 'text-gray-500' }, 
    'thủ công mỹ nghệ': { bg: 'bg-amber-100/70', text: 'text-amber-600' },
    'văn phòng phẩm': { bg: 'bg-sky-100/70', text: 'text-sky-600' },
    'test': { bg: 'bg-slate-200/70', text: 'text-slate-600' },
    
};

export const getStandardizedKey = (categoryName: string) => {
    const key = categoryName.toLowerCase().trim();
    if (key.includes('máy tính') || key.includes('computer') || key.includes('laptop')) return 'máy tính';
    if (key.includes('điện thoại') || key.includes('phone') || key.includes('mobile')) return 'điện thoại';
    if (key.includes('thực phẩm') || key.includes('food')) return 'thực phẩm';
    if (key.includes('sắc đẹp') || key.includes('beauty')) return 'sắc đẹp';
    if (key.includes('sức khỏe') || key.includes('health')) return 'sức khỏe';
    if (key.includes('mẹ') || key.includes('bé')) return 'mẹ & bé';
    if (key.includes('nhà') || key.includes('nội thất')) return 'nhà';
    if (key.includes('thời trang') || key.includes('fashion')) return 'thời trang';
    if (key.includes('gia dụng') || key.includes('thiết bị')) return 'gia dụng';
    if (key.includes('xe') || key.includes('ô tô')) return 'xe';
    if (key.includes('bách hóa')) return 'bách hóa';
    if (key.includes('văn phòng') || key.includes('phòng phẩm')) return 'văn phòng phẩm';
    if (key.includes('thú cưng') || key.includes('pet')) return 'thú cưng';
    if (key.includes('thủ công') || key.includes('mỹ nghệ')) return 'thủ công mỹ nghệ';
    if (key.includes('thời trang nam') || (key.includes('fashion') && key.includes('nam'))) return 'thời trang nam';
    if (key.includes('thời trang nữ') || (key.includes('fashion') && key.includes('nữ'))) return 'thời trang nữ';
    if (key.includes('test')) return 'test';
    return 'default';
}
