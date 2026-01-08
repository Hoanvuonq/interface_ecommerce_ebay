"use client";

import { DataTable } from "@/components";
import { Column } from "@/components/DataTable/type";
import { Button } from "@/components/button/button";
import { getStatusStyle, getWithdrawalLabel } from "@/constants/status";
import walletService from "@/services/wallet/wallet.service";
import type { WalletWithdrawalResponse } from "@/types/wallet/wallet.types";
import { RefreshCcw } from "lucide-react";
import React, { useEffect, useState } from "react";

export const WithdrawalRequestList: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [withdrawals, setWithdrawals] = useState<WalletWithdrawalResponse[]>(
    []
  );

  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalElements, setTotalElements] = useState(0);

  const loadWithdrawals = async () => {
    try {
      setLoading(true);
      const response = await walletService.getMyWithdrawalRequests(page, size);
      setWithdrawals(response.content);
      setTotalElements(response.totalElements);
    } catch (error: any) {
      console.error("Failed to load withdrawal requests", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadWithdrawals();
  }, [page]);

  const columns: Column<WalletWithdrawalResponse>[] = [
    {
      header: "STT",
      align: "center",
      className: "w-16 font-medium text-gray-600",
      render: (_, index) => page * size + index + 1,
    },
    {
      header: "Số tiền",
      align: "right",
      render: (item) => (
        <span className="font-bold text-red-600 tracking-wide tabular-nums">
          {item.amount.toLocaleString("vi-VN")}{" "}
          <span className="text-xs font-normal text-gray-600">VND</span>
        </span>
      ),
    },
    {
      header: "Ngân hàng",
      align: "left",
      render: (item) => (
        <div className="flex flex-col">
          <span className="font-semibold text-gray-900">{item.bankName}</span>
          <span className="text-xs text-gray-500 font-mono mt-0.5">
            {item.accountNumber}
          </span>
          <span className="text-[10px] text-gray-600 uppercase tracking-wider">
            {item.accountHolderName}
          </span>
        </div>
      ),
    },
    {
      header: "Trạng thái",
      align: "center",
      render: (item) => (
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusStyle(
            item.status
          )}`}
        >
          {getWithdrawalLabel(item.status)}
        </span>
      ),
    },
    {
      header: "Người duyệt",
      align: "right",
      render: (item) =>
        item.approvedByUsername ? (
          <div>
            <div className="text-gray-900">{item.approvedByUsername}</div>
            {item.approvedAt && (
              <div className="text-xs text-gray-600">
                {new Date(item.approvedAt).toLocaleString("vi-VN")}
              </div>
            )}
          </div>
        ) : (
          "-"
        ),
    },
    {
      header: "Lý do",
      align: "right",
      render: (item) => (
        <div className="max-w-xs truncate" title={item.reason || ""}>
          {item.reason || "-"}
        </div>
      ),
    },
    {
      header: "Ngày tạo",
      align: "right",
      className: "text-gray-500 text-xs",
      render: (item) => new Date(item.createdDate).toLocaleString("vi-VN"),
    },
  ];

  return (
    <DataTable
      data={withdrawals}
      columns={columns}
      loading={loading}
      page={page}
      size={size}
      totalElements={totalElements}
      onPageChange={setPage}
      emptyMessage="Chưa có yêu cầu rút tiền nào"
      headerContent={
        <Button
          variant="edit"
          onClick={loadWithdrawals}
          disabled={loading}
          icon={<RefreshCcw />}
        >
          Làm mới
        </Button>
      }
    />
  );
};
