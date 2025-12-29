import { CardComponents } from "@/components/card";
import { ShopActions } from "../ShopActions";
import { ShopBrand } from "../ShopBrand";
import { ShopMetrics } from "../ShopMetrics";


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
    <CardComponents className="p-6! border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex flex-col gap-6 md:flex-row md:items-center">
        <div className="flex flex-col gap-4 shrink-0 w-full md:w-auto">
          <ShopBrand shop={product.shop} />
          <ShopActions
            shopId={product.shop.shopId}
            onChat={handleOpenShopChat}
            chatLoading={creatingShopChat}
          />
        </div>

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