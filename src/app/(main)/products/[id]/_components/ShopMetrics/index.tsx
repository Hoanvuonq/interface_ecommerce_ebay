import { formatCompactNumber, formatTimeSince } from "@/hooks/format";

export const ShopMetrics = ({ shop, reviewSummary, soldCount, followerCount }: any) => {
  const metrics = [
    {
      label: "Đánh giá",
      value: reviewSummary?.averageRating ? Number(reviewSummary.averageRating).toFixed(1) : "5.0",
      color: "text-orange-500",
    },
    {
      label: "Sản phẩm",
      value: formatCompactNumber(soldCount) || "Đang cập nhật",
    },
    {
      label: "Người theo dõi",
      value: formatCompactNumber(followerCount) || "Đang cập nhật",
    },
    {
      label: "Tham gia",
      value: shop?.createdDate ? formatTimeSince(shop.createdDate) : "Đang cập nhật",
    },
  ];

  return (
    <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-y-4 md:gap-x-12 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-8">
      {metrics.map((metric) => (
        <div key={metric.label} className="flex flex-col gap-1">
          <span className="text-xs text-black font-bold uppercase tracking-tight">{metric.label}</span>
          <span className={`text-sm md:text-base font-semibold ${metric.color || "text-orange-600"}`}>
            {metric.value}
          </span>
        </div>
      ))}
    </div>
  );
};