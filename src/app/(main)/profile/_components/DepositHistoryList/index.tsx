"use client";

import React, { useState, useEffect } from "react";
import walletService from "@/services/wallet/wallet.service";
import {
  WalletTransactionResponse,
  WalletType,
} from "@/types/wallet/wallet.types";
import { DepositDetailModal } from "../DepositDetailModal";
import { DataTable } from "@/components";
import { Column } from "@/components/DataTable/type";
import { getStatusStyle, getTransactionLabel } from "@/constants/status";
import { RefreshCcw } from "lucide-react";
import { Button } from "@/components/button";

export const DepositHistoryList: React.FC<{ walletType: WalletType }> = ({
  walletType,
}) => {
  // --- State ---
  const [loading, setLoading] = useState(false);
  const [deposits, setDeposits] = useState<WalletTransactionResponse[]>([]);

  // Pagination state
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalElements, setTotalElements] = useState(0);

  // Modal state
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<WalletTransactionResponse | null>(null);

  // --- Effects ---
  useEffect(() => {
    loadDeposits();
  }, [page, walletType]);

  // --- Logic ---
  const loadDeposits = async () => {
    try {
      setLoading(true);
      const response = await walletService.getMyTransactions(
        page,
        size,
        walletType,
        "DEPOSIT"
      );
      setDeposits(response.content);
      setTotalElements(response.totalElements);
    } catch (error: any) {
      console.error("Failed to load history", error);
    } finally {
      setLoading(false);
    }
  };

  // --- Column Definitions ---
  const columns: Column<WalletTransactionResponse>[] = [
    {
      header: "STT",
      className: "w-16 text-center",
      render: (_, index) => page * size + index + 1,
    },
    {
      header: "Số tiền",
      render: (item) => (
        <span className="font-semibold text-green-600">
          +{item.amount.toLocaleString("vi-VN")} VND
        </span>
      ),
    },
    {
      header: "Mô tả",
      render: (item) => (
        <div className="max-w-xs truncate" title={item.description}>
          {item.description || "-"}
        </div>
      ),
    },
    {
      header: "Trạng thái",
      render: (item) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusStyle(
            item.status
          )}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5"></span>
          {getTransactionLabel(item.status)}
        </span>
      ),
    },
    {
      header: "Số dư sau GD",
      render: (item) => `${item.balanceAfter.toLocaleString("vi-VN")} VND`,
    },
    {
      header: "Ngày nạp",
      className: "text-gray-500",
      render: (item) => new Date(item.createdDate).toLocaleString("vi-VN"),
    },
    {
      header: "Thao tác",
      className: "text-right",
      render: (item) => (
        <button
          onClick={() => {
            setSelectedTransaction(item);
            setDetailModalVisible(true);
          }}
          className="text-orange-600 hover:text-orange-900 flex items-center justify-end gap-1 ml-auto transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
          Chi tiết
        </button>
      ),
    },
  ];

  // --- Render ---
  return (
    <div>
      <DataTable
        data={deposits}
        columns={columns}
        loading={loading}
        page={page}
        size={size}
        totalElements={totalElements}
        onPageChange={setPage}
        emptyMessage="Chưa có giao dịch nạp tiền nào"
        headerContent={
          <Button
            variant="edit"
            onClick={loadDeposits}
            disabled={loading}
            icon={<RefreshCcw />}
          >
            Làm mới
          </Button>
        }
      />

      <DepositDetailModal
        visible={detailModalVisible}
        onClose={() => {
          setDetailModalVisible(false);
          setSelectedTransaction(null);
        }}
        transaction={selectedTransaction}
      />
    </div>
  );
};
