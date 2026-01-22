"use client";

import dayjs from "dayjs";
import "dayjs/locale/vi";
import relativeTime from "dayjs/plugin/relativeTime";
import {
  ClipboardList,
  FileX2,
  PackageX,
  RotateCcw,
  ShoppingBag,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { FiAlertCircle, FiX } from "react-icons/fi";

import { EmptyProductState } from "@/app/(main)/products/_components/EmptyProductState";
import { shopReturnService } from "@/app/(main)/shop/_service/shop.return.service";
import {
  ReturnRequest,
  ReturnStatus,
} from "@/app/(main)/shop/_types/dto/shop.order.dto";
import { CustomButtonActions, DataTable, FormInput } from "@/components";
import { useToast } from "@/hooks/useToast";
import { cn } from "@/utils/cn";
import Image from "next/image";
import {
  StatusTabItem,
  StatusTabs,
} from "../../../_components/Products/StatusTabs";
import { formatDeadlineText } from "../_constants/order.constants";
import { getReturnColumns } from "./column";
import { ReturnFilterHeader } from "../_components";

dayjs.extend(relativeTime);
dayjs.locale("vi");

type TabType = "all" | "returns" | "cancelled_orders" | "failed_deliveries";

export default function ReturnsScreen() {
  const { success, error: toastError } = useToast();
  const [activeSubTab, setActiveSubTab] = useState("all");
  const [priority, setPriority] = useState("Tất cả");
  const [returnRequests, setReturnRequests] = useState<ReturnRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<ReturnRequest | null>(
    null,
  );
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [responseNote, setResponseNote] = useState("");

  const returnTabs: StatusTabItem<TabType>[] = useMemo(
    () => [
      {
        key: "all",
        label: "Tất cả",
        icon: ClipboardList,
        count: returnRequests.length,
      },
      {
        key: "returns",
        label: "Trả hàng / Hoàn tiền",
        icon: RotateCcw,
        count: returnRequests.filter((r) => r.status !== ReturnStatus.CANCELLED)
          .length,
      },
      {
        key: "cancelled_orders",
        label: "Đơn Hủy",
        icon: FileX2,
        count: 0,
      },
      {
        key: "failed_deliveries",
        label: "Giao Không Thành Công",
        icon: PackageX, // Icon gói hàng có dấu X (chuẩn cho việc giao hàng thất bại/bom hàng)
        count: 0,
      },
    ],
    [returnRequests.length],
  );

  useEffect(() => {
    setLoading(true);
    const data = shopReturnService.getMockReturnRequests();
    setReturnRequests(data);
    setLoading(false);
  }, []);

  const handleViewRequest = (request: ReturnRequest) => {
    setSelectedRequest(request);
    setResponseNote("");
    setDrawerOpen(true);
  };

  const handleApprove = async () => {
    if (!selectedRequest) return;
    success(`Đã chấp nhận yêu cầu ${selectedRequest.requestId}`);
    setDrawerOpen(false);
  };

  const handleReject = async () => {
    if (!selectedRequest) return;
    if (!responseNote.trim()) {
      toastError("Vui lòng nhập lý do từ chối");
      return;
    }
    success(`Đã từ chối yêu cầu ${selectedRequest.requestId}`);
    setDrawerOpen(false);
  };

  const columns = getReturnColumns({
    onView: handleViewRequest,
    onMessage: (item) => console.log("Message to:", item.requesterName),
  });

  return (
    <div className="min-h-screen p-4 md:p-8 space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-4">
            <div className="p-3.5 bg-orange-500 rounded-[1.2rem] shadow-xl shadow-orange-200">
              <ShoppingBag size={28} className="text-white" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-slate-900 uppercase tracking-tighter italic leading-none">
                Trả Hàng / Hoàn Tiền  <span className="text-orange-500">Hủy Đơn</span>
              </h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-2 ml-1">
                Returns & Cancellations System
              </p>
            </div>
          </div>
        </div>
      </div>

      <StatusTabs
        tabs={returnTabs}
        current={activeTab}
        onChange={setActiveTab}
      />

      {activeTab === "all" && (
        <ReturnFilterHeader
          activeMainTab={activeTab}
          activeSubTab={activeSubTab}
          setActiveSubTab={setActiveSubTab}
          priority={priority}
          setPriority={setPriority}
        />
      )}
      <div className="animate-in fade-in duration-700">
        {activeTab === "returns" || activeTab === "all" ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <span className="text-[12px] font-black text-gray-400 uppercase tracking-widest">
                Tìm thấy {returnRequests.length} yêu cầu phù hợp
              </span>
            </div>

            <DataTable
              data={returnRequests}
              columns={columns}
              loading={loading}
              totalElements={returnRequests.length}
              page={0}
              size={10}
              onPageChange={() => {}}
              rowKey="requestId"
            />
          </div>
        ) : (
          <EmptyProductState isShop message="Chưa có dữ liệu đơn hàng bị hủy" />
        )}
      </div>
      {drawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="absolute inset-y-0 right-0 max-w-full flex">
            <div className="w-screen max-w-md transform transition-all duration-500 ease-in-out">
              <div className="h-full flex flex-col bg-white shadow-2xl rounded-l-[3rem] overflow-hidden">
                {/* Drawer Header */}
                <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between bg-orange-50/30">
                  <h2 className="text-sm font-black uppercase tracking-tighter text-orange-600">
                    Yêu cầu #{selectedRequest?.requestId}
                  </h2>
                  <button
                    onClick={() => setDrawerOpen(false)}
                    className="p-2 hover:bg-white rounded-full transition-colors shadow-sm"
                  >
                    <FiX />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                  {selectedRequest && (
                    <>
                      {selectedRequest.status === ReturnStatus.PENDING && (
                        <div
                          className={cn(
                            "p-4 rounded-3xl flex items-center gap-3 border shadow-sm",
                            formatDeadlineText(selectedRequest.deadline)
                              .isUrgent
                              ? "bg-red-50 border-red-100 text-red-600"
                              : "bg-orange-50 border-orange-100 text-orange-600",
                          )}
                        >
                          <FiAlertCircle size={20} className="shrink-0" />
                          <p className="text-[12px] font-bold">
                            Hạn xử lý còn lại:{" "}
                            {formatDeadlineText(selectedRequest.deadline).text}
                          </p>
                        </div>
                      )}

                      {/* Product Section */}
                      <div className="flex gap-4 items-center p-4 bg-gray-50/50 rounded-3xl border border-gray-100">
                        {selectedRequest.productImage && (
                          <div className="relative w-20 h-20 shrink-0">
                            <Image
                              src={selectedRequest.productImage}
                              alt="product"
                              fill
                              className="object-cover rounded-2xl shadow-md"
                            />
                          </div>
                        )}
                        <div>
                          <p className="font-black text-gray-900 leading-tight mb-1">
                            {selectedRequest.productName}
                          </p>
                          <p className="text-orange-500 font-bold text-sm">
                            {new Intl.NumberFormat("vi-VN").format(
                              selectedRequest.orderTotal || 0,
                            )}{" "}
                            ₫
                          </p>
                        </div>
                      </div>

                      {/* Info Detail Grid */}
                      <div className="space-y-4">
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">
                            Khách hàng
                          </span>
                          <p className="text-sm font-bold text-gray-700 bg-white border border-gray-100 px-4 py-2 rounded-xl">
                            {selectedRequest.requesterName} (ID:{" "}
                            {selectedRequest.requesterId})
                          </p>
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">
                            Lý do từ khách
                          </span>
                          <p className="text-sm font-medium text-gray-600 italic leading-relaxed bg-white border border-gray-100 px-4 py-3 rounded-2xl">
                            "{selectedRequest.reason}"
                          </p>
                        </div>
                        <div className="flex flex-col gap-2">
                          <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">
                            Bằng chứng hình ảnh
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {selectedRequest.evidencePhotos.map((photo, i) => (
                              <div
                                key={i}
                                className="relative w-16 h-16 rounded-xl overflow-hidden border border-gray-100 shadow-sm"
                              >
                                <Image
                                  src={photo}
                                  alt="evidence"
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Feedback Form */}
                      {selectedRequest.status === ReturnStatus.PENDING && (
                        <div className="space-y-4 pt-4 border-t border-gray-50">
                          <FormInput
                            isTextArea
                            label="Phản hồi của cửa hàng"
                            placeholder="Nhập nội dung phản hồi cho khách hàng..."
                            value={responseNote}
                            onChange={(e) => setResponseNote(e.target.value)}
                          />
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Footer Actions */}
                {selectedRequest?.status === ReturnStatus.PENDING && (
                  <div className="p-8 bg-gray-50/50 border-t border-gray-100 space-y-3">
                    <CustomButtonActions
                      submitText="Chấp nhận yêu cầu"
                      onCancel={handleReject}
                      cancelText="Từ chối"
                      onSubmit={handleApprove}
                      isLoading={loading}
                      className="bg-green-500 hover:bg-green-600 shadow-green-200"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
