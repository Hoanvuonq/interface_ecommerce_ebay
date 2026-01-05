export const VOUCHER_SHOP_DATA = [
    {
      id: 1,
      code: "WELCOME",
      discountType: "PERCENTAGE" as const,
      value: 15,
      minOrder: 150000,
      endDate: "2026-02-01",
    },
    {
      id: 2,
      code: "FREESHIP",
      discountType: "AMOUNT" as const,
      value: 25000,
      minOrder: 300000,
      endDate: "2026-03-01",
    },
    {
      id: 3,
      code: "GIAM50K",
      discountType: "AMOUNT" as const,
      value: 50000,
      minOrder: 500000,
      endDate: "2026-01-30",
    },
{
      id: 4,
      code: "WELCOME",
      discountType: "PERCENTAGE" as const,
      value: 15,
      minOrder: 150000,
      endDate: "2026-02-01",
    },
    {
      id: 5,
      code: "FREESHIP",
      discountType: "AMOUNT" as const,
      value: 25000,
      minOrder: 300000,
      endDate: "2026-03-01",
    },
    {
      id: 6,
      code: "GIAM50K",
      discountType: "AMOUNT" as const,
      value: 50000,
      minOrder: 500000,
      endDate: "2026-01-30",
    },
  ];

  export const SORT_OPTIONS = [
  { value: "createdDate,desc", label: "Mới nhất" },
  { value: "sold,desc", label: "Bán chạy" },
  { value: "price_asc", label: "Giá thấp đến cao" },
  { value: "price_desc", label: "Giá cao đến thấp" },
];