"use client";

import {
  StatusTabItem,
  StatusTabs,
} from "@/app/(shop)/shop/_components/Products/StatusTabs";
import { AnimatePresence, motion } from "framer-motion";
import {
  ShieldCheck,
  Truck,
  CreditCard,
  PackageSearch,
  BellRing,
  Moon,
} from "lucide-react";
import { useMemo, useState } from "react";
import { SettingsAddressSreen } from "../SettingsAddressSreen";

type AutoReplyTab =
  | "account"
  | "shipping"
  | "payment"
  | "product"
  | "notification"
  | "vacation";

export const SettingsShopScreen = () => {
  const [activeTab, setActiveTab] = useState<AutoReplyTab>("account");

  const settingsTabs: StatusTabItem<AutoReplyTab>[] = useMemo(
    () => [
      { key: "account", label: "Tài Khoản & Bảo Mật", icon: ShieldCheck },
      { key: "shipping", label: "Cài đặt Vận Chuyển", icon: Truck },
      { key: "payment", label: "Cài đặt Thanh Toán", icon: CreditCard },
      { key: "product", label: "Cài đặt Sản Phẩm", icon: PackageSearch },
      { key: "notification", label: "Cài đặt Thông Báo", icon: BellRing },
      { key: "vacation", label: "Chế độ Tạm Nghỉ", icon: Moon },
    ],
    [],
  );

  const pageMeta = useMemo(() => {
    const meta: Record<AutoReplyTab, { title: string; desc: string }> = {
      account: { title: "Tài khoản", desc: "Account & Security Settings" },
      shipping: { title: "Vận chuyển", desc: "Thiết Lập Vận Chuyển" },
      payment: { title: "Thanh toán", desc: "Payment Method Management" },
      product: { title: "Sản phẩm", desc: "Product Display Settings" },
      notification: { title: "Thông báo", desc: "Notification Preferences" },
      vacation: { title: "Tạm nghỉ", desc: "Shop Vacation Mode" },
    };
    return meta[activeTab];
  }, [activeTab]);

  const renderTabContent = useMemo(() => {
    switch (activeTab) {
      case "account":
        return (
          <div key="acc" className="py-10 text-center  text-gray-400 italic">
            Giao diện Tài khoản...
          </div>
        );
      case "shipping":
        return <SettingsAddressSreen key="shipping-screen" />;
      default:
        return (
          <div
            key={activeTab}
            className="py-10 text-center  text-gray-400 italic"
          >
            Tính năng {pageMeta.title} đang được cập nhật...
          </div>
        );
    }
  }, [activeTab, pageMeta.title]);

  return (
    <div className="w-full p-4 md:p-6 space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-100 pb-6">
        <div className="flex w-full justify-between items-center gap-4">
          <StatusTabs
            tabs={settingsTabs}
            current={activeTab}
            onChange={(key) => setActiveTab(key as AutoReplyTab)}
          />

          <div className="hidden lg:block text-right min-w-62.5">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.3 }}
              >
                <h1 className="text-2xl font-bold  text-gray-800 italic uppercase leading-tight">
                  {pageMeta.title}
                </h1>
                <p className="text-[10px] font-bold uppercase tracking-wider text-orange-500 mt-1">
                  {pageMeta.desc}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="w-full"
          >
            {renderTabContent}
          </motion.div>
        </AnimatePresence>
    </div>
  );
};
