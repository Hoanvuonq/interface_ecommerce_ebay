import { CustomAvatar } from "@/components/customAvatar";
import { formatTimeSince } from "@/hooks/format";

export const ShopBrand = ({ shop }: { shop: any }) => (
  <div className="flex items-center gap-4 min-w-62.5">
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
        <p className="text-xs text-gray-600 whitespace-nowrap">
          {shop?.lastActive ? formatTimeSince(shop.lastActive) : "Vừa xong"}
        </p>
      </div>
    </div>
  </div>
);
