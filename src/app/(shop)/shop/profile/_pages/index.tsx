/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { SectionLoading } from "@/components";
import { useToast } from "@/hooks/useToast";
import {
  FileText,
  ShieldCheck,
  Store,
  AlertCircle,
  MapPin,
} from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { BasicInfo, LegalInfo, TaxInfo, AddressInfo } from "../_components";
import { useGetShopInfo } from "../_hooks/useShop";
import { getStoredUserDetail } from "@/utils/jwt";
import {
  StatusTabs,
  StatusTabItem,
} from "../../_components/Products/StatusTabs";

type TabKey = "basic" | "tax" | "legal" | "address";

export default function ShopProfileScreen() {
  const [shop, setShop] = useState<any>(null);
  const { handleGetShopInfo, loading } = useGetShopInfo();
  const [activeTab, setActiveTab] = useState<TabKey>("basic");
  const [isInitialized, setIsInitialized] = useState(false);
  const users = getStoredUserDetail();
  const { error: toastError } = useToast();

  useEffect(() => {
    (async () => {
      try {
        const res = await handleGetShopInfo(users?.shopId);
        if (res) {
          setShop(res.data);
        }
      } catch (err: any) {
        console.error("Error loading shop info:", err);
        toastError("Không thể tải thông tin shop. Vui lòng thử lại!");
      } finally {
        setIsInitialized(true);
      }
    })();
  }, []);

  const DataMissingPlaceholder = ({
    title,
    desc,
  }: {
    title: string;
    desc: string;
  }) => (
    <div className="flex flex-col items-center justify-center p-20 bg-gray-50/50 rounded-[3rem] border border-gray-200 mt-4 animate-in zoom-in duration-300">
      <AlertCircle
        className="text-orange-400 mb-4"
        size={48}
        strokeWidth={1.5}
      />
      <h3 className="text-lg font-bold text-gray-800 uppercase tracking-tight">
        {title}
      </h3>
      <p className="text-sm text-gray-500 text-center max-w-md mt-2 leading-relaxed">
        {desc}
      </p>
    </div>
  );

  const shopTabs: StatusTabItem<TabKey>[] = [
    { key: "basic", label: "Thông tin cơ bản", icon: Store },
    { key: "address", label: "Địa chỉ", icon: MapPin },
    { key: "tax", label: "Thông tin Thuế", icon: FileText },
    {
      key: "legal",
      label: "Thông tin Định Danh",
      icon: ShieldCheck,
    },
  ];

  const renderTabContent = useMemo(() => {
    if (!isInitialized || !shop) return null;

    switch (activeTab) {
      case "basic":
        return <BasicInfo shop={shop} setShop={setShop} />;
      case "address":
        return <AddressInfo shop={shop} setShop={setShop} />;
      case "tax":
        return <TaxInfo shop={shop} setShop={setShop} />;
      case "legal":
        return <LegalInfo shop={shop} setShop={setShop} />;
      default:
        return null;
    }
  }, [activeTab, shop, isInitialized]);

  if (loading && !isInitialized) {
    return <SectionLoading message="Đang kết nối dữ liệu cửa hàng..." />;
  }

  if (isInitialized && !shop) {
    return (
      <DataMissingPlaceholder
        title="Không tìm thấy Shop"
        desc="Không thể tìm thấy thông tin cửa hàng liên kết với tài khoản này."
      />
    );
  }

  return (
    <div className="max-w-8xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between overflow-x-auto no-scrollbar">
        <StatusTabs
          tabs={shopTabs}
          current={activeTab}
          onChange={(id) => setActiveTab(id as TabKey)}
          className="w-fit"
        />
      </div>

      <div className="transition-all duration-300">
        {renderTabContent}
      </div>
    </div>
  );
}
