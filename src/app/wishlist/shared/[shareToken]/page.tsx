import { Metadata } from 'next';
import { wishlistService } from '@/services/wishlist/wishlist.service';
import PublicWishlistClient from '../../_components/PublicWishlistClient';

interface Props {
    params: Promise<{
        shareToken: string;
    }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { shareToken } = await params;
    
    const defaultImageUrl = process.env.NEXT_PUBLIC_APP_URL 
        ? `${process.env.NEXT_PUBLIC_APP_URL}/og-wishlist-default.jpg`
        : 'https://via.placeholder.com/1200x630/4F46E5/FFFFFF?text=Wishlist';

    try {
        const ogData = await wishlistService.getOgMetadata(shareToken);
        
        let imageUrl = ogData.imageUrl;
        if (imageUrl) {
            if (!imageUrl.startsWith('http://') && !imageUrl.startsWith('https://')) {
                const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || '';
                if (baseUrl) {
                    imageUrl = imageUrl.startsWith('/') ? `${baseUrl}${imageUrl}` : `${baseUrl}/${imageUrl}`;
                } else {
                    console.warn('OG image URL is not absolute and no base URL configured:', imageUrl);
                    imageUrl = "";
                }
            }
        }
        
        const finalImageUrl = imageUrl || defaultImageUrl;
        
        if (process.env.NODE_ENV === 'development') {
            console.log('OG Metadata:', {
                title: ogData.title,
                description: ogData.description,
                imageUrl: finalImageUrl,
                shareUrl: ogData.url,
            });
        }

        return {
            title: ogData.title, 
            description: ogData.description,
            openGraph: {
                title: ogData.title,
                description: ogData.description,
                images: [
                    {
                        url: finalImageUrl,
                        width: 1200,
                        height: 630,
                        alt: ogData.title,
                    }
                ],
                url: ogData.url,
                type: 'website',
                siteName: process.env.NEXT_PUBLIC_APP_NAME || 'eBay E-commerce',
                locale: 'vi_VN',
            },
            twitter: {
                card: 'summary_large_image',
                title: ogData.title,
                description: ogData.description,
                images: [finalImageUrl],
            },
            keywords: ['wishlist', 'sản phẩm yêu thích', 'shopping', 'ecommerce'],
            robots: {
                index: true,
                follow: true,
            },
        };
    } catch (error) {
        console.error('Error fetching OG metadata:', error);
        return {
            title: 'Shared Wishlist - eBay E-commerce',
            description: 'Xem danh sách sản phẩm yêu thích được chia sẻ',
            openGraph: {
                title: 'Shared Wishlist - eBay E-commerce',
                description: 'Xem danh sách sản phẩm yêu thích được chia sẻ',
                images: [
                    {
                        url: defaultImageUrl,
                        width: 1200,
                        height: 630,
                        alt: 'Shared Wishlist',
                    }
                ],
                type: 'website',
                siteName: process.env.NEXT_PUBLIC_APP_NAME || 'eBay E-commerce',
                locale: 'vi_VN',
            },
            twitter: {
                card: 'summary_large_image',
                title: 'Shared Wishlist - eBay E-commerce',
                description: 'Xem danh sách sản phẩm yêu thích được chia sẻ',
                images: [defaultImageUrl],
            },
        };
    }
}

export default async function PublicWishlistPage({ params }: Props) {
    const { shareToken } = await params;

    return <PublicWishlistClient shareToken={shareToken} />;
}
