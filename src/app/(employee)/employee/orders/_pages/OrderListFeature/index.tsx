// import React, { useEffect, useState } from "react";
// import OrderListHeader from "./components/OrderListHeader";
// import OrderFilters from "./components/OrderFilters";
// import OrderTable from "./components/OrderTable";
// import { adminOrderService } from "@/services/adminOrder.service";
// import { OrderResponse } from "@/types/adminOrder.types";
// import { PageableResponse } from "@/types/api.types";
// import { ClipboardList, Clock, Truck, CheckCircle, XCircle, ChevronLeft, ChevronRight } from "lucide-react";

// const OrderListFeature: React.FC = () => {
//     const [orders, setOrders] = useState<OrderResponse[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [search, setSearch] = useState("");
//     const [status, setStatus] = useState("");
//     const [page, setPage] = useState(0);
//     const [totalPages, setTotalPages] = useState(0);
//     const [totalElements, setTotalElements] = useState(0);
//     const pageSize = 10;

//     const fetchOrders = async () => {
//         setLoading(true);
//         try {
//             const data = await adminOrderService.getAllOrders({
//                 page,
//                 size: pageSize,
//                 status: status || undefined,
//             });

//             if (data && data.content) {
//                 setOrders(data.content);
//                 setTotalPages(data.totalPages);
//                 setTotalElements(data.totalElements);
//             }
//         } catch (error) {
//             console.error("Failed to fetch orders", error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchOrders();
//     }, [page, status]);

//     useEffect(() => {
//         const timer = setTimeout(() => {
//             if (page !== 0) {
//                 setPage(0);
//             } else {
//                 fetchOrders();
//             }
//         }, 500);
//         return () => clearTimeout(timer);
//     }, [search]);

//     const handlePageChange = (newPage: number) => {
//         if (newPage >= 0 && newPage < totalPages) {
//             setPage(newPage);
//         }
//     };

//     const statusFilters = [
//         { label: "Tất cả", value: "", icon: ClipboardList },
//         { label: "Chờ xử lý", value: "PENDING", icon: Clock },
//         { label: "Đang giao", value: "SHIPPING", icon: Truck },
//         { label: "Hoàn thành", value: "COMPLETED", icon: CheckCircle },
//         { label: "Đã hủy", value: "CANCELLED", icon: XCircle },
//     ];

//     return (
//         <div className="min-h-screen bg-gray-50 dark:bg-[#0a0e14]">
//             <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
//                 {/* Header */}
//                 <OrderListHeader />

//                 {/* Quick Status Filters */}
//                 <div className="mt-6 flex flex-wrap gap-2">
//                     {statusFilters.map((filter) => {
//                         const Icon = filter.icon;
//                         return (
//                             <button
//                                 key={filter.value}
//                                 onClick={() => {
//                                     setStatus(filter.value);
//                                     setPage(0);
//                                 }}
//                                 className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${status === filter.value
//                                         ? "bg-primary text-white shadow-md shadow-primary/30"
//                                         : "bg-white dark:bg-[#1c2127] text-gray-700 dark:text-gray-500 border border-gray-200 dark:border-[#3b4754] hover:border-primary/50 hover:bg-primary/5"
//                                     }`}
//                             >
//                                 <Icon size={16} />
//                                 <span>{filter.label}</span>
//                                 {status === filter.value && totalElements > 0 && (
//                                     <span className="ml-1 px-1.5 py-0.5 rounded-full bg-white/20 text-xs font-semibold">
//                                         {totalElements}
//                                     </span>
//                                 )}
//                             </button>
//                         );
//                     })}
//                 </div>

//                 {/* Main Content Card */}
//                 <div className="mt-6 bg-white dark:bg-[#1c2127] rounded-xl border border-gray-200 dark:border-[#3b4754] shadow-sm overflow-hidden">
//                     <OrderFilters search={search} onSearchChange={setSearch} />

//                     <OrderTable orders={orders} loading={loading} />

//                     {/* Pagination */}
//                     {!loading && totalElements > 0 && (
//                         <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-[#3b4754] bg-gray-50 dark:bg-[#111418]">
//                             <p className="text-sm text-gray-600 dark:text-gray-500">
//                                 Hiển thị{" "}
//                                 <span className="font-semibold text-gray-900 dark:text-white">
//                                     {page * pageSize + 1}
//                                 </span>
//                                 {" - "}
//                                 <span className="font-semibold text-gray-900 dark:text-white">
//                                     {Math.min((page + 1) * pageSize, totalElements)}
//                                 </span>
//                                 {" trên "}
//                                 <span className="font-semibold text-gray-900 dark:text-white">
//                                     {totalElements}
//                                 </span>
//                                 {" đơn hàng"}
//                             </p>
//                             <div className="flex items-center gap-2">
//                                 <button
//                                     onClick={() => handlePageChange(page - 1)}
//                                     disabled={page === 0 || loading}
//                                     className="p-2 rounded-lg border border-gray-300 dark:border-[#3b4754] text-gray-700 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-[#283039] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
//                                 >
//                                     <ChevronLeft size={18} />
//                                 </button>
//                                 <div className="hidden sm:flex items-center gap-1">
//                                     {[...Array(Math.min(5, totalPages))].map((_, i) => {
//                                         const pageNum = page < 3 ? i : page - 2 + i;
//                                         if (pageNum >= totalPages) return null;
//                                         return (
//                                             <button
//                                                 key={pageNum}
//                                                 onClick={() => handlePageChange(pageNum)}
//                                                 className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${page === pageNum
//                                                         ? "bg-primary text-white"
//                                                         : "text-gray-700 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-[#283039]"
//                                                     }`}
//                                             >
//                                                 {pageNum + 1}
//                                             </button>
//                                         );
//                                     })}
//                                 </div>
//                                 <button
//                                     onClick={() => handlePageChange(page + 1)}
//                                     disabled={page >= totalPages - 1 || loading}
//                                     className="p-2 rounded-lg border border-gray-300 dark:border-[#3b4754] text-gray-700 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-[#283039] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
//                                 >
//                                     <ChevronRight size={18} />
//                                 </button>
//                             </div>
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default OrderListFeature;