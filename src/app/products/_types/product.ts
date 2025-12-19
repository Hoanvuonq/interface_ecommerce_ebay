 // const quickFilters = [
    //     {
    //         key: 'all',
    //         label: 'Tất cả',
    //         icon: <ShoppingOutlined />,
    //         color: 'blue',
    //         description: 'Xem tất cả sản phẩm',
    //         action: () => {
    //             setActiveTab('all');
    //             setFilters({});
    //         }
    //     },
    //     {
    //         key: 'featured',
    //         label: 'Nổi bật',
    //         icon: <TrophyOutlined />,
    //         color: 'orange',
    //         description: 'Sản phẩm được yêu thích',
    //         action: () => {
    //             setActiveTab('featured');
    //             setFilters({});
    //         }
    //     },
    //     {
    //         key: 'new',
    //         label: 'Hàng mới',
    //         icon: <GiftOutlined />,
    //         color: 'green',
    //         description: 'Sản phẩm mới nhất',
    //         action: () => {
    //             setActiveTab('new');
    //             setFilters({ sort: 'createdDate,desc' });
    //         }
    //     },
    //     {
    //         key: 'price-low',
    //         label: 'Giá tốt',
    //         icon: <RocketOutlined />,
    //         color: 'red',
    //         description: 'Giá cả hợp lý',
    //         action: () => {
    //             setActiveTab('all');
    //             setFilters({ sort: 'basePrice,asc' });
    //         }
    //     },
    // ];



export type BreadcrumbItem = {
  title: string;
  href: string;
};

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
}


export interface PricingProps {
  discountInfo?: any;
  priceRangeLabel?: string | null;
  primaryPrice: number;
  comparePrice?: number | null;
  discountPercentage?: number | null;
  priceAfterVoucher?: number | null;
  formatPrice: (price: number) => string;
}

