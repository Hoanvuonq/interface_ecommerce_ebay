"use client";

import { Column } from "@/components/DataTable/type";
import { Checkbox } from "@/components";
import {
  ShopOrderResponse,
  OrderStatus,
} from "@/app/(main)/shop/_types/dto/shop.order.dto";
import { CARRIER_OPTIONS } from "../_constants/carrier.option.constants";
import { cn } from "@/utils/cn";
import Image from "next/image";
import { useMemo, useState } from "react";
import { Package } from "lucide-react";

interface ColumnProps {
  selectedRowKeys: string[];
  handleSelectAll: () => void;
  handleSelectRow: (id: string) => void;
  isAllSelected: boolean;
}
const ProductImage = ({
  basePath,
  extension,
}: {
  basePath: string | null;
  extension: string | null;
}) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
  const [isError, setIsError] = useState(false);

  const src = useMemo(() => {
    if (!basePath || !apiUrl) return null;
    const cleanApiUrl = apiUrl.endsWith("/") ? apiUrl.slice(0, -1) : apiUrl;
    const cleanBasePath = basePath.startsWith("/") ? basePath : `/${basePath}`;
    return `${cleanApiUrl}${cleanBasePath}${extension || ""}`;
  }, [basePath, extension, apiUrl]);

  if (!src || isError) {
    return (
      <div className="flex items-center justify-center w-12 h-12 rounded-lg border border-gray-100 bg-gray-50 shrink-0 text-gray-400">
        <Package size={20} strokeWidth={1.5} />
      </div>
    );
  }

  return (
    <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-gray-100 bg-gray-50 shrink-0">
      <Image
        src={src}
        alt="product"
        fill
        className="object-cover"
        sizes="48px"
        unoptimized
        onError={() => setIsError(true)}
      />
    </div>
  );
};
export const getHandoverColumns = ({
  selectedRowKeys,
  handleSelectAll,
  handleSelectRow,
  isAllSelected,
}: ColumnProps): Column<ShopOrderResponse>[] => [
  {
    header: (
      <Checkbox
        checked={isAllSelected}
        onChange={handleSelectAll}
        containerClassName="justify-center"
      />
    ),
    render: (record) => (
      <Checkbox
        checked={selectedRowKeys.includes(record.orderId)}
        onChange={() => handleSelectRow(record.orderId)}
        disabled={record.status !== OrderStatus.FULFILLING}
        containerClassName="justify-center"
      />
    ),
    className: "w-10",
    align: "center",
  },
  {
    header: "Sản phẩm",
    render: (record) => (
      <div className="flex flex-col gap-3 py-2">
        {record.items?.map((item, idx) => (
          <div
            key={idx}
            className="flex gap-3 border-b border-gray-50 last:border-0 pb-2"
          >
            {/* Render Hình ảnh */}
            <ProductImage
              basePath={item.imagePath ?? null}
              extension={item.imageExtension ?? null}
            />

            <div className="flex flex-col flex-1 min-w-0">
              <div className="flex justify-between items-start gap-2">
                <span className="font-bold text-gray-800 text-[13px] line-clamp-2 italic leading-tight">
                  {item.productName}
                </span>
                <span className="text-orange-600 font-bold text-[13px] whitespace-nowrap">
                  x{item.quantity}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2 mt-1">
                {item.variantAttributes && (
                  <span className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded-md font-semibold border border-blue-100 uppercase">
                    {item.variantAttributes}
                  </span>
                )}
                <span className="text-[11px] text-gray-400 font-mono">
                  {item.unitPrice.toLocaleString()} {record.currency}
                </span>
                <span className="text-[10px] bg-gray-100 text-gray-500 px-1 rounded font-mono">
                  SKU: {item.sku}
                </span>
              </div>
            </div>
          </div>
        ))}

        {record.itemCount > (record.items?.length || 0) && (
          <div className="flex items-center gap-1">
            <div className="w-12 flex justify-center italic text-[10px] text-gray-400">
              •••
            </div>
            <span className="text-[10px] text-orange-500 font-bold uppercase tracking-tighter">
              + {record.itemCount - (record.items?.length || 0)} sản phẩm khác
              trong đơn này
            </span>
          </div>
        )}
      </div>
    ),
    className: "min-w-[350px]",
  },
  {
    header: "Thanh toán",
    render: (record) => (
      <div className="flex flex-col items-end">
        <span className="text-[14px] font-bold  text-gray-900">
          {record.pricing.grandTotal.toLocaleString()}
        </span>
        <span className="text-[10px] font-bold text-gray-400 uppercase">
          {record.currency}
        </span>
        <div className="mt-1 px-1.5 py-0.5 bg-green-50 text-green-600 text-[9px] font-bold rounded border border-green-100 uppercase">
          {record.payment.method}
        </div>
      </div>
    ),
    align: "right",
  },
  {
    header: "Vận chuyển",
    render: (record) => {
      const cfg = CARRIER_OPTIONS.find(
        (c) => c.code === record.shipment?.carrier,
      );
      return (
        <div className="flex flex-col gap-1">
          <span
            className={cn(
              "px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border text-center whitespace-nowrap",
              cfg
                ? "bg-blue-50 border-blue-200 text-blue-700 shadow-sm"
                : "bg-gray-50 border-gray-200 text-gray-400",
            )}
          >
            {cfg?.label || record.shipment?.carrier || "Chưa gán"}
          </span>
          <span className="text-[9px] text-gray-400 font-mono text-center leading-none">
            {record.orderNumber}
          </span>
        </div>
      );
    },
    align: "center",
  },
  {
    header: "Trạng thái",
    render: (record) => (
      <div className="flex flex-col items-center gap-1">
        <div className="flex items-center gap-1.5">
          <span
            className={cn(
              "w-2 h-2 rounded-full",
              record.status === OrderStatus.FULFILLING
                ? "bg-orange-400 animate-pulse"
                : "bg-purple-500",
            )}
          />
          <span className="text-[11px] font-bold text-gray-600 uppercase">
            {record.status === OrderStatus.FULFILLING ? "Chuẩn bị" : "Chờ lấy"}
          </span>
        </div>
      </div>
    ),
    align: "center",
  },
];
