import { CustomAvatar } from "@/components/custom/components/customAvatar";
import { formatTimeSince } from "@/hooks/format";

export const ShopBrand = ({ shop }: { shop: any }) => (
  <div className="flex items-center gap-4">
    <div className="relative shrink-0">
      <CustomAvatar
        size={64}
        src={shop?.logoUrl}
        className="border border-slate-100 shadow-sm rounded-2xl ring-4 ring-slate-50"
      >
        {!shop?.logoUrl && shop?.shopName?.[0]}
      </CustomAvatar>
      <div className="absolute -bottom-1 -right-1 bg-emerald-500 w-3.5 h-3.5 rounded-full border-2 border-white shadow-sm" title="Online" />
    </div>
    
    <div className="flex flex-col gap-1.5 overflow-hidden">
      <h3 className="text-[17px] font-bold text-slate-800 leading-tight truncate">
        {shop?.shopName || "Shop uy tín"}
      </h3>
      <div className="flex items-center gap-2">
        <span className="text-[9px] px-2 py-0.5 bg-orange-500 text-white rounded-md font-bold uppercase tracking-wider shadow-sm shadow-orange-200">
          Yêu thích
        </span>
        <p className="text-[11px] text-slate-400 font-medium">
          {shop?.lastActive ? formatTimeSince(shop.lastActive) : "Vừa xong"}
        </p>
      </div>
    </div>
  </div>
);