import { CustomButton } from "@/components";
import { CardComponents } from "@/components/card";
import { CustomAvatar } from "@/components/customAvatar";
import { formatCompactNumber, formatTimeSince } from "@/hooks/format";
import { MessageSquare, Store } from "lucide-react";

const ShopBrand = ({ shop }: { shop: any }) => (
  <div className="flex items-center gap-4 min-w-[250px]">
    <CustomAvatar
      size={64}
      src={shop?.logoUrl}
      className="border-2 border-orange-100 shadow-sm shrink-0"
    >
      {!shop?.logoUrl && shop?.shopName?.[0]}
    </CustomAvatar>
    <div className="flex flex-col gap-1 overflow-hidden">
      <h3 className="text-lg font-bold text-gray-900 leading-tight truncate">
        {shop?.shopName || "Shop uy tín"}
      </h3>
      <div className="flex items-center gap-2">
        <span className="text-[11px] px-2 py-0.5 bg-orange-100 text-orange-600 rounded-sm font-semibold uppercase">
          Yêu thích
        </span>
        <p className="text-xs text-gray-400 whitespace-nowrap">
          {shop?.lastActive ? formatTimeSince(shop.lastActive) : "vừa xong"}
        </p>
      </div>
    </div>
  </div>
);

const ShopMetrics = ({ shop, reviewSummary, soldCount, followerCount }: any) => {
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

const ShopActions = ({ shopId, onChat, chatLoading }: any) => (
  <div className="flex gap-2 w-full mt-2">
    <CustomButton
      type="primary"
      className="flex-1 !bg-orange-600 hover:!bg-orange-700 !border-none !rounded-md !h-9 text-sm font-medium"
      loading={chatLoading}
      onClick={onChat}
      icon={<MessageSquare className="w-4 h-4" />}
    >
      Chat ngay
    </CustomButton>
    <CustomButton
      type="default"
      className="flex-1 !rounded-md !h-9 border border-orange-600 !text-orange-600 hover:!bg-orange-50 text-sm transition-all shadow-none"
      href={`/shop/${shopId}`}
      icon={<Store className="w-4 h-4" />}
    >
      Xem Shop
    </CustomButton>
  </div>
);

export const InfomationShop = ({
  product,
  reviewSummary,
  soldCount,
  followerCount,
  creatingShopChat,
  handleOpenShopChat,
}: any) => {
  if (!product?.shop) return null;

  return (
    <CardComponents className="!p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex flex-col gap-6 md:flex-row md:items-center">
        <div className="flex flex-col gap-4 shrink-0 w-full md:w-auto">
          <ShopBrand shop={product.shop} />
          <ShopActions
            shopId={product.shop.shopId}
            onChat={handleOpenShopChat}
            chatLoading={creatingShopChat}
          />
        </div>

        {/* Cột bên phải: Chỉ số */}
        <ShopMetrics
          shop={product.shop}
          reviewSummary={reviewSummary}
          soldCount={soldCount}
          followerCount={followerCount}
        />
      </div>
    </CardComponents>
  );
};