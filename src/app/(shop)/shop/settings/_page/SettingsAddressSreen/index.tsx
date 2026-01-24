"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CreditCard, ShieldCheck, Truck } from "lucide-react";
import { useMemo, useState } from "react";
import { ShopAddressForm ,ShippingChanel} from "../../_components/SettingsAddress";
import { cn } from "@/utils/cn";

type AddressTab = "list-address" | "setting-shipping" | "documentation";

export const SettingsAddressSreen = () => {
  const [activeTab, setActiveTab] = useState<AddressTab>("list-address");

  const settingsTabs = useMemo(
    () => [
      { key: "list-address", label: "Danh sách địa chỉ", icon: ShieldCheck },
      { key: "setting-shipping", label: "Cài đặt Vận Chuyển", icon: Truck },
      { key: "documentation", label: "Chứng từ vận chuyển", icon: CreditCard },
    ],
    [],
  );

  const renderTabContent = useMemo(() => {
    switch (activeTab) {
      case "list-address":
        return <ShopAddressForm key="list-address" />;
      case "setting-shipping":
        return <ShippingChanel key="setting-shipping" />;
      default:
        return <div key="other" className="py-6"></div>;
    }
  }, [activeTab]);

  return (
    <div className="w-full flex flex-col gap-6 animate-in fade-in duration-500">
      <div className="relative  w-full bg-white rounded-4xl border border-slate-100 shadow-sm p-4 overflow-hidden">
        <div className="flex items-center">
          <div className="flex p-1 bg-slate-100/80 rounded-2xl border border-slate-200/50 relative overflow-hidden">
            {settingsTabs.map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as AddressTab)}
                  className={cn(
                    "relative flex items-center gap-2 px-4 py-2 text-xs font-bold transition-colors duration-300 z-10 uppercase tracking-tighter",
                    isActive
                      ? "text-orange-600"
                      : " text-gray-500 hover:text-gray-700",
                  )}
                >
                  <tab.icon
                    size={14}
                    className={cn(
                      isActive ? "text-orange-500" : " text-gray-400",
                    )}
                  />
                  {tab.label}

                  {isActive && (
                    <motion.div
                      layoutId="activeTabPill"
                      className="absolute inset-0 bg-white rounded-xl shadow-sm -z-10 border border-orange-100/50"
                      transition={{
                        type: "spring",
                        bounce: 0.2,
                        duration: 0.6,
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="w-full pt-4 px-4"
          >
            {renderTabContent}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
