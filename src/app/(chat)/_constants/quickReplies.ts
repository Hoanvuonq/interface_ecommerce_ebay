import { QuickReply } from "../_types/chat.dto";

export const QUICK_REPLIES: QuickReply[] = [
  {
    id: "order-status",
    title: "Tình trạng đơn hàng",
    content: "Shop ơi, cho mình hỏi tình trạng đơn hàng hiện tại như thế nào?",
    category: "general",
  },
  {
    id: "product-info",
    title: "Thông tin sản phẩm",
    content: "Mình muốn hỏi thêm thông tin chi tiết về sản phẩm này.",
    category: "product",
  },
  {
    id: "exchange-policy",
    title: "Chính sách đổi/trả",
    content: "Shop cho mình xin thông tin về chính sách đổi trả với ạ.",
    category: "policy",
  },
  {
    id: "support",
    title: "Hỗ trợ khác",
    content: "Nhờ shop hỗ trợ giúp mình vấn đề này với ạ.",
    category: "support",
  },
] as const;