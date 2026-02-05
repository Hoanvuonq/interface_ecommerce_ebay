/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import {
  Calendar,
  CheckCircle2,
  ChevronDown,
  Clock,
  Eye,
  Loader2,
  LogIn,
  TrendingUp,
  User,
  Users,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { COLORS_DATA_USER } from "../../_constants/users";
import {
  useGetUserStatistics,
  useGetUserStatisticsAvailableLogins,
  useGetUserStatisticsAvailableUsers,
  useGetUserStatisticsBehavior,
  useGetUserStatisticsTime,
} from "../../_hooks/useUser";
import { StatusTabs } from "@/app/(shop)/shop/_components";
import { USER_STATUS_TABS } from "./type";
import { SelectComponent } from "@/components";
import { TimeAnalyticsSidebar } from "../TimeAnalyticsSidebar";
import { DailyRegistrationChart } from "../ChartOverviewUser/DailyRegistrationChart";
import { BehaviorAnalyticsSidebar } from "../BehaviorAnalyticsSidebar";
import { BehaviorGrowthChart } from "../ChartOverviewUser/BehaviorGrowthChart";
import { UserOverviewTab } from "../UserOverviewTab";

export default function UserStatistics() {
  const {
    handleGetUserStatistics,
    loading: loadingOverview,
    error: overviewError,
  } = useGetUserStatistics();
  const {
    handleGetUserStatisticsTime,
    loading: loadingTime,
    error: timeError,
  } = useGetUserStatisticsTime();
  const {
    handleGetUserStatisticsBehavior,
    loading: loadingBehavior,
    error: behaviorError,
  } = useGetUserStatisticsBehavior();
  const {
    handleGetUserStatisticsAvailableLogins,
    error: availableLoginsError,
  } = useGetUserStatisticsAvailableLogins();
  const { handleGetUserStatisticsAvailableUsers, error: availableUsersError } =
    useGetUserStatisticsAvailableUsers();
  const [activeTab, setActiveTab] = useState("overview");
  const [overview, setOverview] = useState<any>(null);
  const [timeStats, setTimeStats] = useState<any>(null);
  const [behaviorStats, setBehaviorStats] = useState<any>(null);
  const today = new Date();
  const [year, setYear] = useState<number>(today.getFullYear());
  const [month, setMonth] = useState<number>(today.getMonth() + 1);
  const [yearBehavior, setYearBehavior] = useState<number>(today.getFullYear());
  const [monthBehavior, setMonthBehavior] = useState<number>(
    today.getMonth() + 1,
  );

  const [availableUsers, setAvailableUsers] = useState<
    Array<{ year: number; month: number }>
  >([]);
  const [availableLogins, setAvailableLogins] = useState<
    Array<{ year: number; month: number }>
  >([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const resOverview = await handleGetUserStatistics();

        if (resOverview?.data) setOverview(resOverview.data);
        else setError(overviewError || "Không thể tải dữ liệu tổng quan");
      } catch (e: any) {
        setError(overviewError || e?.message || "Lỗi khi tải overview");
      }

      try {
        const resUsers = await handleGetUserStatisticsAvailableUsers();

        if (resUsers?.data?.length) {
          setAvailableUsers(resUsers.data);
          // default chọn tháng mới nhất
          setYear(resUsers.data[0].year);
          setMonth(resUsers.data[0].month);
        }

        const resLogins = await handleGetUserStatisticsAvailableLogins();
        if (resLogins?.data?.length) {
          setAvailableLogins(resLogins.data);
          setYearBehavior(resLogins.data[0].year);
          setMonthBehavior(resLogins.data[0].month);
        }
      } catch (e: any) {
        setError(
          (prev) =>
            prev ||
            availableUsersError ||
            availableLoginsError ||
            e?.message ||
            "Không thể tải danh sách tháng/năm",
        );
      }
    })();
  }, []);

  useEffect(() => {
    setError(null);
    if (!year || !month) return;

    (async () => {
      try {
        const res = await handleGetUserStatisticsTime(year, month);

        setTimeStats(res?.data ?? null);
      } catch (e: any) {
        setError(
          timeError || e?.message || "Lỗi khi tải thống kê theo thời gian",
        );
      }
    })();
  }, [year, month]);

  // === Load behavior stats khi yearBehavior/monthBehavior thay đổi ===
  useEffect(() => {
    setError(null);
    if (!yearBehavior || !monthBehavior) return;

    (async () => {
      try {
        const resBehavior = await handleGetUserStatisticsBehavior(
          yearBehavior,
          monthBehavior,
        );
        setBehaviorStats(resBehavior?.data ?? null);
      } catch (e: any) {
        setError(behaviorError || e?.message || "Lỗi khi tải thống kê hành vi");
      }
    })();
  }, [yearBehavior, monthBehavior]);

  // === Helpers for charts ===
  const monthlyLineData = useMemo(() => {
    if (!timeStats?.monthlyGrowth) return [];
    const arr = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      count: 0,
    }));
    timeStats.monthlyGrowth.forEach((m: any) => {
      const idx = Number(m.month) - 1;
      if (idx >= 0 && idx < 12) arr[idx].count = Number(m.count || 0);
    });
    return arr.map((r) => ({ name: `Tháng ${r.month}`, value: r.count }));
  }, [timeStats]);

  const dailyBarData = useMemo(() => {
    if (!timeStats?.dailyGrowth) return [];
    return timeStats.dailyGrowth.map((d: any) => ({
      name: d.date,
      value: d.count,
    }));
  }, [timeStats]);

  const statusPieData = useMemo(() => {
    if (!overview?.status) return [];
    return Object.entries(overview.status).map(([k, v], i) => ({
      name: k,
      value: v as number,
      color: COLORS_DATA_USER[i % COLORS_DATA_USER.length],
    }));
  }, [overview]);

  const buildOptions = (list: any[]) => {
    if (!list?.length)
      return [
        {
          label: `${today.getFullYear()}-${String(
            today.getMonth() + 1,
          ).padStart(2, "0")}`,
          year: today.getFullYear(),
          month: today.getMonth() + 1,
        },
      ];
    return list.map((it: any) => ({
      label: `${it.year}-${String(it.month).padStart(2, "0")}`,
      year: it.year,
      month: it.month,
    }));
  };

  const userMonths = buildOptions(availableUsers);
  const loginMonths = buildOptions(availableLogins);

  const tabs = useMemo(
    () =>
      USER_STATUS_TABS.map((tab) => ({
        key: tab.id,
        label: tab.label,
        icon: tab.icon,
      })),
    [],
  );

  return (
    <div className="min-h-screen">
      <StatusTabs
        tabs={tabs}
        current={activeTab}
        onChange={setActiveTab}
        layoutId="user-stat-tabs"
      />
      {error && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-600 font-bold animate-in slide-in-from-top-4">
          <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
          {error}
        </div>
      )}

      <div className="min-h-125">
        {activeTab === "overview" && (
          <UserOverviewTab overview={overview} loading={loadingOverview} />
        )}
        {activeTab === "time" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="mb-10">
              <h2 className="text-4xl font-bold tracking-tighter text-gray-900 uppercase italic">
                Theo thời gian
              </h2>
              <p className="text-gray-400 mt-2 font-bold uppercase text-[10px] tracking-[0.3em]">
                Phân tích xu hướng đăng ký tài khoản người dùng hệ thống
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <TimeAnalyticsSidebar
                year={year}
                month={month}
                setYear={setYear}
                setMonth={setMonth}
                userMonths={userMonths}
                timeStats={timeStats}
              />

              <DailyRegistrationChart
                data={dailyBarData}
                isLoading={loadingTime}
              />
            </div>
          </div>
        )}

        {activeTab === "behavior" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="mb-10">
              <h2 className="text-4xl font-bold tracking-tighter text-gray-900 uppercase italic">
                Hành vi người dùng
              </h2>
              <p className="text-gray-400 mt-2 font-bold uppercase text-[10px] tracking-[0.3em]">
                Phân tích hoạt động đăng nhập và tương tác hệ thống theo chu kỳ
              </p>
            </div>

            <BehaviorAnalyticsSidebar
              year={yearBehavior}
              month={monthBehavior}
              setYear={setYearBehavior}
              setMonth={setMonthBehavior}
              loginMonths={loginMonths}
              stats={behaviorStats}
            />

            <BehaviorGrowthChart
              data={behaviorStats?.monthlyStats}
              isLoading={loadingBehavior}
            />
          </div>
        )}
      </div>
    </div>
  );
}
