import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Platform Analytics - Admin Dashboard',
    description: 'Xem thống kê toàn platform - GMV, doanh thu, top shops, categories',
    keywords: ['analytics', 'platform', 'admin', 'dashboard', 'GMV', 'commission'],
};

/**
 * Layout for manager analytics pages
 */
export default function ManagerAnalyticsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
