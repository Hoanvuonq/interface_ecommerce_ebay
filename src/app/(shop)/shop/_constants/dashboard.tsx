export const DATA_DASHBOARD = {
  overview: {
    revenueToday: 1250000,
    revenueThisMonth: 32800000,
    ordersToday: 34,
    newCustomers: 12,
  },
  orders: [
    {
      id: "ORD001",
      customer: "Nguyễn Văn B",
      total: 2500000,
      status: "Đang xử lý",
      date: "2025-10-01",
    },
    {
      id: "ORD002",
      customer: "Trần Thị C",
      total: 4200000,
      status: "Đã giao",
      date: "2025-09-30",
    },
    {
      id: "ORD003",
      customer: "Phạm Văn D",
      total: 1750000,
      status: "Đã hủy",
      date: "2025-09-30",
    },
  ],
  products: {
    bestSellers: [
      { name: "iPhone 15 Pro Max", sold: 120, revenue: 360000000 },
      { name: "AirPods Pro 2", sold: 95, revenue: 76000000 },
      { name: "MacBook Air M3", sold: 60, revenue: 180000000 },
    ],
    lowStock: [
      { name: "Chuột Logitech MX Master 3S", stock: 3 },
      { name: "Bàn phím Keychron K2", stock: 5 },
    ],
  },
  customers: {
    newThisMonth: [
      { name: "Nguyễn Thị E", orders: 2, totalSpent: 3500000 },
      { name: "Lê Văn F", orders: 1, totalSpent: 2200000 },
    ],
  },
  charts: {
    revenueByMonth: [
      { month: "Jan", value: 12000000 },
      { month: "Feb", value: 15000000 },
      { month: "Mar", value: 18000000 },
      { month: "Apr", value: 17000000 },
      { month: "May", value: 21000000 },
      { month: "Jun", value: 25000000 },
      { month: "Jul", value: 27000000 },
      { month: "Aug", value: 30000000 },
      { month: "Sep", value: 32800000 },
    ],
    ordersByStatus: [
      { type: "Đã giao", value: 420 },
      { type: "Đang xử lý", value: 38 },
      { type: "Đã hủy", value: 54 },
    ],
  },
};