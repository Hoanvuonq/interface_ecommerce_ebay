/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import {
    Calendar,
    CheckCircle2,
    Clock,
    Eye,
    LogIn,
    TrendingUp,
    Users,
    User,
    ChevronDown,
    Loader2
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
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
import {
    useGetUserStatistics,
    useGetUserStatisticsAvailableLogins,
    useGetUserStatisticsAvailableUsers,
    useGetUserStatisticsBehavior,
    useGetUserStatisticsTime,
} from "../../_hooks/useUser";
import { COLORS_DATA_USER } from "../../_constants/users";


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
  const {
    handleGetUserStatisticsAvailableUsers,
    error: availableUsersError,
  } = useGetUserStatisticsAvailableUsers();

  const [overview, setOverview] = useState<any>(null);
  const [timeStats, setTimeStats] = useState<any>(null);
  const [behaviorStats, setBehaviorStats] = useState<any>(null);
const [activeTab, setActiveTab] = useState('overview');
  const today = new Date();
  const [year, setYear] = useState<number>(today.getFullYear());
  const [month, setMonth] = useState<number>(today.getMonth() + 1);
  const [yearBehavior, setYearBehavior] = useState<number>(today.getFullYear());
  const [monthBehavior, setMonthBehavior] = useState<number>(
    today.getMonth() + 1
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
        console.log("resOverview", resOverview);
        if (resOverview?.data) setOverview(resOverview.data);
        else setError(overviewError || "Không thể tải dữ liệu tổng quan");
      } catch (e: any) {
        setError(
          overviewError || e?.message || "Lỗi khi tải overview"
        );
      }

      try {
        const resUsers = await handleGetUserStatisticsAvailableUsers();
        console.log("resUsers", resUsers);
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
        setError((prev) =>
          prev ||
          availableUsersError ||
          availableLoginsError ||
          e?.message ||
          "Không thể tải danh sách tháng/năm"
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
        console.log("res", res);
        setTimeStats(res?.data ?? null);
      } catch (e: any) {
        setError(
          timeError || e?.message || "Lỗi khi tải thống kê theo thời gian"
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
          monthBehavior
        );
        console.log("resBehavior", resBehavior);
        setBehaviorStats(resBehavior?.data ?? null);
      } catch (e: any) {
        setError(
          behaviorError ||
          e?.message ||
          "Lỗi khi tải thống kê hành vi"
        );
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
  console.log("monthlyLineData", monthlyLineData);

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
            today.getMonth() + 1
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

  const renderOverviewContent = () => {
        if (!overview) return <div className="p-10 text-center text-gray-600">Không có dữ liệu</div>;
        const roles = overview.roles || {};
        const totalUsers = overview.totalUsers ?? 0;
        const totalEmployee = overview.totalEmployee ?? 0;

        return (
            <div className="animate-in fade-in duration-500">
                <div className="mb-8">
                    <h2 className="text-3xl font-semibold tracking-tight text-gray-800">Thống kê người dùng</h2>
                    <p className="text-gray-500 mt-1 font-medium">Tổng quan về hoạt động và phân bố người dùng trong hệ thống</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {/* Card 1 */}
                    <div className="bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50 flex items-center justify-between group hover:shadow-lg transition-all">
                        <div className="flex items-center gap-4">
                            <div className="bg-blue-500 text-white p-4 rounded-2xl shadow-lg shadow-blue-200 group-hover:scale-110 transition-transform">
                                <User size={24} />
                            </div>
                            <div>
                                <p className="text-gray-600 text-[10px] font-semibold uppercase tracking-widest">Tổng người dùng</p>
                                <p className="text-2xl font-semibold text-gray-800 tracking-tight">{totalUsers.toLocaleString()}</p>
                            </div>
                        </div>
                        <TrendingUp className="text-green-500" size={20} />
                    </div>

                    {/* Card 2 */}
                    <div className="bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50 flex items-center justify-between group hover:shadow-lg transition-all">
                        <div className="flex items-center gap-4">
                            <div className="bg-emerald-500 text-white p-4 rounded-2xl shadow-lg shadow-emerald-200 group-hover:scale-110 transition-transform">
                                <Users size={24} />
                            </div>
                            <div>
                                <p className="text-gray-600 text-[10px] font-semibold uppercase tracking-widest">Tổng nhân viên</p>
                                <p className="text-2xl font-semibold text-gray-800 tracking-tight">{totalEmployee.toLocaleString()}</p>
                            </div>
                        </div>
                        <TrendingUp className="text-blue-500" size={20} />
                    </div>

                    {/* Role Cards */}
                    {Object.entries(roles).map(([role, count], index) => (
                        <div key={role} className="bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50 group hover:shadow-lg transition-all">
                            <div className="flex items-center gap-4">
                                <div className="p-4 rounded-2xl shadow-lg text-white" 
                                     style={{ background: `linear-gradient(135deg, ${COLORS_DATA_USER[index % COLORS_DATA_USER.length]}, ${COLORS_DATA_USER[(index + 1) % COLORS_DATA_USER.length]})` }}>
                                    <Users size={24} />
                                </div>
                                <div>
                                    <p className="text-gray-600 text-[10px] font-semibold uppercase tracking-widest">{role}</p>
                                    <p className="text-2xl font-semibold text-gray-800 tracking-tight">{Number(count).toLocaleString()}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-8 bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h4 className="text-lg font-semibold text-gray-800">Phân bố trạng thái</h4>
                                <p className="text-gray-600 text-xs font-bold">Tỷ lệ các trạng thái người dùng thời gian thực</p>
                            </div>
                            <span className="flex items-center gap-2 text-[10px] font-semibold uppercase bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full">
                                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> Live Update
                            </span>
                        </div>
                        {statusPieData.length ? (
                            <div className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={statusPieData} dataKey="value" nameKey="name" outerRadius={100} innerRadius={60} paddingAngle={5}>
                                            {statusPieData.map((entry, idx) => (<Cell key={idx} fill={entry.color} />))}
                                        </Pie>
                                        <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }} />
                                        <Legend verticalAlign="bottom" />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        ) : <div className="text-center py-20 text-gray-500 font-bold">Trống</div>}
                    </div>

                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50">
                            <h4 className="text-lg font-semibold text-gray-800 mb-6">Tóm tắt nhanh</h4>
                            <div className="space-y-4">
                                {[
                                    { label: 'Hoạt động', val: overview?.status?.ACTIVE || 0, color: 'text-emerald-500', bg: 'bg-emerald-50', icon: CheckCircle2 },
                                    { label: 'Chưa kích hoạt', val: overview?.status?.INACTIVE || 0, color: 'text-orange-500', bg: 'bg-orange-50', icon: Clock },
                                    { label: 'Bị khóa', val: overview?.status?.LOCKED || 0, color: 'text-rose-500', bg: 'bg-rose-50', icon: Eye }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl group hover:bg-white hover:shadow-md transition-all">
                                        <div className="flex items-center gap-3">
                                            <div className={`${item.bg} ${item.color} p-2 rounded-xl`}>
                                                <item.icon size={16} />
                                            </div>
                                            <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">{item.label}</span>
                                        </div>
                                        <span className={`text-sm font-semibold ${item.color}`}>{item.val}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Analysis Card */}
                        <div className="bg-gradient-to-br from-indigo-500 to-blue-600 p-8 rounded-3xl text-white shadow-xl">
                            <h4 className="font-semibold text-white uppercase tracking-[0.2em] text-[10px] mb-4 opacity-80">Insights</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-3xl font-semibold tracking-tight">{totalUsers > 0 ? ((overview?.status?.ACTIVE / totalUsers) * 100).toFixed(1) : 0}%</p>
                                    <p className="text-[10px] font-bold opacity-70 mt-1 uppercase tracking-wider">Active Rate</p>
                                </div>
                                <div>
                                    <p className="text-3xl font-semibold tracking-tight">{Object.keys(roles || {}).length}</p>
                                    <p className="text-[10px] font-bold opacity-70 mt-1 uppercase tracking-wider">Roles</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="p-8 min-h-screen bg-[#fafafa]">
            {/* Custom Tabs implementation */}
            <div className="flex gap-2 p-1.5 bg-white rounded-2xl shadow-sm border border-gray-100 mb-8 w-fit">
                {[
                    { id: 'overview', label: 'Tổng quan', icon: User },
                    { id: 'time', label: 'Thời gian', icon: Calendar },
                    { id: 'behavior', label: 'Hành vi', icon: LogIn }
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-widest transition-all ${
                            activeTab === tab.id 
                            ? 'bg-orange-500 text-white shadow-lg shadow-orange-200' 
                            : 'text-gray-600 hover:text-orange-500 hover:bg-orange-50'
                        }`}
                    >
                        <tab.icon size={16} /> {tab.label}
                    </button>
                ))}
            </div>

            {/* ERROR ALERT */}
            {error && (
                <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-600 font-bold animate-in slide-in-from-top-4">
                    <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
                    {error}
                </div>
            )}

            {/* TAB CONTENT */}
            <div className="min-h-[500px]">
                {activeTab === 'overview' && (
                    loadingOverview ? <div className="flex justify-center py-20"><Loader2 className="animate-spin text-orange-500" size={40} /></div> : renderOverviewContent()
                )}

                {activeTab === 'time' && (
                    <div className="animate-in fade-in duration-500">
                        <div className="mb-8">
                            <h2 className="text-3xl font-semibold tracking-tight text-gray-800">Theo thời gian</h2>
                            <p className="text-gray-500 mt-1 font-medium">Phân tích xu hướng đăng ký tài khoản người dùng</p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                            <div className="lg:col-span-3">
                                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-4">
                                    <label className="text-[10px] font-semibold text-gray-600 uppercase tracking-widest">Chọn tháng</label>
                                    <div className="relative">
                                        <select 
                                            value={`${year}-${month}`}
                                            onChange={(e) => {
                                                const [y, m] = e.target.value.split("-").map(Number);
                                                setYear(y); setMonth(m);
                                            }}
                                            className="w-full appearance-none bg-gray-50 border-none rounded-2xl px-5 py-3.5 font-semibold text-gray-700 focus:ring-2 focus:ring-orange-500 outline-none"
                                        >
                                            {userMonths.map((o: any) => (
                                                <option key={`${o.year}-${o.month}`} value={`${o.year}-${o.month}`}>{o.label}</option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none" size={16} />
                                    </div>

                                    <div className="pt-4 border-t border-gray-50 mt-4 space-y-4">
                                        <div className="p-4 bg-blue-50 rounded-2xl">
                                            <p className="text-[10px] font-semibold text-blue-400 uppercase tracking-widest mb-1">Trong năm</p>
                                            <p className="text-2xl font-semibold text-blue-600 tracking-tight">{timeStats?.thisYear ?? 0}</p>
                                        </div>
                                        <div className="p-4 bg-emerald-50 rounded-2xl">
                                            <p className="text-[10px] font-semibold text-emerald-400 uppercase tracking-widest mb-1">Tăng trưởng</p>
                                            <p className="text-2xl font-semibold text-emerald-600 tracking-tight">{timeStats?.yearGrowthRate ?? 0}%</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="lg:col-span-9 bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50">
                                <div className="flex justify-between items-center mb-10">
                                    <h4 className="font-semibold text-gray-800 tracking-tight">Đăng ký theo ngày</h4>
                                    <TrendingUp className="text-emerald-500" />
                                </div>
                                {loadingTime ? <div className="flex justify-center py-20"><Loader2 className="animate-spin text-orange-500" /></div> : (
                                    <div className="h-[400px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={dailyBarData}>
                                                <defs>
                                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 800}} />
                                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 800}} />
                                                <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 20px rgba(0,0,0,0.05)'}} />
                                                <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={4} fill="url(#colorValue)" />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'behavior' && (
                    <div className="animate-in fade-in duration-500">
                         <div className="mb-8">
                            <h2 className="text-3xl font-semibold tracking-tight text-gray-800">Hành vi người dùng</h2>
                            <p className="text-gray-500 mt-1 font-medium">Phân tích hoạt động đăng nhập và tương tác</p>
                        </div>

                        <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50 mb-6">
                            <div className="flex flex-col md:flex-row justify-between gap-8">
                                <div className="w-full md:w-1/4">
                                     <label className="text-[10px] font-semibold text-gray-600 uppercase tracking-widest block mb-4">Lọc thời gian</label>
                                     <div className="relative">
                                        <select 
                                            value={`${yearBehavior}-${monthBehavior}`}
                                            onChange={(e) => {
                                                const [y, m] = e.target.value.split("-").map(Number);
                                                setYearBehavior(y); setMonthBehavior(m);
                                            }}
                                            className="w-full appearance-none bg-gray-50 border-none rounded-2xl px-5 py-3.5 font-semibold text-gray-700 focus:ring-2 focus:ring-orange-500 outline-none"
                                        >
                                            {loginMonths.map((o: any) => (
                                                <option key={`${o.year}-${o.month}`} value={`${o.year}-${o.month}`}>{o.label}</option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none" size={16} />
                                    </div>
                                </div>
                                <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {[
                                        { l: 'Hôm nay', v: behaviorStats?.loggedInToday, c: 'text-blue-500', b: 'bg-blue-50' },
                                        { l: 'Tuần này', v: behaviorStats?.thisWeekLoggedIn, c: 'text-emerald-500', b: 'bg-emerald-50' },
                                        { l: 'Tháng này', v: behaviorStats?.thisMonthLoggedIn, c: 'text-orange-500', b: 'bg-orange-50' },
                                        { l: 'Năm nay', v: behaviorStats?.thisYearLoggedIn, c: 'text-purple-500', b: 'bg-purple-50' }
                                    ].map((item, i) => (
                                        <div key={i} className={`${item.b} p-4 rounded-2xl`}>
                                            <p className="text-[10px] font-semibold text-gray-600 uppercase tracking-widest mb-1">{item.l}</p>
                                            <p className={`text-2xl font-semibold ${item.c} tracking-tight`}>{item.v ?? 0}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50">
                             <div className="flex justify-between items-center mb-10">
                                <h4 className="font-semibold text-gray-800 tracking-tight uppercase tracking-[0.2em] text-xs">Biểu đồ tăng trưởng đăng nhập</h4>
                                <LogIn className="text-orange-500" size={20} />
                            </div>
                            {loadingBehavior ? <div className="flex justify-center py-20"><Loader2 className="animate-spin text-orange-500" /></div> : (
                                <div className="h-[400px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={behaviorStats?.monthlyStats}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 800}} />
                                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 800}} />
                                            <Tooltip contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)'}} />
                                            <Line type="monotone" dataKey="count" stroke="#f97316" strokeWidth={5} dot={{ r: 6, fill: '#f97316', strokeWidth: 4, stroke: '#fff' }} activeDot={{ r: 10 }} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}