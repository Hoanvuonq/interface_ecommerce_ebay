export const ACTION_OPTIONS = [
  { label: "Toàn bộ thao tác", value: "all" },
  { label: "Thương lượng với Người mua", value: "negotiate" },
  { label: "Cần cung cấp bằng chứng", value: "evidence" },
  { label: "Kiểm tra hàng hoàn", value: "check_return" },
  { label: "Phản hồi quyết định của Shopee", value: "dispute_shopee" },
  { label: "Hoàn tiền một phần", value: "partial_refund" },
  { label: "Hoàn tiền toàn phần", value: "full_refund" },
];

export const ACTIONS_BY_TAB: Record<string, string[]> = {
  all: [
    "Thương lượng với Người mua",
    "Cần cung cấp bằng chứng",
    "Giữ lại kiện hàng",
    "Kiểm tra hàng hoàn",
    "Phản hồi quyết định của Shopee",
  ],
  returns: [
    "Cần cung cấp bằng chứng",
    "Kiểm tra hàng hoàn",
    "Phản hồi quyết định của Shopee",
  ],
  cancelled_orders: ["Thương lượng với Người mua", "Giữ lại kiện hàng"],
  failed_deliveries: ["Cần cung cấp bằng chứng", "Kiểm tra hàng hoàn"],
};
