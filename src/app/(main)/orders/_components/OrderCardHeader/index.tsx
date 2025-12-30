import React from "react";
import Link from "next/link";
import _ from "lodash";
import { ChevronRight, MessageCircle, Store } from "lucide-react";

interface HeaderProps {
  shop: {
    name: string;
    logo: string | null;
    link: string;
    initials: string;
  };
  orderNumber: string;
}

export const OrderCardHeader: React.FC<HeaderProps> = ({ shop, orderNumber }) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-50 pb-2 mb-2">
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-2xl overflow-hidden ring-2 ring-orange-50 shadow-sm">
        {shop.logo ? (
          <img src={shop.logo} alt={shop.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-orange-500 flex items-center justify-center text-white font-bold text-sm">
            {shop.initials}
          </div>
        )}
      </div>
      <div>
        <div className="flex items-center gap-2 group/name cursor-pointer">
          <h3 className="font-bold text-gray-900 group-hover/name:text-orange-600 transition-colors">
            {shop.name}
          </h3>
          <span className="bg-orange-50 text-orange-600 text-[10px] font-bold px-2 py-0.5 rounded-lg">
            YÊU THÍCH
          </span>
          <ChevronRight size={14} className="text-gray-300" />
        </div>
        <p className="text-[11px] text-gray-400 mt-1 font-medium tracking-wide uppercase">
          Mã đơn: {orderNumber}
        </p>
      </div>
    </div>

    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
      <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-gray-600 bg-gray-50 hover:bg-orange-50 hover:text-orange-600 transition-all">
        <MessageCircle size={14} /> Chat
      </button>
      <Link href={`/shops/${shop.link}`}>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-gray-600 bg-gray-50 hover:bg-orange-50 hover:text-orange-600 transition-all">
          <Store size={14} /> Xem shop
        </button>
      </Link>
    </div>
  </div>
);