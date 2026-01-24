"use client";

import { Clock, MailQuestion, Zap } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  StatusTabItem,
  StatusTabs,
} from "@/app/(shop)/shop/_components/Products/StatusTabs";
import {
  OverviewCards,
  TimeStatistics,
  BehaviorStatistics,
} from "../_components";
import { motion, AnimatePresence } from "framer-motion";
import {
  useVoucherBehaviorStats,
  useVoucherStatistics,
  useVoucherTimeStats,
} from "../../_hooks/useVoucher";

type VoucherTab = "overview" | "time" | "behavior";

export const VoucherStatisticsScreen = () => {
  const [activeTab, setActiveTab] = useState<VoucherTab>("overview");

  const { handleGetVoucherStatistics, loading: loadingOverview } =
    useVoucherStatistics();
  const { handleGetVoucherTimeStats, loading: loadingTime } =
    useVoucherTimeStats();
  const { handleGetVoucherBehaviorStats, loading: loadingBehavior } =
    useVoucherBehaviorStats();

  const [overview, setOverview] = useState<any>(null);
  const [timeData, setTimeData] = useState<any>(null);
  const [behaviorData, setBehaviorData] = useState<any>(null);

  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);

  useEffect(() => {
    handleGetVoucherStatistics().then((res) => setOverview(res?.data));
  }, []);

  useEffect(() => {
    if (activeTab === "time")
      handleGetVoucherTimeStats(year, month).then((res) =>
        setTimeData(res?.data),
      );
    if (activeTab === "behavior")
      handleGetVoucherBehaviorStats(year, month).then((res) =>
        setBehaviorData(res?.data),
      );
  }, [activeTab, year, month]);
  const pageMeta = useMemo(() => {
    const meta: Record<VoucherTab, { title: string; desc: string }> = {
      overview: {
        title: "Tổng quan",
        desc: "Tổng quan về hoạt động và hiệu quả của hệ thống voucher",
      },
      time: {
        title: "Thống kê theo thời gian",
        desc: "Phân tích xu hướng tạo voucher theo thời gian",
      },
      behavior: {
        title: "Thống kê sử dụng voucher",
        desc: "Phân tích hoạt động sử dụng voucher của người dùng",
      },
    };
    return meta[activeTab];
  }, [activeTab]);

  const replyTabs: StatusTabItem<VoucherTab>[] = [
    { key: "overview", label: "Tổng quan", icon: Zap },
    { key: "time", label: "Theo thời gian", icon: Clock },
    { key: "behavior", label: "Sử dụng", icon: MailQuestion },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return <OverviewCards overview={overview} loading={loadingOverview} />;
      case "time":
        return (
          <TimeStatistics
            timeStats={timeData}
            loading={loadingTime}
            year={year}
            month={month}
            setYear={setYear}
            setMonth={setMonth}
            voucherMonths={[]}
          />
        );
      case "behavior":
        return (
          <BehaviorStatistics
            behaviorStats={behaviorData}
            loading={loadingBehavior}
            year={year}
            month={month}
            setYear={setYear}
            setMonth={setMonth}
            usageMonths={[]}
          />
        );
    }
  };

  return (
    <div className="mx-autospace-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-100 pb-6">
        <StatusTabs
          tabs={replyTabs}
          current={activeTab}
          onChange={(key) => setActiveTab(key)}
        />
        <div className="text-right pr-10 py-2 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{
                duration: 0.4,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <h1 className="text-3xl font-bold  text-gray-800 tracking-tight italic uppercase leading-none">
                {pageMeta.title}
              </h1>
              <p className="text-[10px] font-bold uppercase  text-orange-400 mt-2">
                {pageMeta.desc}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          {renderTabContent()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
