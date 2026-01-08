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
    <CardComponents className="border-none shadow-sm bg-white rounded-2xl overflow-hidden">
      <div className="flex flex-col lg:flex-row gap-8 lg:items-center">
        <div className="flex flex-col gap-5 shrink-0 w-full lg:w-[320px]">
          <ShopBrand shop={product.shop} />
          <ShopActions
            shopId={product.shop.shopId}
            onChat={handleOpenShopChat}
            chatLoading={creatingShopChat}
          />
        </div>
        <div className="hidden lg:block w-px h-12 bg-slate-100" />
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