import { formatCompactNumber, formatTimeSince } from "@/hooks/format";

export const ShopMetrics = ({ shop, reviewSummary, soldCount, followerCount }: any) => {
  const metrics = [
    {
      label: "Đánh giá",
      value: reviewSummary?.averageRating ? Number(reviewSummary.averageRating).toFixed(1) : "5.0",
    },
    {
      label: "Sản phẩm",
      value: formatCompactNumber(soldCount) || "0",
    },
    {
      label: "Người theo dõi",
      value: formatCompactNumber(followerCount) || "0",
    },
    {
      label: "Tham gia",
      value: shop?.createdDate ? formatTimeSince(shop.createdDate) : "Đang cập nhật",
    },
  ];

  return (
    <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-6 lg:gap-x-10">
      {metrics.map((metric) => (
        <div key={metric.label} className="group flex flex-col items-center transition-all">
          <span className="text-[11px]  text-gray-600 font-semibold uppercase mb-1">
            {metric.label}
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-[18px] font-semibold text-orange-600 tracking-tight">
              {metric.value}
            </span>
            
          </div>
        </div>
      ))}
    </div>
  );
};